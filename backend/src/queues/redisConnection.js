import IORedis from "ioredis";

const queueConnection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

export default queueConnection;
