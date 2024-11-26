import { BlobDownloadResponseParsed, BlockBlobClient } from "@azure/storage-blob";
import { Request, Response } from "express";
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string;

export const listBlobs = async (req: Request, res: Response) => {
    // const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string;
    if (!accountName) {
        console.error("Azure Storage accountName not found");
        res.status(500).json({ error: "Azure Storage accountName not found" });
        return;
    }

    console.log("Initializing BlobServiceClient...");
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        new DefaultAzureCredential() // Ensure credentials are correct
    );
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


//! Notes for future: make sure change route to have :id, so we can put different images
//! Make sure that we can return a bunch of images or smthing yippee
export const downloadBlobs = async (req: Request, res: Response) => {

    console.log("Initializing BlobServiceClient...");
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        new DefaultAzureCredential() // Ensure credentials are correct
    );

    const containerClient = blobServiceClient.getContainerClient("images");
    const blockBlobClient = containerClient.getBlockBlobClient("smirkKitty.jpg")

    const offset = 0;         // start at beginning
    const length = undefined; // read all

    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log('\nDownloaded blob content...');

    const writableStream = fs.createWriteStream("src\\images\\kitty2");

    try {
        res.setHeader("Content-Type", downloadBlockBlobResponse.contentType || "image/jpeg");

        // Pipe the binary stream directly to the response to display the image
        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new Error("The readableStreamBody is undefined. Ensure you're running in a Node.js environment.");
        }
        downloadBlockBlobResponse.readableStreamBody.pipe(res);
    } catch (err) {
        console.error("Error downloading blob:", err);
        res.status(500).send("An error occurred while downloading the blob.");
    }

}
async function streamToText(readable: NodeJS.ReadableStream): Promise<string> {
    readable.setEncoding('utf8');
    let data = '';
    for await (const chunk of readable) {
        data += chunk;
    }
    return data;
}

