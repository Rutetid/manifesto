import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const secondaryStorage = {
  get: async (key: string) => {
    const data = await redis.get(key);
    return data ? JSON.stringify(data) : null;
  },
  set: async (key: string, value: string, ttl?: number) => {
    if (ttl) {
      await redis.set(key, value, { ex: ttl });
    } else {
      await redis.set(key, value);
    }
  },
  delete: async (key: string) => {
    await redis.del(key);
  },
};
