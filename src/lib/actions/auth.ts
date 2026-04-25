"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { mergeGuestCartAction } from "./cart";

const registerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    // If we get here, it succeeded (it doesn't throw if redirect: false)
    await mergeGuestCartAction();
    return { ok: true, callbackUrl };
  } catch (error) {
    if (error instanceof Error && 'type' in error && error.type === "CredentialsSignin") {
      return { error: "Invalid email or password" };
    }
    return { error: "Something went wrong" };
  }
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { error: { email: ["An account with this email already exists"] } };
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  });

  revalidatePath("/");
  return { ok: true };
}
