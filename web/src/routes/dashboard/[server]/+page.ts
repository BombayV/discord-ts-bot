import type { PageServerLoad } from '.././$types';

export const load: PageServerLoad = ({ params }) => {
  return {
    server: (params as {server: string}).server
  };
}