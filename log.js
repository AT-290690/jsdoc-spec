const formatPerf = (time) => {
  const isSec = time[1] > 1000000
  const t = isSec
    ? (time[0] * 1000 + time[1] / 1000000) / 1000
    : time[0] * 1000 + time[1] / 1000000
  return `~ ${t.toFixed(isSec ? 1 : 3)}${isSec ? 's' : 'ms'}`
}
export const __success = (msg, result, time) =>
  console.log(
    '\x1b[32m',
    '\x1b[0m',
    `\x1b[33m${msg} \x1b[36m${formatPerf(time)}\n\x1b[32m   + ${JSON.stringify(
      result
    )}\x1b[31m`,
    '\x1b[0m'
  )
export const __fail = (msg, result, regression, time) =>
  console.log(
    '\x1b[34m',
    '\x1b[0m',
    `\x1b[33m${msg} \x1b[36m${formatPerf(time)}\n\x1b[32m   + ${JSON.stringify(
      result
    )} \n\x1b[31m   - ${JSON.stringify(regression)}`,
    '\x1b[0m'
  )
export const __separator = () => console.log('-'.repeat(process.stdout.columns))
