import express from 'express';
import cors from 'cors';
import fs from 'fs';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000; // Change this to 8000
const MONGO_URL = process.env.MONGO_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

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

const ENvSchema = new mongoose.Schema({
  date: String,
  temp: Number,
  humi: Number,
  air: Number
});

const TempModel = mongoose.model("envs", ENvSchema);

const writeTempDataToFile = async () => {
  try {
    const tempData = await TempModel.find();
    const jsModule = `const data = ${JSON.stringify(tempData, null, 2)};\nexport default data;`;
    fs.writeFileSync(path.join(__dirname, '../src/data/env.js'), jsModule);
  } catch (error) {
    console.error("Error writing to env.js:", error);
  }
};

const initializeEnvFile = () => {
  const envFilePath = path.join(__dirname, '../src/data/env.js');
  if (!fs.existsSync(envFilePath)) {
    fs.writeFileSync(envFilePath, 'const data = [];\nexport default data;');
  }
};

initializeEnvFile();

const appendToLog = (logEntry) => {
  const logFilePath = path.join(__dirname, '../src/data/Log.json');
  try {
    let logData = [];
    if (fs.existsSync(logFilePath)) {
      const existingLog = fs.readFileSync(logFilePath, 'utf-8');
      logData = JSON.parse(existingLog);
    }
    logData.push(logEntry);
    fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));
  } catch (error) {
    console.error('Error appending to Log.json:', error);
  }
};

const appendToHistoryEnv = (logEntry) => {
  const historyEnvPath = path.join(__dirname, '../src/data/historyenv.json');
  try {
    let existingData = [];
    if (fs.existsSync(historyEnvPath)) {
      const content = fs.readFileSync(historyEnvPath, 'utf-8');
      existingData = JSON.parse(content);
    }
    existingData.push(logEntry);
    fs.writeFileSync(historyEnvPath, JSON.stringify(existingData, null, 2));
  } catch (error) {
    console.error('Error appending to historyenv.json:', error);
  }
};

app.get("/getENVdata", async (req, res) => {
  try {
    const Data = await TempModel.find();
    res.json(Data);
    
    await writeTempDataToFile();
  } catch (error) {
    res.status(500).json({ message: "Error fetching environmental data", error });
  }
});

app.post('/getENVdata', (req, res) => {
  const newData = req.body;
  const ENV_FILE_PATH = path.join(__dirname, '../src/data/env.js');

  fs.writeFile(ENV_FILE_PATH, JSON.stringify(newData, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to write file' });
    }
    res.json({ success: true });
  });
});

app.post("/ENVPost", async (req, res) => {
  try {
    const newTemp = new TempModel(req.body);
    await newTemp.save();
    
    await writeTempDataToFile();
    
    // Log to Log.json
    appendToLog(req.body);
    
    // Append to historyenv.json
    appendToHistoryEnv(req.body);
    
    res.status(201).json(newTemp);
  } catch (error) {
    res.status(500).json({ message: "Error saving environmental data", error });
  }
});

const relayStatusFilePath = path.join(__dirname, '../src/controllers/relayStatus.json');
const envIVStatusFilePath = path.join(__dirname, '../src/controllers/envIVStatus.json');

const getRelayStatus = () => {
  try {
    const data = fs.readFileSync(relayStatusFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading relay status:", error);
    return { relay1: false, relay2: false, relay3: false, relay4: false };
  }
};

const setRelayStatus = (statuses) => {
  try {
    fs.writeFileSync(relayStatusFilePath, JSON.stringify(statuses, null, 2));
  } catch (error) {
    console.error("Error writing relay status:", error);
  }
};

const getEnvIVStatus = () => {
  try {
    const data = fs.readFileSync(envIVStatusFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading env status:", error);
    return { temp: false, humi: false, date: false };
  }
};

app.post('/relay-status', (req, res) => {
  const { relay, status } = req.body;
  const timestamp = new Date().toISOString();

  // Get current relay statuses
  const currentStatuses = getRelayStatus();

  // Check if the relay status is actually changing
  if (currentStatuses[relay] !== status) {
    // Update the relay status
    currentStatuses[relay] = status;

    // Save the updated relay statuses
    setRelayStatus(currentStatuses);

    // Log the specific relay change with timestamp to Log.json
    const logEntry = { timestamp, relay, status };

    try {
      const logFilePath = path.join(__dirname, '../src/data/Log.json');
      let logData = [];
      if (fs.existsSync(logFilePath)) {
        const existingLog = fs.readFileSync(logFilePath, 'utf-8');
        logData = JSON.parse(existingLog);
      }
      logData.push(logEntry);
      fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));

      res.status(200).json({ message: 'Relay status updated', logEntry });
    } catch (error) {
      console.error('Error appending to Log.json:', error);
      res.status(500).json({ error: 'Failed to append to Log.json' });
    }
  } else {
    // If the status is the same, send a response indicating no change
    res.status(200).json({ message: 'Relay status unchanged', relay, status });
  }
});

app.post('/enviV', async (req, res) => {
  const data = req.body;
  const timestamp = new Date().toISOString();
  
  const dataEnvPath = path.join(__dirname, '../src/controllers/dataEnv.json');
  const historyEnvPath = path.join(__dirname, '../src/data/historyenv.json');

  try {
    // Check if the current data already exists to prevent duplicates
    const content = fs.readFileSync(historyEnvPath, 'utf-8');
    const existingData = content ? JSON.parse(content) : [];

    const exists = existingData.some(entry => 
      entry.temp === data.temp.toFixed(2) &&
      entry.humi === data.humi.toFixed(2) &&
      entry.air === data.air.toFixed(2)
    );

    if (!exists) {
      const logEntry = {
        date: timestamp,
        temp: data.temp.toFixed(2),
        humi: data.humi.toFixed(2),
        air: data.air.toFixed(2)
      };

      existingData.push(logEntry);
      fs.writeFileSync(historyEnvPath, JSON.stringify(existingData, null, 2));

      appendToLog(logEntry); // Append to Log.json
    }

    fs.writeFile(dataEnvPath, JSON.stringify(data, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing dataEnv.json:', writeErr);
        return res.status(500).send('Error writing file');
      }
      console.log('Data saved to dataEnv.json');
      res.status(200).send('Data saved and appended successfully');
    });
  } catch (error) {
    console.error('Error processing enviV request:', error);
    res.status(500).send('Server error');
  }
});

app.get('/relay-status', (req, res) => {
  const statuses = getRelayStatus();
  res.json(statuses);
});

app.get('/envIV-status', (req, res) => {
  const statuses = getEnvIVStatus();
  res.json(statuses);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});