const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: CustomStrategy } = require('passport-custom');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Configuración de opciones para la estrategia JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_secret_key',
};

// Estrategia JWT para autenticación desde el header Authorization
passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false, { message: 'User not found' });
    } catch (error) {
      return done(error, false);
    }
  })
);

// Estrategia personalizada para autenticación desde cookies
passport.use(
  'current',
  new CustomStrategy(async (req, done) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return done(null, false, { message: 'Token not found' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      const user = await User.findById(decoded.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false, { message: 'User not found' });
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;