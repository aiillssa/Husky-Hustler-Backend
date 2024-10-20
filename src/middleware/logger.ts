// Example: Middleware to keep a personal log of users logging into
// website (for evil reasons of course muahahahahaha)

import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  next();
};
