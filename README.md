## jsdoc-spec

_run tests from function comments_

Write the usual comment as documentation

```js
/**
 * @param percent number
 * @param value number
 * @returns number
 *
 * @example
 * percent(50, 100)
 * // 50
 * percent(12, 100)
 * // 12
 * percent(20, 300)
 * // 300 * (20 / 100)
 */
export const percent = (percent, value) => Math.round(value * (percent / 100))
```

The function has to be exported from the file for this to work
The stuff used for testing is the @example line with the resulting output on the next line

on a single line:

```
@example function execution (@example token function call)
```

on next line:

```
// result (dash comment followed by the output on)
```

multiple tests

```lisp
/**
 * @example
 * percent(50, 100)
 * // 50
 * percent(12, 100)
 * // 12
 * percent(20, 300)
 * // 300 * (20 / 100)
*/
```

Create an entry point file

```js
import { testFile } from './jsdoc-spec'
// filePath - path to the file
// fn - optional run only tests for a specific function

testFile({ filePath: process.argv[2], fn: process.argv[3] })
```

```js
import { testFile } from './jsdoc-spec'
// works with typescript files (does not compile TS!)
testFile({ filePath: './src/func.ts' })
```

```js
const { testFile } = require('./jsdoc-spec')
testFile({
  filePath: './main/func.ts',
  // provide inpDir and outDir
  // By default inDir is src and outDir is 'dist'
  ts: { inpDir: 'main', outDir: 'out' },
})
```

Define script in pacakge.json

```
"scripts": {
 "test": "node ./jsdoc-spec.js"
}
```

Typescript - you have to compile it first

```
"scripts": {
 "build": "tsc --build tsconfig.json",
 "test": "yarn build && node ./jsdoc-spec.js"
}
```

Run the entire file:

```
yarn test ./percent.js
```

Run individual functions:

```
yarn test ./percent.js percent
```
