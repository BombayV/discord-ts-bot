import {Logger} from "tslog";
import chalk from "chalk";
import {DbController} from "./DbController.js";
import {Database} from "sqlite";
import sqlite3 from "sqlite3";

export class LevelController extends DbController {
  public static instance: LevelController;
  protected static db: Database<sqlite3.Database, sqlite3.Statement>;
  protected static logger: Logger<string> | null = null;

  private constructor() {
    super();
    LevelController.logger = new Logger({
      name: 'LevelController',
      type: 'pretty',
    });
    LevelController.logger.info(`${chalk.green('LevelController')} instance created`);
  }

  public static getInstance(): LevelController {
    if (!LevelController.instance) {
      LevelController.instance = new LevelController();
    }

    return LevelController.instance;
  }

  public async getAll() {
    await this.get('SELECT * FROM logs')
  }

  public async createTable() {
    const alreadyExists = await this.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='levels'`);
    if (alreadyExists) return;

    LevelController.logger.info(`Creating table ${chalk.green('levels')}...`);
    const sql = `
      CREATE TABLE levels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        level INTEGER NOT NULL,
        xp INTEGER NOT NULL
      )
    `;

    await this.run(sql);
    LevelController.logger.info(`${chalk.green('Levels')} table created`);
  }
}