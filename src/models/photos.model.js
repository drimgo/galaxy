const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const photos = sequelizeClient.define('photos', {
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likedBy: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    previewPath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    moderated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    averageColor: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  }, {
    indexes: [{
      fields: ['userId'],
      using: 'BTREE'
    }],
    hooks: {
      beforeCount(options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  photos.associate = function (models) {
    const { users } = models
    photos.belongsTo(users)
  }

  return photos
}
