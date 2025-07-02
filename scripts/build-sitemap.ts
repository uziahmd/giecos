import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import slugify from 'slugify';
import 'dotenv/config';

const prisma = new PrismaClient();
const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';

async function main() {
  const products = await prisma.product.findMany({ select: { name: true } });
  const slugs = products.map(p => slugify(p.name, { lower: true }));

  const staticRoutes = [
    '/',
    '/shop',
    '/cart',
    '/success',
    '/about',
    '/contact',
    '/login',
    '/signup',
    '/verify-otp',
    '/admin',
    '/account/orders'
  ];

  const urls = [
    ...staticRoutes,
    ...slugs.map(s => `/product/${s}`)
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`),
    '</urlset>'
  ].join('\n');

  await writeFile('public/sitemap.xml', xml);
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
