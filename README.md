## 🧪 Example

_run tests from function comments_

Write the usual comment as documentation

```ts
/**
 * @param percent number
 * @param value number
 * @returns number
 *
 * @example percent(50, 100)
 * // 50
 * @example percent(12, 100)
 * // 12
 * @example percent(20, 300)
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

Two commands:

example - runs the documentation tests from file

Run the entire file:

```
yarn example ./percent.js
```

Run individual functions:

```
yarn example ./percent.js percent
```
