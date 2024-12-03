import express from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/categoriesController";
import { verifyJWT } from "../middleware/verifyJWT";
const routerCategories = express.Router();

// Protected routes
// (Probably want to restrict everyone but admins from this, but for now, this is what i have)
routerCategories.post("/", verifyJWT, createCategory);
routerCategories.get("/", getAllCategories);

export default routerCategories;
