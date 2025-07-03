import { writeFile } from 'fs/promises';

const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';

async function main() {
  // Static routes - we'll skip dynamic product routes for now to avoid DB issues
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
    '/orders',
    '/shipping'
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticRoutes.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`),
    '</urlset>'
  ].join('\n');

  await writeFile('../public/sitemap.xml', xml);
  console.log('Sitemap generated successfully!');
}

main()
  .catch(err => {
    console.error('Error generating sitemap:', err);
    process.exit(1);
  });
