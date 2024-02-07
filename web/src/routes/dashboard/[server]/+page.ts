import type { PageServerLoad } from '.././$types';
import {error} from "@sveltejs/kit";

export const load: PageServerLoad = ({ params }) => {
  const isServer = isNaN(parseInt((params as {server: string}).server));
  if (isServer) {
    error(404, 'Server not found or invalid');
  }

  return {
    server: (params as {server: string}).server
  };
}