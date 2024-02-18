const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

loginRouter.get('/', userExtractor, async (request, response) => {
    const { userId } = request

    const user = await User.findById(userId)
    response.status(200).json({ id: user._id, username: user.username })
})

loginRouter.post('/', async (request, response) => {
    const { body } = request
    const { username, password } = body

    console.log('intento de log in de: ' + username)

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid user or password'
        })
    }

    const userForToken = {
        id: user._id,
        username: user.username
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        {
            expiresIn: 60 * 60 * 24 * 7
        }
    )

    response.send({
        id: user._id,
        username: user.username,
        token
    })
})

module.exports = loginRouter