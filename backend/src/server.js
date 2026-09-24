import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Athletica backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`[Startup Error] ${error.message}`);
    console.error("Application startup aborted: Database connection failed.");
    process.exit(1);
  }
};

startServer();
