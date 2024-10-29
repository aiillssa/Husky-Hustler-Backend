// TODO: Ailsa
// Write the function to set up connection w/ SQL database
// This will be called at the start in server.ts

import { AppDataSource } from "./data-source";

/** Method to connect to the database */
export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
  } catch (err) {
    console.error(`Error during Data Source Initialization`, err);
    throw err;
  }
};
