-- AlterTable
ALTER TABLE "Order" ADD COLUMN "address1" TEXT;
ALTER TABLE "Order" ADD COLUMN "address2" TEXT;
ALTER TABLE "Order" ADD COLUMN "city" TEXT;
ALTER TABLE "Order" ADD COLUMN "country" TEXT;
ALTER TABLE "Order" ADD COLUMN "firstName" TEXT;
ALTER TABLE "Order" ADD COLUMN "instructions" TEXT;
ALTER TABLE "Order" ADD COLUMN "lastName" TEXT;
ALTER TABLE "Order" ADD COLUMN "orderNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN "phone" TEXT;
ALTER TABLE "Order" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "secondaryPhone" TEXT;
ALTER TABLE "Order" ADD COLUMN "state" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "phone" TEXT;
