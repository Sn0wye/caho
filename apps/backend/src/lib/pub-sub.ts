import {} from '@caho/schemas';
import type { Redis } from 'ioredis';
import type { PlayerEvent, RoomEvent } from '@caho/contracts';

type Event = RoomEvent | PlayerEvent;

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
