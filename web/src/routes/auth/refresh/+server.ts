import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from "@sveltejs/kit";
import {AuthSetter} from "$lib/utils/AuthSetter";

export const GET: RequestHandler = async ({ url , fetch, cookies }) => {
  const refresh_token = url.searchParams.get('code');
  if (!refresh_token) {
    console.log('GET: No refresh_token provided')
    throw redirect(302, '/');
  }

  const formData = {
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token
  }

  return await AuthSetter('https://discord.com/api/oauth2/token', new URLSearchParams(formData), fetch, cookies, false);
}