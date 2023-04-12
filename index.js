const { readFile, writeFile } = require('fs/promises')
const { normalize, resolve } = require('path')
const { runInContext, createContext } = require('vm')
const __equal = (a, b) => {
  if (a === b) return true
  if (a && b && typeof a == 'object' && typeof b == 'object') {
    const c = a.constructor.name
    if (c !== b.constructor.name) return false
    let length, i, keys
    if (Array.isArray(a)) {
      length = a.length
      if (length != b.length) return false
      for (i = length; i-- !== 0; ) if (!__equal(a[i], b[i])) return false
      return true
    }
    if (c === 'Date') return a.valueOf() === b.valueOf()
    if (c === 'Map') {
      if (a.size !== b.size) return false
      for (i of a.entries()) if (!b.has(i[0])) return false
      for (i of a.entries()) if (!__equal(i[1], b.get(i[0]))) return false
      return true
    }
    if (c === 'Set') {
      if (a.size !== b.size) return false
      for (i of a.entries()) if (!b.has(i[0])) return false
      return true
    }
    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length
      if (length != b.length) return false
      for (i = length; i-- !== 0; ) if (a[i] !== b[i]) return false
      return true
    }
    keys = Object.keys(a)
    length = keys.length
    if (length !== Object.keys(b).length) return false
    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false
    for (i = length; i-- !== 0; ) {
      let key = keys[i]
      if (!__equal(a[key], b[key])) return false
    }
    return true
  }
  return a !== a && b !== b
}
const __formatPerf = (time) => {
  const isSec = time[1] > 1000000
  const t = isSec
    ? (time[0] * 1000 + time[1] / 1000000) / 1000
    : time[0] * 1000 + time[1] / 1000000
  return `~ ${t.toFixed(isSec ? 1 : 3)}${isSec ? 's' : 'ms'}`
}
const __stringify = (_, value) => {
  switch (value?.constructor.name) {
    case 'Map':
      return Object.fromEntries(value.entries())
    case 'Set':
      return Array.from(value)
    default:
      return value
  }
}
const __success = (msg, result, time) =>
  console.log(
    '\x1b[32m',
    '\x1b[0m',
    `\x1b[33m${msg} \x1b[36m${__formatPerf(
      time
    )}\n\x1b[32m   + ${JSON.stringify(result, __stringify)}`,
    '\x1b[0m'
  )
const __fail = (msg, result, regression, time) =>
  console.log(
    '\x1b[34m',
    '\x1b[0m',
    `\x1b[33m${msg} \x1b[36m${__formatPerf(
      time
    )}\n\x1b[32m   + ${JSON.stringify(
      result,
      __stringify,
      1
    )} \n\x1b[31m   - ${JSON.stringify(regression, __stringify, 1)}`,
    '\x1b[0m'
  )
const __separator = () => console.log('-'.repeat(process.stdout.columns))
const matchComments = (source) =>
  source.match(new RegExp(/(?:@example)((.|[\r\n])*?)(?:\*\/)/gm))
const matchFunctions = (comments) =>
  comments
    .flatMap((r) => r.match(new RegExp(/(\w+\().+(?=(\s.*\/\/))/gm)))
    .filter(Boolean)
    .map((x) => x.trim())
const matchResults = (comments) =>
  comments
    .flatMap((x) =>
      x.trim().match(new RegExp(/(?<=\/\/).*?(?=(\n|\/\/|\*\/))/gm))
    )
    .filter(Boolean)
    .map((x) => x.trim())
const matchFunctionCalls = (functions) => [
  ...functions
    .map((x) => x.match(new RegExp(/^(.*?)(?=(\())/gm)))
    .flat()
    .reduce((acc, item) => {
      acc.add(item)
      return acc
    }, new Set()),
]
module.exports.matchComments = matchComments
module.exports.matchFunctions = matchFunctions
module.exports.matchResults = matchResults
module.exports.matchFunctionCalls = matchFunctionCalls
module.exports.equal = __equal
const testFile = async ({ filePath, sourcePath, fn, logging }) => {
  if (!filePath)
    return console.log(
      '\x1b[31m',
      'Provide a file from root like this:',
      '\x1b[33m',
      'packages/api/src/myFile.js',
      '\x1b[0m'
    )
  const path = `./${filePath}`
  const outputText = await readFile(resolve(path), 'utf-8')
  const comments = matchComments(outputText)
  if (!comments || !comments.length)
    return console.log(
      '\x1b[31m',
      'There are no documentation comments in',
      '\x1b[33m',
      normalize(sourcePath),
      '\x1b[0m'
    )
  const functions = matchFunctions(comments)
  if (!functions.length)
    return console.log(
      '\x1b[31m',
      '\x1b[1m',
      'Not a single test found',
      '\x1b[0m'
    )

  const specific = fn
    ? functions.map((r, i) => (r.includes(`${fn}(`) ? i : -1)).filter(() => -1)
    : functions.map((_, i) => i)
  const descriptions = functions.map((x) => `${x}`)
  const names = matchFunctionCalls(descriptions)
  const results = matchResults(comments)
  const imports = (fn ? names.filter((x) => x === fn) : names).join(',')
  if (!imports.length) {
    return console.log(
      '\x1b[31m',
      '\x1b[1m',
      'There is nothing to test',
      '\x1b[0m'
    )
  }
  const isLogging = logging !== 'none'
  if (isLogging) {
    __separator()
    console.log('\x1b[36m', `${fn ? fn : names.join(',')}`, '\x1b[0m')
    console.log('\x1b[3m', `${normalize(sourcePath)}`, '\x1b[0m')
  }
  const source = `(async ()=>{
    const {${imports}}=__imports;
    ${isLogging ? '__separator()' : ''}
    let __a,__b,__t;
        ${functions
          .map((x, i) =>
            i === specific[i]
              ? `__t=__hrtime();\n__a=${x};\n__t=__hrtime(__t)\n__b=${results[i]};__equal(__a,__b)?__success(\`${descriptions[i]}\`,__b,__t):__fail(\`${descriptions[i]}\`,__b,__a,__t, __f.push(\`${descriptions[i]}\`));`
              : undefined
          )
          .filter(Boolean)
          .join('\n')}
    ${isLogging ? '__separator()' : ''}
    })();\n`
  try {
    const ctx = createContext({
      __equal,
      __fail: logging === 'all' || logging === 'failed' ? __fail : () => {},
      __success: logging === 'all' ? __success : () => {},
      __separator,
      __f: [],
      __hrtime: process.hrtime,
      __imports: await import(resolve(path)),
    })
    runInContext(source, ctx)
    return ctx.__f
  } catch (err) {
    __fail('Has Errors', 'To Not Throw Errors', err.toString(), [0, 0])
  }
}
module.exports.testFile = testFile
module.exports.cli = async (argv = process.argv.slice(2)) => {
  if (!argv.length) argv.push('-help')
  let filePath = '',
    sourcePath = '',
    fn,
    isTs = false,
    logging = 'all',
    tsconfig = ''
  try {
    while (argv.length) {
      const flag = argv.shift()?.toLowerCase()
      const value = argv.shift()
      // if (!value) throw new Error('No value provided');
      switch (flag) {
        case '-ts':
          {
            if (!value) throw new Error('No tsconfig.json provided')
            const config = JSON.parse(await readFile(value, 'utf-8'))
            if (
              !config ||
              typeof config !== 'object' ||
              !('include' in config) ||
              !('outDir' in config.compilerOptions)
            )
              throw new Error(
                'Not a valid tsconfig.json - must have include and outDir keys'
              )
            tsconfig = config
            isTs = true
          }
          break
        case '-file':
          filePath = value
          sourcePath = filePath
          break
        case '-fn':
          fn = value
          break
        case '-spec':
          __separator()
          console.log(
            '\x1b[30m',
            '\x1b[1m',
            `
  Write doctest comment (/** */) right above the function declaration
  \x1b[35m
  /**
   * @example          \x1b[30m <<< @example tag required to capture tests \x1b[35m
   * percent(50, 100)  \x1b[30m <<< test function - call it with paramters \x1b[35m
   * // 50             \x1b[30m <<< expected result - match after //  \x1b[35m
   * percent(12, 100)
   * // 12
   * percent(20, 300)
   * // 300 * (20 / 100)
  */
  `,
            '\x1b[34m',
            `
export const percent = (percent: number, value: number): number => Math.round(value * (percent / 100));`,
            '\x1b[33m',
            `\n^ make sure to export function`,
            '\x1b[0m'
          )
          __separator()
          return
        case '-logging':
          {
            switch (value) {
              case 'all':
                break
              case 'failed':
                break
              case 'none':
                break
              default:
                throw new Error(
                  'Logging parameters are | all | failed | none |'
                )
            }
            logging = value
          }
          break
        case '-example':
          return console.log(
            '\x1b[36m',
            '\x1b[1m',
            `
- prepare ts file
- run only tests for my func
- compile ts first using tsconfig.json

-file ./src/file.ts -fn myFunc -ts ./tsconfig.json`,
            '\x1b[0m'
          )
        case '-help':
          return console.log(
            '\x1b[36m',
            '\x1b[1m',
            `
------------------------------------
| -help    |   print this           |
------------------------------------
| -file    |   prepare a file       |
------------------------------------
| -fn      |  1 function only       |
------------------------------------
| -ts      |  compile ts file       |
------------------------------------
| -example |  tutorial example      |
------------------------------------
| -spec    |  tutorial format       |
------------------------------------

              `,
            '\x1b[0m'
          )
      }
    }
    if (isTs) {
      const ts = require('typescript')
      const compiledPath = tsconfig.include.reduce(
        (_, dir) =>
          filePath
            .replace(`/${dir}/`, `/${tsconfig.compilerOptions.outDir}/`)
            .replace('.ts', '.js'),
        ''
      )
      await writeFile(
        compiledPath,
        ts.transpileModule(await readFile(filePath, 'utf-8'), tsconfig)
          .outputText
      )
      sourcePath = filePath
      filePath = compiledPath
    }
    return testFile({
      filePath,
      sourcePath,
      fn,
      logging,
    })
  } catch (err) {
    console.log('\x1b[34m', '\x1b[0m', '\n\x1b[31m', err, '\x1b[0m')
  }
}
