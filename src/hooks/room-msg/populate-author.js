const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { result, app } = context
    const cache = app.get('cache')
    if (result.data) {
      const out = await Promise.all(result.data.map(async msg => {
        let u = cache.get('user/'+msg.userId) || await app.service('users').get(msg.userId).then(u => {
          delete u.email
          delete u.password
          cache.set('user/'+u.id, u, 599)
          return u
        })
        return {
          ...msg,
          ...{
            author: u
          }
        }
      }))
      context.result.data = out
    } else {
      let u = cache.get('user/'+result.userId) || await app.service('users').get(result.userId).then(u => {
        delete u.email
        delete u.password
        cache.set('user/'+u.id, u, 599)
        return u
      })
      context.result = {
        ...result,
        ...{
          author: u
        }
      }
    }
    return context
  }
}
