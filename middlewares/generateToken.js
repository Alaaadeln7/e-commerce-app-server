import jwt from 'jsonwebtoken';
import { COOKIE_OPTIONS } from '../config/constants.js';

/**
 * Generate JWT token and set it in HTTP-only cookie
 * @param {string} userId - User ID to encode in token
 * @param {Object} res - Express response object
 * @returns {string} Generated token
 */
const generateToken = (userId, res) => {
  try {
    // Generate token
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
        algorithm: 'HS256'
      }
    );

    // Set secure HTTP-only cookie
    res.cookie('jwt', token, COOKIE_OPTIONS);

    // Return token for potential other uses (e.g., WebSocket authentication)
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Error generating authentication token');
  }
};

export default generateToken;
