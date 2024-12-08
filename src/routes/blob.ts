import express from "express";

import { downloadBlob, listBlobs, uploadBlob, uploadProductBlob } from "../controllers/blobController";
import multer from "multer";
const routerBlobs = express.Router();

const upload = multer();

// const uploadFields = upload.fields([
//     { name: 'files' },
// ])


//routerBlobs.get("/:id/:source", downloadBlob) //will b added in the future...
routerBlobs.get("/", listBlobs);
routerBlobs.get("/:id/:source", downloadBlob);
routerBlobs.post("/", upload.single('file'), uploadBlob);
routerBlobs.post("/product", upload.array('files'), uploadProductBlob)

export default routerBlobs;

