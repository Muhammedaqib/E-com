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
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    console.log("Login result:", result);

    // In some v5 versions, successful signIn returns a string/object, 
    // in others it might throw. With redirect: false, it should return.
    
    await mergeGuestCartAction();
    return { ok: true, callbackUrl };
  } catch (error: any) {
    console.error("Login action error:", error);
    
    // Auth.js v5 throws specific errors that might need re-throwing 
    // or special handling if we were using redirect: true.
    // Since we use redirect: false, we catch and return the error.
    
    if (error?.type === "CredentialsSignin" || error?.code === "credentials") {
      return { error: "Invalid email or password" };
    }
    
    // If it's a redirect error from Auth.js, we might have actually succeeded
    if (error?.message?.includes("NEXT_REDIRECT")) {
       return { ok: true, callbackUrl };
    }

    return { error: error?.message || "Something went wrong" };
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
