import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import sessionRoutes from './routes/sessionRoutes.js';
import './config/passport.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Conexión a MongoDB
mongoose.connect(uri, { dbName })
  .then(() => console.log('Conectado correctamente a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Rutas
app.use('/api/sessions', sessionRoutes);

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
