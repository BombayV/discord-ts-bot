import Fastify from 'fastify';
import FastifyWebsocket from '@fastify/websocket'
import cors from '@fastify/cors';
import HostEventManager from "../managers/HostEventManager.js";

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
  method: 'POST',
  url: '/setNickname',
  websocket: false,
  handler: (request, reply) => {
    const { server_id, nickname } = request.body as { server_id: string, nickname: string };
    const host = HostEventManager.getInstance().getHost(server_id);
    if (!host) {
      reply.code(404).send({ message: 'Host not found' });
      return;
    }

    const success = HostEventManager.getInstance().setBotNickname(server_id, nickname);
    if (success) {
      reply.code(200).send({ message: `Nickname set to ${nickname} successfully!` });
    } else {
      reply.code(500).send({ message: 'An error occurred while setting the nickname' });
    }
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
      const { type, data: {
        server_id
      } } = JSON.parse(message.toString());
      switch (type) {
        case 'server_id':
          const manager = HostEventManager.getInstance();
          manager.addHost(server_id);
          // @ts-ignore
          connection.socket.id = server_id;
          // Send a message to the client
          const defaultServerData = manager.getDefaultServerData(server_id);
          connection.socket.send(JSON.stringify({ type: 'default_data', data: defaultServerData }));
          break;
        case 'disconnect':
          HostEventManager.getInstance().removeHost(server_id);
          break;
      }
    });
  },
});

export default fastify;