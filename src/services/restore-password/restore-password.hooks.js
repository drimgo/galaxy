const beforeFind = require('../../hooks/restore-password/beforeFind')
const beforeCreate = require('../../hooks/restore-password/beforeCreate')
const beforePatch = require('../../hooks/restore-password/beforePatch')

module.exports = {
  before: {
    all: [],
    find: [ beforeFind() ],
    get: [],
    create: [ beforeCreate() ],
    update: [],
    patch: [ beforePatch() ],
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
