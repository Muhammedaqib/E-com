import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const GUEST_CART_COOKIE = "guest_cart_session";

export async function getCartWithItems() {
  const session = await auth();

  if (session?.user?.id) {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: { include: { category: true } },
          },
        },
      },
    });
    return cart;
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!sessionId) return null;

  return prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: { include: { category: true } },
        },
      },
    },
  });
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCartWithItems();
  if (!cart) return 0;
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}
