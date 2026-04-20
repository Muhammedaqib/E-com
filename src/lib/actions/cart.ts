"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const GUEST_CART_COOKIE = "guest_cart_session";

async function resolveCart() {
  const session = await auth();
  if (session?.user?.id) {
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });

    if (userExists) {
      let cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
      });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId: session.user.id } });
      }
      return cart;
    }
  }

  const cookieStore = await cookies();
  let sessionId = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set(GUEST_CART_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
      secure: process.env.NODE_ENV === "production",
    });
  }

  let cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { sessionId } });
  }
  return cart;
}

export async function mergeGuestCartAction() {
  const session = await auth();
  if (!session?.user?.id) return;

  const userExists = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true }
  });
  if (!userExists) return;

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!sessionId) return;

  const guestCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });
  if (!guestCart || guestCart.items.length === 0) {
    cookieStore.delete(GUEST_CART_COOKIE);
    return;
  }

  let userCart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  });
  if (!userCart) {
    userCart = await prisma.cart.create({
      data: { userId: session.user.id },
      include: { items: true },
    });
  }

  for (const line of guestCart.items) {
    const existing = userCart.items.find((i) => i.productId === line.productId);
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + line.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: line.productId,
          quantity: line.quantity,
        },
      });
    }
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
  cookieStore.delete(GUEST_CART_COOKIE);
  revalidatePath("/cart");
}

export async function addToCartAction(productId: string, quantity: number) {
  const q = Math.max(1, Math.min(99, Math.floor(quantity)));
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < 1) {
    return { error: "Product unavailable" };
  }

  const cart = await resolveCart();
  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: { cartId: cart.id, productId },
    },
  });

  const nextQty = (existing?.quantity ?? 0) + q;
  if (nextQty > product.stock) {
    return { error: `Only ${product.stock} in stock` };
  }

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: nextQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity: q },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/products");
  return { ok: true };
}

export async function updateCartItemAction(itemId: string, quantity: number) {
  const cart = await resolveCart();
  const line = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
    include: { product: true },
  });
  if (!line) return { error: "Not found" };

  const q = Math.max(0, Math.min(line.product.stock, Math.floor(quantity)));
  if (q === 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: q },
    });
  }

  revalidatePath("/cart");
  return { ok: true };
}

export async function removeCartItemAction(itemId: string) {
  const cart = await resolveCart();
  await prisma.cartItem.deleteMany({
    where: { id: itemId, cartId: cart.id },
  });
  revalidatePath("/cart");
  return { ok: true };
}
