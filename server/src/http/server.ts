import Fastify from 'fastify';
import FastifyWebsocket from '@fastify/websocket'

const fastify = Fastify();
fastify.register(FastifyWebsocket);

// // @ts-ignore
// fastify.route({
//   method: 'GET',
//   url: '/',
//   websocket: false,
//   handler: (request, reply) => {
//     reply.code(200).send({ message: 'Hello from Fastify!' });
//   },
// })
//
// fastify.route({
//   method: 'GET',
//   url: '/ws',
//   handler: (request, reply) => {
//     reply.code(200).send({ message: 'Use a WebSocket client to connect' });
//   },
//   wsHandler: (connection, request) => {
//     connection.socket.on('message', (message) => {
//       console.log('Received message: ', message);
//     });
//
//     connection.socket.send('Hello from WebSocket server');
//   },
// });
export default fastify;