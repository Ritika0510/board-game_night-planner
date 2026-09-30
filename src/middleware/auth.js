import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate JWT tokens from incoming requests.
 * Extracts token from Authorization header (Bearer <token>) or x-access-token.
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.split(' ')[1]
    : req.headers['x-access-token'] || req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key';
    const decoded = jwt.verify(token, secret);
    
    // Attach decoded user payload (id, email) to request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};