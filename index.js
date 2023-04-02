const { readFile } = require('fs/promises')
const { normalize } = require('path')
const { runInContext, createContext } = require('vm')
const __equal = require('fast-deep-equal')

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
        `../${normalize(`${process.cwd().split('/').pop()}/${path}`)}`
      ),
    })
  )
}
