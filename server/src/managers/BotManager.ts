import {REST, Routes, ActivityOptions, Client, Collection, IntentsBitField, ClientEvents} from "discord.js";
import { Logger } from "tslog";
import { Injections } from "../decorators/discord.decorator.js";
import HostEventManager from "./HostEventManager.js";
import {BotCommand, BotEvent, CommandInjection} from "../../types";
import { GiveawayController } from "../controllers/GiveawayController.js";
import { LogController } from "../controllers/LogController.js";
import { CommandController } from "../controllers/CommandController.js";
import {LevelController} from "../controllers/LevelController.js";
import { DbController } from "../controllers/DbController.js";
import chalk from "chalk";

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
  private static commands = new Collection<string, BotCommand>();
  private static subcommands = new Collection<string, CommandInjection>();
  private static events = new Collection<string, BotEvent<EventListener>>();
  private static giveawayController: GiveawayController;
  private static logController: LogController;
  private static commandController: CommandController;
  private static levelController: LevelController;

  private constructor() {
    BotManager.giveawayController = GiveawayController.getInstance();
    BotManager.logger = new Logger({
      name: 'BotManager',
      type: 'pretty',
    });
    BotManager.logger.info(`${chalk.green('Bot')} instance created`);
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
      const { kind, name } = val;
      if (kind === 'event') {
        BotManager.events.set(name, val);
        val.run.bind(instance);
      }

      if (kind === 'command') {
        commands.push(val);
        BotManager.subcommands.set(name, val);
        val.run.bind(instance);
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


  private buildEvents() {
    BotManager.client.events = BotManager.events;
    for (const [eventName, val] of BotManager.events) {
      BotManager.client.on(eventName, val.run);
    }
    return this;
  }

  private buildCommands() {
    BotManager.client.commands = BotManager.subcommands;
    return this;
  }

  private buildCooldowns() {
    BotManager.client.cooldowns = new Collection<string, number>();
    return this;
  }

  private async buildGiveaway() {
    BotManager.giveawayController = GiveawayController.getInstance();
    await BotManager.giveawayController.createTable();
    return this;
  }

  private async buildLog() {
    BotManager.logController = LogController.getInstance();
    await BotManager.logController.createTable();
    return this;
  }

  private async buildCommand() {
    BotManager.commandController = CommandController.getInstance();
    await BotManager.commandController.createTable();
    return this;
  }

  private async buildLevel() {
    BotManager.levelController = LevelController.getInstance();
    await BotManager.levelController.createTable();
    return this;
  }


  // Builds the commands and events for the client.
  public async build() {
    // Build discord.js client
    this.buildEvents();
    this.buildCooldowns();
    this.buildCommands();
    await DbController.connect();

    // Build db controllers
    await this.buildGiveaway();
    await this.buildLog();
    await this.buildCommand();
    await this.buildLevel();

    // await this.refreshCommands();
    BotManager.logger.silly('Commands, events, cooldowns, and database built');
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

  public async refreshGuildCommands(guildId: string): Promise<boolean> {
    try {
      // await BotManager.REST.put(Routes.applicationGuildCommands(BotManager.privateData.id, guildId), {
      //   body: [...BotManager.commands.values()]
      // });
      await BotManager.REST.put(Routes.applicationCommands(BotManager.privateData.id), {
        body: [...BotManager.commands.values()]
      });
      BotManager.logger.silly(`Commands refreshed for ${guildId} into client.`);
      return true;
    } catch (error) {
      BotManager.logger.fatal(`Failed to refresh commands: \n${error}`);
      return false;
    }
  }
}