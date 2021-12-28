const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const cors = require('cors')
const rootPath = require('./utils/root-path')
const env = require('./utils/env')
const { authenticate } = require('./controllers/access-controller')

// api routes
const apiRoutes = require('./routes/api-routes')

async function setup () {
  const server = express()
  const accessLogStream = fs.createWriteStream(rootPath('access.log'), { flags: 'a' })

  server
    .enable('trust proxy') // to be able to get the protocol, might be deprecated (can use '//' instead)
    .use(express.json())
    .use(helmet())
    .use(cors({ 
      origin: env.isDev ? '*' : undefined,
      methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
    }))
    .use(compression())
    .use(morgan('combined', { stream: accessLogStream }))
    // API
    .use('/api', authenticate, apiRoutes)  
    // frontend
    .use('/assets', express.static(rootPath('public', 'assets')))
    .use('/img', express.static(rootPath('public', 'img')))
    .use('/favicon.ico', (req, res) => {
      res.sendFile(rootPath('public', 'favicon.ico'))
    })
    .use((req, res) => {
      res.sendFile(rootPath('public', 'index.html'))
    })
    .use((error, req, res, next) => {
      res.status(500).json({ message: `Internal server error: ${error.message}` })
    })

  try {
    await mongoose.connect(`mongodb://localhost:27017/${env.DATABASE}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
  } catch (error) {
    console.error('ERROR: could not stablish connection with the database.', error)
  }
  await server.listen(env.port, () => {
    console.log(`--Tiendu is now ACTIVE. Visit http://localhost:${env.port} to access the store.`)
  })
}

setup ()
