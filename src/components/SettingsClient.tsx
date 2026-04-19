"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Lock, 
  Smartphone, 
  Eye, 
  Moon, 
  Sun,
  Mail,
  Check
} from "lucide-react";

export function SettingsClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaved, setIsSaved] = useState(false);

  const tabs = [
    { icon: User, label: "Profile" },
    { icon: Shield, label: "Security" },
    { icon: Bell, label: "Notifications" },
    { icon: Palette, label: "Appearance" },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
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
          {tabs.map((tab) => (
            <button 
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.label 
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
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[400px]">
            {activeTab === "Profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Username</label>
                    <input type="text" defaultValue={user?.name || ""} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" disabled />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                    <input type="email" defaultValue={user?.email || ""} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" disabled />
                  </div>
                  <div className="pt-4">
                    <button onClick={handleSave} className="bg-indigo-600 text-white py-3 px-8 rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                      {isSaved ? <Check size={20} /> : null}
                      {isSaved ? "Saved!" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-lg text-slate-600 border border-slate-100"><Lock size={20} /></div>
                      <div>
                        <p className="text-sm font-bold">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-400">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Enable</button>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-lg text-slate-600 border border-slate-100"><Smartphone size={20} /></div>
                      <div>
                        <p className="text-sm font-bold">Active Sessions</p>
                        <p className="text-xs text-slate-400">Manage your logged in devices</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:underline">View</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: "Email Notifications", desc: "Get updates in your inbox", icon: Mail },
                    { label: "Task Reminders", desc: "Alerts when tasks are due", icon: Bell },
                    { label: "Account Activity", desc: "Security alerts and login info", icon: Shield }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className="text-slate-400" />
                        <div>
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      <div className="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Appearance" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold mb-6">Appearance</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-indigo-600 rounded-2xl bg-white text-left">
                    <Sun size={24} className="text-indigo-600 mb-2" />
                    <p className="font-bold text-sm">Light Mode</p>
                    <p className="text-xs text-slate-400">Clean and bright</p>
                  </button>
                  <button className="p-4 border-2 border-transparent rounded-2xl bg-slate-900 text-left text-white opacity-50">
                    <Moon size={24} className="text-indigo-400 mb-2" />
                    <p className="font-bold text-sm">Dark Mode</p>
                    <p className="text-xs text-slate-500">Easier on the eyes</p>
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeTab === "Profile" && (
            <div className="mt-8 bg-red-50 border border-red-100 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
                <Shield size={20} className="text-red-500" />
                Danger Zone
              </h2>
              <p className="text-sm text-red-600 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="bg-white text-red-600 border border-red-200 py-3 px-8 rounded-xl hover:bg-red-600 hover:text-white font-bold transition-all active:scale-[0.98]">
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
