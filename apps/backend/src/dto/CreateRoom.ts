export type CreateRoomDTO = {
  maxPlayers: number;
  maxPoints: number;
  hostId: string;
  password: string | null;
  isPublic: boolean;
};
