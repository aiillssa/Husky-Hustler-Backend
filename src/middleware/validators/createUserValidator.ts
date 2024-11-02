import { NextFunction, Request, Response } from "express";
import { Users } from "../../models/Users";

/** Middleware to confirm createUser is called in a valid fashion. */
export const createUserValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const { name, email } = req.body;
  if (!name || !email || name === "" || email === "") {
    res.status(400).json({
      error: `At least one missing field: name: ${name}, email: ${email}`,
    });
    return;
  }
  const uwMailRegex = /^[a-zA-Z0-9._%+-]+@uw.edu/;
  if (!uwMailRegex.test(email)) {
    res.status(400).json({ error: `Email in invalid format, email: ${email}` });
    return;
  }
  // Not sure if we need all this ---->
  const existingUser = await Users.findOne({ where: { email: email } });

  if (existingUser) {
    // If the user already exists, return 409 Conflict
    res.status(409).json({ msg: "Email already exists" });
    return;
  }
  next();
};
