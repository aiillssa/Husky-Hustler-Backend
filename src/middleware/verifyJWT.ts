import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = 'your-secret-key-here';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization header missing or malformed' });
      return; // Explicitly return here to avoid further execution
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach the decoded token to the request object
    (req as CustomRequest).token = decoded;

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
