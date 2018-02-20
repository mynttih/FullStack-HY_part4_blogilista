const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User
            .find({}, {passwordHash: 0, __v: 0})
            .populate('blogs', { likes: 1, author: 1, title: 1, urls: 1 })

        response.json(users)
    } catch (exception) {
        console.log(exception)
        response.status(400).json({ error: 'failed to fecth users' })
    }
})

usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            adult: body.adult,
            passwordHash
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'failed to add user'})
    }
})

module.exports = usersRouter