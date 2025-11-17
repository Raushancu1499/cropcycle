import prisma from "../config/prisma.js";

export async function createUser(name, email, passwordHash, role) {
  return prisma.user.create({
    data: { name, email, passwordHash, role }
  });
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email }
  });
}
