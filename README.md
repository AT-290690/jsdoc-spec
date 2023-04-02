## JSDoc-test

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

Define script in pacakge.json

```
"scripts": {
 "test": "node ./receipt/index.js"
}
```

Typescript build first

```
"scripts": {
 "build": "tsc --build tsconfig.json",
 "test": "yarn build && node ./jsdoct-test/index.js"
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
