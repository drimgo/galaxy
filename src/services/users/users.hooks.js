const { authenticate } = require('@feathersjs/authentication').hooks

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks
const checkAccess = require('../../hooks/users/check-access')
const invalidateCache = require('../../hooks/users/invalidate-cache')
const validateData = require('../../hooks/users/validate-data')
module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ hashPassword('password'), validateData() ],
    update: [ hashPassword('password'),  authenticate('jwt'), checkAccess(), invalidateCache() ],
    patch: [ hashPassword('password'),  authenticate('jwt'), checkAccess(), invalidateCache() ],
    remove: [ authenticate('jwt'), checkAccess() ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
