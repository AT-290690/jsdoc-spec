export const __success = (msg, result) =>
  console.log(
    '\x1b[32m',
    '\x1b[1m',
    `\x1b[33m${msg} \x1b[32m \n   + ${JSON.stringify(result)}\x1b[31m`,
    '\x1b[0m'
  )
export const __fail = (msg, result, regression) =>
  console.log(
    '\x1b[34m',
    '\x1b[0m',
    `\x1b[33m${msg}\n\x1b[32m   + ${JSON.stringify(
      result
    )} \n\x1b[31m   - ${JSON.stringify(regression)}`,
    '\x1b[0m'
  )
export const __separator = () => console.log('-'.repeat(process.stdout.columns))
