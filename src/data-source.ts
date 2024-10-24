import "reflect-metadata"
import { DataSource } from "typeorm"
import { Shops } from "./models/Shop"
import { Users } from "./models/Users"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.SQL_HOST || "localhost",
    port: 3306,
    username: "root",
    password: "0817",
    database: "hustlers",
    synchronize: true,
    logging: false,
    entities: [Shops, Users],
    migrations: [],
    subscribers: [],
})