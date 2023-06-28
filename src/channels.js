/* eslint-disable no-unused-vars */
module.exports = function(app) {
  const cache = app.get('cache')
  if(typeof app.channel !== 'function') {
    return
  }
  const joinChannels = (user, connection) => {
  }
  const leaveChannels = user => {
    if (!app.channels.length) return false
    if (!user) return false
    app.channel(app.channels).leave(connection =>
      connection.user && connection.user.id === user.id
    )
  }
  const updateChannels = user => {
    if (!user || !app.channels.length) return false
    app.service('users').publish(() => app.channel('authenticated'))
    const { connections } = app.channel(app.channels).filter(connection =>
      connection.user && connection.user.id === user.id
    )
    leaveChannels(user)
    connections.forEach(connection => joinChannels(user, connection))
  }
  const setUserOffline = (user = null, leaveChannels = false) => {
    if (!user) return false
    app.service('users').patch(user.id, {
      isOnline: false
    }).then(u => {
      app.service('online').remove(u.id).catch(e => {
      })
    }).catch(e => {
      console.log(e)
    })
  }
  app.on('connection', connection => {
    app.channel('anonymous').join(connection)
  })
  app.on('login', (authResult, { connection }) => {
    if (connection) {
      const user = connection.user
      app.channel('anonymous').leave(connection)
      app.channel('authenticated').join(connection)
      app.channel('user/' + user.id).join(connection)
      app.channel('user/' + user.role).join(connection)
      if (!user.isOnline) {
        app.service('users').patch(user.id, {
          isOnline: true
        }).then(u => {
          delete u.password
          delete u.role
          delete u.email
          app.service('online').create({
            user: u
          }).catch(e => {
            console.log('can not set user online', e)
          })
        }).catch(e => {
          console.log(e)
        })
      }
    }
  })
  app.on('logout', (payload, { connection }) => {
    const { user } = connection
    if (!app.channels.length) return
    setUserOffline(user, false)
    console.log(payload)
    app.channel('authenticated').leave(connection)
    app.channel('user/' + user.id).leave(connection)
    app.channel('user/' + user.role).leave(connection)
    app.channel('anonymous').join(connection)
  })
  app.on('disconnect', connection => {
    const { user } = connection
    if (!user) return false
    setUserOffline(user, false)
  })
  app.service('room-categories').publish(() => app.channel('authenticated'))
  app.service('rooms').publish(() => app.channel('authenticated'))
  app.service('room-msg').publish(async (data, context) => {
    const user = context.params.user
    let output = data
    let room = cache.get('room/'+data.roomId) || await app.service('rooms').get(data.roomId).then(r => {
      cache.set('room/'+r.id, r, 599)
      return r
    })
    let author = cache.get('user/'+data.userId) || await app.service('users').get(data.userId).then(u => {
      cache.set('user/'+u.id, u, 599)
      return u
    })
    output = {
      ...data,
      ...{
        author: author
      }
    }
    if (room.blackList.includes(user.id)) output = {}
    if (room.accessMode === 'open') {
      return app.channel('authenticated').send(output)
    } else {
      if (room.whiteList.length) {
        const subs = await Promise.all(room.whiteList.map(u => 'user/'+u))
        subs.push('user/'+user.id)
        return app.channel(subs).send(output)
      } else {
        return app.channel('user/'+data.userId).send(output)
      }
    }
  })
  app.service('users').publish(() => app.channel('authenticated'))
  app.service('room-acts').publish(() => app.channel('authenticated'))
  app.service('room-actions').publish(() => app.channel('authenticated'))
  app.service('online').publish(() => app.channel('authenticated'))
  app.service('smileys').publish(() => app.channel('authenticated'))
  app.service('mannequin-data').publish(() => app.channel('authenticated'))
  app.service('planet-data').publish(() => app.channel('authenticated'))
  app.service('planet').publish(() => app.channel('authenticated'))
  app.service('planet-xy').publish(() => app.channel('authenticated'))
  app.service('kicked').publish(() => app.channel('authenticated'))
  app.service('photos').publish(() => app.channel('authenticated'))
  app.service('notifications').publish((data, context) => {
    return app.channel('user/' + data.data.toId)
  })
  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));
  
  // With the userid and email organization from above you can easily select involved users
  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // });
}
