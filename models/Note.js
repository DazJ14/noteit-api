const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
    note: Object,
    favorite: Boolean,
    created_at: Number,
    last_edition: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
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