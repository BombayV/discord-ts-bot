import {Client, ChannelType} from "discord.js";
import {Logger} from "tslog";

const logger = new Logger({
  name: 'HostManager',
  type: 'pretty',
})

class HostManager {
  public static instance: HostManager;
  public client: Client;
  private hosts: Map<string, any> = new Map();

  constructor(client: Client) {
    this.client = client;
  }

  public static getInstance(): HostManager {
    if (!HostManager.instance) {
      throw new Error('HostManager instance is null');
    }

    return HostManager.instance;
  }

  public addHost(host: string) {
    if (!this.hosts.has(host)) {
      this.hosts.set(host, true);
    }
  }

  public removeHost(hostId: string) {
    if (this.hosts.has(hostId)) {
      this.hosts.delete(hostId);
    }
  }

  public getHost(hostId: string) {
    return this.hosts.get(hostId);
  }

  public getGuild(serverId: string) {
    return this.client.guilds.cache.get(serverId);
  }

  public getDefaultServerData(serverId: string) {
    const guild = this.getGuild(serverId);
    if (!guild) {
      return null;
    }

    const channels = guild.channels.cache;
    return {
      membersSize: guild.members.cache.size,
      rolesSize: guild.roles.cache.size,
      textChannelsSize: channels.filter((channel) => channel.type === 0).size,
      voiceChannelsSize: channels.filter((channel) => channel.type === 2).size,
      nickname: guild.members.me.nickname
    };
  }
}

export default HostManager;