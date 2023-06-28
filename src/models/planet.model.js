const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const planet = sequelizeClient.define('planet', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    backgroundId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    backgroundColor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    soundId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    coordinates: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: []
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true
      }
    }
  })

  planet.associate = function (models) {
    const { rooms, planet_data } = models
    planet.belongsTo(rooms, { as: 'room' })
    planet.belongsTo(planet_data, { as: ['background', 'sound'] })
  }

  return planet
}
