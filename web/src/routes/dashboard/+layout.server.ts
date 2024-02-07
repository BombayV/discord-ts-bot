import {error, redirect} from '@sveltejs/kit';
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
  const path = url.pathname.split('/')[2] || '';
  if (path && !servers.find(server => server.id === path)) {
    error(404, 'Server not found or invalid');
  }

  return {
    url: url.origin + url.pathname,
    props: {
      user,
      servers
    }
  };
}

