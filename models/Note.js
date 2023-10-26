const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
    content: String,
    created_at: Date,
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = model('Note', noteSchema)

// const note = new Note({
//     content: 'Nueva tarea por hacer',
//     created_at: new Date(),
//     important: true
// })

// note.save()
//     .then(result => {
//         console.log(result)
//         moongose.connection.close()
//     })
//     .catch(err => console.log(err))

module.exports = Note