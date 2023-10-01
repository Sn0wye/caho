// import { type CreateRoom } from '@caho/contracts';
// import { type Player, type Room } from '@caho/schemas';
// import { beforeEach, describe, expect, it } from 'bun:test';
// import { MockRoomRepository } from '@/repositories/implementations/MockRoomRepository';
// import { type IRoomRepository } from '@/repositories/IRoomRepository';

// describe('MockRoomRepository', () => {
//   let repo: IRoomRepository;
//   beforeEach(() => {
//     repo = new MockRoomRepository();
//   });

//   it('should create a room', async () => {
//     const room: CreateRoom = {
//       hostId: '1',
//       maxPlayers: 10,
//       isPublic: true,
//       password: 'test',
//       maxPoints: 5,
//       players: []
//     };

//     const createdRoom: Room = await repo.createRoom(room);
//     expect(createdRoom).toMatchObject({
//       status: 'LOBBY',
//       ...room
//     });
//     expect(createdRoom.code.startsWith('mock_')).toBeTruthy();
//     expect(createdRoom.id.startsWith('mock_')).toBeTruthy();
//   });

//   // it('should throw error when getting a non-existing room', async () => {
//   //   expect(repo.getRoom('invalid_code')).rejects.toThrow();
//   // });

//   it('should add player to room', async () => {
//     const room: CreateRoom = {
//       hostId: '1',
//       maxPlayers: 10,
//       isPublic: true,
//       password: 'test',
//       maxPoints: 5,
//       players: []
//     };
//     const createdRoom = await repo.createRoom(room);

//     const player: Player = {
//       id: '2',
//       score: 0,
//       isHost: false,
//       username: 'test'
//     };
//     await repo.addPlayerToRoom({ roomCode: createdRoom.code, player });
//     const updatedRoom = await repo.getRoom(createdRoom.code);

//     expect(updatedRoom.players).toContain(player);
//   });

//   // it('should throw error when adding player to non-existing room', async () => {
//   //   const player: Player = {
//   //     id: '2',
//   //     score: 0,
//   //     isHost: false,
//   //     username: 'test'
//   //   };

//   //   expect(
//   //     repo.addPlayerToRoom({ roomCode: 'invalid_code', player })
//   //   ).toThrow();
//   // });

//   it('should list public rooms', async () => {
//     const room1: CreateRoom = {
//       hostId: '1',
//       maxPlayers: 10,
//       isPublic: true,
//       password: 'test',
//       maxPoints: 5,
//       players: []
//     };
//     const room2: CreateRoom = {
//       hostId: '2',
//       maxPlayers: 5,
//       isPublic: true,
//       password: 'test2',
//       maxPoints: 5,
//       players: []
//     };

//     const createdRoom1 = await repo.createRoom(room1);
//     const createdRoom2 = await repo.createRoom(room2);

//     const publicRooms: Room[] = await repo.listPublicRooms();
//     expect(publicRooms).toContain(createdRoom1);
//     expect(publicRooms).toContain(createdRoom2);
//   });

//   //... Continue this pattern for the rest of the methods like startRoom, endRoom, joinRoom, leaveRoom, etc.
// });
