import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Sign in · BazarMart" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        New here?{" "}
        <Link href="/register" className="font-medium text-amber-700 hover:underline dark:text-amber-400">
          Create an account
        </Link>
      </p>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <Suspense fallback={<div className="h-40 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />}>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">
        Demo: <kbd className="rounded bg-slate-200 px-1 dark:bg-slate-800">buyer@demo.com</kbd> /{" "}
        <kbd className="rounded bg-slate-200 px-1 dark:bg-slate-800">demo1234</kbd>
      </p>
    </div>
  );
}
