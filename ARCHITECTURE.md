# Project Architecture: Marketplace

This document outlines the end-to-end architecture, tech stack, and core design patterns of the Marketplace project.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [SQLite](https://sqlite.org/) via `better-sqlite3`
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Auth.js v5 (NextAuth.js)](https://authjs.dev/)
- **Validation:** [Zod](https://zod.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Theming:** `next-themes` (Light/Dark mode)

---

## 🏗️ System Layers

### 1. Data Layer (Persistence)
Managed by **Prisma**, the database is designed for high relational integrity:
- **RBAC (Role-Based Access Control):** Roles include `USER`, `ADMIN`, `PRODUCT_MANAGER`, and `CUSTOMER_CARE`.
- **E-Commerce Core:** Supports categories, products (with image gallery JSON), carts, and orders.
- **Support System:** Built-in ticketing (Complaints) with threaded messaging.
- **Dynamic CMS:** `SiteSettings` model allows real-time updates to the homepage UI.

### 2. Authentication & Authorization
Powered by **Auth.js v5**:
- **JWT Strategy:** Sessions are stored in a secure JWT.
- **Role Sync:** The session callback fetches the latest user role from the database on every update, ensuring instant permission changes without logout.
- **Security:** Account suspension checks are integrated directly into the `authorize` flow.

### 3. Application Logic (Server Actions)
The project utilizes **Next.js Server Actions** for all mutations (`src/lib/actions/`):
- **Zod Validation:** All `FormData` is parsed and validated against strict schemas before processing.
- **Middleware Security:** Mutations are protected by role-checking helpers (e.g., `requireAdmin`).
- **Data Integrity:** Financial values (prices) are stored as integers (cents) to avoid floating-point inaccuracies.
- **Cache Invalidation:** Uses `revalidatePath` to trigger targeted updates of the Next.js Data Cache.

### 4. Presentation Layer (UI)
- **Hybrid Rendering:** 
  - **Server Components:** Used for data-heavy views (Product lists, Admin dashboards) to reduce client-side bundle size.
  - **Client Components:** Used for interactive state (Cart sidebars, Chat windows, Form handling).
- **Responsive Layout:** Mobile-first design using Tailwind CSS 4.

---

## 📁 Project Structure

```text
src/
├── app/              # Next.js App Router (Routes & Pages)
│   ├── admin/        # Protected administrative routes
│   ├── api/          # Auth.js API handlers
│   └── (storefront)  # User-facing routes (Cart, Profile, Products)
├── components/       # Reusable React components
│   └── admin/        # Specialized admin UI elements
├── lib/              # Core utilities
│   ├── actions/      # Server Actions (The "Backend")
│   ├── prisma.ts     # Database client singleton
│   └── format.ts     # Currency and date formatters
├── types/            # TypeScript definitions/extensions
└── auth.ts           # Auth.js configuration
```

---

## 🔄 Core Workflows

### Order Flow
1. **User** adds products to `Cart` (Action: `addToCartAction`).
2. **Checkout** validates address and stock availability.
3. **Prisma Transaction** creates the `Order`, generates `OrderItems`, and clears the `Cart`.
4. **UI** triggers `revalidatePath('/')` to update stock counts across the site.

### Support Flow
1. **User** submits a `Complaint`.
2. **Customer Care** views the ticket in the admin dashboard.
3. **Threaded Messaging** allows real-time communication between User and Support staff.
4. **Resolution** updates ticket status to `RESOLVED`.
