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

To create such comment type (/** \*/) right above the function declaration
between the /** and \*/ write a comment in this format

```
/**
  * @example           <<< @example tag required to capture tests
  * percent(50, 100)   <<< test function - call it with paramters
  * // 50              <<< expected result - match after //
  * percent(12, 100)
  * // 12
  * percent(20, 300)
  * // 300 * (20 / 100)
*/
export const percent = (percent: number, value: number): number => Math.round(value * (percent / 100));
^ make sure to export function
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

Create an entry point file (jsdoc-spec.js)
and import the cli ormodule

```js
import { cli } from './jsdoc-spec'
cli()
```

Define script in pacakge.json

```
"scripts": {
 "test": "node ./jsdoc-spec.js"
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

Run in terminal

```
- prepare ts file
- run only tests for my func
- compile ts first using tsconfig.json

node ./doctest.js -file ./src/file.ts -fn myFunc -ts ./tsconfig.json`,
```

Generate test cases

```
Call -gen with an argument surrounded in quotes
  -gen "percent(0; 50; 100 | 100; 200)"
  // '?'

 ; is variation separator
 | is arguments separator
 ? is be the default result
```

List of commands

```
------------------------------------
| -help    |   print this           |
------------------------------------
| -file    |   prepare a file       |
------------------------------------
| -fn      |  1 function only       |
------------------------------------
| -ts      |  compile ts file       |
------------------------------------
| -ts      |  compile ts file       |
------------------------------------
| -gen    |   generate tests        |
------------------------------------
| -logging |  all | none | failed   |
------------------------------------
| -example |  tutorial example      |
------------------------------------
| -formula |  tutorial generate     |
------------------------------------
| -spec    |  tutorial format       |
------------------------------------
```

The output of cli is a promisse with an array of failed funciton descriptions

```js
import { cli } from './jsdoc-spec'
// cli uses process.argv.slice(2) if no arguments are provided
// but you can provide args with an array
cli([
  '-file',
  './tests/cli/mock/test-functions.ts',
  '-ts',
  './tests/cli/tsconfig.json',
  '-logging', // you can chose logging levels
  'none', // no loggin - we need the output
]).then((failed) => failed /* ['percent(12, 100)', 'percent((5, 8)'] */)
// if failed  array is empty then all tests have passed
```
