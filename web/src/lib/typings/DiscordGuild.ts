export type DiscordGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  permissions_new: string;
  features: string[];
  bot_in_guild?: boolean;
}