/* eslint-disable no-unused-vars */
const fs = require('fs')
const fsPromises = fs.promises
const readimage = require('readimage')
module.exports = {
  detectOrientation (orientation = 1) {
    const orients = {
      1: null,
      2: null,
      3: 180,
      4: null,
      5: null,
      6: 90,
      7: null,
      8: 270
    }
    // eslint-disable-next-line no-prototype-builtins
    return orients.hasOwnProperty(orientation) ? orients[orientation] : null
  },
  isAllowed (filetype, mime) {
    const videosMimes = ['video/x-flv', 'video/x-ms-wmv', 'video/mp4', 'video/x-msvideo', 'video/quicktime']
    const imagesMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    switch (filetype) {
    case 'video':
    case 'film':
      return videosMimes.includes(mime)
    case 'film-cover':
    case 'photo':
    case 'smiley':
    case 'mannequin-data-body':
    case 'mannequin-data-head':
    case 'planet-data-background':
      return imagesMimes.includes(mime)
    default:
      return false
    }
  },
  averageColor: (buff) => {
    return new Promise((resolve, reject) => {
      readimage(buff, (err, image) => {
        if (!err) {
          let pixels = image.frames[0].data
          let totalRed = 0,
            totalGreen = 0,
            totalBlue = 0,
            totalAlpha = 0
          for (var i = 0; i < pixels.length; i += 4) {
            totalRed   += pixels[i],
            totalGreen += pixels[i + 1],
            totalBlue  += pixels[i + 2],
            totalAlpha += pixels[i + 3]
          }
          let pixelsCount = pixels.length / 4
          let averageRed   = Math.round(totalRed / pixelsCount),
            averageGreen = Math.round(totalGreen / pixelsCount),
            averageBlue  = Math.round(totalBlue / pixelsCount),
            averageAlpha = Math.round(totalAlpha / pixelsCount)
          resolve('rgba(' + averageRed + ', ' + averageGreen + ', ' + averageBlue + ', ' + averageAlpha + ')')
        } else {
          reject(new Error('Can not read image ', err))
        }
      })
    })
  },
  getUploadPath (filetype, uid) {
    uid = uid || false
    switch (filetype) {
    case 'film':
      return './public/uploads/films/'
    case 'film-cover':
      return './public/uploads/films/covers/'
    case 'photo':
      if (!uid) return false
      return './public/uploads/photos/' + uid + '/'
    case 'mannequin-data-body':
      return './public/assets/images/mannequin/body/'
    case 'smiley':
        return './public/assets/images/smileys/'
    case 'mannequin-data-head':
      return './public/assets/images/mannequin/head/'
    case 'planet-data-background':
      return './public/assets/images/planet/backgrounds/'
    default:
      return './pubic/uploads/error/'
    }
  },
  checkUserAccess (user = null, uploadType = null) {
    if (!user || !uploadType) throw new Error('Wrong check parameters')
    const usrLevel = ['usr', 'mod', 'adm', 'sv']
    const modLevel = ['mod', 'adm', 'sv']
    const admLevel = ['adm', 'sv']
    const svLevel = ['sv']
    switch (uploadType) {
    case 'photo':
      return usrLevel.includes(user.role)
    case 'mannequin-data-body':
      return modLevel.includes(user.role)
    case 'mannequin-data-head':
      return modLevel.includes(user.role)
    case 'planet-data-background':
      return modLevel.includes(user.role)
    case 'smiley':
        return modLevel.includes(user.role)
    default:
      return false
    }
  },
  checkDirAccess (d) {
    return new Promise ((resolve, reject) => {
      fs.access(d, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
          fsPromises.mkdir(d).then(() => {
            resolve(d + '/')
          }).catch(e => reject(new Error('Can not create upload folder', e)))
        } else {
          resolve(d + '/')
        }
      })
    })
  },
  encryptFileName (filename) {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.' + filename.split('.').pop()
  }
}
