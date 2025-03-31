const express = require("express"); // Importing Express framework to create a web server
const cors = require("cors"); // Importing CORS middleware to enable Cross-Origin Resource Sharing
const { spawn } = require("child_process"); // Importing the spawn function from child_process module to run Python scripts


const app = express(); // Create an Express application
app.use(express.json()); // Use express built-in JSON parser
app.use(cors()); // Enable CORS for all routes


// API endpoint to handle prediction request
app.post("/predict", (req, res) => {
  const inputData = JSON.stringify(req.body); // Convert input to JSON string
  console.log("Input data received:", inputData); // Log input data for debugging


  const pythonProcess = spawn("python", ["predict.py"]); // Spawn a new Python process to run the script
  pythonProcess.stdin.write(inputData); // Write input data to Python script's stdin

  pythonProcess.stdin.end(); // Close stdin to signal that no more data will be sent
  console.log("sented ra to python script...");// Send data to Python script


  let resultData = "";


  // Collect data from Python script
  pythonProcess.stdout.on("data", (data) => { // Listen for data from Python script's stdout
    console.log("Python output:", data.toString()); // Log data for debugging
    resultData += data.toString(); // Append data to resultData string
  });


  pythonProcess.stderr.on("data", (data) => { // Listen for errors from Python script's stderr
    console.error(`Error from Python script: ${data}`);
  });


  // Handle Python process completion
  pythonProcess.stdout.on("end", () => { // When Python process ends
    try {
      console.log("Final data received from Python:", resultData);
      console.log("hello ra");
      const result = JSON.parse(resultData); // Parse the result data from JSON string to JavaScript object
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


  pythonProcess.stderr.on("data", (data) => { // Listen for errors from Python script's stderr
    console.error(`Error from Python script: ${data}`);
    if (!res.headersSent) { // Check if response has already been sent
      res.status(500).json({ error: data.toString() });
    }
    pythonProcess.kill();  // Ensure process is killed after an error
  });  

});


const PORT = 5000;  // Define the port for the server to listen on
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
