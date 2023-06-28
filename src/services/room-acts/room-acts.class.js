/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
exports.RoomActs = class RoomActs {
  setup (app) {
    this.app = app
    this.cache = app.get('cache')
  }
  constructor (options) {
    this.options = options || {}
    this.events = ['entered', 'exited']
  }

  async find (params) {
    return []
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    }
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }
    if (!data.userId || !data.roomId) throw new error.BadRequest('userId or roomId is not specified for firing entered event')
    this.emit('entered', {
      user: this.cache.get('user/'+data.userId) || await this.app.service('users').get(data.userId).then(u => {
        this.cache.set('user/'+u.id, u, 599)
        return u
      }),
      roomId: data.roomId
    })
    return data
  }

  async update (id, data, params) {
    return data
  }

  async patch (id, data, params) {
    return data
  }

  async remove (id, params) {
    if (params.provider && (!params.query.roomId || !params.query.userId)) throw new error.BadRequest('userId or roomId is not specified for firing exited event #1')
    if (!params.provider && (!params.userId || !params.roomId)) throw new error.BadRequest('userId or roomId is not specified for firing exited event #2')
    this.emit('exited', {
      user: this.cache.get('user/'+params.userId || params.query.userId) || await this.app.service('users').get(params.userId || params.query.userId).then(u => {
        this.cache.set('user/'+u.id, u, 599)
        return u
      }),
      roomId: params.roomId || params.query.roomId
    })
    return { id }
  }
}
