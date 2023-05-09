const { generator } = require('..')
/* Use this example to generate tests
 first call argument is the name of the function
 the rest function call arguments are
 the following parameter variations
 this will generate in:
 myFunction(42, true)
 myFunction(68, true)
 myFunction(42, false)
 myFunction(68, false) */
generator('myFunction')(42, 68)(true, false)()
