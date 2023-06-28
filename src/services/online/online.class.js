/* eslint-disable no-unused-vars */
exports.Online = class Online {
  constructor (options) {
    this.options = options || {}
    this.events = ['online', 'offline']
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
    if (!data.user.id) throw new Error('User is not specified')
    setTimeout(() => {
      this.emit('online', data.user)
    }, 6000)
    return data
  }

  async update (id, data, params) {
    return data
  }

  async patch (id, data, params) {
    return data
  }

  async remove (id, params) {
    if (!id) throw new Error('ID not specified')
    setTimeout(() => {
      this.emit('offline', id)
    }, 3000)
    return { id }
  }
}
