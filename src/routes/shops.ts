import express, { Router } from "express";
import {
  createShop,
  deleteShop,
  getAllShops,
  getShopsWithCategory,
} from "../controllers/shopController";
import { createShopValidator } from "../middleware/validators/createShopValidator";
const routerShops: Router = express.Router();

routerShops.post("/", createShopValidator, createShop);
routerShops.get("/", getAllShops);
routerShops.delete("/:id", deleteShop);
routerShops.get("/categories/:categoryName", getShopsWithCategory);
export default routerShops;
