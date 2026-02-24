import { Client, GatewayIntentBits } from 'discord.js';
import { runAgent } from '../agent/graph.ts';

const token = process.env.DISCORD_BOT_TOKEN;

export function setupDiscordBot() {
  if (!token) {
    console.warn('DISCORD_BOT_TOKEN not found. Discord bot disabled.');
    return null;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on('ready', () => {
    console.log(`Discord bot logged in as ${client.user?.tag}`);
  });

  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Optional: Admin check
    const adminId = process.env.ADMIN_DISCORD_ID;
    if (adminId && message.author.id !== adminId) return;

    // Only respond to DMs or mentions
    const isDM = !message.guild;
    const isMentioned = message.mentions.has(client.user?.id || '');

    if (isDM || isMentioned) {
      const text = message.content.replace(`<@!${client.user?.id}>`, '').replace(`<@${client.user?.id}>`, '').trim();
      
      try {
        await message.channel.sendTyping();
        const response = await runAgent(text, `ds_${message.author.id}`);
        await message.reply(response.toString());
      } catch (error: any) {
        console.error('Discord Bot Error:', error);
        await message.reply('Sorry, I encountered an error processing your request.');
      }
    }
  });

  client.login(token);

  return client;
}
