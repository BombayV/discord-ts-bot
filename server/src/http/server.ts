import Fastify from 'fastify';
import FastifyWebsocket from '@fastify/websocket'

const fastify = Fastify({
  logger: true
})

fastify.register(FastifyWebsocket);
fastify.register(async function (fastify) {
  fastify.get('/', { websocket: false} ,async function handler(req, rep) {
    return {
      hello: 'world'
    }
  });
})

export default fastify;