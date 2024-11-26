import express from "express";
import { createCategory } from "../controllers/categoriesController";
import { verifyJWT } from "../middleware/verifyJWT";
import { downloadBlobs, listBlobs } from "../controllers/blobController";
const routerBlobs = express.Router();

// Protected routes
// (Probably want to restrict everyone but admins from this, but for now, this is what i have)
routerBlobs.get("/", listBlobs);
routerBlobs.get("/download", downloadBlobs);

export default routerBlobs;
