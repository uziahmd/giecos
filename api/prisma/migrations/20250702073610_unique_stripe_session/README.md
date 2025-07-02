# Migration notes

This migration enforces a unique constraint on the `stripeSessionId` column of the `Order` table.

Before running `pnpm prisma migrate deploy`, check for duplicates:

```sql
SELECT "stripeSessionId", COUNT(*)
FROM "Order"
GROUP BY "stripeSessionId"
HAVING COUNT(*) > 1;
```

Remove or merge any duplicate rows before applying the migration.
