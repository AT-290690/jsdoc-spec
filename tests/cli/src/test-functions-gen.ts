/**
 * @param percent number
 * @param value number
 * @returns number
 *
 * @example
 * percent(50, 100)
 * // 52
 * percent(12, 100)
 * // 12
 * percent(20, 300)
 * // 300 * (20 / 100)
 * percent(0 | 50 | 75; 10 | 50 | 100 | 200)
 * // 0 | 5 | 8 | 0 | 25 | 38 | 0 | 50 | 75 | 0 | 100 | 150
 */
export const percent = (percent: number, value: number): number =>
  Math.round(value * (percent / 100))
