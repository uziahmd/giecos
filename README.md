# Giecos Solution

A full‑stack demo storefront built with **Vite**, **React**, **Fastify**, and **Prisma**. The front‑end resides in the `src/` directory, and the backend API lives under `api/`. This starter kit is configured with TypeScript, Tailwind CSS, React Query, and Radix UI.
It relies on **React Query** for fetching and caching server data across the application.
Requires Node.js 20 or newer.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [Development](#development)
8. [Scripts](#scripts)
9. [Testing & Linting](#testing--linting)
10. [Manual Testing Checklist](#manual-testing-checklist)
11. [API Endpoints](#api-endpoints)
12. [Authentication Workflow](#authentication-workflow)
13. [Checkout Flow](#checkout-flow)
14. [Order History](#order-history)
15. [Image Uploading](#image-uploading)
16. [Refund Flow](docs/refund-flow.md)
17. [Sitemap Generation](#sitemap-generation)
18. [Lighthouse CI](#lighthouse-ci)
19. [Building for Production](#building-for-production)
20. [Project Structure](#project-structure)

---

## 🚀 Features

* **Product Catalog**: Browse, search, filter, and sort products.
* **Product Details**: View detailed information and add to cart.
* **Shopping Cart**: Add, update, and remove items with real-time totals and persistent storage.
* **Authentication**: Email signup/login with JWT-based protection.
* **Admin Dashboard**: Manage products with image uploads and issue refunds.
* **Contact Form**: Sends inquiries via API endpoint with confirmation toasts.
* **Responsive Design**: Optimized for desktop, tablet, and mobile.

---

## 🔧 Prerequisites

* **Node.js** v20 or newer
* **pnpm** package manager

Install `pnpm` globally if needed:

```bash
npm install -g pnpm
```

---

## 🛠 Installation

1. **Clone the repo**

   ```bash
   ```

git clone <repo-url> giecos && cd giecos

````
2. **Install dependencies**
```bash
pnpm install
pnpm --filter ./api install
````
3. **Generate Prisma client**
```bash
pnpm --filter ./api exec prisma generate
````

---

## ⚙️ Configuration

1. Copy the environment sample:

```bash
cp .env.example api/.env
```
2. Edit `api/.env` and set values similar to:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret"
PORT="4000"
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM="noreply@example.com"
OTP_EXP_MINUTES="15"
AIRWALLEX_CLIENT_ID="your-client-id"
AIRWALLEX_API_KEY="your-api-key"
AIRWALLEX_WEBHOOK_SECRET="whsec_example"
FRONTEND_URL="http://localhost:5173"
SITE_URL="http://localhost:5173"
```
---

## 🗝 Environment Variables

The backend uses the following variables:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Database connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `PORT` | API server port (defaults to `4000`) |
| `RESEND_API_KEY` | Credentials for the Resend email service |
| `RESEND_FROM` | From address for sent emails |
| `OTP_EXP_MINUTES` | Minutes before OTP codes expire |
| `AIRWALLEX_CLIENT_ID` | Client ID for Airwallex API |
| `AIRWALLEX_API_KEY` | API key for Airwallex |
| `AIRWALLEX_WEBHOOK_SECRET` | Airwallex webhook signing secret |
| `FRONTEND_URL` | Frontend URL used in checkout redirects |
| `SITE_URL` | Canonical domain for the frontend |

Create an Airwallex account and open the **Developer** dashboard. Generate a
client ID and API key under **API Keys** and copy the webhook signing secret from
the **Webhooks** section. Use these test credentials in your `.env` file when
running locally.

---

## 🗄 Database Setup

Run migrations and seed data:

```bash
pnpm prisma migrate dev    # Apply or create migrations
pnpm run seed             # Populate sample data
````
If you pull new migrations from version control, run `pnpm prisma migrate dev`
again to update your local database.

---

## 👩‍💻 Development

Open two terminal sessions:

1. **Start the backend API**

   ```bash
   ```

pnpm dev\:api

````
   - Server runs at `http://localhost:4000` under `/api`.

2. **Start the front‑end**
   ```bash
pnpm dev
````

* Vite dev server at `http://localhost:8080`, proxies `/api` requests.

Visit `http://localhost:8080` to view the app.

---

## 📜 Scripts

Run common tasks from the project root:

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `pnpm dev`           | Start Vite frontend server    |
| `pnpm dev:api`       | Start Fastify backend server  |
| `pnpm run build`     | Build frontend for production |
| `pnpm run preview`   | Preview production build      |
| `pnpm run lint`      | Run ESLint                    |
| `pnpm run format`    | Format code with Prettier     |
| `pnpm prisma:studio` | Open Prisma Studio GUI        |

---
## ✅ Testing & Linting

- **API tests**:
  The API test suite needs a few environment variables. Copy the sample file and
  then run the tests:
  ```bash
  cp api/.env.test.example api/.env
  pnpm --filter ./api run test
  ```
  Required variables include `DATABASE_URL`, `JWT_SECRET`, `RESEND_API_KEY`,
  `RESEND_FROM`, `OTP_EXP_MINUTES`, `AIRWALLEX_CLIENT_ID`,
  `AIRWALLEX_API_KEY`, `AIRWALLEX_WEBHOOK_SECRET`, and `FRONTEND_URL`.

- **Playwright tests** (requires the frontend and API servers to be running):
  ```bash
  pnpm exec playwright install
  pnpm run test:e2e
  ```

- **Linting**:
  ```bash
  pnpm run lint
  ```

- **Formatting**:
  ```bash
  pnpm run format
  ```
(Configure and run tests if added in the future.)

---

## 🧪 Manual Testing Checklist

1. **API**: `curl http://localhost:4000/api/products` returns product list.
2. **Home Page**: Promo banner, trending section, featured collections load.
3. **Shop Page**: Products display; filtering, search, sorting work.
4. **Product Detail**: `/product/:slug` shows details; cart addition works.
5. **Cart**: Add, update, remove items; totals and localStorage update.
6. **Authentication**: Signup/login flows and toasts display correctly.
7. **Admin Dashboard**: In-memory add/edit/delete products.

8. **Contact Form**: Submission logs message and shows toast.
9. **404 Page**: Unknown routes show custom 404 message.

---

## 🔗 API Endpoints

The backend exposes REST endpoints for managing products and initiating checkout.

**Product Management**

| Method & Path | Description | Auth |
| --- | --- | --- |
| `GET /api/products` | List all products | none |
| `POST /api/products` | Create a product | admin |
| `PATCH /api/products/:id` | Update a product | admin |
| `DELETE /api/products/:id` | Remove a product | admin |

---

## 🔐 Authentication Workflow

1. **Signup** – users register with name, email, and password. An OTP code is
   emailed for verification.
2. **Verify OTP** – posting the code to `/api/otp/verify` confirms the account
   and clears the temporary OTP fields.
3. **Login** – a JWT token cookie is issued on successful credentials and used
   for authenticated requests via the `/api/me` endpoint.

---

## 🛒 Checkout Flow

Airwallex payment intents are used to collect payments.

```
Cart -> POST /api/checkout -> Airwallex intent
     -> user pays
Airwallex -> POST /api/airwallex/webhook -> order marked PAID -> receipt email
```

Set `AIRWALLEX_CLIENT_ID`, `AIRWALLEX_API_KEY`, `AIRWALLEX_WEBHOOK_SECRET`, and `FRONTEND_URL` in `.env`. Configure a webhook in your Airwallex dashboard for `payment_intent.succeeded` events pointing to `/api/airwallex/webhook`.

---

## 📜 Order History

After completing a purchase the `/success` page fetches your most recent order via `/api/orders/latest`. A full list of previous orders is available at `/account/orders` and through the `/api/orders` endpoint.

---

## 🗺️ Sitemap Generation

Run `pnpm run sitemap` to generate `public/sitemap.xml`. The script reads product slugs from the database and uses `SITE_URL` to build absolute URLs. It runs automatically after `pnpm run build`.

---

## 📊 Lighthouse CI

Performance budgets are enforced with [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci). Execute `pnpm exec lhci autorun` to run the checks locally. The same command runs in CI using `.github/workflows/lighthouse.yml`.

---

## 📦 Building for Production

1. **Build frontend**:

   ```bash
   ```

pnpm run build

````
2. **Preview build**:
   ```bash
pnpm run preview
````

The optimized assets output to `dist/`.

---

## 📂 Project Structure

```
/ (repo root)
├─ api/                # Fastify + Prisma backend
│  ├─ src/             # Source code (routes, plugins, env)
│  ├─ prisma/          # Schema and migrations
│  └─ .env             # Environment variables
├─ src/                # React frontend
│  ├─ components/      # UI components (Radix + custom)
│  ├─ pages/           # Route-based pages
│  ├─ styles/          # Tailwind CSS configs and globals
│  └─ main.tsx         # React entrypoint
├─ public/             # Static assets
├─ package.json        # Workspace & scripts
├─ pnpm-workspace.yaml # Monorepo filters
└─ tailwind.config.ts  # Tailwind customization
```

---

*Last updated: July 1, 2025*

## 📷 Image Uploading

Product images can be uploaded via the `/api/products/upload` endpoint. The admin UI allows selecting a file which is resized server-side using Sharp and served from `/uploads`.
