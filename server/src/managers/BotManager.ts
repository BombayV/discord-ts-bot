import { REST, Routes, ActivityOptions, Client, Collection, IntentsBitField} from "discord.js";
import { Logger } from "tslog";
import { Injections } from "../decorators/discord.decorator.js";
import HostEventManager from "./HostEventManager.js";

type BotManagerOptions = {
  id: string,
  token: string,
  intents: IntentsBitField,
  name: string
}

type ActivityType = "online" | "idle" | "dnd" | "invisible";

const { getInjections } = Injections();

export class BotManager {
  private static instance: BotManager;
  private static client: Client;
  private static privateData: BotManagerOptions | null = null;
  private static REST: REST | null = null;
  private static logger: Logger<string> | null = null;
  private static commands = new Collection();
  private static subcommands = new Collection();
  private static events = new Collection();

  private constructor() {
    BotManager.logger = new Logger({
      name: 'BotManager',
      type: 'pretty',
    });
    BotManager.logger.warn('Bot instance created');
  }

  // Setters
  public setPrivateData(data: BotManagerOptions) {
    if (BotManager.privateData === null) {
      BotManager.privateData = data;
    }

    return this;
  }

  public setPresence(status: ActivityType, activity: ActivityOptions | null = null) {
    if (BotManager.client === null) {
      new Error('Client is null.');
    }

    BotManager.client.once('ready', () => {
      BotManager.client.user.setPresence({
        activities: [activity],
        status: status,
      });
    });
    return this;
  }

  // Getters
  static getInstance(): BotManager {
    if (!BotManager.instance) {
      BotManager.instance = new BotManager();
    }

    return BotManager.instance;
  }

  // Methods
  // Creates a new instance of a class and adds
  // its commands and events to the client.
  public create(Class) {
    const instance = new Class();
    const commands = [];
    for (const val of getInjections().get(Class)) {
      const { name, event, command } = val;
      if (event) {
        BotManager.events.set(name, event);
        event.run.bind(instance);
      }

      if (command) {
        commands.push(command);
        BotManager.subcommands.set(name, command);
        command.run.bind(instance);
      }
    }

    if (commands.length === 0) {
      return this;
    }

    BotManager.commands.set(Class.__name, {
      name: Class.__name,
      description: Class.__description,
      options: commands,
    });

    return this;
  }

  // Builds the events and adds them to the client
  // for the bot to listen to.
  private buildEvents() {
    // @ts-ignore
    BotManager.client.events = BotManager.events;
    for (const [key, val] of BotManager.events) {
      // @ts-ignore
      BotManager.client.on(key, val.run);
    }
    return this;
  }

  // Builds the commands and adds them to the client
  // for the bot to listen to.
  private async buildCommands() {
    // @ts-ignore
    BotManager.client.commands = BotManager.subcommands;
    await this.refreshCommands();
    return this;
  }

  // Builds the commands and events for the client.
  public async build() {
    this.buildEvents();
    await this.buildCommands();
    BotManager.logger.silly('Commands and events built.');
    return this;
  }

  // Builds the client with the intents and token
  // provided in the privateData object.
  public async buildClient() {
    try {
      if (BotManager.privateData === null) {
        new Error('BotManager privateData is null.');
      }

      BotManager.client = new Client({
        intents: BotManager.privateData?.intents,
      });

      BotManager.REST = new REST().setToken(BotManager.privateData.token);
      HostEventManager.createInstance(BotManager.client);
      await this.build();
    } catch (error) {
      BotManager.logger.fatal(`Failed to build client: \n${error}`);
    }
    return this;
  }

  // Logs the client into Discord.
  public async login() {
    try {
      if (BotManager.client === null) {
        new Error('BotManager client is null.');
      }

      BotManager.client.login(BotManager.privateData.token).then(() => {
        BotManager.logger.warn('Client logged in.');
      }).catch((error) => {
        BotManager.logger.fatal(`Client failed to login: \n${error}`)
      });
    } catch (error) {
      BotManager.logger.fatal(`Failed to login: \n${error}`);
    }
    return this;
  }

  // Refreshes the commands in the client.
  // Should only be needed when new commands are added.
  private async refreshCommands() {
    try {
      await BotManager.REST.put(Routes.applicationCommands(BotManager.privateData.id), {
        body: [...BotManager.commands.values()]
      });
      BotManager.logger.silly('Commands refreshed into client.');
    } catch (error) {
      BotManager.logger.fatal(`Failed to refresh commands: \n${error}`);
    }
  }
}