/**
 * @example
 * pipeToDolars("|")
 * // ".$"
 * pipeToDolars("|||")
 * // ".$$$"
 * pipeToDolars("ab|c|d")
 * // ".ab$c$d"
 */
const pipeToDolars = (string) => string.replace('|', '$')
module.exports.pipeToDolars = pipeToDolars

/**
 * @example
 * split('myFunction("myFunction")')
 * // "(\"myFunction\")"
 */
const split = (string) => string.substring('myFunction'.length)
module.exports.split = split
