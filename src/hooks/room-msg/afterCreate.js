const error = require('@feathersjs/errors')
const axios = require('axios')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { app, result, params } = context
    const { user } = params
    const cache = app.get('cache')
    const FCMKey = app.get('firebase').messagingKey
    if (result.toId) {
      const usr = cache.get(`user/${result.userId}`) || await app.service('users').get(result.userId).then(u => {
        cache.set(`user/${u.id}`, 599)
        return u
      }) || null
      if (!usr) return context
      app.service('notifications').create({
        type: 'chat-reply',
        data: {
          roomId: result.roomId,
          toId: result.toId
        },
        text: `<b style = "font-size:90%">${usr.nickname}</b> ответил(a) Вам в чате`,
        link: '/room/' + result.roomId
      })
      if (usr.pushIds.length) {
        console.log('must send')
        axios.post('https://fcm.googleapis.com/fcm/send', {
          notification: {
            title: 'Вам написали в чате',
            body: `${user.nickname} написал(а) Вам сообщение в чате`,
            icon: null,
            'click_action': `https://jivoclub.ru/room/${result.roomId}`,
          },
          registration_ids: usr.pushIds
        }, {
          headers: {
            Authorization: `key=${FCMKey}`,
            'Content-Type': 'application/json'
          }
        }).then(r => {
          console.log(r.data)
        }).catch(e => {
          console.log('Error FCM', e.data)
        })
      }
    }
    return context
  }
}
