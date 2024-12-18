const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const googleApiKey = process.env.API_KEY;
const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`;

app.use(cors({ origin: "*", methods: ["POST", "OPTIONS"], allowedHeaders: ["Content-Type"] }));
app.use(bodyParser.json());

app.options("/api/gemini", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(204);
});

app.get("/", (req, res) => res.send("Server is working!"));

app.post("/api/gemini", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { userMessage } = req.body;

  if (!userMessage) return res.status(400).json({ error: "User message is missing." });

  try {
    const apiResponse = await fetch(googleApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: userMessage }] }] }),
    });

    if (!apiResponse.ok) throw new Error("Request to Gemini API failed.");

    const result = await apiResponse.json();
    res.status(200).json({ response: result });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong while reaching Gemini API." });
  }
});

app.listen(5000, () => console.log("Server is live at http://localhost:5000"));
