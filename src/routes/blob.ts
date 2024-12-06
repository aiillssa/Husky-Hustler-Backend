import express from "express";

import { downloadBlob, listBlobs, uploadBlob } from "../controllers/blobController";
import multer from "multer";
const routerBlobs = express.Router();

const upload = multer();


//routerBlobs.get("/:id/:source", downloadBlob) //will b added in the future...
routerBlobs.get("/:id/:source", downloadBlob);
routerBlobs.post("/", upload.single('file'), uploadBlob);

export default routerBlobs;

