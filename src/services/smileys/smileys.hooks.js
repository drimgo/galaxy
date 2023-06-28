const { authenticate } = require('@feathersjs/authentication').hooks
const checkAccess = require('../../hooks/smileys/check-access')
const afterRemove = require('../../hooks/smileys/afterRemove')
const invalidateCache = require('../../hooks/smileys/invalidate-cache')
const writeCache = require('../../hooks/smileys/write-cache')
module.exports = {
  before: {
    all: [ authenticate('jwt'), checkAccess() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ invalidateCache(), writeCache() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [ afterRemove() ]
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
