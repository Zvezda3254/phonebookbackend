require('dotenv').config()
const person = require('./models/person')
const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(morgan('tiny'))
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
app.use(express.json());



app.get('/api/persons', (request, response) => {
    person.find({}).then(persons => {
        response.json(persons)
    })
})

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

    newPerson.save().then (savedPerson=>{
    response.json(savedPerson)
})
    .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {

    return response.status(400).send({ error: 'malformatted id' })
    } 

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})