// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const recoveryCodes = sequelizeClient.define('recovery_codes', {
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  recoveryCodes.associate = function (models) {
    const { users } = models
    recoveryCodes.belongsTo(users, { as: 'user' })
  }

  return recoveryCodes
}
