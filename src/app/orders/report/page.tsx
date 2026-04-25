import { ComplaintForm } from "@/components/ComplaintForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Report an Issue · BazarMart" };

export default async function ReportPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders/report");
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
      <p className="text-slate-500 mb-8">
        Having trouble with an order or found a bug? Let us know and we&apos;ll fix it.
      </p>
      
      <ComplaintForm />
    </div>
  );
}
