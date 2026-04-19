import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Shield, Bell, Palette } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Settings Tabs */}
          <div className="md:col-span-4 space-y-2">
            {[
              { icon: User, label: "Profile", active: true },
              { icon: Shield, label: "Security", active: false },
              { icon: Bell, label: "Notifications", active: false },
              { icon: Palette, label: "Appearance", active: false },
            ].map((tab) => (
              <button 
                key={tab.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  tab.active 
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Username</label>
                  <input 
                    type="text" 
                    defaultValue={session.user?.name || ""}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                    disabled
                  />
                  <p className="mt-2 text-xs text-slate-400 italic">Username cannot be changed in this version.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={session.user?.email || ""}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                    disabled
                  />
                </div>

                <div className="pt-4">
                  <button className="bg-indigo-600 text-white py-3 px-8 rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-red-50 border border-red-100 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h2>
              <p className="text-sm text-red-600 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="bg-white text-red-600 border border-red-200 py-3 px-8 rounded-xl hover:bg-red-600 hover:text-white font-bold transition-all active:scale-[0.98]">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
