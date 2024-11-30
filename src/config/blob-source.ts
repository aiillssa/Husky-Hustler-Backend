// mport { DefaultAzureCredential } from "@azure/identity";
// import { BlobServiceClient } from "@azure/storage-blob";
// import dotenv from "dotenv";

// dotenv.config();

// const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string;
// if (!accountName) throw Error('Azure Storage accountName not found');

// // Add `Storage Blob Data Contributor` role assignment to the identity
// export const blobServiceClient = new BlobServiceClient(
//     `https://${accountName}.blob.core.windows.net`,
//     new DefaultAzureCredential()
// );