import express, { Router } from "express";
import {
  createShop,
  deleteShop,
  getAllShops,
  getShop,
  getShopWithUserId,
  getShopsWithCategory,
  updateShops,
} from "../controllers/shopController";
import { createShopValidator } from "../middleware/validators/createShopValidator";
import { verifyJWT } from "../middleware/verifyJWT";
import { checkInappropriate } from "../middleware/validators/filter";
import { logger } from "../middleware/logger";
import { updateShopValidator } from "../middleware/validators/updateShopValidator";
import { prepareProducts } from "../middleware/prepareProducts";
const routerShops: Router = express.Router();

// Public routes

routerShops.get("/", getAllShops);
routerShops.get("/:id", getShop);
routerShops.get("/user/:userId", getShopWithUserId);
routerShops.get("/categories/:categoryName", logger, getShopsWithCategory);

// Protected routes
routerShops.post(
  "/",
  verifyJWT,
  createShopValidator,
  checkInappropriate(["shopName", "shopDescription"]),
  prepareProducts,
  createShop
);
routerShops.delete("/:id", verifyJWT, deleteShop);
routerShops.patch(
  "/:id",
  verifyJWT,
  updateShopValidator,
  checkInappropriate(["shopName", "shopDescription"]),
  prepareProducts,
  updateShops
);

export default routerShops;
