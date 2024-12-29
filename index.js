require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');


// const morgan = require('morgan');
// Crear un token personalizado para capturar el cuerpo de la solicitud
// morgan.token('body', (req) => JSON.stringify(req.body));
// app.use(morgan('tiny'));
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms body: :body'));

if (process.env.PASSWORD === undefined) {
    console.log('give password as environment variable')
    process.exit(1)
}
const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(cors())
app.use(express.static('dist'))


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
});

app.get('/info', (req, res) => {
    const date = new Date();
    Person.find({}).then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>`);
    })
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        if(person){
            res.json(person)
        }else{
            res.status(404).end()
        }
    }).catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(() => {
        res.status(204).end();
    }).catch(error => next(error))
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(id,person,{new: true}).then(updatedPerson => {
        res.json(updatedPerson)
    }).catch(error => next(error))
});

// const GenerId = () => {
//     const maxId = Persons.length > 0
//     ? Math.max(...Persons.map(n => n.id))
//     : 0
//     return maxId + 1
// }

app.post('/api/persons', (req, res) => {  
    const body = req.body;
    console.log(req.body);
    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    Person.find({name: body.name}).then(person => {
        if(person.length > 0){
            return res.status(400).json({
                error: 'name must be unique'
            });
        }
    })

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  // este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
  app.use(errorHandler)

const PORT = process.env.PORT??3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} http://localhost:${PORT}`);
})

app.on('close', () => {
    mongoose.connection.close()
})