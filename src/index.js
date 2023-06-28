const logger = require('./logger')
const app = require('./app')
const port = app.get('port')
//const server = app.listen(port)
const https = require('https')
const fs = require('fs')

//const sslKey = fs.readFileSync(process.cwd() + '/ssl/192.168.1.4_key.pem')
//const sslCert = fs.readFileSync(process.cwd() + '/ssl/192.168.1.4_server.crt')
const sslKey = fs.readFileSync(process.cwd() + '/ssl/192.168.1.5.pem')
const sslCert = fs.readFileSync(process.cwd() + '/ssl/192.168.1.5.crt')
//const sslKey = fs.readFileSync(process.cwd() + '/ssl/192.168.43.80_work.pem')
//const sslCert = fs.readFileSync(process.cwd() + '/ssl/192.168.43.80_work.crt')
const server = https.createServer({
  key: sslKey,
  cert: sslCert
}, app)
server.listen(port)


app.setup(server)

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
)

server.on('listening', () => {
  console.clear()
  logger.info('API server started on https://%s:%d', app.get('host'), port)
})
