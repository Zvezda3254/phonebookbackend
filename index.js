const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(morgan('tiny'))
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
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

app.get('/api/persons',(request,response)=>{
    response.json(persons)
}
)
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const personsFound = persons.find(person => person.id === id)


    if (personsFound) {
        response.json(personsFound)
    } else {
    response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
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

const person = {
    content: body.name,
    important: body.number || false,
    id: generateId(),
}

persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})