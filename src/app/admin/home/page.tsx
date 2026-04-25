import { prisma } from "@/lib/prisma";
import { EditHomeForm } from "@/components/admin/EditHomeForm";

export const metadata = { title: "Edit Home · Admin" };

export default async function EditHomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = prisma as any;
  const settings = (await client.siteSettings?.findUnique({
    where: { id: "default" }
  })) || {
    bannerTitle: "Shop smarter today",
    bannerText: "Fast delivery, secure checkout, and thousands of products — a full storefront demo built with Next.js and Prisma.",
    bannerButton: "Browse all products",
    bannerImage: null,
    footerAboutTitle: "BazarMart",
    footerAboutText: "Demo marketplace built with Next.js, Prisma, and NextAuth — inspired by modern e-commerce experiences.",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Home & Footer</h1>
        <p className="text-slate-500">Update the banner and footer content across the site.</p>
      </div>

      <EditHomeForm settings={settings} />
    </div>
  );
}
