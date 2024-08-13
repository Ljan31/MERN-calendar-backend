const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// crear es servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio Publico
// - use - middleware una funcion q se ejecuta cuando pasa por un lugar
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
// todo auth // crear, login, renew
app.use( '/api/auth', require('./routes/auth') );

// todo CRUD: Eventos
app.use( '/api/events', require('./routes/events') );


// Escuchar peticiones

app.listen( process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
});
