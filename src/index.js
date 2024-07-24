import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error("Failed to connect with port " + process.env.PORT);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log("\n Server listening on port " + process.env.PORT);
    });
  })
  .catch((err) => console.error("MongoDB connection failed: " + err));
