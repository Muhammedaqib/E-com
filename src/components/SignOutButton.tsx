"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded border border-slate-600 px-2 py-1 hover:border-amber-500 hover:text-amber-400"
    >
      Sign out
    </button>
  );
}
