const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')

const app = express()

app.use(cors())
app.use(bodyParser.json())

//mongoose.Promise = global.Promise

app.use('/api/blogs', blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
