import {Injections} from "../decorators/discord.decorator.js";
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import {GiveawayController} from "../controllers/GiveawayController.js";

const { Discord, Command, UserOption, StringOption, IntegerOption } = Injections();
const giveawayController = GiveawayController.getInstance();

@Discord
export class Giveaways {
  @Command('create')
  @StringOption('title', 'Title of the giveaway (e.g. 2x Nitro)', true)
  @StringOption('description', 'Description of the giveaway (e.g. Two nitro codes for 1 month each)', true)
  @IntegerOption('winners', 'Number of winners', true)
  @StringOption('ends_at', 'End date of the giveaway (e.g. 2022-12-31)', true)
  public async create(interaction: ChatInputCommandInteraction){

    await interaction.editReply('Giveaway created!');
  }

  @Command('end')
  @IntegerOption('id', 'ID of the giveaway', true)
  public async end(interaction: ChatInputCommandInteraction){

    await interaction.editReply('Giveaway ended!');
  }

  @Command('list')
  public async list(interaction: ChatInputCommandInteraction){

    await interaction.editReply('List of giveaways');
  }

  @Command('reroll')
  @IntegerOption('id', 'ID of the giveaway', true)
  public async reroll(interaction: ChatInputCommandInteraction){
    await interaction.editReply('Giveaway rerolled!');
  }
}