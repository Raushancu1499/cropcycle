import prisma from "../config/prisma.js";

export async function createInventoryItem(farmerId, data) {
  return prisma.inventoryItem.create({
    data: {
      farmerId,
      name: data.name,
      description: data.description ?? null,
      category: data.category ?? null,
      unit: data.unit,
      quantity: data.quantity,
      basePrice: data.basePrice
    }
  });
}

export async function getInventoryForFarmer(farmerId) {
  return prisma.inventoryItem.findMany({
    where: { farmerId },
    orderBy: { createdAt: "desc" }
  });
}

export async function getInventoryItemById(id, farmerId) {
  return prisma.inventoryItem.findFirst({
    where: { id, farmerId }
  });
}

export async function updateInventoryItem(id, farmerId, data) {
  return prisma.inventoryItem.updateMany({
    where: { id, farmerId },
    data: {
      name: data.name,
      description: data.description ?? null,
      category: data.category ?? null,
      unit: data.unit,
      quantity: data.quantity,
      basePrice: data.basePrice
    }
  });
}

export async function deleteInventoryItem(id, farmerId) {
  return prisma.inventoryItem.deleteMany({
    where: { id, farmerId }
  });
}
