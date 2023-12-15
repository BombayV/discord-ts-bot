export type DiscordTokenResponse = {
  token_type: string,
  access_token: string,
  expires_in: number,
  refresh_token: string,
  scope: string,
  error?: string,
}