const error = require('@feathersjs/errors')
/* eslint-disable no-unused-vars */
exports.Kicked = class Kicked {
  setup (app) {
    this.app = app
    this.cache = app.get('cache')
  }
  constructor (options) {
    this.options = options || {}
    this.events = ['kicked']
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
    const { user } = params
    if (!user) throw new error.NotAuthenticated('Not authenticated')
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }
    if (!data.userId || !data.roomId || data.userId === user.id) throw error.BadRequest('Wrong parameters')
    const room = this.cache.get('room/'+data.roomId) || await this.app.service('rooms').get(data.roomId).then(r => {
      this.cache.set('room/'+r.id, r, 599)
      return r
    })
    if (!room) throw new error.BadRequest(`Room #${room.id} not found`)
    if (room.id !== user.id && user.role === 'usr' && !room.whiteList.includes(user.id)) throw new error.Forbidden('Access restricted')
    await this.app.service('users').patch(data.userId, {
      roomId: null
    }).catch(e => {
      throw new error.BadGateway('Can not patch user to set roomId = null', e.message)
    })
    const us = this.cache.get('user/'+data.userId) || await this.app.service('users').get(data.userId).then(u => {
      this.cache.set('user/'+u.id, u, 599)
      return u
    })
    this.emit('kicked', {
      ...{
        user: us
      },
      ...{
        room: room
      },
      ...{
        kickedBy: user
      }
    })
    this.app.service('room-acts').remove(null, {
      userId: data.userId,
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
    return { id }
  }
}
