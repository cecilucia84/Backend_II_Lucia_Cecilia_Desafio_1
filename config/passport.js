import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as CustomStrategy } from 'passport-custom';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_secret_key',
};

// Estrategia JWT
passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) return done(null, user);
      return done(null, false, { message: 'User not found' });
    } catch (error) {
      return done(error, false);
    }
  })
);

// Estrategia personalizada para cookies
passport.use(
  'current',
  new CustomStrategy(async (req, done) => {
    try {
      const token = req.cookies.token;
      if (!token) return done(null, false, { message: 'Token not found' });
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      const user = await User.findById(decoded.id);
      if (user) return done(null, user);
      return done(null, false, { message: 'User not found' });
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
