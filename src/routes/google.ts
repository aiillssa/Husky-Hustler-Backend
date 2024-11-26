import express, { Router } from "express";
import { handleGoogleLogIn, handleGoogleSignUp } from "../controllers/googleController";

const routerGoogle: Router = express.Router();

routerGoogle.post("/signUp", handleGoogleSignUp);
routerGoogle.post("/signIn", handleGoogleLogIn);


export default routerGoogle;