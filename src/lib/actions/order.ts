"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const addressSchema = z.object({
  fullName: z.string().min(1).max(200),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(32),
  phone: z.string().min(6).max(40),
});

export async function placeOrderAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Sign in required" };
  }

  const parsed = addressSchema.safeParse({
    fullName: formData.get("fullName"),
    line1: formData.get("line1"),
    line2: formData.get("line2") ?? "",
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const address = parsed.data;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { error: "Your cart is empty" };
  }

  for (const line of cart.items) {
    if (line.quantity > line.product.stock) {
      return {
        error: `Not enough stock for ${line.product.name}. Refresh your cart.`,
      };
    }
  }

  const total = cart.items.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          status: "PAID",
          total,
          address: JSON.stringify(address),
        },
      });

      for (const line of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: line.productId,
            title: line.product.name,
            price: line.product.price,
            quantity: line.quantity,
          },
        });
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    });
  } catch {
    return { error: "Could not place order. Try again." };
  }

  revalidatePath("/cart");
  revalidatePath("/orders");
  redirect("/orders?placed=1");
}

export async function submitPlaceOrderAction(formData: FormData): Promise<void> {
  const result = await placeOrderAction(formData);
  if (result && "error" in result) {
    return;
  }
}
