import { Injections } from '../decorators/discord.decorator.js';
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";

const { Discord, Command } = Injections();

const SIZES = {
  'xs': { size: 64, display: 'Extra Small' },
  'sm': { size: 128, display: 'Small' },
  'md': { size: 256, display: 'Medium' },
  'lg': { size: 512, display: 'Large' },
  'xl': { size: 1024, display: 'Extra Large' },
}

@Discord
export class Fun {
  @Command('Say something')
  public async say(interaction: ChatInputCommandInteraction) {
    await interaction.editReply('This command is not implemented yet.');
  }
  @Command('Display a user\'s avatar', [
    {
      name: 'name',
      description: 'Name of the user',
      type: 6,
      required: false
    },
    {
      name: 'size',
      description: 'Size of the avatar',
      type: 3,
      choices: [
        { name: 'Extra Small', value: 'xs'},
        { name: 'Small', value: 'sm' },
        { name: 'Medium', value: 'md' },
        { name: 'Large', value: 'lg' },
        { name: 'Extra Large', value: 'xl' },
      ],
      required: false
    }
  ])
  public async avatar(interaction: ChatInputCommandInteraction){
    const { options, user } = interaction;
    const userToFind = options.getUser('name') || user;
    const size = SIZES[options.getString('size')]?.size  || 256;
    const embed = new EmbedBuilder()
      .setTitle(`${userToFind.bot ? userToFind.displayName : userToFind.globalName}'s Avatar`)
      .setImage(userToFind.avatarURL({
        size
      }));

    await interaction.editReply({
      embeds: [embed]
    });
  }
}