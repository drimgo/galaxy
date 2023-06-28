const { authenticate } = require('@feathersjs/authentication').hooks
const checkCreate = require('../../hooks/photos/check_create')
const checkPatch = require('../../hooks/photos/check_patch')
const checkRemove = require('../../hooks/photos/check_remove')
const removeFiles = require('../../hooks/photos/remove_files')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ checkCreate() ],
    update: [ checkPatch() ],
    patch: [ checkPatch() ],
    remove: [ checkRemove(), removeFiles() ]
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
