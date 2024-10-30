// Example: Controller for interaction with User table
// CRUD operations dealing with Users
// Can (and probably will need to) add more
// methods from here (and might need to get rid of some)
import { AppDataSource } from "../config/data-source";
import { NextFunction, Request, Response } from "express";
import { Shops } from "../models/Shop";
import { Users } from "../models/Users";

export const createUser = async (req: Request, res: Response) => {
  // Assuming that its already authenticated
  // Middleware which checks that req has correct body
  // Middleware for checking if it already exists in the db

  // Already confirmed to have name and email
  const body: any = req.body;
  try {
    const user = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Users)
      .values({ name: body.name, email: body.email })
      .execute();
    console.log(user);
    res
      .status(201)
      .json({ msg: "Success", user_id: user.generatedMaps[0].idUsers });
  } catch (err) {
    console.warn(
      `[Controller - createUser] failed trying to access Users table\nError:${err}`
    );
    res.status(500).json({ error: err });
  }
};

// For Testing Purposes
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await AppDataSource.getRepository(Users)
      .createQueryBuilder("user")
      .getMany();
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

export const deleteUser = async (req: Request, res: Response) => {
  const user_id = req.params.id;
  if (!user_id) {
    res.status(400).json({ error: `UserID is required` });
    return;
  }
  try {
    const result = await AppDataSource.createQueryBuilder()
      .delete()
      .from(Users)
      .where("idUsers = :id", { id: user_id })
      .execute();
    if (result.affected == 0) {
      res.sendStatus(204);
      return;
    }
    res.status(200).json({ msg: "User deleted successfully" });
    return;
  } catch (err) {
    console.warn(
      `[Controller - deleteUser] failed trying to delete user from table\nError:${err}`
    );
    res.status(500).json({ error: err });
  }
};
