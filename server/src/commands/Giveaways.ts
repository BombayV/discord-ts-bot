import {Injections} from "../decorators/discord.decorator.js";
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";

const { Discord, Command, UserOption, StringOption, IntegerOption } = Injections();

@Discord
export class Giveaways {
  @Command('create')
  @StringOption('title', 'Title of the giveaway (e.g. 2x Nitro)', true)
  @StringOption('description', 'Description of the giveaway (e.g. Two nitro codes for 1 month each)', true)
  @IntegerOption('winners', 'Number of winners', true)
  public async create(interaction: ChatInputCommandInteraction){

    await interaction.editReply('Giveaway created!');
  }
}