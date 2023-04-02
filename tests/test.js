const {
  matchComments,
  matchFunctions,
  matchResults,
  equal,
} = require('../index.js')
const examples = [
  `/**
  * bla bla bla
  * jhjhjhjhh  
  * @example 
  * add(1, 2)
  * // 3
  * add(2, 3)
  * // 8
  * add(4, 5)
  * // 9
  */
 export const add = (a: number, b: number): number => a + b;
 
 /**
  * @example 
  * mult(1, 2)
  * // 3
  * mult(2, 3)
  * // 8
  * mult(4, 5)
  * // 9
  */
 export const mult = (a: number, b: number): number => a * b;
 /**
  * @example 
  * set({ firstName: "Homer", "age": 24 }, "lastName", "Simpson")
  * // { firstName: "Homer", "age": 24, lastName: "Simpson" }
  */
 export const set = (object: Record<string, unknown>, key:string, value: unknown): Record<string, unknown> => ({ ...object, [key]: value});
   `,
  `/**
   * @param percent number
   * @param value number
   * @returns number
   *
   * @example percent(50, 100)
   * // 50
   * @example percent(12, 100)
   * // 12
   * @example percent(20, 300)
   * // 300 * (20 / 100)
   */
  export const percent = (percent: number, value: number): number => Math.round(value * (percent / 100));`,
  `
  /**
   * @example 
   * stripFloatingPointOverflow(1.4252242432334343243)
   * // 1.42522424323
   * stripFloatingPointOverflow(Math.PI)
   * // 3.14159265359
   */
  export const stripFloatingPointOverflow = (num: number): number => Number(num.toPrecision(12));
`,
  `/**
* Remove reads after meter expiration
* Optionally do additional filter based on beforeDateOn
* This function is curried
* @param beforeDateOn optional Date
* @returns Function
* @example
* withoutUnverifiedReadsAfter()({ reads: [{ dateOn: new Date('2020-01-11'), dateOn: new Date('2020-01-01') }], verifiedOn: new Date('2018-01-10') })
* // { "reads":[{"dateOn": new Date("2020-01-01") }],"verifiedOn":new Date("2018-01-10") }
* withoutUnverifiedReadsAfter(new Date('2017-12-01'))({ reads: [{ dateOn: new Date('2020-01-11'), dateOn: new Date('2020-01-01') }], verifiedOn: new Date('2018-01-10') })
* // {"reads":[],"verifiedOn":new Date("2018-01-10") }
*/`,
]

const success = (msg) =>
  console.log(
    '\x1b[32m',
    '\x1b[0m',
    `\x1b[33m\n${msg}\x1b[32m\nPassed!`,
    '\x1b[0m'
  )
const fail = (msg, result, regression) =>
  console.log(
    '\x1b[34m',
    '\x1b[0m',
    `\x1b[33m\n${msg}\n\x1b[32m\nExpected:\n\n${result.join(
      '\n'
    )}\n\x1b[31m\nReceived:\n\n${regression.join('\n')}`,
    '\x1b[0m'
  )
let a, b, c
c = 'Parsing functions 1'
a = matchFunctions(matchComments(examples[0]))
b = [
  'add(1, 2)',
  'add(2, 3)',
  'add(4, 5)',
  'mult(1, 2)',
  'mult(2, 3)',
  'mult(4, 5)',
  'set({ firstName: "Homer", "age": 24 }, "lastName", "Simpson")',
]
equal(a, b) ? success(c) : fail(c, b, a)
c = 'Parsing functions 2'
a = matchFunctions(matchComments(examples[1]))
b = ['percent(50, 100)', 'percent(12, 100)', 'percent(20, 300)']
equal(a, b) ? success(c) : fail(c, b, a)
c = 'Parsing functions 3'
a = matchFunctions(matchComments(examples[2]))
b = [
  'stripFloatingPointOverflow(1.4252242432334343243)',
  'stripFloatingPointOverflow(Math.PI)',
]
equal(a, b) ? success(c) : fail(c, b, a)
c = 'Parsing functions 4'
a = matchFunctions(matchComments(examples[3]))
b = [
  `withoutUnverifiedReadsAfter()({ reads: [{ dateOn: new Date('2020-01-11'), dateOn: new Date('2020-01-01') }], verifiedOn: new Date('2018-01-10') })`,
  `withoutUnverifiedReadsAfter(new Date('2017-12-01'))({ reads: [{ dateOn: new Date('2020-01-11'), dateOn: new Date('2020-01-01') }], verifiedOn: new Date('2018-01-10') })`,
]
equal(a, b) ? success(c) : fail(c, b, a)
c = 'Parsing results 1'
a = matchResults(matchComments(examples[0]))
b = [
  '3',
  '8',
  '9',
  '3',
  '8',
  '9',
  '{ firstName: "Homer", "age": 24, lastName: "Simpson" }',
]
equal(a, b) ? success(c) : fail(c, b, a)
c = 'Parsing results 2'
a = matchResults(matchComments(examples[1]))
b = ['50', '12', '300 * (20 / 100)']
equal(a, b) ? success(c) : fail(c, b, a)
c = 'Parsing results 3'
a = matchResults(matchComments(examples[2]))
b = ['1.42522424323', '3.14159265359']
equal(a, b) ? success(c) : fail(c, b, a)
c = 'Parsing results 4'
a = matchResults(matchComments(examples[3]))
b = [
  `{ "reads":[{"dateOn": new Date("2020-01-01") }],"verifiedOn":new Date("2018-01-10") }`,
  `{"reads":[],"verifiedOn":new Date("2018-01-10") }`,
]
equal(a, b) ? success(c) : fail(c, b, a)
c = 'Equality'
a = [
  1,
  '121',
  12.21,
  {
    name: 'John',
    kids: [
      { name: 'Betty', kids: [{ name: 'Johny', kids: [] }] },
      { name: 'Michele', kids: [] },
    ],
  },
  [1, 2, new Date('2020-01-01')],
  {
    reads: [{ dateOn: new Date('2020-01-01T00:00:00.000Z') }],
    verifiedOn: '2018-01-10T00:00:00.000Z',
  },
  { dateOn: new Date('2020-01-01') },
]
b = [
  1,
  '121',
  12.21,
  {
    name: 'John',
    kids: [
      { name: 'Betty', kids: [{ name: 'Johny', kids: [] }] },
      { name: 'Michele', kids: [] },
    ],
  },
  [1, 2, new Date('2020-01-01')],
  {
    reads: [{ dateOn: new Date('2020-01-01T00:00:00.000Z') }],
    verifiedOn: '2018-01-10T00:00:00.000Z',
  },
  { dateOn: new Date('2020-01-01') },
]
equal(a, b) ? success(c) : fail(c, b, a)
c = 'Dates'
a = {
  reads: [{ dateOn: new Date('2020-01-01') }],
  verifiedOn: new Date('2018-01-10'),
}
b = {
  reads: [{ dateOn: new Date('2020-01-01') }],
  verifiedOn: new Date('2018-01-10'),
}
equal(a, b) ? success(c) : fail(c, b, a)
