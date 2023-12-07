import dotenv from 'dotenv';
import { IntentsBitField, ActivityType } from 'discord.js';
import { botManager } from './managers/BotManager.js';
import { EventManager } from './managers/EventManager.js';
import AllClasses from "./commands/index.js";

const { FunCommands } = AllClasses;

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


await botManager.
  setPrivateData({
    id: process.env.ID as string,
    token: process.env.TOKEN as string,
    intents: intents,
    name: process.env.NAME as string,
  })
  .create(EventManager)
  .create(FunCommands)
  .buildClient()
  .build();

botManager
  .login()
  .setPresence('online', {
    name: 'with your mom',
    type: ActivityType.Playing
  });