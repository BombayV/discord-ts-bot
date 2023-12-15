// src/hooks.server.ts
import type {Handle} from '@sveltejs/kit';
import { setAuthCookie } from "$lib/utils/SetAuthCookie";

export const handle: Handle = async ({ event, resolve }) => {
  const { cookies } = event;

  event.locals.getSession = async () => {
    const accessToken = cookies.get('dc:access_token');
    const refreshToken = cookies.get('dc:refresh_token');

    if (accessToken && refreshToken) {
      return {};
    }

    if (!accessToken && refreshToken) {
      const rawResp = await fetch(`${import.meta.env.VITE_HOST}/auth/refresh?code=${refreshToken}`, {
        method: 'GET',
      });
      const resp = await rawResp.json();
      if (resp.error) {
        return null;
      }

      setAuthCookie(cookies, 'dc:access_token', resp.access_token, new Date(Date.now() + resp.expires_in));
      setAuthCookie(cookies, 'dc:refresh_token', resp.refresh_token, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

      return true;
    }

    return null;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
};