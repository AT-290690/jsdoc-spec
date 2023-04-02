const { readFile } = require('fs/promises')
const { normalize } = require('path')
const { runInContext, createContext } = require('vm')
const __equal = (a, b) => {
  if (a === b) return true
  else if (a && b && typeof a == 'object' && typeof b == 'object') {
    const c = a.constructor.name
    if (c !== b.constructor.name) return false
    let length, i, keys
    if (Array.isArray(a)) {
      length = a.length
      if (length != b.length) return false
      for (i = length; i-- !== 0; ) if (!__equal(a[i], b[i])) return false
      return true
    } else if (c === 'Date') return a.toString() === b.toString()
    else if (c === 'Map') {
      if (a.size !== b.size) return false
      for (i of a.entries()) if (!b.has(i[0])) return false
      for (i of a.entries()) if (!__equal(i[1], b.get(i[0]))) return false
      return true
    } else if (c === 'Set') {
      if (a.size !== b.size) return false
      for (i of a.entries()) if (!b.has(i[0])) return false
      return true
    } else if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
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

const formatPerf = (time) => {
  const isSec = time[1] > 1000000
  const t = isSec
    ? (time[0] * 1000 + time[1] / 1000000) / 1000
    : time[0] * 1000 + time[1] / 1000000
  return `~ ${t.toFixed(isSec ? 1 : 3)}${isSec ? 's' : 'ms'}`
}
const __success = (msg, result, time) =>
  console.log(
    '\x1b[32m',
    '\x1b[0m',
    `\x1b[33m${msg} \x1b[36m${formatPerf(time)}\n\x1b[32m   + ${JSON.stringify(
      result
    )}`,
    '\x1b[0m'
  )
const __fail = (msg, result, regression, time) =>
  console.log(
    '\x1b[34m',
    '\x1b[0m',
    `\x1b[33m${msg} \x1b[36m${formatPerf(time)}\n\x1b[32m   + ${JSON.stringify(
      result
    )} \n\x1b[31m   - ${JSON.stringify(regression)}`,
    '\x1b[0m'
  )
const __separator = () => console.log('-'.repeat(process.stdout.columns))

const matchComments = (source) =>
  source.match(new RegExp(/(?:@example)((.|[\r\n])*?)(?:\*\/)/gm))
const matchFunctions = (comments) =>
  comments
    .flatMap((r) => r.match(new RegExp(/(\w+\().+(?=\n.+\/\/)/gm)))
    .filter(Boolean)
    .map((x) => x.trim())
const matchResults = (comments) =>
  comments
    .flatMap((x) => x.trim().match(new RegExp(/(?<=\n.+\/\/).*?(?=(\n))/gm)))
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
module.exports.testFile = async ({
  filePath,
  fn,
  ts,
  root,
  equal,
  success,
  fail,
}) => {
  if (!filePath)
    return console.log(
      '\x1b[31m',
      'Provide a file from root like this:',
      '\x1b[33m',
      'packages/api/src/myFile.js',
      '\x1b[0m'
    )
  const path =
    filePath.split('.').pop() === 'ts'
      ? filePath
          .replace('.ts', '.js')
          .replace(`/${ts?.inpDir ?? 'src'}/`, `/${ts?.outDir ?? 'dist'}/`)
      : filePath
  const outputText = await readFile(path, 'utf-8')
  const comments = matchComments(outputText)
  if (!comments || !comments.length)
    return console.log(
      '\x1b[31m',
      'There are no documentation comments in',
      '\x1b[33m',
      filePath,
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
  const source = `(async () => {
    ${(fn ? names.filter((x) => x === fn) : names)
      .map((fn) => `const {${fn}} = __imports;`)
      .join('\n')}
    console.log('\x1b[32m',"${fn ? fn : names.join(', ')}", '\x1b[0m');
    console.log('\x1b[3m', '"${filePath}"', '\x1b[0m');
    __separator();\n
    let a, b, t;
        ${functions
          .map((x, i) =>
            i === specific[i]
              ? `t = hrtime();\na = ${x};\nt=hrtime(t)\nb = ${results[i]}; __equal(a, b) ? __success(\`${descriptions[i]}\`, b, t) : __fail(\`${descriptions[i]}\`, b, a, t);`
              : undefined
          )
          .filter(Boolean)
          .join('\n')}
    __separator()
    })();\n`
  runInContext(
    source,
    createContext({
      __equal: equal ?? __equal,
      __fail: fail ?? __fail,
      __success: success ?? __success,
      __separator,
      hrtime: process.hrtime,
      __imports: await import(
        normalize(`${root ?? `../${process.cwd().split('/').pop()}`}/${path}`)
      ),
    })
  )
}
