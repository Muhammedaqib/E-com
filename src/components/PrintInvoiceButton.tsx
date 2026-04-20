"use client";

export function PrintInvoiceButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition dark:bg-white dark:text-slate-900"
    >
      Print Invoice
    </button>
  );
}
