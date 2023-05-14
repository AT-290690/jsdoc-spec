/**
 * @example
 * sumReadValues(#MeterRead)
 * // -1 | -1 | -1
 */
module.exports.sumReadValues = sumReadValues = (read) => ({
  ...read,
  sum: read.values.reduce((acc, item) => acc + item, 0),
})
/**
 * @example
 * getUserInfo(#User; #Boolean)
 * // "?"
 */
module.exports.getUserInfo = getUserInfo = (user, showCredits) =>
  showCredits
    ? user
    : {
        ...user,
        credits: [...user.credits.toString()].map(() => '*').join(''),
      }
