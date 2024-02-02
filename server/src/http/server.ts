import Fastify from 'fastify';
import FastifyWebsocket from '@fastify/websocket'
import cors from '@fastify/cors';
import { addServer } from "../utils/ServersMap.js";

const fastify = Fastify();
await fastify.register(FastifyWebsocket);
await fastify.register(cors, {
  origin: '*',
});

fastify.route({
  method: 'GET',
  url: '/',
  websocket: false,
  handler: (request, reply) => {
    reply.code(200).send({ message: 'Hello from Fastify!' });
  },
})

fastify.route({
  method: 'GET',
  url: '/ws',
  handler: (request, reply) => {
    reply.code(200).send({ message: 'Use a WebSocket client to connect' });
  },
  wsHandler: (connection, request) => {
    connection.socket.on('message', (message) => {
      // Read buffer message
      const { type, data } = JSON.parse(message.toString());
      switch (type) {
        case 'server_id':
          addServer(data.server_id, true);
          break;
      }
    });
  },
});

export default fastify;