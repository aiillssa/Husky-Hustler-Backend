import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// App secret key to sign and verify JWTs 
const SECRET_KEY = process.env.APP_SECRET!;

/**
 * Verifys and validates auth JWTs for protected routes and automatically refreshes expired tokens if possible
 * @param req 
 * - Contains the authorization token in the authorization token and the refresh token in cookies for refreshing
 * @param res 
 * - The status code as well as the new auth token if old auth token was expired and the refresh token was valid
 * @param next
 * - If the auth token is valid or it was sucessfully refreshed, proceed to called endpoint
 * @returns 
 * - 400 if the auth token is invalid
 * - 401 if the refresh token is missing, is invalid or expired, or the authorization header is missing
 */
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
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
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

/**
 * Creates a new auth JWT using a vaild refresh JWT
 * @param refreshToken 
 * - The refresh token to use to create a new auth token
 * @returns 
 * - A new auth JWT with a 5 minute expiration if the refresh token is valid
 * - null if the refresh token is invalid or expired
 */
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
