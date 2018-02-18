const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const cors = require('cors')
const express = require('express')
const http = require('http')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

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

mongoose.Promise = global.Promise

app.use('/api/blogs', blogsRouter)

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
