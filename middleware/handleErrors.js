const ERROR_HANDLERS = {
    ValidationError: res =>
        res.status(303).send({ error: 'User already exist' }),
    CastError: res =>
        res.status(400).send({ error: 'id used is malformed' }),

    JsonWebTokenError: res =>
        res.status(401).json({ error: 'token missing or invalid' }),

    TokenExpirerError: res =>
        res.status(401).json({ error: 'token expired' }),

    defaultError: (res, error) => {
        console.error(error.name)
        res.status(500).end()
    }
}

module.exports = (error, request, response, next) => {
    const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

    handler(response, error)
}