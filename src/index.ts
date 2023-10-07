import dotenv from 'dotenv';
import {Client, IntentsBitField} from 'discord.js';
import { botManager } from './bot/managers/BotManager';

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
  id: process.env.BOT_ID as string,
  token: process.env.BOT_TOKEN as string,
  intents: intents,
  name: process.env.BOT_NAME as string,
}).build();