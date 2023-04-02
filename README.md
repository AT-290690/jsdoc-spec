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

Compact and to the point log:

<img width="450" alt="Screenshot 2023-04-02 at 20 26 38" src="https://user-images.githubusercontent.com/88512646/229368947-260bfaf2-fed5-41df-9835-5c68a9734bbd.png">

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

By default root entry point is '../current_working_directory/'
but some project structures can be very complex and have project within projects.
For these cases use root to overwrite entry point

```js
import { testFile } from './jsdoc-spec'
testFile({ filePath: './dist/func.js', root: '../../my_project' })
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

Equality is deep and strict

```ts
type TreeNode = {
  left: TreeNode | undefined
  right: TreeNode | undefined
  value: number
}
/**
      4
    /   \
   2     7
  / \   / \
 1  3  6   9
       4
     /   \
   7      2
  / \    / \
 9  6   3   1
* Definition for a binary tree node.
* @param {TreeNode} root
* @return {TreeNode} inverted tree
* @example
* invertTree({ left: { value: 2, left: { value: 1 }, right: { value: 3 } }, right: { value: 7, left: { value: 6 }, right: { value: 9 } }, value: 4 });
* // { left: { value: 7, left: { value: 9 }, right: { value: 6 } }, right: { value: 2, left: { value: 3 }, right: { value: 1 } }, value: 4 };
*/
export const invertTree = (root: TreeNode): TreeNode => {
  if (!root.left || !root.right) return root
  const { left, right } = root
  root.left = right
  root.right = left
  invertTree(root.left)
  invertTree(root.right)
  return root
}
```
