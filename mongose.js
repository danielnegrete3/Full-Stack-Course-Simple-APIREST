const mongoose = require('mongoose')

if (process.env.PASSWORD === undefined) {
    console.log(process.env)
  console.log('give password as argument')
  process.exit(1)
}
const url =
  `mongodb+srv://danielnegrete5666:${process.env.PASSWORD}@cluster0.fznpo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
})