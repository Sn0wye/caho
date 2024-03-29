import { cardSchema, playerSchema, roomSchema } from '@caho/schemas';
import { z } from 'zod';

type Subscriber = (event: Event) => void;
type RoomEvent = z.infer<typeof roomEvent>;

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
  })
]);

const playerEvent = z.union([
  z.object({
    event: z.literal('cards-drawn'),
    payload: z.array(cardSchema).length(6)
  }),
  z.object({
    event: z.literal('cards-drawn'),
    payload: z.array(cardSchema).length(6)
  })
]);

export type PlayerEvent = z.infer<typeof playerEvent>;
type Event = RoomEvent | PlayerEvent;

class PubSub {
  private channels: Record<string, Subscriber[]> = {};

  subscribe(channel: string, subscriber: Subscriber) {
    if (!this.channels[channel]) {
      this.channels[channel] = [];
    }

    this.channels[channel].push(subscriber);
  }

  publish(channel: string, event: Event) {
    if (!this.channels[channel]) {
      return;
    }

    for (const subscriber of this.channels[channel]) {
      subscriber(event);
    }
  }
}

export const pubsub = new PubSub();
