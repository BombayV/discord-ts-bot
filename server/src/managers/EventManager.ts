import server from '../http/server.js';
import { Injections } from "../decorators/discord.decorator.js";
import {CommandInteraction, CommandInteractionOptionResolver, Message} from "discord.js";
import {Logger} from "tslog";
import HostEventManager from "./HostEventManager.js";

const { Discord, Event } = Injections();
const logger = new Logger({
  name: 'EventManager',
  type: 'pretty',
  
})

@Discord
export class EventManager {
  private static svFastify = server;

  @Event()
  public static async ready() {
    try {
      await EventManager.svFastify.listen({
        host: '0.0.0.0',
        port: 3000,
      })
      // @ts-ignore
      logger.warn(`Server listening on ${EventManager.svFastify.server.address().port}`);
    } catch (err) {
      logger.error(`Error while starting server: ${err}`);
      process.exit(1);
    }
  }

  @Event()
  public static error(error: Error) {
    logger.error(error);
  }

  @Event()
  public static messageCreate(message: Message) {
    for (const client of EventManager.svFastify.websocketServer.clients) {
      if (HostEventManager.getInstance().getHost(message.guild.id) !== undefined) {
        // @ts-ignore
        if (client.id !== message.guild.id) continue;

        const filteredMessage = {
          type: 'message',
          data: {
            id: message.id,
            content: message.attachments && !message.content ? 'Sent an attachment' : message.content,
            author: message.author.username,
            channelId: message.channelId,
            channelName: message.guild.channels.cache.get(message.channelId)?.name,
          }
        }
        client.send(JSON.stringify(filteredMessage));
      }
    }
  }

  @Event()
  public static messageDelete() {

  }

  @Event()
  public static messageUpdate() {

  }

  @Event()
  public static async interactionCreate(interaction: CommandInteraction) {
    const {client} = interaction;
    const subcommmand = (interaction.options as CommandInteractionOptionResolver).getSubcommand();

    // @ts-ignore
    const command = client.commands.get(subcommmand);
    if (!command) return;

    if (interaction.isCommand()) {
      try {
        await interaction.deferReply({ ephemeral: command.ephemeral || false });
        setTimeout(() => {
          if (!interaction.replied) {
            interaction.editReply('This interaction has expired.');
            return;
          }
        }, 10000);
        await command.run(interaction);
      } catch (error) {
        logger.error(error);
        await interaction.editReply('There was an error while executing this command!');
      }
    }
  }
}