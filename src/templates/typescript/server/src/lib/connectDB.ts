import mongoose from "mongoose";
import { DB_NAME } from "@/constants/index";

function getConnectionUri(): string {
  const uri = (process.env.MONGODB_URI ?? "").trim();
  // Only append DB_NAME if URI has no database path (avoids .../existingDb/myDatabase)
  const match = uri.match(/^(mongodb(?:\+srv)?:\/\/[^/]+)(?:\/([^/?]*))?/);
  if (match && match[2] && match[2].length > 0) {
    return uri;
  }
  return `${uri.replace(/\/$/, "")}/${DB_NAME}`;
}

const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(getConnectionUri());
    console.log(
      `\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection Failed : ", error);
    process.exit(1);
  }
};

export default connectDB;
