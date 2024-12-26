const express = require('express');

const app = express();

app.use(express.json());

let Persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(Persons);
    }
);

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${Persons.length} people</p>
    <p>${date}</p>`);
    }
);

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = Persons.find(person => person.id === id);
    if(person){
        res.json(person);
    } else {
        res.status(404).end();
    }
    }
);

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    Persons = Persons.filter(person => person.id !== id);
    console.log(Persons);
    res.status(204).end();
    }
);

const GenerId = () => {
    const maxId = Persons.length > 0
    ? Math.max(...Persons.map(n => n.id))
    : 0
    return maxId + 1
}

app.post('/api/persons', (req, res) => {  
    const body = req.body;
    console.log(req.body);
    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    if(Persons.find(person => person.name === body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        });
    }
    const person = {
        id: GenerId(),
        name: body.name,
        number: body.number
    }

    Persons = Persons.concat(person);
    res.json(person);
    }
);

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})