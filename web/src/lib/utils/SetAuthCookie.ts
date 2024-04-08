import type {Cookies} from "@sveltejs/kit";

export const setAuthCookie = (cookies: Cookies, name: string, value: string, expires: Date) => {
  cookies.set(name, value, {
    expires: expires,
    path: '/',
    sameSite: 'strict',
    secure: false,
  });
}