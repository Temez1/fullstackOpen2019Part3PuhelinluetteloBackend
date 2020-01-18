const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('res-body', (req, res) => {
  const bodyString = JSON.stringify(req.body)
  if (bodyString === '{}') {
    // Returning space because otherwise morgan will return '-'
    return(' ')
  }
  return bodyString
})

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :res-body'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "050-3335554",
    id: 2
  },
  {
    name: "matti",
    number: "123",
    id: 3
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {


  const requestedPerson = req.body

  const findPersonWithRequestedPersonName = () => persons.find(person => person.name === requestedPerson.name)

  if (!requestedPerson.name || !requestedPerson.number){
    res.status(400).json({error: "Person's name or number is missing from request"})
  }
  else if (findPersonWithRequestedPersonName()){
    res.status(409).json({error: `Person with name '${requestedPerson.name}' is already found from phonebook`})
  }
  else {
    const getRandomIntInclusive = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }

    const newPerson = {
      name: requestedPerson.name ,
      number: requestedPerson.number ,
      id: getRandomIntInclusive(0, 1000000000)
    }

    persons = persons.concat(newPerson)
    res.json(newPerson)
  }

})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person){
    res.json(person)
  } 
  else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(note => note.id !== id)

  res.status(204).end()
})

app.get('/info', (req, res) => {
  const peopleAmount = persons.length
  const date = new Date()
  res.send(`Phonebook has info for ${peopleAmount} people ${date} `)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})