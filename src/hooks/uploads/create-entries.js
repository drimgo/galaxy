/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { params, data, app, result, method, type } = context
    const { provider, user } = params
    if (Array.isArray(result)) throw new error.BadRequest('Can not aggregate multiple entries')
    if (type !== 'before') throw new error.BadRequest('Wrong hook type, \'before\' is required')
    switch (data.type) {
    case 'mannequin-data-head':
      context.result = await app.service('mannequin-data').create({
        path: data.path,
        type: 'head',
        gender: data.gender
      }).catch(e => {
        throw new error.BadRequest(e.message)
      })
      break
    case 'mannequin-data-body':
      context.result = await app.service('mannequin-data').create({
        path: data.path,
        type: 'body',
        gender: data.gender
      }).catch(e => {
        throw new error.BadRequest(e.message)
      })
      break
    case 'planet-data-background':
      context.result = await app.service('planet-data').create({
        path: data.path,
        type: 'background',
        averageColor: data.averageColor || null
      }).catch(e => {
        throw new error.BadRequest(e.message)
      })
      break
    case 'photo':
      context.result = await app.service('photos').create({
        userId: user.id,
        path: data.path,
        previewPath: data.previewPath,
        moderated: user.role === 'sv',
        averageColor: data.averageColor || null
      }).catch(e => {
        throw new error.BadGateway(e.message)
      })
      break
      case 'smiley':
        const abbr = await app.service('smileys').find({
          query: {
            $limit: 1,
            $sort: {
              createdAt: -1
            }
          }
        }).then(r => {
          if (r.data.length) {
            let lastAbbr = r.data[0].abbr.substr(1).slice(0 ,-1)
            lastAbbr++
            lastAbbr = lastAbbr.toString()
            if (lastAbbr.length === 1) {
              return `%00${lastAbbr}%`
            } else if (lastAbbr.length === 2) {
              return `%0${lastAbbr}%`
            } else return `%${lastAbbr}%`
          } else {
            return '%001%'
          }
        })
        context.result = await app.service('smileys').create({
          path: data.path,
          abbr: abbr
        }).catch(e => {
          throw new error.BadGateway(e.message)
        })
        break
    default:
      throw new error.BadRequest('Upload type is not specified')
    }
    return context
  }
}
