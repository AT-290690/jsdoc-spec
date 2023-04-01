import { readFile, writeFile, access, mkdir } from 'fs/promises'
import { fork } from 'child_process'
import { normalize } from 'path'
;(async () => {
  try {
    await access('./example/__generated__')
  } catch (err) {
    await mkdir('./example/__generated__')
  }
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
  const outputText = await readFile(mod, 'utf-8')
  const fileName = mod.split('/').pop()
  const comments = outputText.match(
    new RegExp(/(?:\/\*)((.|[\r\n])*?)(?:\*\/)/gm)
  )
  if (!comments || !comments.length)
    return console.log(
      '\x1b[31m',
      'There are no documentation comments in',
      '\x1b[33m',
      mod,
      '\x1b[0m'
    )
  const functions = comments
    .flatMap((r) => r.match(new RegExp(/(?<=@example).*?(?=\n)/gm)))
    .filter(Boolean)
    .map((x) => x.trim())
  if (!functions.length)
    return console.log(
      '\x1b[31m',
      '\x1b[1m',
      'Not a single @example found',
      '\x1b[0m'
    )
  const specific = fn
    ? functions.map((r, i) => (r.includes(`${fn}(`) ? i : -1)).filter(() => -1)
    : functions.map((_, i) => i)
  const descriptions = functions.map((x) => `${x}`)
  const names = [
    ...descriptions
      .map((x) => x.match(new RegExp(/^(.*?)(?=(\())/gm)))
      .flat()
      .reduce((acc, item) => {
        acc.add(item)
        return acc
      }, new Set()),
  ]
  const results = comments
    .flatMap((x) =>
      x.trim().match(new RegExp(/(?<=@example.+\n.+\/\/).*?(?=(\n))/gm))
    )
    .filter(Boolean)
    .map((x) => x.trim())
  await writeFile(
    `./example/__generated__/${fileName}`,
    `import { __success, __fail, __separator } from "../log.js";
    import __equal from 'fast-deep-equal';
${(fn ? names.filter((x) => x === fn) : names)
  .map((fn) => `import {${fn}} from "${normalize(`../../${mod}`)}"`)
  .join('\n')};
console.log('/* 🧪 Example Test 🧪 */');
console.log('\x1b[32m',"${fn ? fn : names.join(', ')}", '\x1b[0m');
console.log('\x1b[3m', '"${mod}"', '\x1b[0m');
__separator();\n
let a, b;
    ${functions
      .map((x, i) =>
        i === specific[i]
          ? `a = ${x};\n b = ${results[i]}; __equal(a, b) ? __success(\`${descriptions[i]}\`, b) : __fail(\`${descriptions[i]}\`, b, a);`
          : undefined
      )
      .filter(Boolean)
      .join('\n')}
__separator();\n
      `,
    'utf-8'
  )
  fork(`./example/__generated__/${fileName}`)
})()
