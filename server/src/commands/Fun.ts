import { setTimeout } from 'node:timers/promises';
import { Injections } from '../decorators/discord.decorator.js';
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import {AVAILABLE_RESPONSES, AVAILABLE_SIZES, AVATAR_SIZES} from "./default.js";

const { Discord, Command, UserOption, StringOption } = Injections();

@Discord
export class Fun {
  @Command('Display a user\'s avatar', 10)
  @UserOption('name', 'Name of the user')
  @StringOption('size', 'Size of the avatar', false, AVATAR_SIZES)
  public async avatar(interaction: ChatInputCommandInteraction){
    const { options, user, guild } = interaction;
    const userToFind = options.getUser('name') || user;
    const size = AVAILABLE_SIZES[options.getString('size')] || 256;
    const embed = new EmbedBuilder()
      .setTitle(`${guild.members.cache.get(userToFind.id).nickname || userToFind.displayName}'s avatar`)
      .setImage(userToFind.avatarURL({
        size
      }));

    await interaction.editReply({
      embeds: [embed]
    });
  }

  @Command('Ask the magic picker to choose for you', 10)
  @StringOption('option1', 'Your first option', true)
  @StringOption('option2', 'Your second option', true)
  @StringOption('option3', 'Extra option', false)
  @StringOption('option4', 'Extra option', false)
  @StringOption('option5', 'Extra option', false)
  @StringOption('option6', 'Extra option', false)
  public async choose(interaction: ChatInputCommandInteraction){
    const { options, user } = interaction;
    const allOptions: any = options.data[0].options.map((option) => option.value);
    const strOptions = allOptions.join(', ');
    const choice = allOptions[Math.floor(Math.random() * allOptions.length)];
    await interaction.editReply({
      content: `${user.toString()} asked:\n> ${strOptions}\nMagic picker chooses...`,
    });

    await setTimeout(3000)
    await interaction.editReply({
      content: `${user.toString()} asked:\n> ${strOptions}\nMagic picker chooses:\n> **${choice}**`,
    });
  }

  @Command('Ask the magic 8-ball a question', 10)
  @StringOption('question', 'Ask a question', true)
  public async ask(interaction: ChatInputCommandInteraction){
    const { options, user } = interaction;
    const question = options.getString('question');
    const response = AVAILABLE_RESPONSES[Math.floor(Math.random() * AVAILABLE_RESPONSES.length)];
    await interaction.editReply({
      content: `${user.toString()} asked:\n> *${question}*\n8-ball is thinking...`,
    });

    await setTimeout(3000)
    await interaction.editReply({
      content: `${user.toString()} asked:\n> *${question}*\n8-ball says:\n> **${response}**`,
    });
  }
}