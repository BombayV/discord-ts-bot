import server from '../http/server.js';
import { Injections } from "../decorators/discord.decorator.js";
import {Collection, CommandInteraction, CommandInteractionOptionResolver, Message} from "discord.js";
import {Logger} from "tslog";
import HostEventManager from "./HostEventManager.js";

const { Discord, Event } = Injections();

@Discord
export class EventManager {
  private static svFastify = server;
  private static logger = new Logger({
    name: 'EventManager',
    type: 'pretty',
  });

  @Event()
  public static async ready() {
    try {
      await EventManager.svFastify.listen({
        host: '0.0.0.0',
        port: 3000,
      })
      const address = EventManager.svFastify.server.address();
      const port = typeof address === 'string' ? address : address?.port;
      EventManager.logger.warn(`Server listening on ${port}`);
    } catch (err) {
      EventManager.logger.error(`Error while starting server: ${err}`);
      process.exit(1);
    }
  }

  @Event()
  public static error(error: Error) {
    EventManager.logger.error(error);
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
    const {client } = interaction;
    const subcommmand = (interaction.options as CommandInteractionOptionResolver).getSubcommand();

    const command = client.commands.get(subcommmand);
    if (!command) return;

    // Cooldowns handling
    const cooldowns = client.cooldowns;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection<string, string>());
    }

    const now = new Date().getTime();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = command.cooldown * 1000;
    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = Math.round((expirationTime - now) / 1000);
        return interaction.reply({
          content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    // End of cooldowns handling

    // Command execution
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
        EventManager.logger.error(error);
        await interaction.editReply('There was an error while executing this command!');
      }
    }
  }
}