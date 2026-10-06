const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://fullstack:${password}@ac-61lkni3-shard-00-00.4oukxs8.mongodb.net:27017,ac-61lkni3-shard-00-01.4oukxs8.mongodb.net:27017,ac-61lkni3-shard-00-02.4oukxs8.mongodb.net:27017/?ssl=true&replicaSet=atlas-w5kbkb-shard-0&authSource=admin&appName=FSO`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })
    .then(() => runApp())
    .catch(err => console.log(err.message))

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const runApp = () => {
    if (process.argv.length == 3) {
        Person.find({})
            .then(result => {
                if (result.length === 0) {
                    console.log("phonebook is empty")
                } else {
                    console.log('phonebook:')
                    result.forEach(p => console.log(p.name, p.number))
                }
            mongoose.connection.close()
        })
        return
    }

    const personName = process.argv[3]
    const personNumber = process.argv[4]
    const person = new Person({
        name: personName,
        number: personNumber,
    })

    person.save()
        .then(result => {
            console.log(`added ${personName} number ${personNumber} to phonebook`)
            mongoose.connection.close()
        })
  
}
