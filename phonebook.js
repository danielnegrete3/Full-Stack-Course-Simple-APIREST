const mongoose = require('mongoose')

if (process.env.PASSWORD === undefined) {
  console.log('give password as environment variable')
  process.exit(1)
}

if (process.argv[2] == "--insert" && process.argv.length < 5) {
    console.log('give a name and number as argument')
    process.exit(1)
}

const url =
  `mongodb+srv://danielnegrete5666:${process.env.PASSWORD}@cluster0.fznpo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url,{ dbName: 'PhoneBook' })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[2] == "--insert") {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })
    
    person.save().then(result => {
      console.log('note saved!',result)
      mongoose.connection.close()
    })
}

if (process.argv[2] == "--list" || process.argv[2] == undefined) {
    Person.find({}).then(result => {
        result.forEach(note => {
          console.log(note)
        })
        mongoose.connection.close()
    })
}
