const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

usersRouter.get('/', userExtractor, async (request, response) => {
    const { userId } = request

    const { id, username } = await User.findById(userId)

    response.json({ id, username })
})

usersRouter.post('/', async (request, response, next) => {
    try {
        const { body } = request
        const { username, password } = body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            passwordHash
        })

        const savedUser = await user.save()

        const userForToken = {
            id: savedUser._id,
            username: savedUser.username
        }

        const token = jwt.sign(
            userForToken,
            process.env.SECRET,
            {
                expiresIn: 60 * 60 * 24 * 7
            }
        )

        response.status(201).json({ username: savedUser.username, id: savedUser._id, token })
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter