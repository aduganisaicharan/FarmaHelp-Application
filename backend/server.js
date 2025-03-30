const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");


const app = express();
app.use(express.json()); // Use express built-in JSON parser
app.use(cors());


// API endpoint to handle prediction request
app.post("/predict", (req, res) => {
  const inputData = JSON.stringify(req.body); // Convert input to JSON string
  console.log("Input data received:", inputData); // Log input data for debugging


  const pythonProcess = spawn("python", ["predict.py"]);
  pythonProcess.stdin.write(inputData);


  pythonProcess.stdin.end();
  console.log("sented ra to python script...");// Send data to Python script


  let resultData = "";


  // Collect data from Python script
  pythonProcess.stdout.on("data", (data) => {
    console.log("Python output:", data.toString()); // Log data for debugging
    resultData += data.toString();
  });


  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error from Python script: ${data}`);
  });


  // Handle Python process completion
  pythonProcess.stdout.on("end", () => {
    try {
      console.log("Final data received from Python:", resultData);
      console.log("hello ra");
      const result = JSON.parse(resultData);
      console.log("this is result", result);


      if (result.error) {
        return res.status(500).json({ error: result.error });
      }
      res.json(result); // Send JSON response to frontend
    } catch (error) {
      console.error("Error parsing Python response:", error);
      res.status(500).json({ error: "Error parsing model response" });
    }
  });


  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error from Python script: ${data}`);
    if (!res.headersSent) {
      res.status(500).json({ error: "Model execution failed" });
    }
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
