import express, { Router } from "express";
import {
  createShop,
  deleteShop,
  getAllShops,
  getShop,
  getShopsWithCategory,
  updateShops,
} from "../controllers/shopController";
import { createShopValidator } from "../middleware/validators/createShopValidator";
import { verifyJWT } from "../middleware/verifyJWT";
const routerShops: Router = express.Router();

// Public routes
routerShops.get("/", getAllShops);
routerShops.get("/:id", getShop);
routerShops.get("/categories/:categoryName", getShopsWithCategory);

// Protected routes
routerShops.post("/", verifyJWT, createShopValidator, createShop);
routerShops.delete("/:id", verifyJWT, deleteShop);
routerShops.patch("/:id", verifyJWT, updateShops);

export default routerShops;
