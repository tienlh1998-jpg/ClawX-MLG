import { Telegraf } from 'telegraf';
import { runAgent } from '../agent/graph.ts';

const token = process.env.TELEGRAM_BOT_TOKEN;

export function setupTelegramBot() {
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN not found. Telegram bot disabled.');
    return null;
  }

  const bot = new Telegraf(token);

  bot.start((ctx) => ctx.reply('Welcome to ClawX AI Agent! How can I help you today?'));

  bot.on('text', async (ctx) => {
    const userId = ctx.from.id.toString();
    const text = ctx.message.text;

    // Optional: Admin check
    const adminId = process.env.ADMIN_TELEGRAM_ID;
    if (adminId && userId !== adminId) {
      return ctx.reply('Unauthorized access.');
    }

    try {
      await ctx.sendChatAction('typing');
      const response = await runAgent(text, `tg_${userId}`);
      await ctx.reply(response.toString());
    } catch (error: any) {
      console.error('Telegram Bot Error:', error);
      await ctx.reply('Sorry, I encountered an error processing your request.');
    }
  });

  bot.launch().then(() => {
    console.log('Telegram bot started');
  });

  return bot;
}
