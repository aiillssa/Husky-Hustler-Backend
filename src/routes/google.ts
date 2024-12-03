import express, { Router } from "express";
import { handleGoogleLogIn, handleGoogleSignUp, handleLogOut } from "../controllers/googleController";

const routerGoogle: Router = express.Router();

routerGoogle.post("/signUp", handleGoogleSignUp);
routerGoogle.post("/signIn", handleGoogleLogIn);
routerGoogle.post("/logOut", handleLogOut);


export default routerGoogle;