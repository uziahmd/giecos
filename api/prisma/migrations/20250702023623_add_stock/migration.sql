-- AlterTable
ALTER TABLE "Order" ADD COLUMN "stripeSessionId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "images" JSONB NOT NULL DEFAULT [],
    "stock" INTEGER NOT NULL DEFAULT 0,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_Product" ("category", "description", "id", "images", "inStock", "name", "price", "slug") SELECT "category", "description", "id", "images", "inStock", "name", "price", "slug" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
