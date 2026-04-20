"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

const updateInvoiceSchema = z.object({
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  phone: z.string().min(1),
  items: z.array(z.object({
    id: z.string(),
    title: z.string().min(1),
    price: z.number().int().min(0),
    quantity: z.number().int().min(1),
  }))
});

export async function updateInvoiceAction(orderId: number, data: any) {
  await requireAdmin();
  
  const parsed = updateInvoiceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid data" };
  }

  const { fullName, line1, line2, city, postalCode, phone, items } = parsed.data;
  const address = JSON.stringify({ fullName, line1, line2, city, postalCode, phone });
  
  const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  try {
    await prisma.$transaction(async (tx) => {
      // Update address and total
      await tx.order.update({
        where: { id: orderId },
        data: { address, total: newTotal }
      });

      // Get current items to find which ones to delete
      const currentItems = await tx.orderItem.findMany({
        where: { orderId }
      });
      const currentIds = currentItems.map(i => i.id);
      const newIds = items.filter(i => !i.id.startsWith("new-")).map(i => i.id);
      const idsToDelete = currentIds.filter(id => !newIds.includes(id));

      if (idsToDelete.length > 0) {
        await tx.orderItem.deleteMany({
          where: { id: { in: idsToDelete } }
        });
      }

      // Update existing or Create new items
      for (const item of items) {
        if (item.id.startsWith("new-")) {
          await tx.orderItem.create({
            data: {
              orderId,
              title: item.title,
              price: item.price,
              quantity: item.quantity
            }
          });
        } else {
          await tx.orderItem.update({
            where: { id: item.id },
            data: {
              title: item.title,
              price: item.price,
              quantity: item.quantity
            }
          });
        }
      }
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/admin/orders/${orderId}/invoice`);
    revalidatePath(`/orders`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to update invoice" };
  }
}
