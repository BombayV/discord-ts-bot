import Fastify from 'fastify';
import FastifyWebsocket from '@fastify/websocket'
import cors from '@fastify/cors';

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
      console.log('Received message: ', message);
    });

    connection.socket.send('Hello from WebSocket server');
  },
});

export default fastify;