import express from 'express';
import cors from 'cors';
import fs from 'fs';
import mongoose from 'mongoose';
import path, { dirname } from 'path'; // Ensure only one import statement for 'path'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; // Import dotenv if needed
import { fileURLToPath } from 'url';

const app = express();

// Load environment variables from .env file
dotenv.config();

// Set the port from environment variables or default to 7000
const PORT = process.env.PORT || 7000;

// Get the MongoDB connection URL from environment variables
const MONGO_URL = process.env.MONGO_URL;

// Define __dirname using import.meta.url and fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

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
    fs.writeFileSync(path.join(__dirname, '../src/data/temp.js'), jsModule);
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

// Define the file path for relay status JSON
const relayStatusFilePath = path.join(__dirname, '../src/controllers/relayStatus.json');

// Read the current relay statuses from the file
const getRelayStatus = () => {
  try {
    const data = fs.readFileSync(relayStatusFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading relay status:", error);
    return { relay1: false, relay2: false, relay3: false, relay4: false };
  }
};

// Write relay statuses to the file
const setRelayStatus = (statuses) => {
  try {
    fs.writeFileSync(relayStatusFilePath, JSON.stringify(statuses, null, 2));
  } catch (error) {
    console.error("Error writing relay status:", error);
  }
};

// Route to handle POST requests to update relay status
app.post('/relay-status', (req, res) => {
  const { relay, status } = req.body;

  // Get current relay statuses
  const statuses = getRelayStatus();

  // Update relay status
  statuses[relay] = status;

  // Save updated status to file
  setRelayStatus(statuses);

  // Send response
  res.status(200).json({ message: 'Relay status updated', statuses });
});

// Route to handle GET requests to fetch relay status
app.get('/relay-status', (req, res) => {
  const statuses = getRelayStatus();
  res.json(statuses);
});
