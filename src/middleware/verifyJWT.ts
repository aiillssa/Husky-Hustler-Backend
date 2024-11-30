import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = 'your-secret-key-here';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

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
    const refreshToken = req.cookies;
    console.log("Gotten refreshToken from cookies is: ", refreshToken);
    // Verify the token
    jwt.verify(token, process.env.APP_SECRET!, (err, decoded) => {
      // If the verify does not work
      if(err) {
        res.status(400).json({error: 'Token is not valid'});
      }
      
    });

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/** 
const refreshJWT = (token: string, refreshToken: string): void => {
  try {
    jwt.verify(refreshToken, process.env.APP_SECRET!, (err, decoded) => {
      // If the verify does not work
      if(err) {
        return false;
      }
      return "true";
    });
  } catch (err) {
    return "fasle";
  }
  
}
*/
