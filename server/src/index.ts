import dotenv from 'dotenv';
import { IntentsBitField, ActivityType } from 'discord.js';
import { BotManager } from './managers/BotManager.js';
import { EventManager } from './managers/EventManager.js';
import AllCommands from "./commands/index.js";

dotenv.config();

const intents = new IntentsBitField([
  'Guilds',
  'GuildMembers',
  'GuildMessages',
  'GuildMessageReactions',
  'GuildPresences',
  'DirectMessages',
  'DirectMessageReactions',
  'MessageContent'
]);

const botManager = BotManager.getInstance();

botManager.setPrivateData({
  id: process.env.ID as string,
  token: process.env.TOKEN as string,
  intents: intents,
  name: "Discord Bot",
}).create(EventManager)

// Add all commands
for (const Class of AllCommands) {
  botManager.create(Class);
}

await botManager.buildClient();
await botManager.login();
botManager.setPresence('online', {
    name: 'with your mom',
    type: ActivityType.Playing
});