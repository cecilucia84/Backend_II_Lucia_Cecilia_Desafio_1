const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config();
require('./config/passport'); // Asegúrate de que este archivo esté correctamente importado

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Conexión a MongoDB
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;

mongoose.connect(uri, { dbName })
  .then(() => {
    console.log('Conectado correctamente a MongoDB');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

// Rutas
const sessionRoutes = require('./routes/sessionRoutes');
app.use('/api/sessions', sessionRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));