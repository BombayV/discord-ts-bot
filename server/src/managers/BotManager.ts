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

class BotManager {
  private static instance: BotManager;
  // @ts-ignore
  private static client: Client;
  private static privateData: BotManagerOptions | null = null;
  private static REST: REST | null = null;
  private static logger: Logger<string> | null = null;
  private static commands = new Collection();
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
  public create(Class) {
    const instance = new Class();
    for (const val of getInjections().get(Class)) {
      const { name, command, event } = val;
      if (command) {
        BotManager.commands.set(name, command);
        command.run.bind(instance);
      }

      if (event) {
        BotManager.events.set(name, event);
        event.run.bind(instance);
      }
    }

    return this;
  }

  private buildEvents() {
    // @ts-ignore
    BotManager.client.events = BotManager.events;
    for (const [key, val] of BotManager.events) {
      // @ts-ignore
      BotManager.client.on(key, val.run);
    }
    return this;
  }

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

  private async buildCommands() {
    // @ts-ignore
    BotManager.client.commands = BotManager.commands;
    await this.refreshCommands();
    return this;
  }

  public async build() {
    this.buildEvents();
    await this.buildCommands();
    BotManager.logger.silly('Commands and events built.');
    return this;
  }

  public buildClient() {
    try {
      if (BotManager.privateData === null) {
        new Error('BotManager privateData is null.');
      }

      BotManager.client = new Client({
        intents: BotManager.privateData?.intents,
      });
      BotManager.REST = new REST().setToken(BotManager.privateData.token);
      HostEventManager.createInstance(BotManager.client);
    } catch (error) {
      BotManager.logger.fatal(`Failed to build client: \n${error}`);
    }
    return this;
  }

  public login() {
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
}

export const botManager = BotManager.getInstance();