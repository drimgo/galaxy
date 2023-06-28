/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
const mergeImages = require('merge-images')
const { Canvas, Image } = require('canvas')
const sharp = require('sharp')
const fs = require('fs')
const { getFilePath, getDestinationPath, encryptFileName, decode64Image } = require('./utils/merge-images.utils')
Canvas.Image = Image
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data, params, app, method, type } = context
    const { query, user, provider } = params
    if (provider) {
      if (!data.headID || !data.bodyID) throw new error.BadRequest('Wrong data')
      const headItem = await app.service('mannequin-data').get(data.headID).catch(e => {
        throw new error.BadRequest(e.message)
      })
      const bodyItem = await app.service('mannequin-data').get(data.bodyID).catch(e => {
        throw new error.BadRequest(e.message)
      })
      const headPath = getFilePath(headItem.path)
      const bodyPath = getFilePath(bodyItem.path)
      const destination = getDestinationPath()
      const filename = encryptFileName()
      const headMeta = await sharp(headPath).metadata().catch(e => {
        throw new error(e)
      })
      const bodyMeta = await sharp(bodyPath).metadata().catch(e => {
        throw new error(e)
      })
      const canvasHeight = +headMeta.height + +bodyMeta.height
      const canvasWidth = headMeta.width > bodyMeta.width ? headMeta.width : bodyMeta.width
      const imageSrc = await mergeImages([{
        src: bodyPath,
        y: headMeta.height,
        x: Math.round(Math.floor(canvasWidth / 2) - Math.floor(bodyMeta.width / 2))
      }, {
        src: headPath,
        x: Math.round(Math.floor(canvasWidth / 2) - Math.floor(headMeta.width / 2)),
        y: Math.round(Math.floor((headMeta.height / 100) * 17))
      }], {
        Canvas: Canvas,
        height: canvasHeight,
        width: canvasWidth
      }).catch(e => {throw new error.BadRequest(e.message)})
      const imageBuffer = decode64Image(imageSrc)
      await new Promise((res, rej) => {
        const wstream = fs.createWriteStream(destination + filename + '.png')
        wstream.write(imageBuffer.data)
        wstream.end(() => {
          res()
        })
      })
      context.data.result = {
        path: `/uploads/personages/${filename}.png`
      }
    }
    return context
  }
}
