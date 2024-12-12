import { NextFunction, Request, Response } from "express";
import { Users } from "../../models/Users";

/**
 * Middleware which validates requests for the createUser endpoint
 * If any validation check fails, it returns a 400 Bad Request
 * Expected fields for the request body (all required):
 * - name (string)
 * - email (string): must fit UW Email Regex
 * @returns
 * - 400 error if validation fails
 * - 409 Conflict if User already exists (2 Users cannot have the same email)
 * - Otherwise forwards to the createUser endpoint
 */
export const createUserValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract fields from body
  const { name, email } = req.body;

  // Check for missing/empty fields
  if (!name || !email || name === "" || email === "") {
    res.status(400).json({
      error: `At least one missing field: name: ${name}, email: ${email}`,
    });
    return;
  }

  // Check that email fits the UW Email Regex
  const uwMailRegex = /^[a-zA-Z0-9._%+-]+@uw.edu/;
  if (!uwMailRegex.test(email)) {
    res.status(400).json({ error: `Email in invalid format, email: ${email}` });
    return;
  }

  // Checks if user already exists
  const existingUser = await Users.findOne({ where: { email: email } });
  if (existingUser) {
    // If the user already exists, return 409 Conflict
    res.status(409).json({ msg: "Email already exists" });
    return;
  }

  // Proceed to createUser
  next();
};
