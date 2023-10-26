require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors');
const Note = require('./models/Note.js')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
    response.send('<h1>Bienvenido a la api</h1><p>En algun momento en este endpoint puede que ponga documentacion</>')
})

app.get('/api/notes', (request, response) => {
    console.log('peticion!!')
    Note.find({}).then(notes => {
        response.json(notes)
    })
    
})

app.get('/api/notes/:id', (request, response, next) => {
    const { id } = request.params

    Note.findById(id).then(note => {
        if (note) {
            return response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        next(err)
    })
})

app.post('/api/notes', (request, response, next) => {
    let note = request.body;
    
    if (!note.content) {
        return response.status(400).json({
            error: 'required "content" field is missing'
        })
    }

    const newNote = new Note({
        content: note.content,
        created_at: new Date,
        important: note.important || false
    })

    newNote.save().then(savedNote => {
        response.json(savedNote)
    }).catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    const { id } = request.params

    Note.findByIdAndDelete(id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const { id } = request.params
    const noteUpdated = {
        content: request.body.content,
        important: request.body.important
    }

    Note.findByIdAndUpdate(id, noteUpdated, { new: true })
        .then(result => {
            response.json(result)
        })
        .catch(error => {
            next(error)
        })
})

// Middleware 
app.use(notFound)
app.use(handleErrors)

// Puerto y listen
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${PORT}`)
});