import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Books", slug: "books" },
  { name: "Sports", slug: "sports" },
];

function img(seed: string) {
  return `https://picsum.photos/seed/${seed}/800/800`;
}

async function main() {
  console.log("Cleaning up database...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating users...");
  const adminHash = await hash("admin123", 12);
  const userHash = await hash("demo1234", 12);

  await prisma.user.create({
    data: {
      email: "admin@demo.com",
      name: "Admin",
      password: adminHash,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      email: "buyer@demo.com",
      name: "Demo Buyer",
      password: userHash,
      role: "USER",
    },
  });

  console.log("Creating categories...");
  const cats = await prisma.$transaction(
    categories.map((c) =>
      prisma.category.create({ data: { name: c.name, slug: c.slug } }),
    ),
  );

  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id])) as Record<
    string,
    string
  >;

  const products: Array<{
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAt?: number;
    stock: number;
    categorySlug: string;
    featured: boolean;
    images: string[];
  }> = [
    {
      name: "Wireless Noise-Cancelling Headphones",
      slug: "wireless-headphones-pro",
      description:
        "Premium over-ear headphones with 30h battery, USB-C fast charge, and studio-quality sound.",
      price: 19999,
      compareAt: 24999,
      stock: 120,
      categorySlug: "electronics",
      featured: true,
      images: [img("hp1"), img("hp2")],
    },
    {
      name: 'Ultra HD Smart TV 55"',
      slug: "smart-tv-55",
      description:
        "4K HDR, voice assistant, and low-latency gaming mode. Perfect for movies and sports.",
      price: 54999,
      compareAt: 62999,
      stock: 40,
      categorySlug: "electronics",
      featured: true,
      images: [img("tv1")],
    },
    {
      name: "Lightweight Laptop 14\"",
      slug: "laptop-14-ultra",
      description: "16GB RAM, 512GB SSD, all-day battery. Built for work and travel.",
      price: 89900,
      stock: 35,
      categorySlug: "electronics",
      featured: true,
      images: [img("lap1"), img("lap2")],
    },
    {
      name: "Fitness Smartwatch",
      slug: "fitness-smartwatch",
      description: "Heart rate, GPS, sleep tracking, and swim-proof design.",
      price: 12999,
      stock: 200,
      categorySlug: "electronics",
      featured: false,
      images: [img("watch1")],
    },
    {
      name: "Cotton Crew Tee (Pack of 3)",
      slug: "cotton-tee-pack",
      description: "Breathable organic cotton. Classic fit, machine washable.",
      price: 2999,
      stock: 300,
      categorySlug: "fashion",
      featured: true,
      images: [img("tee1")],
    },
    {
      name: "Slim Fit Denim Jeans",
      slug: "slim-denim-jeans",
      description: "Stretch comfort denim with modern slim taper.",
      price: 4999,
      compareAt: 6999,
      stock: 150,
      categorySlug: "fashion",
      featured: false,
      images: [img("jean1")],
    },
    {
      name: "Running Shoes — Airstride",
      slug: "running-shoes-airstride",
      description: "Responsive cushioning and breathable mesh upper.",
      price: 8999,
      stock: 90,
      categorySlug: "fashion",
      featured: true,
      images: [img("run1"), img("run2")],
    },
    {
      name: "Stainless Steel Cookware Set",
      slug: "cookware-set-steel",
      description: "10-piece set with even heat distribution and glass lids.",
      price: 12999,
      stock: 55,
      categorySlug: "home-kitchen",
      featured: true,
      images: [img("pan1")],
    },
    {
      name: "Robot Vacuum Cleaner",
      slug: "robot-vacuum-mop",
      description: "LiDAR mapping, app control, auto-empty base optional.",
      price: 34900,
      stock: 28,
      categorySlug: "home-kitchen",
      featured: true,
      images: [img("vac1")],
    },
    {
      name: "Ceramic Non-Stick Pan 28cm",
      slug: "ceramic-pan-28",
      description: "PFAS-free coating, induction compatible, oven safe to 230°C.",
      price: 3999,
      stock: 80,
      categorySlug: "home-kitchen",
      featured: false,
      images: [img("pan2")],
    },
    {
      name: "The Art of Distributed Systems",
      slug: "book-distributed-systems",
      description: "A practical guide to building reliable large-scale software.",
      price: 4299,
      stock: 400,
      categorySlug: "books",
      featured: true,
      images: [img("book1")],
    },
    {
      name: "Modern UI Patterns — Hardcover",
      slug: "book-ui-patterns",
      description: "Design systems, accessibility, and component architecture.",
      price: 3599,
      stock: 220,
      categorySlug: "books",
      featured: false,
      images: [img("book2")],
    },
    {
      name: "Yoga Mat Extra Thick",
      slug: "yoga-mat-thick",
      description: "Non-slip surface, carrying strap included.",
      price: 2499,
      stock: 180,
      categorySlug: "sports",
      featured: false,
      images: [img("yoga1")],
    },
    {
      name: "Adjustable Dumbbells 24kg Pair",
      slug: "adjustable-dumbbells",
      description: "Quick dial weight selection, compact home gym setup.",
      price: 18999,
      compareAt: 21999,
      stock: 45,
      categorySlug: "sports",
      featured: true,
      images: [img("db1")],
    },
    {
      name: "Insulated Water Bottle 1L",
      slug: "water-bottle-1l",
      description: "Keeps drinks cold 24h, hot 12h. Powder-coated finish.",
      price: 1899,
      stock: 500,
      categorySlug: "sports",
      featured: false,
      images: [img("bot1")],
    },
  ];

  console.log("Creating products...");
  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAt: p.compareAt ?? null,
        images: JSON.stringify(p.images),
        stock: p.stock,
        categoryId: bySlug[p.categorySlug],
        featured: p.featured,
      },
    });
  }

  console.log("Updating site settings...");
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      bannerTitle: "Shop smarter today",
      bannerText: "Fast delivery, secure checkout, and thousands of products — a full storefront demo built with Next.js and Prisma.",
      bannerButton: "Browse all products",
      footerAboutTitle: "BazarMart",
      footerAboutText: "Demo marketplace built with Next.js, Prisma, and NextAuth — inspired by modern e-commerce experiences.",
    },
  });

  console.log("Seed complete. Accounts:");
  console.log("  admin@demo.com / admin123");
  console.log("  buyer@demo.com / demo1234");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
