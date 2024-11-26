import { BlobDownloadResponseParsed, BlockBlobClient } from "@azure/storage-blob";
import { Request, Response } from "express";
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

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

    const downloadBlockBlobResponse: BlobDownloadResponseParsed = await blockBlobClient.download(offset, length);
    // console.log('\nDownloaded blob content...');
    // console.log(
    //     '\t',
    //     await streamToText(downloadBlockBlobResponse.readableStreamBody as NodeJS.ReadableStream)
    // );
    if (downloadBlockBlobResponse.readableStreamBody) {
        downloadBlockBlobResponse.readableStreamBody.pipe(res);
    } else {
        res.status(404).send("Blob stream not found.");
    }
    // } catch (error) {
    //     console.error("Error downloading blob:", error);
    //     res.status(500).send("An error occurred while retrieving the blob.");
    // }

}
async function streamToText(readable: NodeJS.ReadableStream): Promise<string> {
    readable.setEncoding('utf8');
    let data = '';
    for await (const chunk of readable) {
        data += chunk;
    }
    return data;
}

