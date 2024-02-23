// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import Client from 'socket.io-client';

describe.todo('socket.io');

// describe.todo('socket.io', () => {
//   let io = null;
//   let serverSocket = null;
//   let clientSocket = null;

//   beforeAll(done => {
//     const httpServer = createServer();
//     io = new Server(httpServer);
//     httpServer.listen(() => {
//       const port = httpServer.address().port;
//       io.on('connection', socket => {
//         serverSocket = socket;
//       });
//       clientSocket = new Client(`http://localhost:${port}`);
//       clientSocket.on('connect', done);
//     });
//   });

//   afterAll(() => {
//     io.close();
//     clientSocket.close();
//   });
// });
