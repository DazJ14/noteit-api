require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors');
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes');
const loginRouter = require('./controllers/login');

app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
    response.send('<h1>Bienvenido a la api</h1><p>En algun momento en este endpoint puede que ponga documentacion</>')
})

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

// Middleware 
app.use(notFound)
app.use(handleErrors)

// Puerto y listen
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${PORT}`)
});

module.exports = { app, server }