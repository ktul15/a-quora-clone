const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  password: 'postgres@postgres',
  host: 'localhost',
  database: 'a_quora_clone',
  port: 5432
})

module.exports = pool