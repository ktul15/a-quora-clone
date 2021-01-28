const pool = require('../db'),
  bcrypt = require('bcrypt'),
  jwtGenerator = require('../utils/jwtGenerator')

module.exports.signUp = async (req, res, next) => {
  // 1. destructure name, email and password from req.body
  const { name, email, password } = req.body

  try {
    // 2. check if user already exists, throw error if yes
    const user = await pool.query('SELECT * FROM users WHERE user_email = ($1)', [email])
    if (user.rows.length !== 0) {
      return res.status(401).json('User already exists. Log in!')
    }

    // 3. bcrypt the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. add user to database
    let newUser = await pool.query('INSERT INTO users (user_name, user_email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword])

    const { user_id, user_name, user_email } = newUser.rows[0]

    // 5. generate jwt token
    const token = jwtGenerator(user_id, user_email, user_name)
    res.json({ user_id, user_name, user_email, token })
  } catch (err) {
    if (err.code == 11000) {
      err.message = `Sorry, that username and/or email is taken`
    }
    return next({
      status: 400,
      message: err.message
    })
  }
}

module.exports.login = async (req, res, next) => {
  try {
    // 1. get email and password from req.body
    const { email, password } = req.body

    // 2. check if user already exists, throw error if not
    const user = await pool.query('SELECT * FROM users WHERE user_email = ($1)', [email])
    if (user.rows.length === 0) {
      return res.status(401).json(`User doesn't exists. Sign Up!`)
    }

    const { user_id, user_name, user_email } = user.rows[0]

    // 3. Check if password is valid
    const isPasswordCorrect = await bcrypt.compare(password, user.rows[0].password)
    if (!isPasswordCorrect) {
      return res.status(401).json('Incorrect password or email!')
    }

    // 4. give them the jwt token if password correct
    const token = jwtGenerator(user_id, user_name, user_email)
    res.json({ token })
  }
  catch (error) {
    return next({
      status: 400,
      message: error.message
    })
  }
}