import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'agent_memory.db');
let db: any;

try {
  console.log(`Connecting to database at ${dbPath}...`);
  db = new Database(dbPath);
  console.log('Database connected successfully.');
} catch (error) {
  console.error('Failed to connect to database:', error);
  // Fallback or exit
  process.exit(1);
}

// Initialize tables
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      user_id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      settings JSON DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS scheduled_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_name TEXT NOT NULL,
      cron_expr TEXT NOT NULL,
      payload JSON,
      last_run DATETIME
    );
  `);
  console.log('Database tables initialized.');
} catch (error) {
  console.error('Failed to initialize database tables:', error);
}

export default db;
