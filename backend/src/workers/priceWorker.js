import { Worker } from "bullmq";
import connection from "../queues/redisConnection.js";
import prisma from "../config/prisma.js";

const worker = new Worker(
  "price-events",
  async (job) => {
    const { itemId, price } = job.data;
    console.log("[PriceWorker] Recording price change:", job.data);

    await prisma.priceHistory.create({
      data: {
        itemId,
        price
      }
    });
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
  console.log(`[PriceWorker] Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`[PriceWorker] Job failed: ${job?.id}`, err);
});
