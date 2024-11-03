import express, { Router } from "express";
import {
  getAllUsers,
  updateUser,
  createUser,
  deleteUser,
} from "../controllers/userController";
import { createUserValidator } from "../middleware/validators/createUserValidator";
const routerUser: Router = express.Router();

routerUser.post("/", createUserValidator, createUser);
routerUser.get("/", getAllUsers);
routerUser.delete("/:id", deleteUser);
export default routerUser;
