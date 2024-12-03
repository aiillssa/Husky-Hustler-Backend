import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.APP_SECRET!;

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization header missing or malformed' });
      return;
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          // Handle expired token
          const refreshToken = req.cookies.refreshToken;

          if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token missing' });
          }

          const newAuthToken = refreshJWT(refreshToken);

          if (!newAuthToken) {
            return res.status(401).json({ error: 'Invalid or expired refresh token AAAA' });
          }

          // Set new token in response headers
          res.setHeader('Authorization', `Bearer ${newAuthToken}`);

          // Allow the request to continue
          req.headers.authorization = `Bearer ${newAuthToken}`;
          console.log("Auth token was invalid, refresh token was valid");
          return next();
        }

        return res.status(400).json({ error: 'Invalid token' });
      }

      // Token is valid, proceed to the next middleware
      console.log("Auth token was valid");
      next();
    });
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
    console.log("Auth and refresh tokens were invalid");
  }
};

const refreshJWT = (refreshToken: string): string | null => {
  try {
    const decodedRefresh = jwt.verify(refreshToken, SECRET_KEY) as JwtPayload;
    if (!decodedRefresh) {
      return null;
    }

    const newToken = jwt.sign(
      { id: decodedRefresh.id },
      SECRET_KEY,
      { expiresIn: '5m' }
    );

    console.log("created new token");

    return newToken;
  } catch (err) {
    console.error('Failed to refresh token:', err);
    return null;
  }
};
