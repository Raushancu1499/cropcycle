import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!["FARMER", "BUYER"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hash, role);

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const userRecord = await findUserByEmail(email);

    if (!userRecord) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: userRecord.id, role: userRecord.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: userRecord.id, role: userRecord.role }
    });

  } catch (err) {
    console.error("login:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

