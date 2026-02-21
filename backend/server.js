import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { z } from "zod";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20
}));

const SYS = `Review the code and return a JSON object ONLY. 
Structure:
{
  "overall_score": 80,
  "summary": "Short summary",
  "metrics": {"efficiency": 80, "readability": 80, "best_practices": 80, "security": 80},
  "findings": [{"type": "info", "title": "Fix this", "line": "10", "description": "Why", "fix": "How"}],
  "complexity": [{"function": "main", "current": "O(n)", "optimized": "O(1)", "note": "Note"}],
  "tags": ["logic"]
}
IMPORTANT: Use double quotes. No comments. No text before or after the JSON.`;

const schema = z.object({
  overall_score: z.number(),
  summary: z.string(),
  metrics: z.object({
    efficiency: z.number(),
    readability: z.number(),
    best_practices: z.number(),
    security: z.number()
  }),
  findings: z.array(z.object({
    type: z.string(),
    title: z.string(),
    line: z.union([z.string(), z.number()]).transform(val => String(val)),
    description: z.string(),
    fix: z.string()
  })),
  complexity: z.array(z.object({
    function: z.string(),
    current: z.string(),
    optimized: z.string().nullable(),
    note: z.string()
  })),
  tags: z.array(z.string())
});

const cache = new Map();

function hashInput(code, lang) {
  return crypto.createHash("sha256").update(code + lang).digest("hex");
}

// function extractJSON(text) {
//   const start = text.indexOf("{");
//   const end = text.lastIndexOf("}");
//   if (start !== -1 && end !== -1) {
//     try {
//       return JSON.parse(text.slice(start, end + 1));
//     } catch {}
//   }
//   return null;
// }
function extractJSON(text) {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try to find the first '{' and the last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
      const potentialJSON = text.slice(start, end + 1);
      try {
        return JSON.parse(potentialJSON);
      } catch (innerError) {
        // 3. Last ditch effort: remove common LLM "hallucinations" in JSON
        const cleaned = potentialJSON
          .replace(/,\s*([\]}])/g, '$1') // Remove trailing commas
          .replace(/\\n/g, ' ');         // Replace escaped newlines
        try {
          return JSON.parse(cleaned);
        } catch (finalErr) {
          console.error("Final JSON Parse Error:", finalErr);
          return null;
        }
      }
    }
    return null;
  }
}
app.post("/analyze", async (req, res) => {
  try {
    const { code, lang } = req.body;
    if (!code) return res.status(400).json({ error: "Provide code." });

    const key = hashInput(code, lang || "");
    if (cache.has(key)) return res.json(cache.get(key));

    // Calling your local Ollama instance
    const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3",
    system: SYS,
    prompt: `Language: ${lang}\n\nCode:\n${code}`,
    format: "json",
    stream: false,
    options: {
      temperature: 0.1,      // Makes output more predictable
      num_predict: 2048,    // Prevents JSON from cutting off midway
      num_ctx: 4096         // Ensures enough memory for long code snippets
    }
  })
});

    const data = await response.json();
    
    // Ollama puts the AI text in a field called 'response'
    const text = data.response || "";
    const parsed = extractJSON(text);

    if (!parsed) {
      return res.status(500).json({ error: "Local AI failed to format JSON." });
    }

    // Validation using your existing Zod schema
    try {
  const validatedData = schema.parse(parsed);
  cache.set(key, validatedData);
  res.json(validatedData);
} catch (zodErr) {
  console.error("Zod Errors:", zodErr.format());
  // Fallback: If it's mostly correct, return it anyway to keep the UI alive
  // Or return a specific error that tells the user to try again
  res.status(422).json({ 
    error: "AI response was slightly malformed.", 
    details: zodErr.errors.map(e => e.message) 
  });
}

  } catch (err) {
    console.error("Local Server Error:", err);
    res.status(500).json({ error: "Ensure Ollama is running (ollama serve)" });
  }
});
app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000/")
);