/**
 * @example
 * pipeToDolars("|")
 * // ".$"
 * pipeToDolars("|||")
 * // ".$$$"
 * pipeToDolars("ab|c|d")
 * // ".ab$c$d"
 * pipeToDolars("a|b" | "d|f")
 * // "a.b" | "d.f"
 */
const pipeToDolars = (string) => string.split('|').join('$')
module.exports.pipeToDolars = pipeToDolars
/**
 * @example
 * pipeToDolarsFine("|")
 * // ".$"
 * pipeToDolarsFine("a|b" | "d|f" | "||||")
 * // "a$b" | "d$f" | "$$$$"
 */
const pipeToDolarsFine = (string) => string.split('|').join('$')
module.exports.pipeToDolarsFine = pipeToDolarsFine
/**
 * @example
 *  pipeTo("|")
 * // "fail"
 * pipeTo("a|b" | "d|f" | "||||"; "$" | "|*|" | "x" | ";")
 * // "a$b" | "d$f" | "$$$$" | "a|*|b" | "d|*|f" | "|*||*||*||*|" | "axb" | "dxf" | "xxxx" | "a;b" | "d;f" | ";;;;"
 */
const pipeTo = (string, out) => string.split('|').join(out)
module.exports.pipeTo = pipeTo
/**
 * @example
 * split('myFunction("myFunction")')
 * // "(\"myFunction\")"
 */
const split = (string) => string.substring('myFunction'.length)
module.exports.split = split
