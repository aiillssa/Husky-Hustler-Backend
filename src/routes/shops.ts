import express, { Router } from "express";
import { createShop, getAllShops } from "../controllers/shopController";
import { createShopValidator } from "../middleware/validators/createShopValidator";
const routerShops: Router = express.Router();

routerShops.post("/", createShopValidator, createShop);
routerShops.get("/", getAllShops);
export default routerShops;
