/**
 * @param successPercent number
 * @param value number
 * @returns number
 *
 * @example successPercent(50, 100)
 * // 50
 * @example successPercent(12, 100)
 * // 12
 * @example successPercent(20, 300)
 * // 300 * (20 / 100)
 */
module.exports.successPercent = (percent, value) =>
  Math.round(value * (percent / 100))
/**
 * @param failPercent number
 * @param value number
 * @returns number
 *
 * @example failPercent(50, 100)
 * // 1
 * @example failPercent(12, 100)
 * // 11
 * @example failPercent(20, 300)
 * // 00 * (20 / 100)
 */
module.exports.failPercent = (percent, value) =>
  Math.round(value * (percent / 100))
/**
 * @param failPercent number
 * @param value number
 * @returns number
 *
 * @example someFaillPercent(50, 100)
 * // 52
 * @example someFaillPercent(12, 100)
 * // 11
 * @example someFaillPercent(20, 300)
 * // 300 * (20 / 100)
 */
module.exports.someFaillPercent = (percent, value) =>
  Math.round(value * (percent / 100))
