const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtGenerator = (user_id, user_name, user_email) => {
  const payload = {
    user_id: user_id,
    user_name: user_name,
    user_email: user_email
  }

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1h' })
}

module.exports = jwtGenerator