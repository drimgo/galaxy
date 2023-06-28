const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { app, result } = context
    app.service('notifications').create({
      type: 'chat-action',
      data: {
        roomId: result.roomId,
        toId: result.toId
      },
      text: result.notificationDraft,
      link: '/room/' + result.roomId
    })
    delete context.result.notificationDraft
    return context
  }
}
