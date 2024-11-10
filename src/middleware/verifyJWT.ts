import { NextFunction, Request, Response } from "express";

// TODO: Sean
// Ensuring protected routes by confirming tokens match
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  next();
};
