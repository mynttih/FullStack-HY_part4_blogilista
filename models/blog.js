const mongoose = require('mongoose')

const mongoUrl = 'mongodb://hemyntti:<password>@ds233238.mlab.com:33238/fullstack-hy-blogilista'

mongoose.connect(mongoUrl)

const Blog = mongoose.model('Blog', {
    title: String,
    author: String,
    url: String,
    likes: Number
  })

module.exports = Blog