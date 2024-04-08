import { Injections } from '../decorators/discord.decorator.js';
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import { colorTransformer } from "../utils/colorTransformer.js";

const { Discord, Command, StringOption } = Injections();

@Discord
export class Info {
  @Command('Ping the bot')
  public async ping(interaction: ChatInputCommandInteraction) {
    const { createdTimestamp } = interaction;
    const reply = await interaction.editReply('Pinging...');
    const messagePing = reply.createdTimestamp - createdTimestamp;
    const websocketPing = interaction.client.ws.ping;

    await interaction.editReply(`Pong!\n**Message Ping:** ${messagePing}ms\n**Websocket Ping:** ${websocketPing}ms`);
  }

  @Command('Transforms a color into different formats')
  @StringOption('color', 'Color in hex format', true, null, 0, 7)
  public async color(interaction: ChatInputCommandInteraction) {
    const { options } = interaction;
    const color = options.getString('color', true);
    const { data, error } = colorTransformer(color);
    if (error) return await interaction.editReply(`Invalid color (${color}). Please provide a valid hex color.`);

    const { rgb, hsl, hsv, cmyk, hex } = data;
    const embed = new EmbedBuilder()
      .setTitle('Color Transformer')
      .setColor(Number(`0x${color.replace('#', '')}`))
      .addFields([
        { name: 'RGB', value: rgb },
        { name: 'HEX', value: `${hex}` },
        { name: 'HSL', value: hsl },
      ]).addFields([
        { name: 'HSV', value: hsv },
        { name: 'CMYK', value: cmyk },
      ])

    await interaction.editReply({ embeds: [embed] });
  }

  @Command('Get the distance between two vectors in 3D space')
  @StringOption('start', 'Starting coordinates x, y, z', true)
  @StringOption('end', 'Ending coordinates x, y, z', true)
  public async distance(interaction: ChatInputCommandInteraction) {
    const { options } = interaction;
    const start = options.getString('start', true);
    const end = options.getString('end', true);
    const removeBrackets = (str: string) => str.replace(/[\[\]()]/g, '');
    const [startX, startY, startZ] = removeBrackets(start).split(',').map(Number);
    const [endX, endY, endZ] = removeBrackets(end).split(',').map(Number);

    const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2 + (endZ - startZ) ** 2);
    await interaction.editReply(`The distance between the two vectors is ${distance.toFixed(2)}`);
  }
}