const { authenticate } = require('@feathersjs/express')
const busboy = require('./busboy')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.use('/uploads', authenticate('jwt'), busboy())
}
