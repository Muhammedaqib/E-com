"use server";

import { redirect } from "next/navigation";

export async function HeaderSearch() {
  async function searchAction(formData: FormData) {
    "use server";
    const query = formData.get("q") as string;
    if (query?.trim()) {
      redirect(`/products?q=${encodeURIComponent(query.trim())}`);
    } else {
      redirect("/products");
    }
  }

  return (
    <form action={searchAction} className="relative flex w-full items-center">
      <input
        type="text"
        name="q"
        placeholder="Search for products..."
        className="h-10 w-full rounded-lg bg-slate-800 border-none px-4 pl-10 text-sm text-white placeholder-slate-400 focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-amber-500 transition-all outline-none"
      />
      <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
        <SearchIcon />
      </div>
      
      {/* Search Button (Hidden on Mobile, Visible on Tablet/Desktop) */}
      <button 
        type="submit"
        className="hidden sm:block absolute right-1.5 h-7 rounded-md bg-amber-500 px-3 text-[10px] font-bold text-slate-900 hover:bg-amber-400 uppercase tracking-widest transition-colors"
      >
        Search
      </button>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
