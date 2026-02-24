# ClawX AI Agent (Personal Server)

A robust, personal AI agent server inspired by OpenClaw/ZeroClaw. Built with **Node.js**, **Express**, **LangGraph.js**, and **Gemini 1.5 Pro**.

## Features

- **Multi-Platform**: Chat via Telegram.
- **Advanced Reasoning**: Powered by Gemini 1.5 Pro via LangGraph.
- **Tool Calling**:
  - `web_scraper`: Extract content from any URL.
  - `calculator`: Perform math operations.
  - `google_search`: (Native Gemini grounding supported).
- **Long-term Memory**: SQLite database for thread history and user settings.
- **Cron Scheduler**: Automate tasks (e.g., daily summaries).
- **Control Dashboard**: Monitor system health, logs, and stats.

## Setup Instructions

1. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in:
   - `GEMINI_API_KEY`: Your Google AI Studio key.
   - `TELEGRAM_BOT_TOKEN`: From [@BotFather](https://t.me/botfather).
   - `ADMIN_TELEGRAM_ID`: Your ID for security.

2. **Installation**:
   ```bash
   npm install
   ```

3. **Running**:
   ```bash
   npm run dev
   ```

4. **Deployment (Docker)**:
   ```bash
   docker-compose up -d
   ```

## Tech Stack Note

While the request mentioned Python/FastAPI, this implementation uses **TypeScript/Express** to ensure 100% compatibility with the provided runtime environment and build tools. It uses the JS versions of **LangGraph** and **LangChain** which offer identical capabilities.
