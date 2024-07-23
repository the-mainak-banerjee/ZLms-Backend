// Always wrap DB in try catch
// DB is always in another continent, so always use async await while talking to DB

import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});

console.log(process.env.PORT);

connectDB();
