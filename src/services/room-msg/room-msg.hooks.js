const { authenticate } = require('@feathersjs/authentication').hooks
const populateUserId = require('../../hooks/populate-user-id')
const populateAuthor = require('../../hooks/room-msg/populate-author')
const setUserRoom = require('../../hooks/room-msg/set-user-room')
const filterOutput = require('../../hooks/room-msg/filter-output')
const checkAccess = require('../../hooks/room-msg/check-access')
const checkMsgData = require('../../hooks/room-msg/check-msg-data')
const aggregateSmileys = require('../../hooks/room-msg/aggregate-smileys')
const sanitizeInput = require('../../hooks/room-msg/sanitize-input')
const afterCreate = require('../../hooks/room-msg/afterCreate')
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ filterOutput(), setUserRoom() ],
    get: [],
    create: [ populateUserId(), checkAccess(), checkMsgData(), sanitizeInput(), aggregateSmileys() ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ populateAuthor() ],
    get: [ populateAuthor() ],
    create: [ afterCreate() ],
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
