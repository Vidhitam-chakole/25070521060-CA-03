// server/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'learnwithfun_pixel_secret_key_2026';

/**
 * Authentication middleware to verify JWT token and protect private user routes.
 * Ensures only the authenticated user can access and manage their own data.
 */
export function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication token is missing.',
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        // Fallback check: check alternate secret if legacy
        try {
          const fallbackDecoded = jwt.verify(token, 'speechpact_pixel_secret_key_2026');
          req.user = fallbackDecoded;
          return next();
        } catch {
          return res.status(403).json({
            success: false,
            message: 'Invalid or expired authentication session. Please sign in again.',
          });
        }
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during token verification',
    });
  }
}
