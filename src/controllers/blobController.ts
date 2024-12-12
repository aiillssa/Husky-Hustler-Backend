import { Request, Response } from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
dotenv.config();

//Method loads and returns a blobServiceClient that allows users to interact with blob storage
export const loadServiceClient = async () => {
  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw Error("Azure Storage Connection string not found");
  }
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  return blobServiceClient;
};

//Method lists all blobs -> returns an array of strings with blob names
//If there are errors, will send it back.
export const listBlobs = async (req: Request, res: Response) => {
  const blobServiceClient = await loadServiceClient();
  try {
    const containerClient = blobServiceClient.getContainerClient("images");
    console.log("Listing blobs...");
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(blob.name);
    }
    res.json({
      message: "[blobController] - successfully loaded blob list",
      blobs,
    });
  } catch (error) {
    console.error("[blobController] - Failed to list blobs:", error);
    res.status(500).json({ error: error });
  }
};

//Method takes a request with userID and source and returns a binary string of the requested image, if it exists.
//Throws an error if it does not exist.
export const downloadBlob = async (req: Request, res: Response) => {
  const userID = req.params.id;
  const source = req.params.source;
  const blobServiceClient = await loadServiceClient();
  const containerClient = blobServiceClient.getContainerClient("images");
  const blockBlobClient = containerClient.getBlockBlobClient(
    userID + "-" + source
  );
  const downloadBlockBlobResponse = await blockBlobClient.download(0);
  try {
    //res.setHeader("Content-Type", downloadBlockBlobResponse.contentType || "image/jpeg");
    if (!downloadBlockBlobResponse.readableStreamBody) {
      throw new Error(
        "[blobController] - The readableStreamBody is undefined. Ensure you're running in a Node.js environment."
      );
    }
    downloadBlockBlobResponse.readableStreamBody.pipe(res);
  } catch (err) {
    res
      .status(500)
      .send("[blobController] - An error occurred while downloading the blob.");
  }
};

//interface for multer
interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

//uploads a blob given a formData file object, userId, and "source" keyword
//Returns successfully uploaded message if it succeeds, error otherwise
export const uploadBlob = async (req: Request, res: Response) => {
  const blobServiceClient = await loadServiceClient();
  const containerClient = blobServiceClient.getContainerClient("images");
  const file = req.file as MulterFile;
  const id = req.body.id;
  const source = req.body.source;
  const blockBlobClient = containerClient.getBlockBlobClient(id + "-" + source);
  try {
    await blockBlobClient.uploadData(file.buffer);
    res.send("[blobController, uploadBlob] - successfully uploaded blob");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send(
        "[blobController, uploadBlob] - An error occurred while uploading the image."
      );
  }
};

//This method uploads multiple, product images to the blob using a specific naming scheme.
//Takes in a user id, "source" keyword, and a formData file object.
export const uploadProductBlob = async (req: Request, res: Response) => {
  const blobServiceClient = await loadServiceClient();
  const containerClient = blobServiceClient.getContainerClient("images");
  const files = req.files as Express.Multer.File[];
  const id = req.body.id;
  const source = req.body.source;

  try {
    files.forEach(async (file, index) => {
      const blockBlobClient = containerClient.getBlockBlobClient(
        id + "-" + source + index
      );
      await blockBlobClient.uploadData(file.buffer);
    });
    res.send(
      "[blobController, uploadProductBlob] - successfully uploaded blob"
    );
  } catch (err) {
    res
      .status(400)
      .send("[blobController, uploadProductBlob] - failed uploading blob");
  }
};

//this method deletes all blobs that contain a given userID in them.
//Returns success message if successful, error message otherwise.
export const deleteBlob = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log("Initializing BlobServiceClient...");
  const blobServiceClient = await loadServiceClient();
  const containerClient = blobServiceClient.getContainerClient("images");

  const blobs = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    blobs.push(blob.name);
  }
  try {
    console.log("blobs", blobs);
    for (const blob of blobs) {
      if (blob.includes(id)) {
        await containerClient.deleteBlob(blob);
      }
    }
    res.send("[blobController, deleteBlob] - successfully deleted blobs");
  } catch (err) {
    res
      .status(400)
      .send("[blobController, deleteBlob] - failed to delete blobs");
  }
};
