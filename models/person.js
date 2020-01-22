/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

mongoose.set("useUnifiedTopology", true)
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)

const personSchema = new mongoose.Schema({
  // eslint-disable-next-line object-curly-newline
  name: { type: String, minlength: 3, required: true, unique: true },
  number: { type: String, minlength: 8, required: true },
})
personSchema.plugin(uniqueValidator)

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)
