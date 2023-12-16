import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';


export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
  const session = await getSession();
  if (session) {
    redirect(303, '/dashboard');
  }

  return {
    url: url.origin
  };
}

const AUTH_URL = import.meta.env.VITE_DISCORD_AUTHORIZATION_URL;

export const actions: Actions = {
  login: async ({cookies}) => {
    const authToken = cookies.get('dc:access_token');
    if (authToken) {
      redirect(303, '/dashboard');
    }

    const refreshToken = cookies.get('dc:refresh_token');
    if (refreshToken) {
      redirect(303, '/auth/refresh');
    }

    redirect(303, AUTH_URL);
  }
};