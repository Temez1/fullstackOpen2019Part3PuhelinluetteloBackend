const morgan = require("morgan")

morgan.token("res-body", (req) => {
  const bodyString = JSON.stringify(req.body)
  if (bodyString === "{}") {
    // Returning space because otherwise morgan will return '-'
    return (" ")
  }
  return bodyString
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError" && error.kind === "ObjectId") {
    res.status(400).send({ error: "malformatted id" })
  }
  if (error.name === "ValidationError") {
    // Person name
    if (error.errors.name) {
      if (error.errors.name.kind === "required") {
        res.status(400).json({ error: error.message })
      }
      if (error.errors.name.kind === "minlength") {
        res.status(400).json({ error: error.message })
      }
      if (error.errors.name.kind === "unique") {
        res.status(409).json({ error: error.message })
      }
    }
    // Person number
    if (error.errors.number) {
      if (error.errors.number.kind === "required") {
        res.status(400).json({ error: error.message })
      }
      if (error.errors.number.kind === "minlength") {
        res.status(400).json({ error: error.message })
      }
    }
  }

  next(error)
}

module.exports = {
  morgan,
  unknownEndpoint,
  errorHandler,
}
