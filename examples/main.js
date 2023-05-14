const { cli } = require('..')
// node ./examples/main.js -file ./examples/examples.js
cli({
  fixtures: [
    {
      name: 'Users',
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
