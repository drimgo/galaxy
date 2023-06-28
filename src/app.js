const path = require('path')
const favicon = require('serve-favicon')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./logger')
const NodeCache = require('node-cache')
const busboy = require('connect-busboy')

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')


const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')
const channels = require('./channels')

const authentication = require('./authentication')

const sequelize = require('./sequelize')

const app = express(feathers())
const corsUrls = app.get('cors') || [
  'http://192.168.1.6', 
  'http://192.168.1.6:8080', 
  'http://89.108.64.56', 
  'https://192.168.1.5:8080', 
  'http://localhost:8080', 
  'http://127.0.0.1:8080', 
  'http://192.168.43.80:8080', 
  'http://176.99.11.24', 
  'http://chat.bodrchat.ru', 
  'http://bodrchat.ru', 
  'https://chat.bodrchat.ru', 
  'https://bodrchat.ru',
  'http://sociel.ru', 
  'https://sociel.ru',
  'http://jivoclub.ru', 
  'https://jivoclub.ru',
]
// Load app configuration
app.configure(configuration())
app.use(busboy({
  highWaterMark: 2 * 1024 * 1024
}))
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors({
  origin: function (origin, cb) {
    if (origin === undefined || corsUrls.indexOf(origin) > -1) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'), false)
    }
  },
  credentials: true
}))
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(app.get('public')))
app.set('cache', new NodeCache())
// Set up Plugins and providers

app.configure(socketio({
  pingInterval: 10000,
  pingTimeout: 50000
}))
app.configure(express.rest())

app.configure(sequelize)

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware)
app.configure(authentication)
// Set up our services (see `services/index.js`)
app.configure(services)
// Set up event channels (see channels.js)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

module.exports = app
