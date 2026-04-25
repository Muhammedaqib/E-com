-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "bannerTitle" TEXT NOT NULL DEFAULT 'Shop smarter today',
    "bannerText" TEXT NOT NULL DEFAULT 'Fast delivery, secure checkout, and thousands of products — a full storefront demo built with Next.js and Prisma.',
    "bannerButton" TEXT NOT NULL DEFAULT 'Browse all products',
    "bannerImage" TEXT,
    "categoriesTitle" TEXT NOT NULL DEFAULT 'Shop by category',
    "showCategories" BOOLEAN NOT NULL DEFAULT true,
    "featuredTitle" TEXT NOT NULL DEFAULT 'Featured picks',
    "showFeatured" BOOLEAN NOT NULL DEFAULT true,
    "footerAboutTitle" TEXT NOT NULL DEFAULT 'BazarMart',
    "footerAboutText" TEXT NOT NULL DEFAULT 'Demo marketplace built with Next.js, Prisma, and NextAuth — inspired by modern e-commerce experiences.'
);
INSERT INTO "new_SiteSettings" ("bannerButton", "bannerImage", "bannerText", "bannerTitle", "footerAboutText", "footerAboutTitle", "id") SELECT "bannerButton", "bannerImage", "bannerText", "bannerTitle", "footerAboutText", "footerAboutTitle", "id" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
