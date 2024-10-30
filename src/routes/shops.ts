import express, { Router } from "express";
import { createShop, getAllShops } from "../controllers/shopController";
const routerShops: Router = express.Router();

routerShops.route("/").post(createShop).get(getAllShops);
export default routerShops;
