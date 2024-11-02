import express from "express";
import { getShopsWithCategory } from "../controllers/categoryController";

const routerCategories = express.Router();

routerCategories.get("/:category", getShopsWithCategory);

export default routerCategories;
