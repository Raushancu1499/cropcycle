import prisma from "../config/prisma.js";
import { getCache, setCache } from "../utils/cache.js";
import { clearMarketplaceCache } from "../utils/cache.js";
import { priceQueue } from "../queues/priceQueue.js";



export async function browseMarketplace(req, res) {
  try {
    const { search, category, minPrice, maxPrice, skip = 0, take = 20 } = req.query;

    // 1) Build cache key from query
    const cacheKey = `marketplace:${search || ""}:${category || ""}:${
      minPrice || ""
    }:${maxPrice || ""}:${skip}:${take}`;

    // 2) Try cache
    const cached = await getCache(cacheKey);
    if (cached) {
      // console.log("CACHE HIT", cacheKey);
      return res.json({ items: cached, cached: true });
    }

    // 3) Build Prisma filter
    const where = {
      isListed: true,
      quantity: { gt: 0 }
    };

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    if (category) where.category = category;

    if (minPrice || maxPrice) {
      where.listedPrice = {};
      if (minPrice) where.listedPrice.gte = Number(minPrice);
      if (maxPrice) where.listedPrice.lte = Number(maxPrice);
    }

    // 4) Query DB
    const items = await prisma.inventoryItem.findMany({
      where,
      skip: Number(skip),
      take: Number(take),
      orderBy: { listedPrice: "asc" },
      include: {
        farmer: { select: { name: true } }
      }
    });

    // 5) Store in cache (TTL = 60s for now)
    await setCache(cacheKey, items, 60);

    res.json({ items, cached: false });
  } catch (err) {
    console.error("browseMarketplace:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function listItem(req, res) {
  try {
    const farmerId = req.user.id;
    const id = Number(req.params.id);
    const { listedPrice } = req.body;

    if (!listedPrice) {
      return res.status(400).json({ error: "listedPrice is required" });
    }
    const numericPrice = Number(listedPrice);  // ← Define BEFORE USE

    const result = await prisma.inventoryItem.updateMany({
      where: { id, farmerId },
      data: { isListed: true, listedPrice: Number(listedPrice) }
    });

    if (result.count === 0)
      return res.status(404).json({ error: "Item not found or not yours" });

    // enqueue async job
await priceQueue.add("price-changed", {
  itemId: id,
  price: numericPrice
});

    await clearMarketplaceCache();

    res.json({ message: "Item listed on marketplace" });
  } catch (err) {
    console.error("listItem:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function unlistItem(req, res) {
  try {
    const farmerId = req.user.id;
    const id = Number(req.params.id);

    const result = await prisma.inventoryItem.updateMany({
      where: { id, farmerId },
      data: { isListed: false }
    });

    if (result.count === 0)
      return res.status(404).json({ error: "Item not found or not yours" });

     await clearMarketplaceCache();

    res.json({ message: "Item removed from marketplace" });
  } catch (err) {
    console.error("unlistItem:", err);
    res.status(500).json({ error: "Server error" });
  }
}
