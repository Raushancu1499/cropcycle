import { Queue } from "bullmq";
import connection from "./redisConnection.js";

export const notificationQueue = new Queue("notification-events", {
  connection
});
