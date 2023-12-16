import type {DiscordUser, ExtendedDiscordUser} from "$lib/typings/DiscordUser";

export const useUser = (user: ExtendedDiscordUser) => {
  const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=56`;
  return {
    id: user.id,
    username: user.global_name,
    email: user.email,
    avatar,
  } as DiscordUser;
}