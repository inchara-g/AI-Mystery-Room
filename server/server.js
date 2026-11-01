
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash-lite";

// Difficulty settings
const settings = {
  Easy: { suspects: 3, clues: 5, hints: 2, bonus: 100 },
  Medium: { suspects: 4, clues: 7, hints: 3, bonus: 150 },
  Hard: { suspects: 5, clues: 9, hints: 3, bonus: 200 },
};

// MongoDB Schema
const mysterySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: String,
    description: String,
    difficulty: String,

    suspects: Array,
    clues: Array,
    hints: [String],

    solution: {
      culprit: String,
      explanation: String,
    },

    discoveredClues: {
      type: [String],
      default: [],
    },

    hintsUsed: {
      type: Number,
      default: 0,
    },

    accused: {
      type: Boolean,
      default: false,
    },

    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

const MysteryCase = mongoose.model("MysteryCase", mysterySchema);

console.log(
  "Gemini API key loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "AI Mystery Room backend is running!",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Test Gemini
app.get("/api/test-gemini", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: "Say hello in one short sentence.",
    });

    res.json({
      success: true,
      message: response.text,
    });
  } catch (error) {
    console.error("Gemini test failed:", error.message);

    res.status(500).json({
      success: false,
      error: "Gemini connection failed.",
    });
  }
});

// Generate a new mystery
app.post("/api/mysteries", async (req, res) => {
  try {
    const difficulty = req.body.difficulty || "Easy";

    if (!settings[difficulty]) {
      return res.status(400).json({
        error: "Difficulty must be Easy, Medium, or Hard.",
      });
    }

    const { suspects, clues, hints } = settings[difficulty];

    const prompt = `
Create an original fictional mystery game.

Difficulty: ${difficulty}
Exactly ${suspects} suspects.
Exactly ${clues} clues.
Exactly ${hints} hints.

Return only valid JSON in this structure:

{
  "title": "Mystery title",
  "description": "Case description",
  "suspects": [
    {
      "name": "Name",
      "role": "Role",
      "statement": "Statement"
    }
  ],
  "clues": [
    {
      "id": "clue-1",
      "description": "Clue description",
      "revelation": "What it reveals"
    }
  ],
  "hints": ["Hint 1", "Hint 2"],
  "solution": {
    "culprit": "Exact suspect name",
    "explanation": "Full explanation"
  }
}

Rules:
- Select exactly one culprit from the suspects.
- Make all clues logically support the solution.
- Do not reveal the culprit in the description, statements, clues or hints.
- Keep the solution private.
- Make the mystery interesting and logically consistent.
`;

    console.log("Generating mystery with Gemini...");

    const response = await Promise.race([
      ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Gemini request timed out after 60 seconds")),
          60000
        )
      ),
    ]);

    const mystery = JSON.parse(response.text);

    // Validate generated mystery
    if (
      !mystery.title ||
      !mystery.description ||
      !Array.isArray(mystery.suspects) ||
      mystery.suspects.length !== suspects ||
      !Array.isArray(mystery.clues) ||
      mystery.clues.length !== clues ||
      !Array.isArray(mystery.hints) ||
      mystery.hints.length !== hints ||
      !mystery.solution?.culprit ||
      !mystery.solution?.explanation ||
      !mystery.suspects.some(
        (suspect) => suspect.name === mystery.solution.culprit
      ) ||
      mystery.suspects.some(
        (suspect) => !suspect.name || !suspect.role || !suspect.statement
      ) ||
      mystery.clues.some(
        (clue) => !clue.id || !clue.description || !clue.revelation
      )
    ) {
      throw new Error("Gemini returned an invalid mystery structure.");
    }

    const caseId = crypto.randomUUID();

    // Save mystery permanently in MongoDB
    await MysteryCase.create({
      _id: caseId,
      title: mystery.title,
      description: mystery.description,
      difficulty,
      suspects: mystery.suspects,
      clues: mystery.clues,
      hints: mystery.hints,
      solution: mystery.solution,
    });

    // Never expose solution or unrevealed hints
    const { solution, hints: privateHints, ...publicMystery } = mystery;

    console.log("Mystery saved in MongoDB:", caseId);

    res.status(201).json({
      ...publicMystery,
      caseId,
      difficulty,
      hintsAvailable: hints,
    });
  } catch (error) {
    console.error("Mystery generation failed:", error.message);

    res.status(500).json({
      error: "Could not generate mystery. " + error.message,
    });
  }
});

// Retrieve a mystery
app.get("/api/mysteries/:caseId", async (req, res) => {
  try {
    const mystery = await MysteryCase.findById(req.params.caseId);

    if (!mystery) {
      return res.status(404).json({ error: "Mystery not found." });
    }

    const publicMystery = {
      title: mystery.title,
      description: mystery.description,
      difficulty: mystery.difficulty,
      suspects: mystery.suspects,
      clues: mystery.clues.map((clue) => {
        if (mystery.discoveredClues.includes(clue.id)) {
          return clue;
        }

        return { id: clue.id, discovered: false };
      }),
      caseId: mystery._id,
      hintsAvailable: mystery.hints.length,
      discoveredCount: mystery.discoveredClues.length,
      hintsUsed: mystery.hintsUsed,
      accused: mystery.accused,
    };

    res.json(publicMystery);
  } catch (error) {
    console.error("Retrieve mystery failed:", error.message);
    res.status(500).json({ error: "Could not retrieve mystery." });
  }
});

// Discover a clue
app.post(
  "/api/mysteries/:caseId/clues/:clueId/discover",
  async (req, res) => {
    try {
      const mystery = await MysteryCase.findById(req.params.caseId);

      if (!mystery) {
        return res.status(404).json({ error: "Mystery not found." });
      }

      if (mystery.accused) {
        return res.status(400).json({
          error: "This case has already been completed.",
        });
      }

      const clue = mystery.clues.find(
        (item) => item.id === req.params.clueId
      );

      if (!clue) {
        return res.status(404).json({ error: "Clue not found." });
      }

      if (!mystery.discoveredClues.includes(clue.id)) {
        mystery.discoveredClues.push(clue.id);
        await mystery.save();
      }

      res.json({
        success: true,
        clue,
        discoveredCount: mystery.discoveredClues.length,
      });
    } catch (error) {
      console.error("Clue discovery failed:", error.message);
      res.status(500).json({ error: "Could not discover clue." });
    }
  }
);

// Request a hint
app.post("/api/mysteries/:caseId/hints", async (req, res) => {
  try {
    const mystery = await MysteryCase.findById(req.params.caseId);

    if (!mystery) {
      return res.status(404).json({ error: "Mystery not found." });
    }

    if (mystery.accused) {
      return res.status(400).json({
        error: "This case has already been completed.",
      });
    }

    if (mystery.hintsUsed >= mystery.hints.length) {
      return res.status(400).json({ error: "No hints remaining." });
    }

    const hint = mystery.hints[mystery.hintsUsed];

    mystery.hintsUsed++;
    await mystery.save();

    res.json({
      success: true,
      hint,
      hintsUsed: mystery.hintsUsed,
      hintsRemaining: mystery.hints.length - mystery.hintsUsed,
    });
  } catch (error) {
    console.error("Hint request failed:", error.message);
    res.status(500).json({ error: "Could not retrieve hint." });
  }
});

// Submit final accusation
app.post("/api/mysteries/:caseId/accuse", async (req, res) => {
  try {
    const mystery = await MysteryCase.findById(req.params.caseId);

    if (!mystery) {
      return res.status(404).json({ error: "Mystery not found." });
    }

    if (mystery.accused) {
      return res.status(400).json({
        error: "This case has already been completed.",
      });
    }

    const selectedSuspect = req.body.suspectName;

    if (
      typeof selectedSuspect !== "string" ||
      !mystery.suspects.some(
        (suspect) => suspect.name === selectedSuspect
      )
    ) {
      return res.status(400).json({
        error: "Please select a valid suspect.",
      });
    }

    const isCorrect = selectedSuspect === mystery.solution.culprit;
    const bonus = settings[mystery.difficulty].bonus;

    const score = Math.max(
      0,
      mystery.discoveredClues.length * 5 -
        mystery.hintsUsed * 10 +
        (isCorrect ? bonus : 0)
    );

    const result = {
      success: true,
      correct: isCorrect,
      accusedSuspect: selectedSuspect,
      culprit: mystery.solution.culprit,
      explanation: mystery.solution.explanation,
      score,
      discoveredClues: mystery.discoveredClues.length,
      hintsUsed: mystery.hintsUsed,
    };

    // Save completed result permanently
    mystery.accused = true;
    mystery.result = result;

    await mystery.save();

    res.json(result);
  } catch (error) {
    console.error("Accusation failed:", error.message);
    res.status(500).json({ error: "Could not submit accusation." });
  }
});

// Retrieve completed result
app.get("/api/mysteries/:caseId/result", async (req, res) => {
  try {
    const mystery = await MysteryCase.findById(req.params.caseId);

    if (!mystery) {
      return res.status(404).json({ error: "Mystery not found." });
    }

    if (!mystery.accused || !mystery.result) {
      return res.status(409).json({
        error: "This mystery has not been completed yet.",
      });
    }

    res.json(mystery.result);
  } catch (error) {
    console.error("Result retrieval failed:", error.message);
    res.status(500).json({ error: "Could not retrieve result." });
  }
});

// Connect MongoDB before starting server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
