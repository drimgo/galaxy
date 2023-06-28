const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const users = sequelizeClient.define('users', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    profileImage: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: null
    },
    roomId: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
      defaultValue: 'male'
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    currency: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    role: {
      type: DataTypes.ENUM('usr', 'mod', 'adm', 'sv'),
      allowNull: false,
      defaultValue: 'usr'
    },
    personage: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthday: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    pushIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
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
  users.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return users
}
