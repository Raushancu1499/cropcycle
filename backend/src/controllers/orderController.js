import prisma from "../config/prisma.js";
import { clearMarketplaceCache } from "../utils/cache.js";
import { notificationQueue } from "../queues/notificationQueue.js";
import { io } from "../server.js";



export async function placeOrder(req, res) {
  try {
    const buyerId = req.user.id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array required" });
    }

    // Validate items inside a transaction
    const order = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;

      // Check stock and compute total
      const orderItemsData = await Promise.all(
        items.map(async (cartItem) => {
          const product = await tx.inventoryItem.findUnique({
            where: { id: cartItem.itemId }
          });

          if (!product || !product.isListed) {
            throw new Error(`Item ${cartItem.itemId} unavailable`);
          }

          if (product.quantity < cartItem.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }

          const subtotal = product.listedPrice * cartItem.quantity;
          totalPrice += subtotal;

          await tx.inventoryItem.update({
            where: { id: product.id },
            data: { quantity: product.quantity - cartItem.quantity }
          });

          return {
            itemId: product.id,
            quantity: cartItem.quantity,
            pricePerUnit: product.listedPrice,
            subtotal,
            farmerId: product.farmerId   // keep for notification
          };
        })
      );

       // Extract farmerIds from orderItemsData
  const farmerIds = [...new Set(orderItemsData.map((d) => d.farmerId))];

      const newOrder = await tx.order.create({
        data: {
          buyerId,
          totalPrice,
          items: {
            create: orderItemsData.map(({ farmerId, ...rest }) => rest) // don't store farmerId here
          }
        },
        include: { items: true }
      });

     // attach farmerIds so outside transaction we can notify
  return { newOrder, farmerIds };
    });

    const { newOrder, farmerIds } = order;

// enqueue notification job
await notificationQueue.add("order-placed", {
  type: "ORDER_PLACED",
  orderId: newOrder.id,
  buyerId,
  farmerIds
});

console.log("EMIT TO FARMERS:", farmerIds);

farmerIds.forEach(fid => {
  const room = `user:${fid}`;
  console.log("Emitting to room:", room);
  io.to(room).emit("new-order", {
    orderId: newOrder.id,
    buyerId
  });
});


    await clearMarketplaceCache();
    res.status(201).json({ order : newOrder });
  } catch (err) {
    console.error("placeOrder:", err.message);
    res.status(400).json({ error: err.message });
  }
}


export async function getOrdersForFarmer(req, res) {
  try {
    const farmerId = req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        items: { some: { item: { farmerId } } } // Orders that include farmer's items
      },
      include: {
        items: true
      }
    });

    res.json({ orders });
  } catch (err) {
    console.error("getOrdersForFarmer:", err);
    res.status(500).json({ error: "Server error" });
  }
}


export async function listOrders(req, res) {
  try {
    const buyerId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { buyerId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            item: {
              select: { name: true, unit: true, farmer: { select: { name: true } } }
            }
          }
        }
      }
    });
    res.json({ orders });
  } catch (err) {
    console.error("listOrders:", err);
    res.status(500).json({ error: "Server error" });
  }
}
