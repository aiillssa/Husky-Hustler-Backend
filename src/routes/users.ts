import express, { Router } from "express";
import {
  getAllUsers,
  updateUser,
  createUser,
  deleteUser,
  getUser,
} from "../controllers/userController";
import { createUserValidator } from "../middleware/validators/createUserValidator";
import { verifyJWT } from "../middleware/verifyJWT";
const routerUser: Router = express.Router();

// Public routes
routerUser.get("/", getAllUsers);

// Protected Routes
routerUser.post("/", createUserValidator, createUser);
routerUser.get("/:id", verifyJWT, getUser);
routerUser.delete("/:id", verifyJWT, deleteUser);
export default routerUser;
