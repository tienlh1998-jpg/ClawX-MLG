import cron from 'node-cron';
import { runAgent } from '../agent/graph.ts';
import db from '../db/database.ts';

export function setupScheduler() {
  console.log('Initializing scheduler...');

  // Example: Daily summary task
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily summary task...');
    try {
      const response = await runAgent("Give me a daily summary of my tasks and news.", "system_scheduler");
      console.log('Scheduler response:', response);
      // In a real app, you might send this to the user via Telegram/Discord
    } catch (error) {
      console.error('Scheduler Error:', error);
    }
  });

  // Load custom tasks from DB
  const tasks = db.prepare('SELECT * FROM scheduled_tasks').all() as any[];
  tasks.forEach(task => {
    cron.schedule(task.cron_expr, async () => {
      console.log(`Running custom task: ${task.task_name}`);
      try {
        await runAgent(task.payload?.prompt || `Run task ${task.task_name}`, "system_scheduler");
      } catch (error) {
        console.error(`Custom Task Error (${task.task_name}):`, error);
      }
    });
  });
}
