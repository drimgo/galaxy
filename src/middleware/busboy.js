/* eslint-disable no-unused-vars */
const { isAllowed, detectOrientation, getUploadPath, encryptFileName, checkDirAccess, checkUserAccess, averageColor } = require('./utils/busboy-upload.utils.js')
const error = require('@feathersjs/errors')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const exifReader = require('exif-reader')
module.exports = () => {
  return function busboy(req, res, next) {
    const { user } = req
    req.pipe(req.busboy)
    if (req.busboy) {
      req.busboy.on('field', function(fieldname, val, valTruncated, keyTruncated) {
        req.body = Object.assign(req.body, {
          [fieldname]: val
        })
      })
      const fileType = req.feathers.headers.type
      if (!fileType) throw new error.BadRequest('Filetype is not sent')
      req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (!isAllowed(fileType, mimetype)) {
          file.resume()
          return next(new error.BadRequest('Filetype is not supported'))
        }
        if (!checkUserAccess(user, fileType)) {
          file.resume()
          return next(new error.Forbidden('You have not access to this action'))
        }
        let newFilename = encryptFileName(filename)
        let savePath = getUploadPath(fileType, user.id)
        let readyPath = path.join(savePath, newFilename)
        checkDirAccess(savePath).then(() => {
          const fstream = fs.createWriteStream(readyPath)
          file.pipe(fstream)
          fstream.on('close', async () => {
            if (fileType === 'photo') {
              await checkDirAccess(savePath + 'previews').then(async pathToSave => {
                const image = sharp(readyPath).withMetadata({
                  orientation: 1
                })
                await image.metadata().then(async meta => {
                  if (meta.exif) {
                    const exif = exifReader(meta.exif)
                    if (exif.image.Orientation !== 1) {
                      const detectedOrientation = detectOrientation(exif.image.Orientation)
                      if (detectedOrientation) {
                        const fixedPath = savePath + '__' + newFilename
                        return image.rotate(detectedOrientation).toFile(fixedPath).then(async () => {
                          await image.resize({
                            width: meta.width > 420 ? 420 : meta.width
                          }).toFile(savePath + 'previews/' + newFilename).then(() => {
                            sharp(path.join(savePath, newFilename)).toBuffer().then(async (buf) => {
                              req.body = {
                                ...req.body,
                                ...{
                                  filename: newFilename,
                                  path: fixedPath.replace(/\\/g,'/').replace('public/', ''),
                                  previewPath: (pathToSave + newFilename).replace(/\\/g,'/').replace('./public/', ''),
                                  filesize: req.feathers.headers['content-length'],
                                  averageColor: await averageColor(buf)
                                }
                              }
                              return next()
                            }).catch(e => {
                              return next(new error.BadGateway(e.message))
                            })
                          }).catch(e => {
                            return next(new error.BadRequest(e))
                          })
                        }).catch(e => {
                          return next(new error.BadGateway(e.message))
                        })
                      }
                    }
                  }
                  await image.resize({
                    width: meta.width > 420 ? 420 : meta.width
                  }).toFile(savePath + 'previews/' + newFilename).then(() => {
                    sharp(path.join(savePath + 'previews/', newFilename)).toBuffer().then(async (buf) => {
                      req.body = {
                        ...req.body,
                        ...{
                          filename: newFilename,
                          path: readyPath.replace(/\\/g,'/').replace('public/', ''),
                          previewPath: (pathToSave + newFilename).replace(/\\/g,'/').replace('./public/', ''),
                          filesize: req.feathers.headers['content-length'],
                          averageColor: await averageColor(buf)
                        }
                      }
                      next()
                    }).catch(e => {
                      return next(new error.BadGateway(e.message))
                    })
                  }).catch(e => {
                    return next(new error.BadRequest(e))
                  })
                }).catch(e => {
                  return next(new error.BadRequest('Can not get image metadata'))
                })
              }).catch(e => {
                return next(new error.BadRequest(e.message))
              })
            } else if (fileType === 'planet-data-background') {
              sharp(path.join(savePath, newFilename)).toBuffer().then(async buf => {
                req.body = {
                  ...req.body,
                  ...{
                    filename: newFilename,
                    path: readyPath.replace(/\\/g,'/').replace('public/', ''),
                    filesize: req.feathers.headers['content-length'],
                    averageColor: await averageColor(buf)
                  }
                }
                next()
              }).catch(e => {
                throw new Error(e)
              })
            } else if (fileType === 'smiley') {
              req.body = {
                ...req.body,
                ...{
                  filename: newFilename,
                  path: readyPath.replace(/\\/g,'/').replace('public/', ''),
                  filesize: req.feathers.headers['content-length'],
                }
              }
              next()
            } else {
              req.body = {
                ...req.body,
                ...{
                  filename: newFilename,
                  path: readyPath.replace(/\\/g,'/').replace('public/', ''),
                  filesize: req.feathers.headers['content-length']
                }
              }
              next()
            }
          })
        }).catch(e => {
          file.resume()
          return next(new error.BadRequest(e))
        })
      })
    }
  }
}
