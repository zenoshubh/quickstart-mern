import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./lib/connectDB.js";

dotenv.config({
  path: "./.env",
});

const mongoUri = process.env.MONGODB_URI?.trim();

if (!mongoUri) {
  // No MongoDB URI, run server without DB
  app.listen(process.env.PORT || 8000, () => {
    console.log(`🚀Server is running at port ${process.env.PORT} (no database connected)`);
  });
} else {
  connectDB()
    .then(() => {
      app.listen(process.env.PORT || 8000, () => {
        console.log(`🚀Server is running at port ${process.env.PORT}`);
      });
    })
    .catch((err) => {
      console.log("❌MONGODB connection Failed !!! ", err);
    });
}
