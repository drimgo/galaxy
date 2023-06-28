const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const roomMsg = sequelizeClient.define('room_msg', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    toId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    indexes: [{
      fields: ['roomId'],
      using: 'BTREE'
    }],
    hooks: {
      beforeCount(options) {
        options.raw = true
      }
    }
  })

  roomMsg.associate = function (models) {
    const { users, rooms } = models
    roomMsg.belongsTo(users, { as: 'user' })
    roomMsg.belongsTo(rooms, { as: 'room' })
  }

  return roomMsg
}
