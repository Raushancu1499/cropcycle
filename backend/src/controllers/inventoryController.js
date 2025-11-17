import {
  createInventoryItem,
  getInventoryForFarmer,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem
} from "../models/inventoryModel.js";

export async function createItem(req, res) {
  try {
    const farmerId = req.user.id;
    const { name, description, category, unit, quantity, basePrice } = req.body;

    if (!name || !unit || quantity == null || basePrice == null) {
      return res.status(400).json({ error: "name, unit, quantity, basePrice are required" });
    }

    const item = await createInventoryItem(farmerId, {
      name,
      description,
      category,
      unit,
      quantity: Number(quantity),
      basePrice: Number(basePrice)
    });

    res.status(201).json({ item });
  } catch (err) {
    console.error("createItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function listMyInventory(req, res) {
  try {
    const farmerId = req.user.id;
    const items = await getInventoryForFarmer(farmerId);
    res.json({ items });
  } catch (err) {
    console.error("listMyInventory error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getMyItem(req, res) {
  try {
    const farmerId = req.user.id;
    const id = Number(req.params.id);

    const item = await getInventoryItemById(id, farmerId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json({ item });
  } catch (err) {
    console.error("getMyItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function updateMyItem(req, res) {
  try {
    const farmerId = req.user.id;
    const id = Number(req.params.id);
    const { name, description, category, unit, quantity, basePrice } = req.body;

    const result = await updateInventoryItem(id, farmerId, {
      name,
      description,
      category,
      unit,
      quantity: Number(quantity),
      basePrice: Number(basePrice)
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Item not found or not yours" });
    }

    res.json({ message: "Item updated" });
  } catch (err) {
    console.error("updateMyItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function removeMyItem(req, res) {
  try {
    const farmerId = req.user.id;
    const id = Number(req.params.id);

    const result = await deleteInventoryItem(id, farmerId);
    if (result.count === 0) {
      return res.status(404).json({ error: "Item not found or not yours" });
    }

    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("removeMyItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
