"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdmin();

  // Create a clean data object to ensure no extra or missing fields
  const data = {
    bannerTitle: formData.get("bannerTitle") as string,
    bannerText: formData.get("bannerText") as string,
    bannerButton: formData.get("bannerButton") as string,
    bannerImage: (formData.get("bannerImage") as string) || null,
    categoriesTitle: (formData.get("categoriesTitle") as string) || "Shop by category",
    showCategories: formData.get("showCategories") === "true",
    featuredTitle: (formData.get("featuredTitle") as string) || "Featured picks",
    showFeatured: formData.get("showFeatured") === "true",
    footerAboutTitle: formData.get("footerAboutTitle") as string,
    footerAboutText: formData.get("footerAboutText") as string,
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = prisma as any;
    
    // Final defensive check to provide a helpful message if caching persists
    if (!client.siteSettings) {
       return { error: "Development cache error: Please restart your 'npm run dev' terminal to apply the new database schema." };
    }

    await client.siteSettings.upsert({
      where: { id: "default" },
      update: data,
      create: { ...data, id: "default" },
    });

    revalidatePath("/");
    revalidatePath("/", "layout");
    revalidatePath("/admin/home");
    return { success: true };
  } catch (error) {
    console.error("Site settings update error:", error);
    return { error: "Database error: " + (error instanceof Error ? error.message : "Unknown error occurred") };
  }
}
