import { test, expect } from "@playwright/test";

// full flow: upload image, purchase product, refund order

test("admin uploads product image, purchase then refund", async ({ page }) => {
  const adminEmail = "admin@example.com";
  const shopperEmail = "shopper@example.com";

  const products: Array<Record<string, unknown>> = [];
  const orders: Array<Record<string, unknown>> = [];
  let currentUser: { email: string; isAdmin: boolean } | null = null;

  await page.route("**/api/login", async (route) => {
    const body = JSON.parse(route.request().postData() || "{}");
    if (body.email === adminEmail) {
      currentUser = { email: adminEmail, isAdmin: true };
    } else {
      currentUser = { email: shopperEmail, isAdmin: false };
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(currentUser),
    });
  });

  await page.route("**/api/me", async (route) => {
    await route.fulfill({
      status: currentUser ? 200 : 401,
      contentType: "application/json",
      body: JSON.stringify(currentUser),
    });
  });

  await page.route("**/api/products/upload", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url: "/uploads/test.jpg" }),
    });
  });

  await page.route("**/api/products", async (route) => {
    const req = route.request();
    if (req.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(products),
      });
    } else {
      const body = JSON.parse(req.postData() || "{}");
      const product = {
        ...body,
        id: `p${products.length + 1}`,
        images: body.images ?? [],
      };
      products.push(product);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(product),
      });
    }
  });

  await page.route("**/api/checkout", async (route) => {
    const product = products[0];
    const order = {
      id: `o${orders.length + 1}`,
      status: "PAID",
      items: [{ product, quantity: 1, price: product.price }],
    };
    orders.push(order);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url: "/success" }),
    });
  });

  await page.route("**/api/orders/latest", async (route) => {
    const order = orders[orders.length - 1];
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: order.id, total: order.items[0].price }),
    });
  });

  await page.route("**/api/orders", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(orders),
    });
  });

  await page.route("**/api/orders/*/refund", async (route) => {
    const id = route.request().url().split("/").slice(-2)[0];
    const order = orders.find((o) => o.id === id);
    if (order) order.status = "REFUNDED";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "ok" }),
    });
  });

  // admin login
  await page.goto("http://localhost:8080/login");
  await page.fill('input[name="email"]', adminEmail);
  await page.fill('input[name="password"]', "secret");
  await Promise.all([
    page.waitForResponse((res) => res.url().endsWith("/api/login")),
    page.getByRole("button", { name: /sign in/i }).click(),
  ]);

  await page.goto("http://localhost:8080/admin");
  await page.getByText("Add Product").click();

  await page.setInputFiles('input[type="file"]', "public/placeholder.svg");
  await page.waitForResponse((res) =>
    res.url().endsWith("/api/products/upload"),
  );

  await page.getByLabel("Product Name").fill("Refundable Item");
  await page.getByLabel("Price").fill("20");
  await page.getByLabel("Category").fill("Tools");
  await page.getByLabel("Description").fill("Test item");

  await Promise.all([
    page.waitForResponse(
      (res) => res.url().endsWith("/api/products") && res.status() === 201,
    ),
    page.getByRole("button", { name: "Add Product" }).click(),
  ]);
  await expect(page.getByText("Refundable Item")).toBeVisible();

  // shopper login and purchase
  await page.goto("http://localhost:8080/login");
  await page.fill('input[name="email"]', shopperEmail);
  await page.fill('input[name="password"]', "secret");
  await Promise.all([
    page.waitForResponse((res) => res.url().endsWith("/api/login")),
    page.getByRole("button", { name: /sign in/i }).click(),
  ]);

  await page.goto("http://localhost:8080/shop");
  await page.getByText("Refundable Item").click();
  await page.getByRole("button", { name: /add to cart/i }).click();

  await page.goto("http://localhost:8080/cart");
  await Promise.all([
    page.waitForResponse((res) => res.url().endsWith("/api/checkout")),
    page.getByRole("button", { name: /proceed to checkout/i }).click(),
  ]);
  await expect(page).toHaveURL(/\/success$/);

  // admin refund flow
  await page.goto("http://localhost:8080/login");
  await page.fill('input[name="email"]', adminEmail);
  await page.fill('input[name="password"]', "secret");
  await Promise.all([
    page.waitForResponse((res) => res.url().endsWith("/api/login")),
    page.getByRole("button", { name: /sign in/i }).click(),
  ]);

  await page.goto("http://localhost:8080/admin");
  await Promise.all([
    page.waitForResponse((res) => res.url().includes("/refund")),
    page.getByRole("button", { name: "Refund" }).click(),
  ]);

  const updatedOrders = await page.evaluate(async () => {
    const res = await fetch("/api/orders");
    return res.json();
  });

  expect(updatedOrders[0].status).toBe("REFUNDED");
});
