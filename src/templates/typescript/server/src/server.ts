import dotenv from "dotenv";
import { app } from "@/app";
import connectDB from "@/lib/connectDB";

dotenv.config({
    path: "./.env",
});

const mongoUri: string | undefined = process.env.MONGODB_URI?.trim();

if (!mongoUri) {
    // No MongoDB URI, run server without DB
    // Error handling for server can be done via process events or inside listen callback if needed.
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port ${process.env.PORT} (no database connected)`);
    });
} else {
    connectDB()
        .then(() => {
            app.listen(process.env.PORT || 8000, () => {
                console.log(`Server is running at port ${process.env.PORT}`);
            });
        })
        .catch((err: Error) => {
            console.log("MONGODB connection Failed !!! ", err);
        });
}
