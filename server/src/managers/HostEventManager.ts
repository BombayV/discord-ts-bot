import HostManager from "./HostManager.js";
import {Client} from "discord.js";
import {Logger} from "tslog";

const logger = new Logger({
  name: 'HostEventManager',
  type: 'pretty',
})

class HostEventManager extends HostManager {
  public static instance: HostEventManager;

  private constructor(client: Client) {
    super(client);
  }

  public static createInstance(client: Client) {
    if (!HostEventManager.instance) {
      HostEventManager.instance = new HostEventManager(client);
    }

    logger.info('HostEventManager instance created');
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
      logger.error(`Guild with ID ${serverId} not found`);
      return false;
    }

    const newNickname = nickname.length > 32 ? nickname.substring(0, 32) : nickname;

    guild.members.me.setNickname(newNickname === '' ? null : newNickname)
      .then(() => {
        logger.info(`Nickname set to ${nickname} successfully`);
      })
      .catch((err) => {
        logger.error(`An error occurred while setting the nickname: ${err}`);
      });
    return true;
  }
}

export default HostEventManager;