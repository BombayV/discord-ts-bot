import {redirect, json} from "@sveltejs/kit";
import type { Cookies } from "@sveltejs/kit";
import type { DiscordTokenResponse } from '$lib/typings/DiscordTokenResponse';
import { setAuthCookie} from "$lib/utils/SetAuthCookie";

export const AuthSetter = async (url: string, formData: URLSearchParams, fetch: any,  cookies: Cookies, setCookies?: boolean) => {
  const rawResp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(formData)
  })
  const resp: DiscordTokenResponse = await rawResp.json();

  if (resp.error) {
    console.error('AuthSetter Error');
    if (!setCookies) {
      throw redirect(302, '/');
    }

    return json({
      error: resp.error,
    }, {
      status: 200,
      statusText: 'Bad Request',
    });
  }

  if (!setCookies) {
    return json({
      access_token: resp.access_token,
      expires_in: resp.expires_in,
      refresh_token: resp.refresh_token,
      scope: resp.scope,
      token_type: resp.token_type,
    }, {
      status: 200,
      statusText: 'OK',
    });
  }

  setAuthCookie(cookies, 'dc:access_token', resp.access_token, new Date(Date.now() + resp.expires_in));
  setAuthCookie(cookies, 'dc:refresh_token', resp.refresh_token, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  throw redirect(302, '/');
}