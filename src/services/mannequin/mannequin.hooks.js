const { authenticate } = require('@feathersjs/authentication').hooks
const mergeImages = require('../../hooks/mannequin/merge-images')
const savePersonage = require('../../hooks/mannequin/save-personage')
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ mergeImages(), savePersonage() ],
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
