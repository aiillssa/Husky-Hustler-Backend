import express, { Router } from "express";
import {
  getAllUsers,
  updateUser,
  createUser,
} from "../controllers/userController";
const routerUser: Router = express.Router();

routerUser.route("/").post(createUser).get(getAllUsers);
export default routerUser;
