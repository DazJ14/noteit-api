const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

notesRouter.get('/', userExtractor, async (request, response, next) => {
  const { userId } = request

  try {
    const users = await User.findById(userId).populate('notes', {})
    response.json(users)
  } catch (error) {
    next(error)
  }
})

notesRouter.post('/', userExtractor, async (request, response, next) => {
  const { userId } = request

  const user = await User.findById(userId)

  const newNote = new Note({
    note: {
      header: {
        type: 'doc',
        content: [
          {
            type: 'title',
          }
        ]
      },
      body: {
        type: 'doc',
        content: [
          {
            type: 'paragraph'
          }
        ]
      }
    },
    favorite: false,
    created_at: Date.now(),
    last_edition: Date.now(),
    user: user._id
  })

  try {
    const savedNote = await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  const { userId } = request

  try {
    await User.updateOne({ _id: userId },
      { $pull: { notes: id } })

    const deletingNote = await Note.findByIdAndDelete(id)

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', userExtractor, (request, response, next) => {
  const { id } = request.params
  const noteUpdated = {
    note: {
      header: request.body.header,
      body: request.body.body,
    },
    last_edition: Date.now()
  }

  Note.findByIdAndUpdate(id, noteUpdated, { new: true })
    .then(result => {
      console.log(result)
      response.json(result)
    })
    .catch(error => {
      console.log('error al editar')
      next(error)
    })
})

notesRouter.put('/favorite/:noteId', userExtractor, async (request, response, next) => {
  const { noteId } = request.params

  const note = await Note.findById(noteId)

  console.log(note)
})

module.exports = notesRouter