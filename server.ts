import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { setupTelegramBot } from "./bots/telegram.ts";
import { setupScheduler } from "./scheduler/cron.ts";
import db from "./db/database.ts";

dotenv.config();

async function startServer() {
  console.log('Starting ClawX Server...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  const app = express();
  const PORT = 3000;

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    console.log('GET /api/health');
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/stats", (req, res) => {
    console.log('GET /api/stats');
    try {
      const messageCount = db.prepare('SELECT COUNT(*) as count FROM messages').get() as any;
      res.json({
        messages: messageCount.count || 0,
        platform: process.platform,
        uptime: process.uptime()
      });
    } catch (error) {
      console.error('Error in /api/stats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // API 404 handler
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  // Initialize Bots and Scheduler
  let tgBot;
  try {
    tgBot = setupTelegramBot();
  } catch (error) {
    console.error('Failed to setup Telegram bot:', error);
  }

  try {
    setupScheduler();
  } catch (error) {
    console.error('Failed to setup scheduler:', error);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(process.cwd(), "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ClawX Server running on http://localhost:${PORT}`);
    console.log(`Telegram Bot: ${tgBot ? 'Active' : 'Disabled'}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
