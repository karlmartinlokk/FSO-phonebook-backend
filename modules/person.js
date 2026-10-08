const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.log('Error connecting to MongoDB: ', err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Person name too short'],
    required: [true, 'Person name required']
  },
  number: {
    type: String,
    minLength: [8, 'Incorrect phone number length'],
    validate: {
      validator: function(n) {
        return /^\d{2,3}-\d{4,100}$/.test(n)
      }
    },

    required: [true, 'Person phone number required']
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
