import dotenv from 'dotenv';
import { IntentsBitField, ActivityType } from 'discord.js';
import { botManager } from './bot/managers/BotManager.js';

dotenv.config();

const intents = new IntentsBitField([
  'Guilds',
  'GuildMembers',
  'GuildMessages',
  'GuildMessageReactions',
  'GuildPresences',
  'DirectMessages',
  'DirectMessageReactions',
]);

botManager.setPrivateData({
  id: process.env.ID as string,
  token: process.env.TOKEN as string,
  intents: intents,
  name: process.env.NAME as string,
}).build();

botManager.buildClient().setPresence("online", {
  name: "with your mom",
  type: ActivityType.Playing,
});