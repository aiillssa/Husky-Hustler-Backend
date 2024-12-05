import { Request, Response } from "express";
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string;


export const loadServiceClient = async () => {
    console.log("Initializing BlobServiceClient...");
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        new DefaultAzureCredential() // Ensure credentials are correct)
    );

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
    const blockBlobClient = containerClient.getBlockBlobClient("testName");

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
export const uploadBlob = async (req: Request, res: Response) => {
    console.log("Initializing BlobServiceClient...");
    const blobServiceClient = await loadServiceClient();
    const containerClient = blobServiceClient.getContainerClient("images");

    //here is where i will add the names and stuff

    const blockBlobClient = containerClient.getBlockBlobClient("testName")
    //const imagePath = "C:\\CSE 403\\Husky-Hustler-Backend\\kittyThinking.jpg"

    //I THINK THIS IS HOW IT WILL B BUT IDK gotta wait until frontend 
    const formData = req.body.formData
    const id = req.body.id
    const source = req.body.source
    const img = formData.get(formData.keys().next())
    //const buffer = await fs.readFile(imagePath)

    try {
        await blockBlobClient.uploadData(img)
    } catch (err) {
        console.log(err)
        res.status(500).send("An error occurred while uploading the image.");
    }

    res.status(200).send("[blobController] - successfully uploaded blob")

}

