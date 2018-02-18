const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog
            .find({})
        
        response.json(blogs)
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'failed to fetch blogs'})
    }
})
  
blogsRouter.post('/', async (request, response) => {
    try {
        const blog = new Blog(request.body)
    
        if (blog.title === undefined || blog.url === undefined) {
            return response.status(400).json({ error: 'title or url missing' })
        }

        if (blog.likes === undefined) {
            blog.likes = 0
        }

        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'failed to add new blog'})
    }
})

module.exports = blogsRouter