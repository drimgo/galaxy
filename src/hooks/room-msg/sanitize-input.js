const error = require('@feathersjs/errors')
const sanitizeHtml = require('sanitize-html')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data } = context
    if (!data.text) throw new error.BadRequest('No text sent')
    data.text = sanitizeHtml(data.text, {
      allowedTags: [],
    })
    return context
  }
}
