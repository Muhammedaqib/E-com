import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/**
 * Standard Prisma initialization for Next.js.
 * Includes improved logging for production debugging.
 */
function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  console.log("Prisma: Initializing client...");
  
  if (!process.env.DATABASE_URL) {
    console.warn("Prisma: DATABASE_URL is missing in environment!");
  }

  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  
  return client;
}

export const prisma = getPrismaClient();
