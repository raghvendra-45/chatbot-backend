const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON requests

// Gemini API details
const API_KEY = process.env.API_KEY; // Replace with your actual API key
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
  API_KEY;

// Endpoint to handle chatbot requests
app.post("/api/gemini", async (req, res) => {
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
    res.status(500).json({ error: "Error fetching response from Gemini API" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
