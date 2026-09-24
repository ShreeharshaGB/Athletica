import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify incoming Bearer JWT tokens.
 * Attaches decoded user payload ({ id, role }) to req.user.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Access denied. No token provided or token format is invalid.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Access denied. Token missing.'
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[Auth Error] JWT_SECRET is not configured in environment variables.');
    return res.status(500).json({
      error: 'Server error',
      message: 'Authentication service is misconfigured.'
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Token has expired. Please log in again.'
      });
    }

    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid token.'
    });
  }
};

export default authenticate;
