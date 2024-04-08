import sqlite3 from 'sqlite3';
import {Database, open} from 'sqlite';
import { Logger } from "tslog";

export class DbController {
  private static instance: DbController;
  private static db: Database<sqlite3.Database, sqlite3.Statement>;
  private static logger: Logger<string> | null = null;

  private constructor() {
    DbController.logger = new Logger({
      name: 'DbController',
      type: 'pretty',
    });
    DbController.logger.warn('Bot instance created');
  }

  public static getInstance(): DbController {
    if (!DbController.instance) {
      DbController.instance = new DbController();
    }

    return DbController.instance;
  }

  public async connect() {
    DbController.db = await open({
      filename: '/src/db/bot.db',
      driver: sqlite3.Database
    });
  }
}