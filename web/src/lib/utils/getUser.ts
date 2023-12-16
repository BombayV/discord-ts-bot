import {useUser} from "$lib/utils/useUser";
import { onMount } from "svelte";

export const getUser = async (token: string | undefined) => {
  if (!token) return null;

  try {
    const rawResp = await fetch(`${import.meta.env.VITE_DISCORD_API_URL}/users/@me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const resp = await rawResp.json();
    if (resp.error) {
      return null;
    }

    onMount(() => {
      sessionStorage.setItem('user', JSON.stringify(resp));
      console.log('set user')
    });

    return useUser(resp) as ReturnType<typeof useUser>;
  } catch (e) {
    console.error(e)
    return null;
  }
}