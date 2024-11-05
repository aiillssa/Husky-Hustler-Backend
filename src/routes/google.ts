import express, { Router } from "express";
import { handleGoogleLogin } from "../controllers/googleController";

const routerGoogle: Router = express.Router();

routerGoogle.post("/", handleGoogleLogin);

export default routerGoogle;