import express from "express";

import { downloadBlob, listBlobs, uploadBlob, uploadProductBlob } from "../controllers/blobController";
import multer from "multer";
const routerBlobs = express.Router();

const upload = multer();

// const uploadFields = upload.fields([
//     {name: 'files'}, {name: 'captions'}, {name: 'prices'}
// ])


//routerBlobs.get("/:id/:source", downloadBlob) //will b added in the future...
routerBlobs.get("/:id/:source", downloadBlob);
routerBlobs.post("/", upload.single('file'), uploadBlob);
routerBlobs.post("/product", upload.array('files'), upload.array('captions'), upload.array('prices'), uploadProductBlob)

export default routerBlobs;

