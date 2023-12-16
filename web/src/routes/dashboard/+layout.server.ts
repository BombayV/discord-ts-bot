import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '.././$types';
import {getUser} from "$lib/utils/getUser";
import {getServers} from "$lib/utils/getServers";

export const load: PageServerLoad = async ({ url, cookies, locals: { getSession } }) => {
  const session = await getSession();
  if (!session) {
    redirect(302, '/');
  }

  const token = cookies.get('dc:access_token');
  const user = await getUser(token);
  const servers = await getServers(token) || [];

  return {
    url: url.origin + url.pathname,
    props: {
      user,
      servers
    }
  };
}

