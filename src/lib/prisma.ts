import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/**
 * Robust Prisma initialization for Supabase + Vercel.
 * Automatically handles PgBouncer / Pooler configuration to prevent 
 * "prepared statement already exists" errors.
 */
function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  let connectionString = process.env.DATABASE_URL || "";

  // If using Supabase Pooler (Port 6543), we must force pgbouncer mode and disable statement caching
  if (connectionString.includes("pooler.supabase.com") || connectionString.includes(":6543")) {
    const separator = connectionString.includes("?") ? "&" : "?";
    if (!connectionString.includes("pgbouncer=true")) {
      connectionString += `${separator}pgbouncer=true`;
    }
    if (!connectionString.includes("statement_cache_size=")) {
      connectionString += `&statement_cache_size=0`;
    }
    if (!connectionString.includes("connect_timeout=")) {
      connectionString += `&connect_timeout=30`;
    }
  }

  const client = new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

export const prisma = getPrismaClient();
