const error = require('@feathersjs/errors')
const axios = require('axios')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { app, data, params } = context
    const { user } = params
    if (!user) throw new error.NotAuthenticated('403 - Forbidden')
    if (!data.toId || !data.type) throw new error.BadRequest('Error #1')
    if (!user.roomId) throw new error.BadRequest('Error #3')
    const cache = app.get('cache')
    const FCMKey = app.get('firebase').messagingKey
    const to = cache.get('user/'+data.toId) || await app.service('users').get(data.toId).then(u => {
      cache.set('user/'+u.id, u, 599)
      return u
    }) || {}
    if (!to.id) throw new error.BadGateway('Error #2')
    const description = {
      smile: ['улыбнулся', 'улыбнулась'],
      kiss: ['поцеловал', 'поцеловала'],
      wink: ['подмигнул', 'подмигнула'],
      wave: ['помахал рукой', 'помахала рукой'],
      clap: ['похлопал', 'похлопала'],
      surprise: ['удивился от слов', 'удивилась от слов'],
      shakeHands: ['пожал руку', 'пожала руку'],
      laugh: ['рассмеялся над', 'рассмеялась над'],
      hit: ['ударил', 'ударила'],
      middleFinger: ['показал фак', 'показала фак'],
      confessLove: ['признался в любви', 'призналась в любви'],
      think: ['задумался над словами', 'задумалась над словами'],
      tongue: ['показал язык', 'показала язык'],
      strength: ['демонстрирует силу перед', 'демонстрирует силу перед'],
    }
    const descriptionDraft = {
      smile: ['улыбнулся', 'улыбнулась', 'Вам'],
      kiss: ['поцеловал', 'поцеловала', 'Вас'],
      wink: ['подмигнул', 'подмигнула', 'Вам'],
      wave: ['помахал рукой', 'помахала рукой', 'Вам'],
      clap: ['похлопал', 'похлопала', 'Вам'],
      surprise: ['удивился', 'удивилась', 'Вашим словам'],
      shakeHands: ['пожал', 'пожала', 'Вам руку'],
      laugh: ['рассмеялся', 'рассмеялась', 'от Ваших слов'],
      hit: ['ударил', 'ударила', 'Вас'],
      middleFinger: ['показал', 'показала', 'Вам фак'],
      confessLove: ['признался', 'призналась', 'Вам в любви'],
      think: ['задумался', 'задумалась', 'над Вашими словами'],
      tongue: ['показал', 'показала', 'Вам язык'],
      strength: ['демонстрирует', 'демонстрирует', 'Вам силу'],
    }
    const text = description[data.type][user.gender === 'male' ? 0 : 1] || '#error getting acion description#'
    const prefix = descriptionDraft[data.type][user.gender === 'male' ? 0 : 1] || ''
    const postfix = descriptionDraft[data.type][2] || ''
    if (to.pushIds.length) {
      axios.post('https://fcm.googleapis.com/fcm/send', {
        "notification": {
          "title": "Уведомление",
          "body": `${user.nickname} ${prefix} ${postfix}`,
          "icon": user.personage,
          "click_action": `https://jivoclub.ru/room/${user.roomId}`,
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
    context.result = {
      id: new Date().getTime(),
      fromId: user.id,
      from: {
        nickname: user.nickname,
        profileImage: user.profileImage ? user.profileImage[0] : null,
        gender: user.gender
      },
      toId: data.toId,
      type: data.type,
      text: `${user.nickname} ${text} ${to.nickname}`,
      roomId: user.roomId,
      notificationDraft: `<b style = "font-size:90%;">${user.nickname}</b> ${prefix} ${postfix}`
    }
    return context
  }
}
