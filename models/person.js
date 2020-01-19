const mongoose = require('mongoose')
mongoose.set('useUnifiedTopology', true)

const dbUrl = process.env.MONGODB_URI

console.log("Connecting to MongoDB")

mongoose.connect(dbUrl, {useNewUrlParser: true})
.then(result => {
    console.log("Connected to MongoDB")
})
.catch((error) => {
    console.log("Error connecting to MongoDB", error.message)
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transfrom: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)