// Import required packages
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import bodyParser from "body-parser";

// Create an Express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Set the port from environment variables or default to 7000
const PORT = process.env.PORT || 7000;

// Get the MongoDB connection URL from environment variables
const MONGO_URL = process.env.MONGO_URL;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Define the schema for the temperature data using Mongoose
const TempSchema = new mongoose.Schema({
  date: String,
  value: Number,
});

// Create a Mongoose model called "TempModel" based on the TempSchema
const TempModel = mongoose.model("temps", TempSchema);

// Function to write data to temp.js
const writeTempDataToFile = async () => {
  try {
    const tempData = await TempModel.find();
    const jsModule = `export const tempData = ${JSON.stringify(tempData, null, 2)};`;
    fs.writeFileSync("../src/data/temp.js", jsModule);
  } catch (error) {
    console.error("Error writing to temp.js:", error);
  }
};

// Route to handle GET requests to "/getTemp"
app.get("/getTemp", async (req, res) => {
  try {
    const tempData = await TempModel.find();
    res.json(tempData);
    
    // Write the data to temp.js
    await writeTempDataToFile();
  } catch (error) {
    res.status(500).json({ message: "Error fetching temperature data", error });
  }
});

// Route to handle POST requests to "/TempPost"
app.post("/TempPost", async (req, res) => {
  try {
    const newTemp = new TempModel(req.body);
    await newTemp.save();
    
    // Write the data to temp.js after saving the newTemp
    await writeTempDataToFile();
    
    res.status(201).json(newTemp);
  } catch (error) {
    res.status(500).json({ message: "Error saving temperature data", error });
  }
});
