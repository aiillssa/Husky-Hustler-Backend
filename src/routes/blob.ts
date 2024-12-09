import express from "express";

import { deleteBlob, downloadBlob, listBlobs, uploadBlob, uploadProductBlob } from "../controllers/blobController";
import multer from "multer";
const routerBlobs = express.Router();

const upload = multer();

routerBlobs.get("/", listBlobs);
routerBlobs.get("/:id/:source", downloadBlob);
routerBlobs.post("/", upload.single('file'), uploadBlob);
routerBlobs.post("/product", upload.array('files'), uploadProductBlob)
routerBlobs.delete("/:id", deleteBlob)

export default routerBlobs;

