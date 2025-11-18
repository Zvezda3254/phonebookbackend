require('dotenv').config()
const person = require('./models/person')
const express = require('express')
const app = express()
const morgan = require('morgan')

// const mongoose = require('mongoose')
// const password = process.argv[2]
// const url = `mongodb+srv://zzhekova:${password}@cluster0.i33qeyp.mongodb.net/phonebookApp?appName=Cluster0`
// mongoose.set('strictQuery',false)
// mongoose.connect(url, { family: 4 })

/* const personSchema = new mongoose.Schema({
   name: String,
   number: String,
})

 personSchema.set('toJSON', {
   transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
     delete returnedObject._id
    delete returnedObject.__v
  }
 }) */


app.use(morgan('tiny'))
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
app.use(express.json());
let persons = [

    {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
    },
    {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
    },
    {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
    },

    {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
    }
    
]

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/info/', (request, response) => {
    const personCount = persons.length
    const date = new Date()
    const infoText = `
        <div>
            <p>Phonebook has info for ${personCount} people</p>
            <p>${date}</p>
        </div>
    `
    response.send(infoText)

})

//app.get('/api/persons',(request,response)=>{
 //   response.json(persons)
//}
//)

app.get('/api/persons', (request, response) => {
  person.find({}).then(persons => {
    response.json(persons)
  })
})


// app.get('/api/persons/:id', (request, response) => {
//     const id = request.params.id
//     const personsFound = persons.find(person => person.id === id)


//     if (personsFound) {
//         response.json(personsFound)
//     } else {
//     response.status(404).end()
//     }
// })

/* app.get('/api/persons/:id', (request, response) => {
  person.findById(request.params.id).then(person => {
    response.json(person)
  })
}) */

app.get('/api/persons/:id', (request, response, next) => {
  person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})





/* app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
}) */

app.delete('/api/persons/:id', (request, response, next) => {
  person.findByIdAndDelete(request.params.id)
    .then(result => {
    response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
    const maxId = 200000
    const newIDNumber=Math.floor(Math.random()*maxId)
    return String(newIDNumber + 1)
}


app.post('/api/persons', (request, response) => {
const body = request.body

if (!body.name) {
    return response.status(400).json({ 
        error: 'name missing' 
    })
}
if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }

const nameExists = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())
    if (nameExists) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

const newPerson = new person ({
    name: body.name,
    number: body.number || false,
    id: generateId(),
})

//persons = persons.concat(person)
//    response.json(person)
    newPerson.save().then (savedPerson=>{
    response.json(savedPerson)
})

})



const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})