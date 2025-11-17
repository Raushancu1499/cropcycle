import { Worker } from "bullmq";
import connection from "../queues/redisConnection.js";

const worker = new Worker(
  "notification-events",
async (job) => {
    const { type, orderId, buyerId, farmerIds } = job.data;

    if (type === "ORDER_PLACED") {
      console.log(
        `[NotificationWorker] New order ${orderId} placed by buyer ${buyerId} for farmers:`,
        farmerIds
      );
      // Later: for keepin or send of email/SMS/WebSocket etc.
} else {
      console.log("[NotificationWorker] unknown job type:", type);
    }
  },
   {
    connection: {
      ...connection.options,
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    }
  }
);

worker.on("completed", (job) => {
  console.log(`[NotificationWorker] Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`[NotificationWorker] Job failed: ${job?.id}`, err);
});
