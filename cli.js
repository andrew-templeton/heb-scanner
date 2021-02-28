const logJson = obj => console.log(JSON.stringify(obj, null, 2))

const main = require('../')
const argv = require('yargs/yargs')(process.argv.slice(2))
  .default('longitude', -97.7437001)
  .default('latitude', 30.270077)
  .default('distance', 100)
  .default('watch', false)
  .default('open', false)
  .default('forever', false)
  .default('minimum', 1)
  .default('interval', 10)
  .argv

const { latitude, longitude, distance, watch, open, forever, minimum, interval } = argv
main({ latitude, longitude, distance, watch, open, forever, minimum, interval }).then(logJson)
