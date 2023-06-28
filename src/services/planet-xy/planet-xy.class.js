/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
exports.PlanetXy = class PlanetXy {
  setup (app) {
    this.app = app
    this.cache = app.get('cache')
  }
  constructor (options) {
    this.options = options || {}
    this.events = ['moved']
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
    if (!user) throw new error.Forbidden('Access restricted')
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }
    if (!data.roomId || !data.x || typeof data.y === 'undefined') throw new error.BadRequest('Wrong params')
    if (user.roomId !== data.roomId) throw new error.Forbidden('Wrong room ID')
    const room = this.cache.get('room/'+data.roomId) || await this.app.service('rooms').get(data.roomId)
    const planet = this.cache.get('planet/'+room.planetId) || await this.app.service('planet').get(room.planetId)
    const uIndex = planet.coordinates.findIndex(u => u.userId === user.id)
    const currTime = Math.floor(new Date().getTime() / 1000)
    const lastTeleport = this.cache.get('user/' + user.id + '/teleport-cd')
    if (lastTeleport) {
      if ((lastTeleport + 10) > currTime) throw new error.BadRequest('Teleport is cooling down')
    }
    if (uIndex > -1) {
      planet.coordinates[uIndex] = {
        userId: user.id,
        x: data.x,
        y: data.y
      }
    } else {
      planet.coordinates.push({
        userId: user.id,
        x: data.x,
        y: data.y
      })
    }
    this.app.service('planet').patch(planet.id, {
      coordinates: planet.coordinates
    }).then(p => {
      this.emit('moved', {
        userId: user.id,
        roomId: data.roomId,
        x: data.x,
        y: data.y
      })
      this.cache.set('user/' + user.id + '/teleport-cd', currTime, 60)
      this.app.service('planet').emit('patched', p)
    }).catch(e => {
      throw new error.BadRequest('Can not move')
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
