import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "Hospital_Management",
    });
    console.log("Connected to the database successfully!");
  } catch (err) {
    console.error(
      `Some error occurred while connecting to the database: ${err}`
    );
  }
};
