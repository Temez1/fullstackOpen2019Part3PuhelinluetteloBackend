const mongoose = require('mongoose')
let findOnly = false

if ( process.argv.lenght < 3 ) {
  console.log('parameter: password')
  process.exit(1)
}
if ( process.argv.length === 3 ){
  findOnly = true
}
else if ( process.argv.length !== 5 ) {
  console.log('parameters: password, personName, personNumber')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://temez1:${password}@cluster0-nss7s.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (findOnly){
  Person
  .find({})
  .then(result => {
    console.log("phonebook:")
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`) 
    })
    mongoose.connection.close()
  })
}
else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(response => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
    mongoose.connection.close()
  })
}
