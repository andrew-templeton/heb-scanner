const Axios = require('axios')
const { exec } = require('child_process')
const Exec = require('util').promisify(exec)

const LOCATION_LIST = 'https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json'

const spheric = (a, b) => {
	const R = 6371
	const kmToMiFactor = 0.621371
	const degToRadianFactor = 0.0174533
  const dLat = (b.latitude - a.latitude) * degToRadianFactor
  const dLong = (b.longitude - a.longitude) * degToRadianFactor
  const z = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a.latitude * degToRadianFactor) * Math.cos(b.latitude * degToRadianFactor) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2)
  const c = 2 * Math.atan2(Math.sqrt(z), Math.sqrt(1 - z))
  const d = R * c
  return d * kmToMiFactor
}

const logJson = obj => console.log(JSON.stringify(obj, null, 2))
const sortAsc = field => (a, b) => a[field] - b[field]
const getLocations = async () => (await Axios.get(LOCATION_LIST)).data.locations.filter(({ openAppointmentSlots:o }) => !!o)
const getLocationsNear = async ({ latitude, longitude, distance, minimum }) => (await getLocations())
                                                                        .map(store => ({ ...store, distance: spheric(store, { latitude, longitude }) }))
                                                                        .filter(store => store.distance <= distance && store.openAppointmentSlots >= minimum)
                                                                        .sort(sortAsc('distance'))
const openInBrowser = async store => { await Exec(`open '${store.url}'`); return store; }
const openLocationsNear = async circle => await Promise.all((await getLocationsNear(circle)).map(openInBrowser))

const any = result => result.length
const wait = async time => await new Promise(resolve => setTimeout(resolve, time))
const waitFor = ({ functor, finish, interval }) => async (...args) => {
  while (true) {
    const result = await functor(...args)
    if (finish(result)) {
      return result
    }
    await wait(interval * 1000)
  }
}

const main = async ({ latitude, longitude, distance, watch, open, forever, minimum, interval }) => {
  const functor = open ? openLocationsNear : getLocationsNear
  const finish = forever ? console.log : any
  const control = watch ? waitFor({ functor, finish, interval }) : functor
  return await control({ latitude, longitude, distance, minimum })
}

module.exports = main

if (!module.parent) {
  var argv = require('yargs/yargs')(process.argv.slice(2))
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
}
