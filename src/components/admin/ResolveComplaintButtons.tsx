"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { resolveComplaintAction } from "@/lib/actions/admin-complaints";

export function ResolveComplaintButtons({ 
  complaintId, 
  isUnlocked,
  currentStatus 
}: { 
  complaintId: string, 
  isUnlocked: boolean,
  currentStatus: string
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFix = () => {
    if (!isUnlocked) return;
    startTransition(async () => {
      const res = await resolveComplaintAction(complaintId);
      if (res.success) {
        router.push("/admin/complaints");
      } else {
        alert(res.error);
      }
    });
  };

  const handleDone = () => {
    router.push("/admin/complaints");
  };

  if (currentStatus === "RESOLVED") return null;

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={handleDone}
        className="flex-1 rounded-xl bg-slate-200 dark:bg-slate-800 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95"
      >
        Reply Done
      </button>
      <button
        onClick={handleFix}
        disabled={!isUnlocked || isPending}
        className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all active:scale-95 ${
          isUnlocked 
            ? "bg-green-600 text-white hover:bg-green-500 shadow-sm" 
            : "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800/50 dark:text-slate-600"
        }`}
      >
        {isPending ? "Updating..." : "Problem Fix"}
      </button>
    </div>
  );
}
