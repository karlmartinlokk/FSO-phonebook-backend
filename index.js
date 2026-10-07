const express = require('express')
const app = express()

require('dotenv').config()

const Person = require('./modules/person')

const morgan = require('morgan')
morgan.token('body', (request, response) => JSON.stringify(request.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/api/persons', (request, response, next) => {
  Person.find({})
  .then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
  })

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body || !body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
      .then(savedPerson => {
          response.json(savedPerson)
      })
      .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      person.name = name
      person.number = number

      return person.save()
        .then(updatedPerson => response.json(updatedPerson))
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.countDocuments()
    .then(count =>
      response.send(`
          <p>Phonebook has info for ${count} people.</p>
          <p>${Date()}</p>
      `)
    )
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})