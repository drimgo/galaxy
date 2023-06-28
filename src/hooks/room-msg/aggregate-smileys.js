const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data, app } = context
    const cache = app.get('cache')
    const matchesCount = data.text.match(/%/g) || []
    if (matchesCount.length > 1) {
      const smileys = cache.get('smileys') || await app.service('smileys').find().then(sm => sm.data) || []
      await Promise.all(smileys.map(smiley => {
        let txt = data.text.split(smiley.abbr)
        data.text = txt.join(`<img src = "$cdnPath$${smiley.path}" alt = "" class = "smiley" />`)
      }))
    }
    return context
  }
}
