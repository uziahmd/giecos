# Giecos Solution

A full-stack demo storefront built with **Vite**, **React**, **Fastify**, and **Prisma**. The front-end resides in the `src/` directory, and the backend API lives under `api/`. This starter kit is configured with TypeScript, Tailwind CSS, React Query, and Radix UI and integrates **Airwallex** for payment processing. It relies on React Query for fetching and caching server data across the application.

Requires Node.js v20 or newer.

---

## 📋 Table of Contents

1. [Features](#features)  
2. [Prerequisites](#prerequisites)  
3. [Installation](#installation)  
4. [Configuration](#configuration)  
5. [Environment Variables](#environment-variables)  
6. [Database Setup](#database-setup)  
7. [Admin Account](#admin-account)  
8. [Development](#development)  
9. [Scripts](#scripts)  
10. [Testing & Linting](#testing--linting)  
11. [Manual Testing Checklist](#manual-testing-checklist)  
12. [API Endpoints](#api-endpoints)  
13. [Authentication Workflow](#authentication-workflow)  
14. [Checkout Flow](#checkout-flow)  
15. [Order History](#order-history)  
16. [Image Uploading](#image-uploading)  
17. [Refund Flow](docs/refund-flow.md)  
18. [Sitemap Generation](#sitemap-generation)  
19. [Building for Production](#building-for-production)  
20. [Project Structure](#project-structure)  

---

## 🚀 Features

- **Product Catalog**: Browse, search, filter, and sort products.  
- **Product Details**: View detailed information and add to cart.  
- **Shopping Cart**: Add, update, and remove items with real-time totals and persistent storage.  
- **Airwallex Payments**: Secure checkout using Airwallex payment intents.  
- **Authentication**: Email signup/login with JWT-based protection.  
- **Admin Dashboard**: Manage products with image uploads and issue refunds.  
- **Shipping Form**: Collect shipping details before payment.  
- **Contact Form**: Sends inquiries via API endpoint with confirmation toasts.  
- **Admin Notifications**: Emails the admin when orders are paid.  
- **Responsive Design**: Optimized for desktop, tablet, and mobile.  

---

## 🔧 Prerequisites

- **Node.js** v20 or newer  
- **pnpm** package manager  

Install `pnpm` globally if needed:

```bash
npm install -g pnpm
# Giecos Solution

A full‑stack demo storefront built with **Vite**, **React**, **Fastify**, and **Prisma**. The front‑end resides in the `src/` directory, and the backend API lives under `api/`. This starter kit is configured with TypeScript, Tailwind CSS, React Query, and Radix UI, and integrates **Airwallex** for payment processing. It relies on **React Query** for fetching and caching server data across the application.

> **Requirement:** Node.js 20 or newer.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Prerequisites](#-prerequisites)
3. [Installation](#-installation)
4. [Configuration](#-configuration)
5. [Environment Variables](#-environment-variables)
6. [Database Setup](#-database-setup)
7. [Admin Account](#-admin-account)
8. [Development](#-development)
9. [Scripts](#-scripts)
10. [Testing & Linting](#-testing--linting)
11. [Manual Testing Checklist](#-manual-testing-checklist)
12. [API Endpoints](#-api-endpoints)
13. [Authentication Workflow](#-authentication-workflow)
14. [Checkout Flow](#-checkout-flow)
15. [Order History](#-order-history)
16. [Image Uploading](#-image-uploading)
17. [Sitemap Generation](#-sitemap-generation)
18. [Building for Production](#-building-for-production)
19. [Project Structure](#-project-structure)

---

## 🚀 Features

* **Product Catalog:** Browse, search, filter, and sort products.
* **Product Details:** View detailed information and add to cart.
* **Shopping Cart:** Add, update, and remove items with real‑time totals and persistent storage.
* **Airwallex Payments:** Secure checkout using Airwallex payment intents.
* **Authentication:** Email signup/login with JWT‑based protection.
* **Admin Dashboard:** Manage products with image uploads and issue refunds.
* **Shipping Form:** Collect shipping details before payment.
* **Contact Form:** Send inquiries via API endpoint with confirmation toasts.
* **Admin Notifications:** Email the admin when orders are paid.
* **Responsive Design:** Optimized for desktop, tablet, and mobile.

---

## 🔧 Prerequisites

* **Node.js 20** (or newer)
* **pnpm** package manager

Install **pnpm** globally if needed:

```bash
npm install -g pnpm
```

---

## 🛠 Installation

1. **Clone the repo**

   ```bash
   git clone <repo‑url> giecos && cd giecos
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   pnpm --filter ./api install
   ```

3. **Generate Prisma client**

   ```bash
   pnpm --filter ./api exec prisma generate
   ```

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
   ADMIN_EMAIL="admin@example.com"
   OTP_EXP_MINUTES="15"
   AIRWALLEX_CLIENT_ID="your-client-id"
   AIRWALLEX_API_KEY="your-api-key"
   AIRWALLEX_WEBHOOK_SECRET="whsec_example"
   FRONTEND_URL="http://localhost:5173"
   SITE_URL="http://localhost:5173"
   ```

---

## 🗝 Environment Variables

| Variable                   | Description                               |
| -------------------------- | ----------------------------------------- |
| `DATABASE_URL`             | Database connection string                |
| `JWT_SECRET`               | Secret for signing JWTs                   |
| `PORT`                     | API server port (defaults to `4000`)      |
| `RESEND_API_KEY`           | Credentials for the Resend email service  |
| `RESEND_FROM`              | From address for sent emails              |
| `ADMIN_EMAIL`              | Address that receives order notifications |
| `OTP_EXP_MINUTES`          | Minutes before OTP codes expire           |
| `AIRWALLEX_CLIENT_ID`      | Client ID for Airwallex API               |
| `AIRWALLEX_API_KEY`        | API key for Airwallex                     |
| `AIRWALLEX_WEBHOOK_SECRET` | Airwallex webhook signing secret          |
| `FRONTEND_URL`             | Frontend URL used in checkout redirects   |
| `SITE_URL`                 | Canonical domain for the frontend         |

Create an Airwallex account and open the **Developer** dashboard. Generate a client ID and API key under **API Keys** and copy the webhook signing secret from the **Webhooks** section. Use these **test credentials** in your `.env` file when running locally.

Set `ADMIN_EMAIL` to the address that should receive order‑paid notifications. Emails are sent via the Resend API using the `RESEND_*` credentials.

---

## 🗄 Database Setup

Run migrations and seed data:

```bash
pnpm prisma migrate dev   # apply existing migrations or create new
pnpm run seed             # populate sample data
```

If you pull new migrations from version control, run `pnpm prisma migrate dev` again to update your local database.

---

## 🛡️ Admin Account

To manage products and orders you’ll need at least one **admin** user. Launch Prisma Studio and edit the `isAdmin` field:

```bash
pnpm prisma:studio
```

Locate your user record in the **User** table and set `isAdmin` to `true` (or use any database tool to do the same). Logging in with this account grants access to `/admin` for full CRUD operations.

---

## 👩‍💻 Development

Open **two** terminal sessions:

1. **Start the backend API**

   ```bash
   pnpm dev:api
   ```

   * Server runs at `http://localhost:4000` under `/api`.

2. **Start the front‑end**

   ```bash
   pnpm dev
   ```

   * Vite dev server at `http://localhost:5173`; proxies `/api` requests.

Visit `http://localhost:5173` to view the app.

---

## 📜 Scripts

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

## ✅ Testing & Linting

### API Tests

Copy the sample file, then run the tests:

```bash
cp api/.env.test.example api/.env
pnpm --filter ./api run test
```

### Playwright End‑to‑End Tests

(Requires the frontend and API servers to be running.)

```bash
pnpm exec playwright install
pnpm run test:e2e
```

### Linting

```bash
pnpm run lint
```

### Formatting

```bash
pnpm run format
```

---

## 🧪 Manual Testing Checklist

1. **API:** `curl http://localhost:4000/api/products` returns product list.
2. **Home Page:** Promo banner, trending section, featured collections load.
3. **Shop Page:** Products display; filtering, search, sorting work.
4. **Product Detail:** `/product/:slug` shows details; cart addition works.
5. **Cart:** Add, update, remove items; totals and localStorage update.
6. **Shipping Page:** `/shipping` collects address details before payment.
7. **Authentication:** Signup/login flows and toasts display correctly.
8. **Admin Dashboard:** Create/edit/delete products.
9. **Contact Form:** Submission logs message and shows toast.
10. **404 Page:** Unknown routes show custom 404 message.

---

## 🔗 API Endpoints

### Product Management

| Method & Path              | Description       | Auth  |
| -------------------------- | ----------------- | ----- |
| `GET /api/products`        | List all products | none  |
| `POST /api/products`       | Create a product  | admin |
| `PATCH /api/products/:id`  | Update a product  | admin |
| `DELETE /api/products/:id` | Remove a product  | admin |

---

## 🔐 Authentication Workflow

1. **Signup** – users register with name, email, and password. An OTP code is emailed for verification.
2. **Verify OTP** – posting the code to `/api/otp/verify` confirms the account and clears the temporary OTP fields.
3. **Login** – a JWT cookie is issued on successful credentials and used for authenticated requests via the `/api/me` endpoint.

---

## 🛒 Checkout Flow

Airwallex payment intents are used to collect payments.

```text
Cart → Shipping form → POST /api/checkout → Airwallex intent
           ↓ user pays
Airwallex → POST /api/airwallex/webhook → order marked PAID
           → receipt email to user and admin
```

Set `AIRWALLEX_CLIENT_ID`, `AIRWALLEX_API_KEY`, `AIRWALLEX_WEBHOOK_SECRET`, and `FRONTEND_URL` in `.env`. Configure a webhook in your Airwallex dashboard for **`payment_intent.succeeded`** events pointing to `/api/airwallex/webhook`.

The shipping form collects recipient name, phone numbers, address lines, city/state/postal code, country, order number, and delivery instructions. These values are stored on each `Order` and appear in the admin notification email.

---

## 📜 Order History

After completing a purchase, the `/success` page fetches your most recent order via `/api/orders/latest`. A full list of previous orders is available at `/account/orders` and through the `/api/orders` endpoint.

---

## 📷 Image Uploading

Product images can be uploaded via the `/api/products/upload` endpoint. The admin UI allows selecting a file, which is resized server‑side using **Sharp** and served from `/uploads`.

---

## 🗺️ Sitemap Generation

Run the script after building to generate `public/sitemap.xml`:

```bash
pnpm run sitemap
```

The script reads product slugs from the database and uses `SITE_URL` to build absolute URLs. It runs **automatically** after `pnpm run build`.

---

## 📦 Building for Production

1. **Build frontend**

   ```bash
   pnpm run build
   ```

2. **Preview build**

   ```bash
   pnpm run preview
   ```

Optimized assets output to `dist/`.

---

## 📂 Project Structure

```text
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

*Last updated: July 3, 2025*
