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
  constructor() {
  }

  @Event()
  public static ready() {

  }

  @Event()
  public static error(error: Error) {
    logger.error(error);
  }

  @Event()
  public static messageCreate(message: Message) {

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