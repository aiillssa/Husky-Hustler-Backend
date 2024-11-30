import express from "express";
import { createCategory } from "../controllers/categoriesController";
import { verifyJWT } from "../middleware/verifyJWT";
import { downloadBlob, listBlobs, uploadBlob } from "../controllers/blobController";
const routerBlobs = express.Router();

// Protected routes
// (Probably want to restrict everyone but admins from this, but for now, this is what i have)
//routerBlobs.get("/", listBlobs);
routerBlobs.get("/", downloadBlob);
//change to post!
routerBlobs.post("/", uploadBlob);

export default routerBlobs;
