import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Eco Water Bottle',
        slug: 'eco-water-bottle',
        price: 19.99,
        description: 'Reusable stainless steel water bottle with insulation.',
        images: ['https://example.com/images/bottle.jpg'],
        stock: 100,
        inStock: true,
        category: 'Accessories',
      },
      {
        name: 'Solar Phone Charger',
        slug: 'solar-phone-charger',
        price: 49.99,
        description: 'Portable solar charger compatible with most smartphones.',
        images: ['https://example.com/images/charger.jpg'],
        stock: 50,
        inStock: true,
        category: 'Electronics',
      },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
