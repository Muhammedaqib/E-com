import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { InvoiceView } from "@/components/admin/InvoiceView";

export const metadata = { title: "Invoice · Admin" };

export default async function AdminInvoicePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  
  const order = await prisma.order.findUnique({
    where: { id: numericId },
    include: {
      user: true,
      items: true,
    },
  });

  if (!order) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-4xl py-10">
      <InvoiceView order={order} />
    </div>
  );
}
