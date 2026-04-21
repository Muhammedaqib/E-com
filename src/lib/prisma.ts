import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const databasePath = path.join(process.cwd(), "dev.db");

const adapter = new PrismaBetterSqlite3({ url: databasePath });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

console.log("Prisma Client initialized (Version 2)");

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
