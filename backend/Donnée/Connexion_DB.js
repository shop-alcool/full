require('dotenv').config({ path: __dirname + '/../.env' });
//const { Client } = require('pg');
const mysql = require('mysql2')
console.log('USER:', process.env.USER);
console.log('DB:', process.env.DATABASE);
console.log('USER:', process.env.USER)
// const client = new Client({
//   host: process.env.HOST,
//   port: process.env.PORT,
//   user: process.env.USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DATABASE,
// });

const client = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
})

client.connect((err)=> {
  if(err)
  {
    console.error('Erreur de connexion:', err);
    return;
  }
  else{
    console.log('Connecté à la base de données');
  }

})

// client.connect()
//   .then(() => {
//     console.log('Connecté à la base de données');
//   })
//   .catch(err => {
//     console.error('Erreur de connexion:', err);
//   });

// module.exports = {
//   client,
//   query: (...args) => client.query(...args)
// };