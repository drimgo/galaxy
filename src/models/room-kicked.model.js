const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const roomKicked = sequelizeClient.define('room_kicked', {
    reason: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kickedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expiredAt: {
      type: DataTypes.INTEGER,
      allowNull: false
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

  // eslint-disable-next-line no-unused-vars
  roomKicked.associate = function (models) {
    const { rooms } = models
    roomKicked.belongsTo(rooms, { as: 'room' })
  }

  return roomKicked
}
