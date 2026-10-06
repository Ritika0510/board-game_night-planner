import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate JWT tokens from incoming requests.
 * Extracts token from Authorization header (Bearer <token>) or x-access-token.
 * Sets req.user = { id: ... } when valid.
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.split(' ')[1]
    : req.headers['x-access-token'] || req.query.token;

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'super_secret_jwt_key';
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }
  }

  // Fallback for transition/unauthenticated compatibility:
  // If no token, check for user ID in body, params, or custom header
  const fallbackUserId = req.headers['x-user-id'] || req.body?.userId || req.params?.userId || req.query?.userId;
  if (fallbackUserId) {
    req.user = { id: parseInt(fallbackUserId, 10), isFallback: true };
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Access denied. No authentication token or user identity provided.'
  });
};

/**
 * Strict authentication middleware: Requires a verified JWT.
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.split(' ')[1]
    : req.headers['x-access-token'] || req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token required.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};