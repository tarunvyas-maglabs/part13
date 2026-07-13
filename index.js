const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const resetRouter = require('./controllers/reset')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/reset', resetRouter)

app.get('/', (_req, res) => {
  res.status(200).send('Ok')
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: ["username must be a valid email address"] })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).send({ error: "username must be unique" })
  }
  next(error)
}

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()