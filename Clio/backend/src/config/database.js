import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

import User from "../models/User.js";
import Analysis from "../models/Analysis.js";
import Keyword from "../models/Keyword.js";
import { AuditLog } from "../models/AuditLog.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  
  synchronize: false,

  logging: false,

  entities: [
    User,
    Analysis,
    Keyword,
    AuditLog,
  ],
});