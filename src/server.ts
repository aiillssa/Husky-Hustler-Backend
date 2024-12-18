import express, { Express } from "express";
import { connectDB } from "./config/dbConn";
import routerUser from "./routes/users";
import "reflect-metadata";
import dotenv from "dotenv";
import routerShops from "./routes/shops";
import routerGoogle from "./routes/google";
import cors from "cors";
import bodyParser from "body-parser";
import { corsOptions } from "./config/corsOptions";
import routerCategories from "./routes/categories";
import routerBlobs from "./routes/blob";
import cookieParser from "cookie-parser";

dotenv.config();

const port: number = Number(process.env.PORT) || 8088;

const app: Express = express();

// Establish connection with the SQL
// Database, then start listening for requests
connectDB().then(() => {
  console.log("Connected to SQL Database");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

// Middleware for CORS issues
app.use(cors(corsOptions));

app.use(cookieParser());

// Middleware to parse json in requests
app.use(bodyParser.json());

// Users route
app.use("/users", routerUser);

// Shops route
app.use("/shops", routerShops);

// Category route
app.use("/categories", routerCategories);

// Sign Up / Sign In route
app.use("/google", routerGoogle);

// Blob storage
app.use("/blob", routerBlobs);
