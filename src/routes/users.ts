import express, { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  postUser,
  updateUser,
} from "../controllers/userController";

const routerUser: Router = express.Router();

routerUser
  .route("/")
  .get(getAllUsers)
  .post(postUser)
  .put(updateUser)
  .delete(deleteUser);

export default routerUser;
