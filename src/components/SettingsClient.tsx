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
  Sun, 
  Moon,
  Mail,
  Check,
  Loader2
} from "lucide-react";

export function SettingsClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Interactive States
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    email: true,
    reminders: true,
    activity: false
  });

  const tabs = [
    { icon: User, label: "Profile" },
    { icon: Shield, label: "Security" },
    { icon: Bell, label: "Notifications" },
    { icon: Palette, label: "Appearance" },
  ];

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
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

      <h1 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">Settings</h1>

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
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[450px]">
            {activeTab === "Profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Username</label>
                    <input type="text" defaultValue={user?.name || ""} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                    <input type="email" defaultValue={user?.email || ""} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" />
                  </div>
                  <div className="pt-4">
                    <button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className={`min-w-[160px] flex items-center justify-center gap-2 py-3 px-8 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] ${
                        isSaved ? "bg-green-500 text-white shadow-green-100" : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
                      }`}
                    >
                      {isSaving ? <Loader2 size={20} className="animate-spin" /> : isSaved ? <Check size={20} /> : null}
                      {isSaving ? "Saving..." : isSaved ? "Saved Successfully!" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between border border-transparent hover:border-indigo-100 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-xl text-slate-600 border border-slate-100 shadow-sm"><Lock size={24} /></div>
                      <div>
                        <p className="text-sm font-bold">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-400">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors">Enable</button>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between border border-transparent hover:border-indigo-100 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-xl text-slate-600 border border-slate-100 shadow-sm"><Smartphone size={24} /></div>
                      <div>
                        <p className="text-sm font-bold">Active Sessions</p>
                        <p className="text-xs text-slate-400">Manage your logged in devices</p>
                      </div>
                    </div>
                    <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors">View All</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { id: "email" as const, label: "Email Notifications", desc: "Get updates in your inbox", icon: Mail },
                    { id: "reminders" as const, label: "Task Reminders", desc: "Alerts when tasks are due", icon: Bell },
                    { id: "activity" as const, label: "Account Activity", desc: "Security alerts and login info", icon: Shield }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-50 transition-all">
                      <div className="flex items-center gap-4">
                        <item.icon size={20} className="text-slate-400" />
                        <div>
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleNotification(item.id)}
                        className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                          notifications[item.id] ? "bg-indigo-600" : "bg-slate-300"
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                          notifications[item.id] ? "right-1" : "right-7"
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Appearance" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6">Appearance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTheme("light")}
                    className={`p-6 rounded-2xl text-left transition-all ${
                      theme === "light" 
                        ? "border-2 border-indigo-600 bg-white ring-4 ring-indigo-50" 
                        : "border-2 border-slate-100 bg-slate-50 text-slate-400"
                    }`}
                  >
                    <Sun size={28} className={theme === "light" ? "text-indigo-600 mb-4" : "mb-4"} />
                    <p className={`font-bold text-sm ${theme === "light" ? "text-slate-900" : ""}`}>Light Mode</p>
                    <p className="text-xs">Clean and professional</p>
                  </button>
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`p-6 rounded-2xl text-left transition-all bg-slate-900 ${
                      theme === "dark" 
                        ? "border-2 border-indigo-500 ring-4 ring-indigo-900/20" 
                        : "border-2 border-transparent text-slate-500"
                    }`}
                  >
                    <Moon size={28} className={theme === "dark" ? "text-indigo-400 mb-4" : "mb-4"} />
                    <p className={`font-bold text-sm ${theme === "dark" ? "text-white" : ""}`}>Dark Mode</p>
                    <p className="text-xs">Easier on the eyes (Beta)</p>
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
              <p className="text-sm text-red-600 mb-6 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
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
