module.exports.success = (msg) =>
  console.log(
    '\x1b[32m',
    '\x1b[0m',
    `\x1b[33m\n${msg}\x1b[32m\nPassed!`,
    '\x1b[0m'
  )
module.exports.fail = (msg, result, regression) =>
  console.log(
    '\x1b[34m',
    '\x1b[0m',
    `\x1b[33m\n${msg}\n\x1b[32m\nExpected:\n\n${JSON.stringify(
      result,
      null,
      1
    )}\n\x1b[31m\nReceived:\n\n${JSON.stringify(regression, null, 1)}`,
    '\x1b[0m'
  )
