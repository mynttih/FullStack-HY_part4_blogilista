const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const cors = require('cors')
const express = require('express')
const http = require('http')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')

mongoose.connect(config.mongoUrl)
    .then(() => {
        console.log('connected to database', config.mongoUrl)
    })
    .catch(error => {
        console.log(error)
    })

const app = express()

app.use(cors())
app.use(bodyParser.json())
//app.use(middleware.logger)
app.use(middleware.tokenExtractor)
app.use(express.static('build'))

mongoose.Promise = global.Promise

app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
