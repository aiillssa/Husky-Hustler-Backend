import express, { Router } from "express";
import {
  getAllUsers,
  updateUser,
  createUser,
  deleteUser,
  getUser,
} from "../controllers/userController";
import { createUserValidator } from "../middleware/validators/createUserValidator";
const routerUser: Router = express.Router();

routerUser.post("/", createUserValidator, createUser);
routerUser.get("/", getAllUsers);
routerUser.get("/:id", getUser);
routerUser.delete("/:id", deleteUser);
export default routerUser;
