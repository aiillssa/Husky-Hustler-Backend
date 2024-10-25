import express, { Router } from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/userController";
const routerUser: Router = express.Router();

routerUser
  .route("/")
  .get(getAllUsers)
  .post(createUser)
  .put(updateUser)
  .delete(deleteUser);

export default routerUser;
