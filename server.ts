import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "LearnHub AI" });
  });

  // AI Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback realistic response for local/offline testing
        return res.json({
          reply: `The concepts in **${message || "your query"}** require systematic deconstruction. In deep work methodology, we separate the foundational mechanics from emergent principles.\n\n### The Core Breakdown\n- **Foundational Architecture**: Core primitives and state management dynamics.\n- **Application Layer**: How these primitives interact in production scenarios with predictable lifecycles.\n\nWould you like to generate an active roadmap for this topic or synthesize targeted notes?`,
          roadmapCreated: message?.toLowerCase().includes("problem") || message?.toLowerCase().includes("roadmap")
            ? {
                title: "The Philosophy of Mind: Consciousness",
                topicsCount: 4,
              }
            : null,
        });
      }

      const systemPrompt = `You are LearnHub AI, an elite deep-work learning assistant and research synthesizer.
Your tone is intellectual, structured, crisp, and distraction-free (Palladian scholarly aesthetic).
Break down complex topics into clear hierarchies (e.g. "The Core Distinction", "Mechanics vs Experience").
If the user asks to create a roadmap or learn a complex topic, include structured steps and indicate that a structured roadmap can be explored.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
          },
        ],
      });

      const replyText = response.text || "I've synthesized the core breakdown for your research.";
      
      const shouldCreateRoadmap = 
        message.toLowerCase().includes("roadmap") ||
        message.toLowerCase().includes("path") ||
        message.toLowerCase().includes("break it down") ||
        message.toLowerCase().includes("learn");

      res.json({
        reply: replyText,
        roadmapCreated: shouldCreateRoadmap
          ? {
              title: message.length > 40 ? message.slice(0, 38) + "..." : message,
              topicsCount: 4,
            }
          : null,
      });
    } catch (err: any) {
      console.error("Chat API error:", err);
      res.status(500).json({
        error: "Failed to generate AI response",
        fallbackReply: "Unable to process through Gemini API at this moment. You can still create and organize your research roadmaps manually.",
      });
    }
  });

  // AI Roadmap Generator Endpoint
  app.post("/api/generate-roadmap", async (req, res) => {
    try {
      const { topic, experienceLevel = "Intermediate", focus = "Deep Mastery" } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          title: `Mastering ${topic || "New Field"}`,
          phases: [
            {
              id: "p1",
              phaseNumber: 1,
              title: "Foundations & Primitives",
              status: "COMPLETED",
              topics: [
                { id: "t1", title: "Core Principles & Architecture", description: "Fundamental axioms and setup", status: "completed", estimatedHours: 2 },
                { id: "t2", title: "Key Mechanisms & Taxonomy", description: "Essential vocabulary and workflows", status: "completed", estimatedHours: 3 }
              ]
            },
            {
              id: "p2",
              phaseNumber: 2,
              title: "Intermediate Syntheses & Architecture",
              status: "IN_PROGRESS",
              topics: [
                { id: "t3", title: "Complex Patterns & Edge Cases", description: "Deep dive into performance and nuances", status: "completed", estimatedHours: 3 },
                { id: "t4", title: "Applied Problem Solving & Workflows", description: "Handling stateful scenarios and optimization", status: "in_progress", estimatedHours: 2 },
                { id: "t5", title: "Comparative Frameworks", description: "Evaluating alternative approaches", status: "pending", estimatedHours: 4 }
              ]
            },
            {
              id: "p3",
              phaseNumber: 3,
              title: "Advanced Specialization & Production",
              status: "LOCKED",
              topics: [
                { id: "t6", title: "High-Scale Implementations", description: "Production resilience and benchmark analysis", status: "pending", estimatedHours: 5 },
                { id: "t7", title: "Autonomous Research & Synthesis", description: "Pushing beyond standard conventions", status: "pending", estimatedHours: 6 }
              ]
            }
          ]
        });
      }

      const prompt = `Generate a high-signal, academic-grade deep learning roadmap for: "${topic}".
Experience level: ${experienceLevel}.
Return JSON only matching this format:
{
  "title": "Mastering ${topic}",
  "phases": [
    {
      "id": "p1",
      "phaseNumber": 1,
      "title": "Phase title",
      "status": "COMPLETED" or "IN_PROGRESS" or "LOCKED",
      "topics": [
        {
          "id": "t1",
          "title": "Topic title",
          "description": "Short 1-sentence precise synopsis",
          "status": "completed" or "in_progress" or "pending",
          "estimatedHours": 2
        }
      ]
    }
  ]
}
Provide exactly 3 distinct chronological phases with 2-3 topics each.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Roadmap generation error:", err);
      res.status(500).json({ error: "Failed to generate roadmap" });
    }
  });

  // AI Notes Synthesizer Endpoint
  app.post("/api/synthesize-notes", async (req, res) => {
    try {
      const { topic, rawInput } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          title: `Synthesized Notes: ${topic || "Deep Concepts"}`,
          tags: ["Synthesized", "Deep Work", "Research"],
          contentMarkdown: `## Core Overview\n\nThese notes distill the essence of **${topic || "the topic"}** into fundamental principles and operational insights.\n\n### Key Concepts\n- **First Principles**: Establishing invariant properties.\n- **Runtime Behavior**: Observing real-world constraints.\n\n> **💡 AI Insight**: Consistent practice and mental modeling accelerate conceptual retention by over 40%.`
        });
      }

      const prompt = `Synthesize a structured, academic, markdown study note on: "${topic}".
Raw input/context: "${rawInput || "Provide a comprehensive breakdown with code/examples if relevant."}"
Include:
1. Executive Summary
2. 2 numbered core sections (with a code snippet if technical)
3. An AI Insight callout block
4. Tags array
Return JSON format:
{
  "title": "Title of the note",
  "tags": ["Tag1", "Tag2"],
  "contentMarkdown": "Formatted markdown text"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Note synthesis error:", err);
      res.status(500).json({ error: "Failed to synthesize note" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LearnHub AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
