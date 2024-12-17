const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 5000;

const API_KEY = process.env.API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
  API_KEY;

// Explicit CORS configuration
const corsOptions = {
  origin: "*", // Replace "*" with specific frontend origin if needed
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Handle preflight OPTIONS requests for /api/gemini
app.options("/api/gemini", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  return res.sendStatus(204); // No content
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("API running successfully.");
});

// POST endpoint for Gemini API
app.post("/api/gemini", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // CORS header for POST requests

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Gemini API");
    }

    const data = await response.json();
    res.status(200).json({ response: data });
  } catch (error) {
    console.error("Error fetching response from Gemini API:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching response from Gemini API",
      });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
