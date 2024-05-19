import { blackCard, playerSchema, roomSchema, whiteCard } from '@caho/schemas';
import type { Redis } from 'ioredis';
import { z } from 'zod';

type RoomEvent = z.infer<typeof roomEvent>;
type PlayerEvent = z.infer<typeof playerEvent>;
type Event = RoomEvent | PlayerEvent;

const roomEvent = z.union([
  z.object({
    event: z.literal('message'),
    payload: z.object({ message: z.string() })
  }),
  z.object({
    event: z.literal('player-joined'),
    payload: playerSchema
  }),
  z.object({
    event: z.literal('player-update'),
    payload: playerSchema
  }),
  z.object({
    event: z.literal('room-started'),
    payload: roomSchema
  }),
  z.object({
    event: z.literal('black-card-drawn'),
    payload: blackCard
  })
]);

const playerEvent = z.union([
  z.object({
    event: z.literal('cards-drawn'),
    payload: z.array(whiteCard).length(6)
  }),
  z.object({
    event: z.literal('cards-drawn'),
    payload: z.array(whiteCard).length(6)
  })
]);

export class Pubsub {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  public async publish(channel: string, event: Event): Promise<void> {
    await this.redis.publish(channel, JSON.stringify(event));
  }

  public async subscribe(channel: string, cb: (event: Event) => void) {
    const sub = this.redis.duplicate();

    sub.on('message', (_, message) => {
      cb(JSON.parse(message));
    });

    await sub.subscribe(channel);
  }
}
