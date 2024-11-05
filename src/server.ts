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

dotenv.config();

const port: number = Number(process.env.PORT_NUM) || 8088;

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

// Middleware to parse json in requests
app.use(bodyParser.json());

// Users route
app.use("/users", routerUser);

// Shops route
app.use("/shops", routerShops);

app.use("/google", routerGoogle);
