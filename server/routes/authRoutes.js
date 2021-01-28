const router = require('express').Router(),
  { signUp, login } = require('../handlers/auth')

router.post('/register', signUp)
router.post('/login', login)

module.exports = router