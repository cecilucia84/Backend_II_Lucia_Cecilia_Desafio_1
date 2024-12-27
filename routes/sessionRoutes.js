const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validar la contraseña con el método isValidPassword
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generar el JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

    // Guardar el token en una cookie
    res.cookie('token', token, { httpOnly: true });

    // Responder con el token
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener los datos del usuario actual
router.get(
  '/current',
  passport.authenticate('current', { session: false }), // Usa la estrategia 'current' para obtener al usuario de la cookie
  (req, res) => {
    res.json({ user: req.user }); // Devuelve los datos del usuario
  }
);

module.exports = router;