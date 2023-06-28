const { authenticate } = require('@feathersjs/authentication').hooks

const populateUserId = require('../../hooks/populate-user-id')
const checkAccess = require('../../hooks/rooms/check-access')
const invalidateCache = require('../../hooks/rooms/invalidate-cache')
const removeForeigns = require('../../hooks/rooms/remove-foreign')
const eventEmitters = require('../../hooks/rooms/event-emitters')
const checkLists = require('../../hooks/rooms/check-lists')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [populateUserId()],
    update: [checkAccess(), eventEmitters(), checkLists()],
    patch: [checkAccess(), eventEmitters(), checkLists()],
    remove: [checkAccess(), removeForeigns() ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [ invalidateCache() ],
    patch: [ invalidateCache() ],
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
