import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from "@sveltejs/kit";
import { AuthSetter } from "$lib/utils/AuthSetter";

export const GET: RequestHandler = async ({ url , fetch, cookies }) => {
  const code = url.searchParams.get('code');
  if (!code) {
    console.error('GET: No code provided')
    throw redirect(302, '/');
  }

  const formData = {
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI,
  }

  return await AuthSetter('https://discord.com/api/oauth2/token', new URLSearchParams(formData), fetch, cookies, true);
}