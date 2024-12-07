import { Request, Response } from "express";
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string;


export const loadServiceClient = async () => {

    const AZURE_STORAGE_CONNECTION_STRING =
        process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error('Azure Storage Connection string not found');
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );


    // Create the BlobServiceClient object with connection string
    // const blobServiceClient = BlobServiceClient.fromConnectionString(
    //     AZURE_STORAGE_CONNECTION_STRING
    // );
    // console.log("Initializing BlobServiceClient...");
    // const blobServiceClient = new BlobServiceClient(
    //     `https://${accountName}.blob.core.windows.net`,
    //     new DefaultAzureCredential() // Ensure credentials are correct)
    // );

    return blobServiceClient
}

export const listBlobs = async (req: Request, res: Response) => {
    const blobServiceClient = await loadServiceClient();
    try {
        const containerClient = blobServiceClient.getContainerClient("images");

        console.log("Listing blobs...");
        const blobs = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            console.log(`Blob name: ${blob.name}`);
            blobs.push(blob.name);
        }

        res.status(200).json({ message: "Success", blobs });
    } catch (error) {
        console.error("Failed to list blobs:", error);
        res.status(500).json({ error: error });
    }
};


//! Notes for future: make sure change route to have the id and source as well!
//PASS IN THE USER ID IN THE URL
export const downloadBlob = async (req: Request, res: Response) => {
    const userID = req.params.id
    const source = req.params.source
    const blobServiceClient = await loadServiceClient();

    const containerClient = blobServiceClient.getContainerClient("images");
    const blockBlobClient = containerClient.getBlockBlobClient(userID + "-" + source);

    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log('\nDownloaded blob content...');

    try {
        res.setHeader("Content-Type", downloadBlockBlobResponse.contentType || "image/jpeg");

        // Pipe the binary stream directly to the response to display the image
        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new Error("The readableStreamBody is undefined. Ensure you're running in a Node.js environment.");
        }
        res.status(200)
        downloadBlockBlobResponse.readableStreamBody.pipe(res);


    } catch (err) {
        console.error("Error downloading blob:", err);
        res.status(500).send("An error occurred while downloading the blob.");
    }

}

//I WILL NEED: the formdata object, a user ID (as a string), and a source (a string)

//ADD FUNCTIONALITY FOR MULTIPLE BLOBS! 
interface MulterFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
}


export const uploadBlob = async (req: Request, res: Response) => {
    //const upload = multer()
    console.log("Initializing BlobServiceClient...");
    const blobServiceClient = await loadServiceClient();
    const containerClient = blobServiceClient.getContainerClient("images");

    const file = req.file as MulterFile
    const id = req.body.id;
    const source = req.body.source;


    console.log("body", req.body);
    console.log("file received", file.originalname);

    const blockBlobClient = containerClient.getBlockBlobClient(id + "-" + source)

    try {
        await blockBlobClient.uploadData(file.buffer);
        res.status(200).send("[blobController] - successfully uploaded blob")
    } catch (err) {
        console.log(err)
        res.status(500).send("An error occurred while uploading the image.");
    }

}

export const uploadProductBlob = async (req: Request, res: Response) => {

    console.log("Initializing BlobServiceClient...");
    const blobServiceClient = await loadServiceClient();
    const containerClient = blobServiceClient.getContainerClient("images");

    const files = req.files as Express.Multer.File[];

    const id = req.body.id;
    const source = req.body.source;
    const caption = req.body.caption as string[];
    const price = req.body.price as string[];
    console.log(caption)
    console.log(price)

    files.forEach(async (file, index) => {
        const blockBlobClient = containerClient.getBlockBlobClient(id + "-" + source + index)
        try {
            await blockBlobClient.uploadData(file.buffer);
            res.status(200).send("[blobController] - successfully uploaded blob")
        } catch (err) {
            console.log(err)
            res.status(500).send("An error occurred while uploading the image.");
        }

    });





    // console.log("body", req.body);
    // console.log("file received", file.originalname);



}


