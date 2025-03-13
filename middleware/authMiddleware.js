import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const protect = async (req, res, next) => {
  console.log('wtf1');
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Attach user info without password

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
