module.exports = {
  getFilePath: (path) => {
    return process.cwd() + '/public/' + path
  },
  decode64Image: (src) => {
    let matches = src.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    let response = {}
    if (matches.length !== 3) {
      return new Error('Invalid input string')
    }
    response.type = matches[1]
    response.data = Buffer.from(matches[2], 'base64')
    return response
  },
  getDestinationPath: () => {
    return process.cwd() + '/public/uploads/personages/'
  },
  encryptFileName: (filename = null) => {
    const encryptedString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    return  filename ? encryptedString + '.' + filename.split('.').pop() : encryptedString
  }
}