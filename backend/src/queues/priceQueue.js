import { Queue } from "bullmq";
import connection from "./redisConnection.js";

export const priceQueue = new Queue("price-events", {
  connection
});
