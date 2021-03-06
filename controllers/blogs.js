const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog
            .find({}, {__v: 0})
            .populate('user', { username: 1, name: 1 })
        
        response.json(blogs)
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'failed to fetch blogs'})
    }
})

blogsRouter.get('/:id', async (request, response) => {
    try {
        const blog = await Blog
            .findById(request.params.id)

        response.json(blog)
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformed id'})
    }
})

blogsRouter.put('/:id', async (request, response) => {
    try {
        const body = request.body

        const blog = {
            user: body.userId,
            likes: body.likes + 1,
            author: body.author,
            title: body.title,
            url: body.url
        }

        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        const user = await User.findById(updatedBlog.user)
        updatedBlog.user = user
        response.json(updatedBlog)
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformed id' })
    }
})

blogsRouter.post('/', async (request, response) => {
    try {
        const body = request.body
        
        //const token = getTokenFrom(request)
        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
    
        if (body.title === undefined || body.url === undefined) {
            return response.status(400).json({ error: 'title or url missing' })
        }

        if (body.likes === undefined) {
            body.likes = 0
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })

        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        savedBlog.user = user
        response.status(201).json(savedBlog)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'failed to add new blog'})
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        const deletedBlog = await Blog
            .findByIdAndRemove(request.params.id)
        
        const user = await User.findById(deletedBlog.user)
        user.blogs = user.blogs.filter(blog => blog.toString() !== deletedBlog._id.toString())
        await user.save()

        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformed id'})
    }
})

module.exports = blogsRouter