const { cli } = require('../..')
const { success, fail } = require('../testUtils')
const { equal } = require('../../index.js')
;(async () => {
  let a, b, c
  c = 'JS Assertion 1'
  a = await cli([
    '-file',
    './tests/cli/src/test-functions.js',
    '-logging',
    'none',
  ])
  b = [
    'failPercent(50, 100)',
    'failPercent(12, 100)',
    'failPercent(20, 300)',
    'someFaillPercent(50, 100)',
    'someFaillPercent(12, 100)',
  ]
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertion 2'
  a = await cli([
    '-file',
    './tests/cli/src/test-functions.js',
    '-logging',
    'none',
    '-fn',
    'successPercent',
  ])
  b = []
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertion 3'
  a = await cli([
    '-file',
    './tests/cli/src/test-functions.js',
    '-logging',
    'none',
    '-fn',
    'failPercent',
  ])
  b = ['failPercent(50, 100)', 'failPercent(12, 100)', 'failPercent(20, 300)']
  equal(a, b) ? success(c) : fail(c, b, a)

  c = 'JS Assertion 4'
  a = await cli([
    '-file',
    './tests/cli/src/test-functions.js',
    '-logging',
    'none',
    '-fn',
    'failPercent',
  ])
  b = ['failPercent(50, 100)', 'failPercent(12, 100)', 'failPercent(20, 300)']
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'TS Assertions 5'
  a = await cli([
    '-file',
    './tests/cli/src/test-functions.ts',
    '-ts',
    './tests/cli/tsconfig.json',
    '-logging',
    'none',
  ])
  b = ['percent(50, 100)']
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'TS Assertions 6'
  a = await cli([
    '-file',
    './tests/cli/src/test-tree.ts',
    '-ts',
    './tests/cli/tsconfig.json',
    '-logging',
    'none',
  ])
  b = []
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'TS Assertions 7'
  a = await cli(['-file', './tests/cli/src/test-tree.ts', '-logging', 'none'])
  b = []
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'TS Assertions 8'
  a = await cli([
    '-file',
    './tests/cli/src/test-functions-gen.ts',
    '-logging',
    'none',
    '-ts',
    './tests/cli/tsconfig.json',
  ])
  b = ['percent(50, 100)']
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertions 9'
  a = await cli([
    '-file',
    './tests/cli/src/test-functions-gen-tokens.js',
    '-logging',
    'none',
    '-fn',
    'pipeToDolars',
  ])
  b = [
    'pipeToDolars("|")',
    'pipeToDolars("|||")',
    'pipeToDolars("ab|c|d")',
    'pipeToDolars("a|b")',
    'pipeToDolars("d|f")',
  ]
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertions 10'
  a = await cli([
    '-file',
    './tests/cli/src/test-functions-gen-tokens.js',
    '-logging',
    'none',
    '-fn',
    'pipeToDolarsFine',
  ])
  b = ['pipeToDolarsFine("|")']
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertions 11'
  a = await cli([
    '-file',
    './tests/cli/src/test-functions-gen-tokens.js',
    '-logging',
    'none',
    '-fn',
    'pipeTo',
  ])
  b = ['pipeTo("|")']
  equal(a, b) ? success(c) : fail(c, b, a)
})()
