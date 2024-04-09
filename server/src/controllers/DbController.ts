import sqlite3 from 'sqlite3';
import {Database, open} from 'sqlite';
import { Logger } from "tslog";
import chalk from "chalk";

export class DbController {
  public static instance: DbController;
  protected static db: Database<sqlite3.Database, sqlite3.Statement>;
  protected static logger: Logger<string> | null = null;

  protected constructor() {
    DbController.logger = new Logger({
      name: 'DbController',
      type: 'pretty',
    });
    DbController.logger.info(`${chalk.green('DbController')} instance created`);
  }

  public static getInstance(): DbController {
    if (!DbController.instance) {
      DbController.instance = new DbController();
    }

    return DbController.instance;
  }

  public static async connect() {
    try {
      DbController.db = await open({
        filename: 'src/db/bot.db',
        driver: sqlite3.Database
      });
    } catch (err) {
      DbController.logger.error(`Error while connecting to database: ${err}`);
      process.exit(1);
    }
  }

  protected async close() {
    try {
      await DbController.db.close();
    } catch (err) {
      DbController.logger.error(`Error while closing database: ${err}`);
      process.exit(1);
    }
  }

  protected async get(query: string) {
    try {
      return await DbController.db.get(query);
    } catch (err) {
      DbController.logger.error(`Error while executing query: ${err}`);
      process.exit(1);
    }
  }

  protected async run(query: string) {
    try {
      await DbController.db.run(query);
    } catch (err) {
      DbController.logger.error(`Error while executing query: ${err}`);
      process.exit(1);
    }
  }
}