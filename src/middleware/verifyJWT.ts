import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = 'your-secret-key-here';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}
/**
 const authHeader = req.headers.authorization || req.headers.Authorization;
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};
 */
export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization header missing or malformed' });
      return; // Explicitly return here to avoid further execution
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    jwt.verify(token, process.env.APP_SECRET!, (err, decoded) => {
      // If the verify does not work
      if(err) {
        res.status(400).json({error: 'Token is not valid'});
      }
      
    });

    // Attach the decoded token to the request object

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
