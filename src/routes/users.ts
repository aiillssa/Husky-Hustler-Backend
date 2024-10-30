import express, { Router } from "express";
import {
  getAllUsers,
  updateUser,
  createUser,
} from "../controllers/userController";
import { createUserValidator } from "../middleware/validators/createUserValidator";
const routerUser: Router = express.Router();

routerUser.route("/").post(createUserValidator, createUser).get(getAllUsers);
export default routerUser;
