import express, { Router } from "express";
import { createShop, getAllShops } from "../controllers/shopController";
const routerUser: Router = express.Router();

routerUser.route("/").post(createShop).get(getAllShops);
export default routerUser;
