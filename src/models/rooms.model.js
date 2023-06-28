const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const rooms = sequelizeClient.define('rooms', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    accessMode: {
      type: DataTypes.ENUM('open', 'close'),
      defaultValue: 'open'
    },
    whiteList: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    blackList: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    planetId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    indexes: [{
      fields: ['planetId'],
      using: 'BTREE'
    }],
    hooks: {
      beforeCount(options) {
        options.raw = true
      }
    }
  })

  rooms.associate = function (models) {
    const { users, room_categories } = models
    rooms.belongsTo(users, { as: 'user' })
    rooms.belongsTo(room_categories, { as: 'category' })
  }

  return rooms
}
