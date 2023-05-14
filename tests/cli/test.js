const { cli } = require('../..')
const { success, fail } = require('../testUtils')
const { equal } = require('../../index.js')

;(async () => {
  let a, b, c
  c = 'JS Assertion 1'
  a = await cli({
    argv: ['-file', './tests/cli/src/test-functions.js', '-logging', 'none'],
  })
  b = [
    'failPercent(50, 100)',
    'failPercent(12, 100)',
    'failPercent(20, 300)',
    'someFaillPercent(50, 100)',
    'someFaillPercent(12, 100)',
  ]
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertion 2'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-functions.js',
      '-logging',
      'none',
      '-fn',
      'successPercent',
    ],
  })
  b = []
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertion 3'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-functions.js',
      '-logging',
      'none',
      '-fn',
      'failPercent',
    ],
  })
  b = ['failPercent(50, 100)', 'failPercent(12, 100)', 'failPercent(20, 300)']
  equal(a, b) ? success(c) : fail(c, b, a)

  c = 'JS Assertion 4'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-functions.js',
      '-logging',
      'none',
      '-fn',
      'failPercent',
    ],
  })
  b = ['failPercent(50, 100)', 'failPercent(12, 100)', 'failPercent(20, 300)']
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'TS Assertions 5'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-functions.ts',
      '-ts',
      './tests/cli/tsconfig.json',
      '-logging',
      'none',
    ],
  })
  b = ['percent(50, 100)']
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'TS Assertions 6'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-tree.ts',
      '-ts',
      './tests/cli/tsconfig.json',
      '-logging',
      'none',
    ],
  })
  b = []
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'TS Assertions 7'
  a = await cli({
    argv: ['-file', './tests/cli/src/test-tree.ts', '-logging', 'none'],
  })
  b = []
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'TS Assertions 8'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-functions-gen.ts',
      '-logging',
      'none',
      '-ts',
      './tests/cli/tsconfig.json',
    ],
  })
  b = ['percent(50, 100)']
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertions 9'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-functions-gen-tokens.js',
      '-logging',
      'none',
      '-fn',
      'pipeToDolars',
    ],
  })
  b = [
    'pipeToDolars("|")',
    'pipeToDolars("|||")',
    'pipeToDolars("ab|c|d")',
    'pipeToDolars("a|b")',
    'pipeToDolars("d|f")',
  ]
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertions 10'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-functions-gen-tokens.js',
      '-logging',
      'none',
      '-fn',
      'pipeToDolarsFine',
    ],
  })
  b = ['pipeToDolarsFine("|")']
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertions 11'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-functions-gen-tokens.js',
      '-logging',
      'none',
      '-fn',
      'pipeTo',
    ],
  })
  b = ['pipeTo("|")']
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertions 12'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-functions-gen-fixtures.js',
      '-logging',
      'none',
    ],
  })
  b = [
    'percent(0.1, 1)',
    'percent(0.2, 1)',
    'percent(1, 1)',
    'percent(2, 1)',
    'percent(3, 1)',
    'percent(4, 1)',
    'percent(5, 1)',
    'percent(6, 1)',
    'percent(7, 1)',
    'percent(8, 1)',
    'percent(9, 1)',
    'percent(10, 1)',
    'percent(0.1, 2)',
    'percent(0.2, 2)',
    'percent(1, 2)',
    'percent(2, 2)',
    'percent(3, 2)',
    'percent(4, 2)',
    'percent(5, 2)',
    'percent(6, 2)',
    'percent(7, 2)',
    'percent(8, 2)',
    'percent(9, 2)',
    'percent(10, 2)',
    'percent(0.1, 3)',
    'percent(0.2, 3)',
    'percent(1, 3)',
    'percent(2, 3)',
    'percent(3, 3)',
    'percent(4, 3)',
    'percent(5, 3)',
    'percent(6, 3)',
    'percent(7, 3)',
    'percent(8, 3)',
    'percent(9, 3)',
    'percent(10, 3)',
    'percent(0.1, 4)',
    'percent(0.2, 4)',
    'percent(1, 4)',
    'percent(2, 4)',
    'percent(3, 4)',
    'percent(4, 4)',
    'percent(5, 4)',
    'percent(6, 4)',
    'percent(7, 4)',
    'percent(8, 4)',
    'percent(9, 4)',
    'percent(10, 4)',
    'percent(0.1, 5)',
    'percent(0.2, 5)',
    'percent(1, 5)',
    'percent(2, 5)',
    'percent(3, 5)',
    'percent(4, 5)',
    'percent(5, 5)',
    'percent(6, 5)',
    'percent(7, 5)',
    'percent(8, 5)',
    'percent(9, 5)',
    'percent(10, 5)',
    'percent(0.1, 6)',
    'percent(0.2, 6)',
    'percent(1, 6)',
    'percent(2, 6)',
    'percent(3, 6)',
    'percent(4, 6)',
    'percent(5, 6)',
    'percent(6, 6)',
    'percent(7, 6)',
    'percent(8, 6)',
    'percent(9, 6)',
    'percent(10, 6)',
    'percent(0.1, 7)',
    'percent(0.2, 7)',
    'percent(1, 7)',
    'percent(2, 7)',
    'percent(3, 7)',
    'percent(4, 7)',
    'percent(5, 7)',
    'percent(6, 7)',
    'percent(7, 7)',
    'percent(8, 7)',
    'percent(9, 7)',
    'percent(10, 7)',
    'percent(0.1, 8)',
    'percent(0.2, 8)',
    'percent(1, 8)',
    'percent(2, 8)',
    'percent(3, 8)',
    'percent(4, 8)',
    'percent(5, 8)',
    'percent(6, 8)',
    'percent(7, 8)',
    'percent(8, 8)',
    'percent(9, 8)',
    'percent(10, 8)',
    'percent(0.1, 9)',
    'percent(0.2, 9)',
    'percent(1, 9)',
    'percent(2, 9)',
    'percent(3, 9)',
    'percent(4, 9)',
    'percent(5, 9)',
    'percent(6, 9)',
    'percent(7, 9)',
    'percent(8, 9)',
    'percent(9, 9)',
    'percent(10, 9)',
    'percent(0.1, 10)',
    'percent(0.2, 10)',
    'percent(1, 10)',
    'percent(2, 10)',
    'percent(3, 10)',
    'percent(4, 10)',
    'percent(5, 10)',
    'percent(6, 10)',
    'percent(7, 10)',
    'percent(8, 10)',
    'percent(9, 10)',
    'percent(10, 10)',
  ]
  equal(a, b) ? success(c) : fail(c, b, a)
  c = 'JS Assertions 13'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-custom-gen-fixtures.js',
      '-logging',
      'none',
      '-fn',
      'sumReadValues',
    ],
    fixtures: [
      {
        name: 'MeterRead',
        data: [
          `{
            values: [1, 2, 3],
            dateOn: new Date('2023.01.01'),
            reason: 'F12Q4',
            type: 'Quarterly',
          }`,
          `{
            values: [100],
            dateOn: new Date('2022.01.01'),
            type: 'Quarterly',
            reason: 'F11Q3',
          }`,
          `{
            values: [0],
            dateOn: new Date('2023.01.01'),
            type: 'Opening',
            reason: 'Change Of Ownership',
          }`,
        ],
      },
    ],
  })
  b = [
    "sumReadValues({ values: [1, 2, 3], dateOn: new Date('2023.01.01'), reason: 'F12Q4', type: 'Quarterly', })",
    "sumReadValues({ values: [100], dateOn: new Date('2022.01.01'), type: 'Quarterly', reason: 'F11Q3', })",
    "sumReadValues({ values: [0], dateOn: new Date('2023.01.01'), type: 'Opening', reason: 'Change Of Ownership', })",
  ]
  equal(a, b) ? success(c) : fail(c, b, a)

  c = 'JS Assertions 14'
  a = await cli({
    argv: [
      '-file',
      './tests/cli/src/test-custom-gen-fixtures.js',
      '-logging',
      'none',
      '-fn',
      'getUserInfo',
    ],
    fixtures: [
      {
        name: 'User',
        data: [
          `{
            bornAt: new Date('1990.06.29'),
            credits: 1000,
            roles: ['admin', 'user'],
            name: 'Anthony',
            gender: 'M'
         }`,
          `{
            bornAt: new Date('1999.03.29'),
            name: 'Dee Dee',
            credits: 100,
            roles: ['user'],
            gender: 'F'
        }`,
        ],
      },
    ],
  })
  b = [
    "getUserInfo({ bornAt: new Date('1990.06.29'), credits: 1000, roles: ['admin', 'user'], name: 'Anthony', gender: 'M' }, false)",
    "getUserInfo({ bornAt: new Date('1999.03.29'), name: 'Dee Dee', credits: 100, roles: ['user'], gender: 'F' }, false)",
    "getUserInfo({ bornAt: new Date('1990.06.29'), credits: 1000, roles: ['admin', 'user'], name: 'Anthony', gender: 'M' }, true)",
    "getUserInfo({ bornAt: new Date('1999.03.29'), name: 'Dee Dee', credits: 100, roles: ['user'], gender: 'F' }, true)",
  ]
  equal(a, b) ? success(c) : fail(c, b, a)
})()
