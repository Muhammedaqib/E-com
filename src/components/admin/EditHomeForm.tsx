"use client";

import { useState, useTransition } from "react";
import { updateSiteSettingsAction } from "@/lib/actions/admin-settings";

interface Settings {
  bannerTitle: string;
  bannerText: string;
  bannerButton: string;
  bannerImage?: string | null;
  categoriesTitle: string;
  showCategories: boolean;
  featuredTitle: string;
  showFeatured: boolean;
  footerAboutTitle: string;
  footerAboutText: string;
}

export function EditHomeForm({ settings }: { settings: Settings }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateSiteSettingsAction(formData);
      if (res && res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: "All changes saved successfully!" });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl font-bold text-sm ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Banner Section */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-amber-600 uppercase tracking-tight">Home Banner</h2>
        
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Banner Title</label>
            <input 
              name="bannerTitle"
              defaultValue={settings.bannerTitle}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Button Text</label>
            <input 
              name="bannerButton"
              defaultValue={settings.bannerButton}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Banner Description</label>
          <textarea 
            name="bannerText"
            defaultValue={settings.bannerText}
            rows={2}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Banner Image URL (Optional)</label>
          <input 
            name="bannerImage"
            defaultValue={settings.bannerImage || ""}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-amber-600 uppercase tracking-tight">Categories Section</h2>
        
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Section Title</label>
            <input 
              name="categoriesTitle"
              defaultValue={settings.categoriesTitle}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Visibility</label>
            <select 
              name="showCategories" 
              defaultValue={(settings.showCategories ?? true).toString()}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="true">Show Section</option>
              <option value="false">Hide Section</option>
            </select>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-amber-600 uppercase tracking-tight">Featured Products Section</h2>
        
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Section Title</label>
            <input 
              name="featuredTitle"
              defaultValue={settings.featuredTitle || "Featured picks"}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Visibility</label>
            <select 
              name="showFeatured" 
              defaultValue={(settings.showFeatured ?? true).toString()}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="true">Show Section</option>
              <option value="false">Hide Section</option>
            </select>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-amber-600 uppercase tracking-tight">Footer About Section</h2>
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Footer Title</label>
          <input 
            name="footerAboutTitle"
            defaultValue={settings.footerAboutTitle}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Footer Text</label>
          <textarea 
            name="footerAboutText"
            defaultValue={settings.footerAboutText}
            rows={3}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-slate-900 text-white px-8 py-3 font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400 disabled:opacity-50"
        >
          {isPending ? "Saving Changes..." : "Save All Changes"}
        </button>
      </div>
    </form>
  );
}
