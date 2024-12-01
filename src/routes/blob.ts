import express from "express";

import { downloadBlob, listBlobs, uploadBlob } from "../controllers/blobController";
const routerBlobs = express.Router();


//routerBlobs.get("/:id/:source", downloadBlob) //will b added in the future...
routerBlobs.get("/", downloadBlob);
routerBlobs.post("/", uploadBlob);

export default routerBlobs;
