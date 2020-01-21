require("dotenv").config()
const express = require("express")
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")

const personModel = require("./models/person")

const app = express()

app.use(express.static("build"))
app.use(bodyParser.json())

morgan.token("res-body", (req) => {
  const bodyString = JSON.stringify(req.body)
  if (bodyString === "{}") {
    // Returning space because otherwise morgan will return '-'
    return (" ")
  }
  return bodyString
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :res-body"))
app.use(cors())

app.get("/api/persons", (req, res) => {
  personModel.find({}).then((persons) => {
    res.json(persons.map((person) => person.toJSON()))
  })
})

app.post("/api/persons", (req, res, next) => {
  const requestedPerson = req.body

  const newPerson = new personModel({
    name: requestedPerson.name,
    number: requestedPerson.number,
  })

  newPerson.save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => {
      res.json(savedAndFormattedPerson)
    })
    .catch((error) => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
  personModel.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person.toJSON())
    } else {
      res.status(404).end()
    }
  })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const { body } = req

  const person = {
    name: body.name,
    number: body.number,
  }

  // mongoose-unique-validator context option, more:
  // https://www.npmjs.com/package/mongoose-unique-validator#find--updates
  personModel.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: "query" })
    .then((updatedPerson) => {
      // This happens when someone has deleted the doc and you are trying to
      // update it (toJSON throws TypeError "can't read null")
      if (updatedPerson === null) {
        return res.status(410).json({ error: "The person information is deleted already from the server." })
      }
      res.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  personModel.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id" })
  }
  if (error.name === "ValidationError") {
    // Person name
    if (error.errors.name) {
      if (error.errors.name.kind === "required") {
        return res.status(400).json({ error: error.message })
      }
      if (error.errors.name.kind === "minlength") {
        return res.status(400).json({ error: error.message })
      }
      if (error.errors.name.kind === "unique") {
        return res.status(409).json({ error: error.message })
      }
    }
    // Person number
    if (error.errors.number) {
      if (error.errors.number.kind === "required") {
        return res.status(400).json({ error: error.message })
      }
      if (error.errors.number.kind === "minlength") {
        return res.status(400).json({ error: error.message })
      }
    }
  }

  next(error)
}

app.use(errorHandler)

const { PORT } = process.env

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
