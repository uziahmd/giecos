# Giecos Solution

A full‑stack demo storefront built with **Vite**, **React**, **Fastify**, and **Prisma**. The front‑end resides in the `src/` directory, and the backend API lives under `api/`. This starter kit is configured with TypeScript, Tailwind CSS, React Query, and Radix UI.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Development](#development)
7. [Scripts](#scripts)
8. [Testing & Linting](#testing--linting)
9. [Manual Testing Checklist](#manual-testing-checklist)
10. [Building for Production](#building-for-production)
11. [Project Structure](#project-structure)

---

## 🚀 Features

* **Product Catalog**: Browse, search, filter, and sort products.
* **Product Details**: View detailed information and add to cart.
* **Shopping Cart**: Add, update, and remove items with real-time totals and persistent storage.
* **Authentication**: Email signup/login with JWT-based protection.
* **Admin Dashboard**: In-memory CRUD for products.
* **Contact Form**: Sends inquiries via API endpoint with confirmation toasts.
* **Responsive Design**: Optimized for desktop, tablet, and mobile.

---

## 🔧 Prerequisites

* **Node.js** v18 or newer
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

---

## ⚙️ Configuration

1. Copy the environment sample:

   ```bash
   ```

cp .env.sample api/.env

````
2. Edit `api/.env` and set the following variables:
   - `DATABASE_URL` (e.g., `postgresql://user:pass@localhost:5432/dbname`)
   - `JWT_SECRET` (a strong random string)
   - `PORT` (API port, e.g., `4000`)

---

## 🗄 Database Setup

Run migrations and seed data:

```bash
pnpm prisma migrate dev    # Apply or create migrations
pnpm run seed             # Populate sample data
````

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

* **Linting**:

  ```bash
  ```

pnpm run lint

````
- **Formatting**:
  ```bash
pnpm run format
````

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
