import redis from "../config/redisClient.js";

export async function getCache(key) {
  const cached = await redis.get(key);
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

export async function setCache(key, value, ttlSeconds = 60) {
  const json = JSON.stringify(value);
  if (ttlSeconds > 0) {
    await redis.setex(key, ttlSeconds, json);
  } else {
    await redis.set(key, json);
  }
}

export async function clearMarketplaceCache() {
  // For now: brutally clear all keys related to marketplace
  // In production you'd be more surgical.
  const pattern = "marketplace:*";
  const stream = redis.scanStream({ match: pattern });
  const keys = [];
  for await (const resultKeys of stream) {
    for (const key of resultKeys) {
      keys.push(key);
    }
  }
  if (keys.length) {
    await redis.del(keys);
  }
}
