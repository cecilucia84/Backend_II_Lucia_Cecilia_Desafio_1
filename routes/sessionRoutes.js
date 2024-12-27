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
    
    const isPasswordValid = user.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });  // Guarda el token en una cookie
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener los datos del usuario actual
router.get(
  '/current',
  passport.authenticate('current', { session: false }),  // Usa la estrategia 'current' para obtener al usuario de la cookie
  (req, res) => {
    res.json({ user: req.user });  // Devuelve los datos del usuario
  }
);

module.exports = router;
