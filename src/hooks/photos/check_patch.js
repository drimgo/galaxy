/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
const axios = require('axios')
module.exports = (options = {}) => {
  return async context => {
    const { params, app, data, id } = context
    const { provider, user } = params
    const FCMKey = app.get('firebase').messagingKey
    const cache = app.get('cache')
    if (provider) {
      if (!user) throw new error.Forbidden('Access restricted for unauthenticated users')
      if (data.moderated && user.role === 'user') throw new error.Forbidden('Access restricted')
      if (!id) throw new error.BadRequest('ID was not sended')
      const photo = await app.service('photos').get(id).catch(e => {
        throw new error.BadGateway(e.message)
      })
      const to = cache.get(`user/${photo.userId}`) || await app.service('users').get(photo.userId).then(u => {
        delete u.password
        delete u.email
        cache.set(`user/u.id`, u, 599)
        return u
      }) || null
      if (!to) throw new error.NotFound('Photo author not found')
      if (photo.userId !== user.id) {
        if (Object.keys(data).length === 1) {
          if (data.hasOwnProperty('likedBy')) {
            data.likedBy = photo.likedBy.includes(user.id) ? photo.likedBy.filter(u => u !== user.id) : [...photo.likedBy, ...[user.id]]
            if (!photo.likedBy.includes(user.id)) {
              app.service('notifications').create({
                type: 'photo-like',
                data: {
                  photoId: id,
                  toId: photo.userId
                },
                text: `<b style = "font-size:90%">${user.nickname}</b> оценил Ваше фото`,
                link: '/photo/' + id
              })
              if (to.pushIds.length) {
                console.log('sending push for photo like')
                axios.post('https://fcm.googleapis.com/fcm/send', {
                  notification: {
                    title: 'Лайк на фото',
                    body: `${user.nickname} понравилось Ваше фото`,
                    icon: null,
                    image: photo.path,
                    'click_action': `https://jivoclub.ru/photo/${photo.id}`,
                  },
                  registration_ids: to.pushIds
                }, {
                  headers: {
                    Authorization: `key=${FCMKey}`,
                    'Content-Type': 'application/json'
                  }
                }).catch(e => {
                  console.log('Error FCM', e.data)
                })
              }
            }
          } else throw new error.Forbidden('403 Restricted access #1')
        } else throw new error.Forbidden('403 Restricted access #2')
      }
      if (data.userId) throw new error.Forbidden('Can not change owner')
    }
    return context
  }
}
