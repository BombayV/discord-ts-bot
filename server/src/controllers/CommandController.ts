import {Logger} from "tslog";
import chalk from "chalk";
import {DbController} from "./DbController.js";
import {Database} from "sqlite";
import sqlite3 from "sqlite3";

export class CommandController extends DbController {
  public static instance: CommandController;
  protected static db: Database<sqlite3.Database, sqlite3.Statement>;
  protected static logger: Logger<string> | null = null;

  private constructor() {
    super();
    CommandController.logger = new Logger({
      name: 'CommandController',
      type: 'pretty',
    });
    CommandController.logger.info(`${chalk.green('CommandController')} instance created`);
  }

  public static getInstance(): CommandController {
    if (!CommandController.instance) {
      CommandController.instance = new CommandController();
    }

    return CommandController.instance;
  }

  public async getAll() {
    await this.get('SELECT * FROM giveaways')
  }

  public async createTable() {
    const alreadyExists = await this.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='commands'`);
    if (alreadyExists) return;

    CommandController.logger.info(`Creating table ${chalk.green('commands')}...`);
    const sql = `
      CREATE TABLE commands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL
      )
    `;

    await this.run(sql);
    CommandController.logger.info(`${chalk.green('Commands')} table created`);
  }
}