import server from '../http/server.js';
import { Injections } from "../decorators/discord.decorator.js";
import {CommandInteraction, Message} from "discord.js";
import {Logger} from "tslog";

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
      client.send(message.content);
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
    const {commandName} = interaction;

    // @ts-ignore
    const command = client.commands.get(commandName);
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