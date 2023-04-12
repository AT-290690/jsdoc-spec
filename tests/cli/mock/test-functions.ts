/**
 * @param percent number
 * @param value number
 * @returns number
 *
 * @example percent(50, 100)
 * // 52
 * @example percent(12, 100)
 * // 12
 * @example percent(20, 300)
 * // 300 * (20 / 100)
 */
export const percent = (percent: number, value: number): number =>
  Math.round(value * (percent / 100))
