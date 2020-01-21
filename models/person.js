const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

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
  name: {type:String, minlength:3, required:true, unique:true},
  number: {type:String, minlength:8, required:true}
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)