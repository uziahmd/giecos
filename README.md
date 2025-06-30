# Giecos Solution

This project is a full‑stack demo storefront built with **Vite**, **React**, **Fastify** and **Prisma**.  The front‑end lives in the root `src` directory while the API is located in [`api/`](api/).  The app is configured for TypeScript, TailwindCSS, React Query and Radix UI components.

## Prerequisites

- **Node.js** 18 or newer
- **npm** (comes with Node) and **pnpm** for the API workspace

Install pnpm globally if you don’t have it:

```bash
npm install -g pnpm
```

## Setup

1. **Clone the repository**
   ```bash
git clone <repo-url> && cd giecos
   ```
2. **Install root dependencies**
   ```bash
npm install
   ```
3. **Install API dependencies**
   ```bash
pnpm --filter ./api install
   ```
4. **Create environment variables**
   Copy `.env.sample` to `api/.env` and adjust values as needed.  At minimum set `DATABASE_URL` (SQLite by default) and any JWT secret or custom port.
   ```bash
cp .env.sample api/.env
   ```
5. **Run database migrations** and seed sample data:
   ```bash
# apply migrations
npm run prisma migrate dev

# seed the database
pnpm --filter ./api exec ts-node prisma/seed.ts
   ```

## Development

Open two terminals:

1. **Start the API**
   ```bash
npm run dev:api
   ```
   The server listens on `http://localhost:4000` and exposes endpoints under `/api`.

2. **Start the front‑end**
   ```bash
npm run dev
   ```
   Vite serves the React app on `http://localhost:8080` and proxies API requests to the backend.

Navigate to `http://localhost:8080` in your browser to explore the storefront.

### Linting
Run ESLint over the project with:
```bash
npm run lint
```

## Manual Testing Checklist

After the servers are running you can verify features end‑to‑end:

1. **API** – Request the product list to ensure the database works:
   ```bash
curl http://localhost:4000/api/products
   ```
2. **Home page** – Loads promo banner, trending section and featured collections.
3. **Shop page** – Displays products from the API. Test filtering, search and sort.
4. **Product detail** – Accessible via `/product/:slug`. Add items to the cart from this page.
5. **Cart** – Adding, updating and removing items should update totals and local storage.
6. **Login / Signup** – Submit forms and observe toast notifications.
7. **Admin page** – Add, edit and delete products in-memory.
8. **Contact form** – Submitting should log the message and show a toast.
9. **Not Found** – Navigating to an unknown route should show the 404 page.

## Building for Production

Create an optimized build of the front‑end:
```bash
npm run build
```
The output goes to `dist/`.  You can preview it locally using:
```bash
npm run preview
```

---
This guide covers the current implementation of the project.  Future features may require additional setup.
