/**
 * @param percent number
 * @param value number
 * @returns number
 *
 * @example
 * percent(0.1 | 0.2 | @Sequance10; @Sequance10)
 * // -1
 */
module.exports.percent = percent = (percent, value) =>
  Math.round(value * (percent / 100))
