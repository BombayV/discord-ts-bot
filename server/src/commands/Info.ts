import { Injections } from '../decorators/discord.decorator.js';
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";

const { Discord, Command } = Injections();

@Discord
export class Info {
  @Command('Ping the bot')
  public async ping(interaction: ChatInputCommandInteraction) {
    await interaction.editReply('Pong!');
  }
}