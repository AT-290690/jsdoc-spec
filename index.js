const { readFile } = require('fs/promises')
const { normalize } = require('path')
const { runInContext, createContext } = require('vm')
const { __success, __fail, __separator } = require('./log.js')
const __equal = require('fast-deep-equal')
const {
  matchComments,
  matchResults,
  matchFunctions,
  matchFunctionCalls,
} = require('./utils.js')
;(async () => {
  const mod = process.argv[2]
  if (!mod)
    return console.log(
      '\x1b[31m',
      'Provide a file from root like this:',
      '\x1b[33m',
      'packages/api/src/myFile.js',
      '\x1b[0m'
    )
  const fn = process.argv[3]
  const path =
    mod.split('.').pop() === 'ts'
      ? mod.replace('.ts', '.js').replace('/src/', '/dist/')
      : mod
  const outputText = await readFile(path, 'utf-8')
  const comments = matchComments(outputText)
  if (!comments || !comments.length)
    return console.log(
      '\x1b[31m',
      'There are no documentation comments in',
      '\x1b[33m',
      mod,
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
  runInContext(
    `(async () => {
      ${(fn ? names.filter((x) => x === fn) : names)
        .map((fn) => `const {${fn}} = __imports;`)
        .join('\n')};
      console.log('\x1b[32m',"${fn ? fn : names.join(', ')}", '\x1b[0m');
      console.log('\x1b[3m', '"${mod}"', '\x1b[0m');
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
      })();\n`,
    createContext({
      __equal,
      __fail,
      __success,
      __separator,
      hrtime: process.hrtime,
      __imports: await import(normalize(`../${path}`)),
    })
  )
})()
