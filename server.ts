import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Demand Prediction Endpoint
  app.post("/api/ai/predict-demand", async (req, res) => {
    try {
      const { salesHistory, products } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          As a supermarket inventory analyst, predict the demand for the following products based on their sales history.
          
          Sales History (last 30 days):
          ${JSON.stringify(salesHistory)}
          
          Current Products:
          ${JSON.stringify(products)}
          
          Provide a JSON response with predictions for each product. 
          Format: Array of { productId: string, predictedDemand: number, reasoning: string, recommendation: string }
        `,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = await model;
      res.json(JSON.parse(result.text || "[]"));
    } catch (error) {
      console.error("AI Prediction Error:", error);
      res.status(500).json({ error: "Failed to generate prediction" });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
