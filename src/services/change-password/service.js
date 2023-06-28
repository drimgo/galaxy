const auth = require('@feathersjs/authentication')
const errors = require('@feathersjs/errors')
const bcrypt = require('bcryptjs')

const comparePasswords = (oldPassword, password) => new Promise((resolve, reject) => {
  bcrypt.compare(oldPassword, password, (err, data1) => {
    if(err || !data1) return reject()
    return resolve()
  })
})

module.exports = function() {
  const app = this

  // Add authentication/changePassword service
  const changePasswordService = app.use('authentication/changePassword', {
    async create(data, params) {
      const user = await app.service('users').get(params.user.id)
      if(!data.password) throw new errors.BadRequest(`Missing password`)
      if(!data.oldPassword) throw new errors.BadRequest(`Missing oldPassword`)
      try {
        await comparePasswords(data.oldPassword, user.password)
      }
      catch(e) {
        throw new errors.BadRequest('Current password wrong')
      }
      const newUser = await app.service('users').patch(user.id, {password: data.password})
      delete newUser.password // never send pwd to client
      return newUser
    }
  })

  // Add jwt authentication
  /*
  changePasswordService.hooks({
    before: auth.hooks.authenticate('jwt')
  })
  */
}