import {Logger} from "tslog";
import chalk from "chalk";
import {DbController} from "./DbController.js";
import {Database} from "sqlite";
import sqlite3 from "sqlite3";

export class GiveawayController extends DbController {
  public static instance: GiveawayController;
  protected static db: Database<sqlite3.Database, sqlite3.Statement>;
  protected static logger: Logger<string> | null = null;

  private constructor() {
    super();
    GiveawayController.logger = new Logger({
      name: 'GiveawayController',
      type: 'pretty',
    });
    GiveawayController.logger.info(`${chalk.green('GiveawayController')} instance created`);
  }

  public static getInstance(): GiveawayController {
    if (!GiveawayController.instance) {
      GiveawayController.instance = new GiveawayController();
    }

    return GiveawayController.instance;
  }

  public async getAll() {
    await this.get(`SELECT * FROM giveaways`);
  }

  public async createTable() {
    const alreadyExists = await this.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='giveaways'`);
    if (alreadyExists) return;

    GiveawayController.logger.info(`Creating table ${chalk.green('giveaways')}...`);
    const sql = `
      CREATE TABLE giveaways (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        message_id TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        winners INTEGER NOT NULL DEFAULT 1,
        winners_id TEXT NOT NULL,
        entries INTEGER NOT NULL DEFAULT 0,
        ends_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const sql2 = `
      CREATE TABLE giveaway_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        giveaway_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await this.run(sql);
    await this.run(sql2);
    GiveawayController.logger.info(`${chalk.green('Giveaways')} table created`);
  }
}