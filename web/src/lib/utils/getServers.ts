import type { DiscordGuild } from "$lib/typings/DiscordGuild";

const ADMINISTRATOR = 8n;
const MANAGE_GUILD = 32n;

const hasPermission = (bitwisePermissions: string) => {
  const permissions = BigInt(bitwisePermissions);
  return (permissions & ADMINISTRATOR) === ADMINISTRATOR || (permissions & MANAGE_GUILD) === MANAGE_GUILD;
}

const isBotInGuild = async (guild: DiscordGuild) => {
  const rawResp = await fetch(`https://discordapp.com/api/guilds/${guild.id}/members/${import.meta.env.VITE_DISCORD_CLIENT_ID}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bot ${import.meta.env.VITE_DISCORD_BOT_TOKEN}`
    }
  });

  return rawResp.status === 200;
}

export const getServers = async (token: string | undefined) => {
  if (!token) return null;

  try {
    const rawResp = await fetch(`https://discordapp.com/api/users/@me/guilds`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const resp = await rawResp.json() as DiscordGuild[];

    const servers: DiscordGuild[] extends {} ? DiscordGuild[] : never = [];
    for (const guild of resp) {
      if (hasPermission(guild.permissions_new)) {
        servers.push({
          ...guild,
          icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : '',
          bot_in_guild: await isBotInGuild(guild)
        })
      }
    }

    return servers;
  } catch (e) {
    console.error(e)
    return [];
  }
}