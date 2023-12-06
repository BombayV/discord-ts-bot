import {ActivityOptions, Client, ClientPresence, IntentsBitField, PresenceData} from "discord.js";
import { Logger } from "tslog";

type BotManagerOptions = {
  id: string,
  token: string,
  intents: IntentsBitField,
  name: string
}

type ActivityType = "online" | "idle" | "dnd" | "invisible";

class BotManager {
  private static instance: BotManager;
  private static client: Client | null = null;
  private static privateData: BotManagerOptions | null = null;
  private static logger: Logger<string> | null = null;

  private constructor() {
    BotManager.logger = new Logger({
      name: 'BotManager',
      type: 'pretty',
    });
    BotManager.logger.info('BotManager instance created');
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
      new Error('BotManager client is null.');
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
  private buildEvents() {
    return this;
  }

  private buildCommands() {
    return this;
  }

  public build() {
    this.buildEvents().buildCommands();
    BotManager.logger.info('BotManager built.');
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
      BotManager.client.login(BotManager.privateData.token).then(() => {
        BotManager.logger.info('BotManager client logged in.');
      }).catch((error) => {
        BotManager.logger.fatal(`BotManager client failed to login: \n${error}`)
      });
    } catch (error) {
      BotManager.logger.fatal(`BotManager failed to build client: \n${error}`);
    }
    return this;
  }
}

export const botManager = BotManager.getInstance();