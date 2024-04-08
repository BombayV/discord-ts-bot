import { Injections } from '../decorators/discord.decorator.js';
import {ChatInputCommandInteraction} from "discord.js";
import { BotManager } from "../managers/BotManager.js";

const { Discord, Command, StringOption } = Injections();

@Discord
export class Admin {
  @Command('Refresh commands', 60)
  @StringOption('guild', 'Guild ID', false)
  public async refresh(interaction: ChatInputCommandInteraction){
    const { guildId } = interaction;
    const bot = BotManager.getInstance();
    const resp = await bot.refreshGuildCommands(guildId);
    if (!resp) await interaction.editReply('Could not refresh commands!');

    await interaction.editReply('Commands refreshed!');
  }
}