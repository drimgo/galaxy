const checkOnline = require('./hooks/app/check-online')
module.exports = {
  before: {
    all: [ checkOnline() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ hook => {
      const e = hook.error
      console.log({
        message: e.message,
        service: hook.path,
        method: hook.method,
        type: hook.type,
        query: hook.params.query,
        data: hook.data,
        stack: e.stack
      })
    } ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
