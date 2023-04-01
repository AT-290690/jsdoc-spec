module.exports.matchComments = (source) =>
  source.match(new RegExp(/(?:@example)((.|[\r\n])*?)(?:\*\/)/gm))
module.exports.matchFunctions = (comments) =>
  comments
    .flatMap((r) => r.match(new RegExp(/(\w+\().+(?=\n.+\/\/)/gm)))
    .filter(Boolean)
    .map((x) => x.trim())
module.exports.matchResults = (comments) =>
  comments
    .flatMap((x) => x.trim().match(new RegExp(/(?<=\n.+\/\/).*?(?=(\n))/gm)))
    .filter(Boolean)
    .map((x) => x.trim())
module.exports.matchFunctionCalls = (functions) => [
  ...functions
    .map((x) => x.match(new RegExp(/^(.*?)(?=(\())/gm)))
    .flat()
    .reduce((acc, item) => {
      acc.add(item)
      return acc
    }, new Set()),
]
