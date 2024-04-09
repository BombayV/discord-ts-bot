import {Logger} from "tslog";
import chalk from "chalk";
import {DbController} from "./DbController.js";
import {Database} from "sqlite";
import sqlite3 from "sqlite3";

export class LogController extends DbController {
  public static instance: LogController;
  protected static db: Database<sqlite3.Database, sqlite3.Statement>;
  protected static logger: Logger<string> | null = null;

  private constructor() {
    super();
    LogController.logger = new Logger({
      name: 'LogController',
      type: 'pretty',
    });
    LogController.logger.info(`${chalk.green('LogController')} instance created`);
  }

  public static getInstance(): LogController {
    if (!LogController.instance) {
      LogController.instance = new LogController();
    }

    return LogController.instance;
  }

  public async getAll() {
    await this.get('SELECT * FROM logs')
  }

  public async createTable() {
    const alreadyExists = await this.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='logs'`);
    if (alreadyExists) return;

    LogController.logger.info(`Creating table ${chalk.green('logs')}...`);
    const sql = `
      CREATE TABLE logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        type TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await this.run(sql);
    LogController.logger.info(`${chalk.green('Logs')} table created`);
  }
}