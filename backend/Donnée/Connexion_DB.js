// require('dotenv').config({ path: __dirname + '/../.env' });
// const { Client } = require('pg');
// console.log('USER:', process.env.USER);
// console.log('DB:', process.env.DATABASE);
// const client = new Client({
//   host: process.env.HOST,
//   port: process.env.PORT,
//   user: process.env.USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DATABASE,
// });

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