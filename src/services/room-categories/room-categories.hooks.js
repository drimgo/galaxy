const { authenticate } = require('@feathersjs/authentication').hooks
const checkPermissions = require('feathers-permissions')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [checkPermissions({
      roles: ['mod', 'adm', 'sv'],
      field: 'role'
    })],
    update: [checkPermissions({
      roles: ['mod', 'adm', 'sv'],
      field: 'role'
    })],
    patch: [checkPermissions({
      roles: ['mod', 'adm', 'sv'],
      field: 'role'
    })],
    remove: [checkPermissions({
      roles: ['mod', 'adm', 'sv'],
      field: 'role'
    })]
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
