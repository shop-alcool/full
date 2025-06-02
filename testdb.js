require('dotenv').config()
const mysql = require('mysql2')

const conn = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
})

conn.connect(err => {
  if (err) return console.error('Erreur de connexion:', err)
  console.log('✅ Connexion réussie !')
  conn.end()
})
