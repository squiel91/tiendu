const express = require('express')
const fs = require('fs')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const connectFlash = require('connect-flash')
const mongoose = require('mongoose')
const favicon = require('serve-favicon')
const path = require('path')

// const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

const rootPath = require('./utils/root-path')
const env = require('./utils/env')

// API routes
const storeApiRoutes = require('./routes/api-store-routes')
const adminApiRoutes = require('./routes/api-admin-routes')
const accessApiRoutes = require('./routes/api-access-routes')

// routes
const accessRoutes = require('./routes/access-routes')
const adminRoutes = require('./routes/admin-routes')
const storeRoutes = require('./routes/store-routes')
const galleryRoutes = require('./routes/gallery-routes')

const server = express()

const conUri = `mongodb://localhost:27017/${env.DATABASE}`
const store = new MongoDBStore({
  uri: conUri,
  collection: 'sessions'
})

// Catch errors
store.on('error', function (error) {
  console.error(error)
})

server.set('template engine', 'ejs')
server.use(express.urlencoded({ extended: true }))
server.use(express.json())

server.use(connectFlash())

// if (!env.isDev) {
//   server.use(helmet())
// }

server.use(compression())

const accessLogStream = fs.createWriteStream(rootPath('access.log'), { flags: 'a' })
server.use(morgan('combined', { stream: accessLogStream }))

server.use(favicon(path.join(path.dirname(require.main.filename), 'public', 'assets', 'favicon.png')))

server.use('/statics', express.static(rootPath('public'))) // 'statics' subroute so it does not initialize the session

server.use(
  require('express-session')({
    secret: env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    },
    store: store,
    resave: true, // https://www.npmjs.com/package/express-session#resave
    saveUninitialized: true // https://www.npmjs.com/package/express-session#saveuninitialized
  })
)

// if (!env.isDev) {
//   server.use(csrf()) // To protect against CSRF attacks
// }

server.use('/api',
  adminApiRoutes,
  accessApiRoutes,
  storeApiRoutes,
  galleryRoutes
)

server.use(accessRoutes)
server.use(storeRoutes)
server.use('/admin', adminRoutes)

server.use((req, res, next) => {
  res.status(404).render('404.ejs')
})

server.use((error, req, res, next) => {
  res.status(500).render('500.ejs', { error })
})

global.PREFERENCES = JSON.parse(
  fs.readFileSync(rootPath('data', 'preferences.json'))
)

mongoose.connect(conUri)
  .then(() => {
    server.listen(env.port, () => {
      console.log(`--Tiendu está ACTIVO. Visitá http://localhost:${env.port} para acceder a la tienda.`)
    })
  })
  .catch((err) => {
    console.error('ERROR: could not stablish connection with the database.', err)
  })
