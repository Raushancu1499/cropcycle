-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "isListed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "listedPrice" DOUBLE PRECISION;
