const { deepStrictEqual } = require('assert')
const { matchComments, matchFunctions, matchResults } = require('../utils')
describe('Parsing should work', () => {
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
  ]
  it('extract example', () => {
    deepStrictEqual(matchFunctions(matchComments(examples[0])), [
      'add(1, 2)',
      'add(2, 3)',
      'add(4, 5)',
      'mult(1, 2)',
      'mult(2, 3)',
      'mult(4, 5)',
      'set({ firstName: "Homer", "age": 24 }, "lastName", "Simpson")',
    ])
    deepStrictEqual(matchFunctions(matchComments(examples[1])), [
      'percent(50, 100)',
      'percent(12, 100)',
      'percent(20, 300)',
    ])
    deepStrictEqual(matchFunctions(matchComments(examples[2])), [
      'stripFloatingPointOverflow(1.4252242432334343243)',
      'stripFloatingPointOverflow(Math.PI)',
    ])
  })
  it('extract result', () => {
    deepStrictEqual(matchResults(matchComments(examples[0])), [
      '3',
      '8',
      '9',
      '3',
      '8',
      '9',
      '{ firstName: "Homer", "age": 24, lastName: "Simpson" }',
    ])
    deepStrictEqual(matchResults(matchComments(examples[1])), [
      '50',
      '12',
      '300 * (20 / 100)',
    ])
    deepStrictEqual(matchResults(matchComments(examples[2])), [
      '1.42522424323',
      '3.14159265359',
    ])
  })
})
