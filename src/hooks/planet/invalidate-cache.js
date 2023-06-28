/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { result, app } = context
    const cache = app.get('cache')
    if (Array.isArray(result)) {
      await Promise.all(result.map(planet => {
        if (cache.del('planet/'+planet.id)) {
          console.log('cache invalidated for planet ' + planet.id)
        }
      }))
    } else {
      if (cache.del('planet/'+result.id)) {
        console.log('cache invalidated for planet ' + result.id)
      }
    }
    return context
  }
}
