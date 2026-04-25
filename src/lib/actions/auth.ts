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

  console.log(`Login attempt: ${email}`);

  try {
    // We use redirect: false so we can handle the response manually 
    // and avoid any Next.js redirect bugs during the transition.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    console.log("Login successful, resolving user data...");

    // Fetch the user one last time to get the ID safely
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (user) {
      // Merge cart without blocking the login response
      // We pass the ID directly to avoid calling auth() again
      await mergeGuestCartAction(user.id);
    }

    return { ok: true, callbackUrl };
  } catch (error: any) {
    console.error("Login action error:", error);
    
    if (error?.type === "CredentialsSignin" || error?.code === "credentials") {
      return { error: "Invalid email or password" };
    }
    
    if (error?.message?.includes("NEXT_REDIRECT")) {
       return { ok: true, callbackUrl };
    }

    return { error: "Authentication failed. Please check your credentials." };
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

  try {
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
  } catch (error) {
    console.error("Register error:", error);
    return { error: { server: ["An unexpected error occurred"] } };
  }
}
