import type { Actions } from '.././$types';
import {redirect} from "@sveltejs/kit";

export const actions: Actions = {
  // @ts-ignore
  logout: async ({ cookies, locals: { getSession } }) => {
    const session = await getSession();
    if (session) {
      cookies.delete('dc:access_token', {
        path: '/',
        sameSite: 'strict',
        secure: true,
      });
      cookies.delete('dc:refresh_token', {
        path: '/',
        sameSite: 'strict',
        secure: true,
      });
      throw redirect(302, '/');
    }
  }
}