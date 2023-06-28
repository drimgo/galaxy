const { authenticate } = require('@feathersjs/authentication').hooks
const beforeCreate = require('../../hooks/room-acts/beforeCreate')
const afterCreate = require('../../hooks/room-acts/afterCreate')
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ beforeCreate() ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
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
};
