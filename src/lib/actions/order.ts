"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCartWithItems } from "@/lib/cart-data";

const addressSchema = z.object({
  fullName: z.string().min(1).max(200),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(32),
  phone: z.string().min(6).max(40),
});

export async function placeOrderAction(formData: FormData) {
  console.log("placeOrderAction started");
  const session = await auth();
  if (!session?.user?.id) {
    console.log("No session user id");
    return { error: "Sign in required" };
  }

  // Verify user still exists in DB (handle stale sessions)
  const userExists = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true }
  });

  if (!userExists) {
    console.log("User does not exist in DB:", session.user.id);
    return { error: "User session is invalid. Please sign out and sign in again." };
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
    console.log("Address validation failed:", parsed.error.flatten().fieldErrors);
    return { error: "Please fill in all required address fields correctly." };
  }

  const address = parsed.data;

  // Use robust cart resolution
  const cart = await getCartWithItems();
  console.log("Cart found:", cart?.id, "Items:", cart?.items?.length);

  if (!cart || cart.items.length === 0) {
    return { error: "Your cart is empty" };
  }

  for (const line of cart.items) {
    if (line.quantity > line.product.stock) {
      console.log("Insufficient stock for:", line.product.name);
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
    console.log("Starting transaction...");
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          status: "PAID",
          total,
          address: JSON.stringify(address),
        },
      });
      console.log("Order created:", order.id);

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

      // Important: delete the items from the specific cart we found
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      console.log("Transaction finished successfully");
    });
  } catch (error) {
    console.error("Order placement error:", error);
    return { error: "Could not place order. Please check your details and try again." };
  }

  console.log("Revalidating and redirecting...");
  revalidatePath("/cart");
  revalidatePath("/orders");
  revalidatePath("/", "layout");
  redirect("/orders?placed=1");
}

export async function submitPlaceOrderAction(formData: FormData): Promise<void> {
  const result = await placeOrderAction(formData);
  if (result && "error" in result) {
    return;
  }
}
