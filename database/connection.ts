import mongoose from "mongoose";

// Define the function to connect to the database
export const connectToDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URI, {
      dbName:"acm"
    });
    console.log(`🚀 Successfully connected to MongoDB`);

    // Handling connection events
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the process with an error code
  }

  // Graceful shutdown on app termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to app termination.");
    process.exit(0);
  });
};