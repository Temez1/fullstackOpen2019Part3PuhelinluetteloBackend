const personsRouter = require("express").Router()
const PersonModel = require("../models/person")

personsRouter.get("/", (req, res) => {
  PersonModel.find({}).then((persons) => {
    res.json(persons.map((person) => person.toJSON()))
  })
})

personsRouter.post("/", (req, res, next) => {
  const requestedPerson = req.body

  const newPerson = new PersonModel({
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

personsRouter.get("/:id", (req, res, next) => {
  PersonModel.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person.toJSON())
    } else {
      res.status(404).end()
    }
  })
    .catch((error) => next(error))
})

personsRouter.put("/:id", (req, res, next) => {
  const { body } = req

  const person = {
    name: body.name,
    number: body.number,
  }

  // mongoose-unique-validator context option, more:
  // https://www.npmjs.com/package/mongoose-unique-validator#find--updates
  PersonModel.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: "query" })
    .then((updatedPerson) => {
      // This happens when someone has deleted the doc and you are trying to
      // update it (toJSON throws TypeError "can't read null")
      if (updatedPerson === null) {
        res.status(410).json({ error: "The person information is deleted already from the server." })
      }
      res.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})

personsRouter.delete("/:id", (req, res, next) => {
  PersonModel.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = personsRouter
