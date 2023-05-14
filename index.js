const { readFile, writeFile } = require('fs/promises')
const { normalize, resolve } = require('path')
const { runInContext, createContext } = require('vm')
const CMD_LIST = `
------------------------------------
| -help    |   print this           |
------------------------------------
| -about    |  print tool info      |
------------------------------------
| -file    |   prepare a file       |
------------------------------------
| -fn      |  1 function only       |
------------------------------------
| -ts      |  compile ts file       |
------------------------------------
| -gen    |   generate tests        |
------------------------------------
| -logging |  all | none | failed   |
------------------------------------
| -indent  | indentation 0|1|2|3|4  |
------------------------------------
| -example |  tutorial example      |
------------------------------------
| -formula |  print tutorial gen    |
------------------------------------
| -spec    |  print tutorial format |
------------------------------------
`,
  PROVIDE_A_FILE_ERROR = () =>
    console.log(
      '\x1b[31m',
      'Provide a file from root like this:',
      '\x1b[33m',
      'packages/api/src/myFile.js',
      '\x1b[0m'
    ),
  VARIANTS = '|',
  ARGUMENTS = ';',
  PREFIX = '#',
  PLACEHOLDER_TOKEN = '"?"',
  YEAR = 2023,
  SETS = {
    Sequance10: Array.from({ length: 10 })
      .fill(null)
      .map((_, i) => i + 1),
    Sequance100: Array.from({ length: 100 })
      .fill(null)
      .map((_, i) => i + 1),
    Integer: [58, 80, 90, 43, 50, 23, 47, 60, 83, 1],
    Power: Array.from({ length: 10 })
      .fill(null)
      .map((_, i) => 2 << i),
    Number: [
      0,
      1,
      42,
      69,
      100.001,
      'Math.PI',
      2.3333333333333335,
      0.3333333333333333,
      'Number.MAX_SAFE_INTEGER',
      'Number.MAX_SAFE_INTEGER',
      'NaN',
      'Infinity',
      '-Infinity',
    ],
    String: [
      '""',
      '"a"',
      '"Hello world!"',
      '"512"',
      '"The quick brown fox jumps over the lazy dog"',
    ],
    Date: [
      'new Date(0)',
      'new Date("1990.06.29")',
      `new Date("${YEAR}.01.01")`,
      `new Date("${YEAR}.02.01")`,
      `new Date("${YEAR}.03.01")`,
      `new Date("${YEAR}.04.01")`,
      `new Date("${YEAR}.05.01")`,
      `new Date("${YEAR}.06.01")`,
      `new Date("${YEAR}.07.01")`,
      `new Date("${YEAR}.08.01")`,
      `new Date("${YEAR}.09.01")`,
      `new Date("${YEAR}.11.01")`,
      `new Date("${YEAR}.12.01")`,
      `new Date("${YEAR}.02.28")`,
      `new Date("${YEAR}.06.15")`,
      `new Date("${YEAR}.01.30")`,
    ],
    Boolean: [false, true],
    Function: ['() => {}', '(x) => x'],
    None: ['undefined', 'null'],
    Empty: ['undefined', 'null', 'false', '0', '""', '[]', '{}'],
  },
  FIXTURES = {
    [`${PREFIX}Integer`]: SETS.Integer,
    [`${PREFIX}Number`]: SETS.Number,
    [`${PREFIX}Sequance10`]: SETS.Sequance10,
    [`${PREFIX}Sequance100`]: SETS.Sequance100,
    [`${PREFIX}Power`]: SETS.Power,
    [`${PREFIX}String`]: SETS.String,
    [`${PREFIX}Date`]: SETS.Date,
    [`${PREFIX}Boolean`]: SETS.Boolean,
    [`${PREFIX}None`]: SETS.None,
    [`${PREFIX}Function`]: SETS.Function,
    [`${PREFIX}Empty`]: SETS.Empty,
    [`${PREFIX}Array`]: ['[]'],
    [`${PREFIX}Array<${PREFIX}Integer>`]: [`[${SETS.Integer.join(',')}]`],
    [`${PREFIX}Array<${PREFIX}Number>`]: [`[${SETS.Number.join(',')}]`],
    [`${PREFIX}Array<${PREFIX}Sequance10>`]: [`[${SETS.Sequance10.join(',')}]`],
    [`${PREFIX}Array<${PREFIX}Sequance100>`]: [
      `[${SETS.Sequance100.join(',')}]`,
    ],
    [`${PREFIX}Array<${PREFIX}Power>`]: [`[${SETS.Power.join(',')}]`],
    [`${PREFIX}Array<${PREFIX}Strings>`]: [`[${SETS.String.join(',')}]`],
    [`${PREFIX}Array<${PREFIX}Date>`]: [`[${SETS.Date.join(',')}]`],
    [`${PREFIX}Array<${PREFIX}Boolean>`]: [`[${SETS.Boolean.join(',')}]`],
    [`${PREFIX}Array<${PREFIX}Empty>`]: [`[${SETS.Empty.join(',')}]`],
    [`${PREFIX}Array<${PREFIX}None>`]: [`[${SETS.None.join(',')}]`],
    [`${PREFIX}Object`]: ['{}'],
    [`${PREFIX}Map`]: ['new Map()'],
    [`${PREFIX}Set`]: ['new Set()'],
    [`${PREFIX}Set<${PREFIX}Integer>`]: [
      `new Set([${SETS.Integer.join(',')}])`,
    ],
    [`${PREFIX}Set<${PREFIX}Number>`]: [`new Set([${SETS.Number.join(',')}])`],
    [`${PREFIX}Set<${PREFIX}Sequance10>`]: [
      `new Set([${SETS.Sequance10.join(',')}])`,
    ],
    [`${PREFIX}Set<${PREFIX}Sequance100>`]: [
      `new Set([${SETS.Sequance100.join(',')}])`,
    ],
    [`${PREFIX}Set<${PREFIX}Power>`]: [`new Set([${SETS.Power.join(',')}])`],
    [`${PREFIX}Set<${PREFIX}String>`]: [`new Set([${SETS.String.join(',')}])`],
    [`${PREFIX}Set<${PREFIX}Date>`]: [`new Set([${SETS.Date.join(',')}])`],
    [`${PREFIX}Set<${PREFIX}None>`]: [`new Set([${SETS.None.join(',')}])`],
    [`${PREFIX}Set<${PREFIX}Empty>`]: [`new Set([${SETS.Empty.join(',')}])`],
  },
  __equal = (a, b) => {
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
  },
  __formatPerf = (time) => {
    const isSec = time[1] > 1000000,
      t = isSec
        ? (time[0] * 1000 + time[1] / 1000000) / 1000
        : time[0] * 1000 + time[1] / 1000000
    return `~ ${t.toFixed(isSec ? 1 : 3)}${isSec ? 's' : 'ms'}`
  },
  __stringify = (_, value) => {
    switch (value?.constructor.name) {
      case 'Map':
        return Object.fromEntries(value.entries())
      case 'Set':
        return Array.from(value)
      default:
        return value
    }
  },
  isGenerator = (fn) => {
    const withoutStrings = fn.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '')
    return withoutStrings.includes(VARIANTS) || withoutStrings.includes(PREFIX)
  },
  split = (string, separator) => {
    const output = ['']
    let isDQuote = false,
      isSQuote = false
    for (let i = 0; i < string.length; ++i) {
      const current = string[i]
      if (current === '"') isDQuote = !isDQuote
      else if (current === "'") isSQuote = !isSQuote
      if (current === separator && !isDQuote && !isSQuote) output.push([''])
      else output[output.length - 1] = output[output.length - 1] + current
    }
    return output
  },
  splitPipes = (x) => split(x, VARIANTS).map((x) => x.trim()),
  decodeGenerated = (value) => {
    const matches = value.match(new RegExp(/^(.*?)(?=(\())/gm))
    if (matches == undefined)
      return console.log(
        '\x1b[31m',
        'No generation formula provided!',
        '\x1b[0m'
      )
    const functionName = matches.pop(),
      argsRaw = value.substring(functionName.length),
      argsPristine = split(
        argsRaw.substring(1, argsRaw.length - 1),
        ARGUMENTS
      ).map((x) => x.trim()),
      args = argsPristine.map((x) => splitPipes(x))
    return { functionName, args }
  },
  output = [],
  __log = (msg, _0, regression, _1, indent = 0) => {
    console.log(
      `\x1b[30m * \x1b[33m${msg}\n\x1b[30m * // ${JSON.stringify(
        regression,
        __stringify,
        indent
      )}`,
      '\x1b[0m'
    )
    output.push(JSON.stringify(regression, __stringify, 0))
  },
  __success = (msg, result, time, indent = 0) =>
    console.log(
      '\x1b[32m',
      '\x1b[0m',
      `\x1b[33m${msg} \x1b[36m${__formatPerf(
        time
      )}\n\x1b[32m   + ${JSON.stringify(result, __stringify, indent)}`,
      '\x1b[0m'
    ),
  __fail = (msg, result, regression, time, indent = 0) =>
    console.log(
      '\x1b[34m',
      '\x1b[0m',
      `\x1b[33m${msg} \x1b[36m${__formatPerf(
        time
      )}\n\x1b[32m   + ${JSON.stringify(
        result,
        __stringify,
        indent
      )} \n\x1b[31m   - ${JSON.stringify(regression, __stringify, indent)}`,
      '\x1b[0m'
    ),
  __separator = () => console.log('-'.repeat(process.stdout.columns)),
  matchComments = (source) =>
    source.match(new RegExp(/(?:@example)((.|[\r\n])*?)(?:\*\/)/gm)),
  matchFunctions = (comments) =>
    comments
      .flatMap((r) => r.match(new RegExp(/(\w+\().+(?=(\s.*\/\/))/gm)))
      .filter(Boolean)
      .map((x) => x.trim())
      .reduce((acc, f) => {
        if (isGenerator(f)) {
          const { functionName, args } = decodeGenerated(f)
          const cases = toFixtures(args)
          const genFn = combine(cases).map((x) => `${functionName}(${x})`)
          acc.push(...genFn)
        } else acc.push(f)
        return acc
      }, []),
  matchResults = (comments) =>
    comments
      .flatMap((x) =>
        x.trim().match(new RegExp(/(?<=\/\/).*?(?=(\n|\/\/|\*\/))/gm))
      )
      .filter(Boolean)
      .map((x) => x.trim())
      .reduce(
        (acc, r) => (
          isGenerator(r) ? acc.push(...splitPipes(r)) : acc.push(r), acc
        ),
        []
      ),
  matchFunctionCalls = (functions) => [
    ...functions
      .map((x) => x.match(new RegExp(/^(.*?)(?=(\())/gm)))
      .flat()
      .reduce((acc, item) => (acc.add(item), acc), new Set()),
  ],
  combine = ([head, ...[headTail, ...tailTail]]) => {
    if (!headTail) return head
    const combined = headTail.reduce(
      (acc, x) => acc.concat(head.map((h) => `${h}, ${x}`)),
      []
    )
    return combine([combined, ...tailTail])
  },
  logGenerated = (name, ...args) => {
    const output = `'${name}(${args.map((x) =>
      x
        .map(
          (y) =>
            `${y
              .map((z) => `${JSON.stringify(z, __stringify)}`)
              .join(` ${VARIANTS} `)}`
        )
        .join(`${ARGUMENTS} `)
    )})'`
    console.log('\x1b[34m', output, '\x1b[0m')
    return output
  },
  toFixtures = (args) =>
    args.map((x) =>
      x.reduce(
        (acc, item) => (
          item in FIXTURES ? acc.push(...FIXTURES[item]) : acc.push(item), acc
        ),
        []
      )
    ),
  generator = (name, memo = []) => {
    const generate = (...args) => {
      if (args.length === 0) {
        __separator()
        console.log('')
        const string = logGenerated(name.trim(), memo)
        console.log('')
        __separator()
        return string
      } else {
        memo.push([...args])
        return generate
      }
    }
    return generate
  },
  testFile = async ({
    filePath,
    sourcePath,
    fn,
    logging,
    indent,
    inMemoryComments,
    logPlainText,
    originalValue,
  }) => {
    if (!filePath) PROVIDE_A_FILE_ERROR()
    const path = `./${
        filePath.split('.').pop() === 'ts'
          ? filePath.replace('/src/', '/dist/').replace('.ts', '.js')
          : filePath
      }`,
      outputText = inMemoryComments
        ? inMemoryComments
        : await readFile(resolve(path), 'utf-8'),
      comments = matchComments(outputText)
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
        ? functions
            .map((r, i) => (r.includes(`${fn}(`) ? i : -1))
            .filter(() => -1)
        : functions.map((_, i) => i),
      descriptions = functions.map((x) => `${x}`),
      names = matchFunctionCalls(descriptions),
      results = matchResults(comments),
      imports = (fn ? names.filter((x) => x === fn) : names).join(',')
    if (!imports.length)
      return console.log(
        '\x1b[31m',
        '\x1b[1m',
        'There is nothing to test',
        '\x1b[0m'
      )
    const isLogging = logging !== 'none'
    if (isLogging) {
      __separator()
      console.log('\x1b[36m', `${fn ? fn : names.join(',')}`, '\x1b[0m')
      console.log('\x1b[3m', `${normalize(sourcePath)}`, '\x1b[0m')
    }
    const source = `(async ()=>{
    const {${imports}}=__imports;
    ${isLogging ? '__separator()\n' : ''}
    let __a,__b,__t;
        ${functions
          .map((x, i) =>
            i === specific[i]
              ? `__t=__hrtime();\n__a=${x};\n__t=__hrtime(__t)\n__b=${results[i]};__equal(__a,__b)?__success(\`${descriptions[i]}\`,__b,__t, __indent):__fail(\`${descriptions[i]}\`,__b,__a,__t, __indent, __f.push(\`${descriptions[i]}\`));`
              : undefined
          )
          .filter(Boolean)
          .join('\n')}
    ${
      isLogging
        ? 'if(__f.length === 0)__on_pass()\nelse\n__on_fail()\n__separator()'
        : ''
    }
    })();\n`
    try {
      const ctx = createContext({
        __equal,
        __indent: +indent,
        __nl: () => console.log(''),
        __fail:
          logging === 'all' || logging === 'failed'
            ? logPlainText
              ? __log
              : __fail
            : () => {},
        __success: logging === 'all' ? __success : () => {},
        __separator,
        __on_pass: () =>
          console.log('\x1b[32m', '\n  All tests passed!\n', '\x1b[0m'),
        __on_fail: logPlainText
          ? () => {
              console.log(`\x1b[30m*\x1b[33m ${originalValue}`)
              console.log(`\x1b[30m* // ${output.join(` ${VARIANTS} `)}\x1b[0m`)
            }
          : () =>
              console.log('\x1b[31m', '\n  Some tests failed!\n', '\x1b[0m'),
        __f: [],
        __hrtime: process.hrtime,
        __imports: await import(resolve(path)),
      })
      runInContext(source, ctx)
      return ctx.__f
    } catch (err) {
      console.log('\x1b[31m', { err }, '\x1b[0m')
      __fail('Has Errors', 'To Not Throw Errors', err.toString(), [0, 0])
    }
  }
module.exports.testFile = testFile
module.exports.cli = async (options = {}) => {
  argv = options.argv || process.argv.slice(2)
  if (!argv.length) argv.push('-help')
  if (options.fixtures)
    options.fixtures.forEach(({ name, data }) => {
      const stringified = data.map((x) =>
        split(x, '\n')
          .map((x) => x.trim())
          .filter(Boolean)
          .join(' ')
      )
      FIXTURES[`${PREFIX}${name}`] = stringified
      FIXTURES[`${PREFIX}Array<${PREFIX}${name}>`] = [
        `[${stringified.join(',')}]`,
      ]
      FIXTURES[`${PREFIX}Set<${PREFIX}${name}>`] = [
        `new Set([${stringified.join(',')}])`,
      ]
    })
  let filePath = '',
    sourcePath = '',
    fn,
    isTs = false,
    logging = 'all',
    tsconfig = {},
    indent = 0,
    inMemoryComments = '',
    logPlainText = false,
    originalValue = ''
  try {
    while (argv.length) {
      const flag = argv.shift()?.toLowerCase(),
        value = argv.shift()
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
        case '-formula':
          __separator()
          console.log(
            '\x1b[30m',
            '\x1b[1m',
            `
  Call \x1b[32m-gen\x1b[0m with an \x1b[34margument\x1b[0m surrounded in \x1b[35mquotes
  \x1b[32m-gen \x1b[35m"percent(\x1b[34m0 | 50 | 100\x1b[33m ;\x1b[34m 100 | 200\x1b[35m)"
  \x1b[0m// \x1b[31m'?'\x1b[0m
  `,
            '\x1b[34m',
            `\n | variation separator`,
            '\x1b[33m',
            `\n ; arguments separator`,
            '\x1b[31m',
            `\n ? default result`,
            '\x1b[0m'
          )
          __separator()
          return
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
                console.log(
                  '\x1b[31m',
                  'Logging parameters are | all | failed | none |',
                  '\x1b[0m'
                )
                return
            }
            logging = value
          }
          break
        case '-about':
          return console.log(
            '\x1b[32m',
            '\x1b[1m',
            `
JSDoc spec\n
This package is a versatile tool that can automatically turn your jsDoc comments into executable tests. 
With its input variation generation feature, you can easily generate tests with multiple possible input values.\n
This package can be used both as a command-line interface (CLI) tool or as a library that can be integrated into your code. 
It is an efficient and time-saving tool that helps ensure the quality and reliability of your code.\n
By utilizing this tool, you can streamline your testing process and easily maintain test suites alongside your codebase.
With its ease of use and flexibility, it is a valuable addition to any developer's toolkit.\n
Thank you for choosing jsdoc-spec.
Happy Hacking!
`,
            '\x1b[0m'
          )
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
        case '-indent':
          indent = +value
          break
        case '-gen': {
          const { functionName, args } = decodeGenerated(value)
          const cases = toFixtures(args)
          originalValue = value
          const cartesianProduct = combine(cases)
          if (!filePath) {
            __separator()
            console.log('\x1b[30m *\x1b[36m @example')
            cartesianProduct.forEach((x) => {
              console.log(
                '\x1b[30m * \x1b[35m' +
                  functionName +
                  '(\x1b[33m' +
                  x +
                  '\x1b[35m)'
              )
              console.log("\x1b[30m * // \x1b[31m'?'\x1b[0m")
            })
            __separator()
            console.log('\x1b[30m*\x1b[36m @example')
            console.log(`\x1b[30m* \x1b[33m${originalValue}`)
            console.log(
              `\x1b[30m* // ${cartesianProduct
                .map(() => PLACEHOLDER_TOKEN)
                .join(` ${VARIANTS} `)}\x1b[0m`
            )
            return
          } else {
            inMemoryComments = `/**\n* @example\n${cartesianProduct
              .map((x) => `* ${functionName}(${x})\n * // '?'`)
              .join('\n')}\n*/`
            fn = functionName
            logPlainText = true
          }
          break
        }
        case '-help':
          return console.log('\x1b[36m', '\x1b[1m', CMD_LIST, '\x1b[0m')
      }
    }
    if (isTs) {
      const ts = require('typescript'),
        compiledPath = tsconfig.include.reduce(
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
      logPlainText,
      inMemoryComments,
      filePath,
      sourcePath,
      fn,
      logging,
      indent,
      originalValue,
    })
  } catch (err) {
    console.log('\x1b[34m', '\x1b[0m', '\n\x1b[31m', err, '\x1b[0m')
  }
}
module.exports.matchComments = matchComments
module.exports.matchFunctions = matchFunctions
module.exports.matchResults = matchResults
module.exports.matchFunctionCalls = matchFunctionCalls
module.exports.equal = __equal
module.exports.generator = generator
