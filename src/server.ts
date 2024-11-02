import express, { Express } from "express";
import { connectDB } from "./config/dbConn";
import routerUser from "./routes/users";
import "reflect-metadata";
import dotenv from "dotenv";
import routerShops from "./routes/shops";
import cors from "cors";
import bodyParser from "body-parser";
import { corsOptions } from "./config/corsOptions";

dotenv.config();

// Using the port which AWS has assigned or 8088
// during development
const port: number = Number(process.env.PORT_NUM) || 8088;

const app: Express = express();

// Establish connection with the SQL
// Database, then start listening for requests
// Consequences:
//  - Server will not run if a connection cannot be established
connectDB().then(() => {
  console.log("Connected to SQL Database");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use("/users", routerUser);

app.use("/shops", routerShops);
