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
