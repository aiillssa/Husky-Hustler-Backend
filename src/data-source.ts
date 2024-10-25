import "reflect-metadata";
import { DataSource } from "typeorm";
import { Shops } from "./models/Shop";
import { Users } from "./models/Users";
import dotenv from "dotenv";
import { Categories } from "./models/Categories";
dotenv.config();
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.AWS_SQL_HOST || "localhost",
  port: Number(process.env.AWS_SQL_PORT) || 3306,
  username: process.env.AWS_SQL_USER || "admin",
  password: process.env.AWS_SQL_PASS || "1234",
  database: process.env.AWS_SQL_DB || "husky-hustlers-db",
  synchronize: true,
  logging: false,
  entities: [Shops, Users, Categories],
  migrations: [],
  subscribers: [],
});
