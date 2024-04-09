import HostManager from "./HostManager.js";
import {Client} from "discord.js";
import {Logger} from "tslog";
import chalk from "chalk";

class HostEventManager extends HostManager {
  public static instance: HostEventManager;
  private static logger: Logger<string> | null = null;

  private constructor(client: Client) {
    super(client);
    HostEventManager.logger = new Logger({
      name: 'HostEventManager',
      type: 'pretty',
    });
    HostEventManager.logger.info(`${chalk.green('HostEventManager')} instance created`);
  }

  public static createInstance(client: Client) {
    if (!HostEventManager.instance) {
      HostEventManager.instance = new HostEventManager(client);
    }

    return HostEventManager.instance;
  }

  public static getInstance(): HostEventManager {
    if (!HostEventManager.instance) {
      throw new Error('HostEventManager instance is null');
    }

    return HostEventManager.instance;
  }

  public setBotNickname(serverId: string, nickname: string): boolean {
    const guild = this.client.guilds.cache.get(serverId);
    if (!guild) {
      HostEventManager.logger.error(`Guild with ID ${serverId} not found`);
      return false;
    }

    const newNickname = nickname.length > 32 ? nickname.substring(0, 32) : nickname;

    guild.members.me.setNickname(newNickname === '' ? null : newNickname)
      .then(() => {
        HostEventManager.logger.info(`Nickname set to ${chalk.green(newNickname)}`);
      })
      .catch((err) => {
        HostEventManager.logger.error(`An error occurred while setting the nickname: ${chalk.red(err)}`);
      });
    return true;
  }
}

export default HostEventManager;