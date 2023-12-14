import { type WsServerEvent } from '@caho/schemas/ws';
import { type SocketStream } from '@fastify/websocket';

type Socket = SocketStream['socket'];

export class RoomSocketManager {
  private rooms: Map<string, Map<string, Socket>>;

  constructor() {
    this.rooms = new Map();
  }

  // Adds a socket to a specific room and user
  addSocket(roomCode: string, userId: string, socket: Socket): void {
    let userSockets = this.rooms.get(roomCode);

    if (!userSockets) {
      userSockets = new Map();
      this.rooms.set(roomCode, userSockets);
    }

    userSockets.set(userId, socket);
  }

  // Retrieves a socket by room and user
  getSocket(roomCode: string, userId: string): Socket | undefined {
    return this.rooms.get(roomCode)?.get(userId);
  }

  // Removes a socket for a specific room and user
  removeSocket(roomCode: string, userId: string): void {
    this.rooms.get(roomCode)?.delete(userId);
  }

  async broadcast(roomCode: string, event: WsServerEvent): Promise<void> {
    const sockets = this.rooms.get(roomCode);

    if (!sockets) {
      return;
    }

    for (const socket of sockets.values()) {
      socket.send(JSON.stringify(event));
    }
  }
}
