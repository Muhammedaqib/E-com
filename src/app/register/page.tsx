import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata = { title: "Create account · BazarMart" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-amber-700 hover:underline dark:text-amber-400">
          Sign in
        </Link>
      </p>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <RegisterForm />
      </div>
    </div>
  );
}
