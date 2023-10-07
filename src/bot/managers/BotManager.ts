import {Client, IntentsBitField} from "discord.js";
import {EventManager} from "./EventManager";
import { Logger } from "tslog";

type BotManagerOptions = {
  id: string,
  token: string,
  intents: IntentsBitField,
  name: string
}

class BotManager {
  private static instance: BotManager;
  private static client: Client | null = null;
  private static privateData: BotManagerOptions | null = null;
  private static eventManager: EventManager | null = null;
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

  // Getters
  static getInstance(): BotManager {
    if (!BotManager.instance) {
      BotManager.instance = new BotManager();
    }

    return BotManager.instance;
  }

  public getTest() {
    return BotManager.privateData;
  }

  // Methods
  private buildEvents() {
    BotManager.eventManager = new EventManager(BotManager.client as Client);
    BotManager.eventManager.test('hello');
  }

  public build() {
    this.buildEvents();
    return this;
  }
}

export const botManager = BotManager.getInstance();