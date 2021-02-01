require('dotenv').config()

const express = require('express'),
  app = express(),
  cors = require('cors'),
  errorHandler = require('./handlers/error'),
  PORT = process.env.PORT || 5000,
  pool = require('./db'),
  authRoutes = require('./routes/authRoutes')

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ROUTES

// auth routes
app.use('/auth', authRoutes)

// temporary routes
app.get('/temp/get-all', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM users')
    res.json(allUsers.rows)
  } catch (err) {
    console.log(err)
  }
})

app.delete('/temp/delete/:id', async (req, res) => {
  try {
    const allUsers = await pool.query('DELETE FROM users WHERE user_id = $1', [req.params.id])
    res.json(allUsers.rows)
  } catch (err) {
    console.log(err)
  }
})

// if none of my routes reached, then handle error
app.use((req, res, next) => {
  let err = new Error('Not found!')
  err.status = 404
  next(err)
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server on port ${PORT}`)
})