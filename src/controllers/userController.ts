// Example: Controller for interaction with User table
// CRUD operations dealing with Users
// Can (and probably will need to) add more
// methods from here (and might need to get rid of some)
import { Request, Response } from "express";
import { Users } from "../models/Users";

/**
 * POST request for creating a user
 * @returns
 * - 201 w/ user_id if user successfully created
 * - 500 if server error
 */
export const createUser = async (req: Request, res: Response) => {
  // Extract fields from body
  const { name, email } = req.body;
  try {
    // Create user
    const user = Users.create({ name, email });
    await user.save();
    console.log(user);
    res.status(201).json({ msg: "Success", user_id: user.idUsers });
  } catch (err) {
    console.warn(
      `[Controller - createUser] failed trying to access Users table\nError:${err}`
    );
    res.status(500).json({ error: err });
  }
};

// For Testing Purposes
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const allUsers = await Users.find();
    console.log(allUsers);
    res.status(200).json({ users: allUsers });
  } catch (err) {
    console.warn(
      `[Controller - getAllUsers] failed trying to access Users table\nError:${err}`
    );
    res.status(500).json({ error: err });
  }
};

export const updateUser = async (req: Request, res: Response) => {};

/**
 * DELETE request for deleting a user
 * @returns
 * - 400 if user_id not included
 * - 204 if already deleted
 * - 200 if successfully deleted
 * - 500 if server error
 */
export const deleteUser = async (req: Request, res: Response) => {
  // Check if user_id provided
  const user_id = req.params.id;
  if (!user_id) {
    res.status(400).json({ error: `UserID is required` });
    return;
  }
  try {
    // Delete user
    const result = await Users.delete({ idUsers: parseInt(user_id) });

    // If nothing got deleted (already provided/not present)
    if (result.affected === 0) {
      res.sendStatus(204);
      return;
    }

    // Deleted successfully
    res.status(200).json({ msg: "User deleted successfully" });
    return;
  } catch (err) {
    console.warn(
      `[Controller - deleteUser] failed trying to delete user from table\nError:${err}`
    );
    res.status(500).json({ error: String(err) });
  }
};
