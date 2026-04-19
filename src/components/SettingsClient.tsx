"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
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
  Loader2,
  AlertCircle,
  LayoutDashboard,
  Users,
  History,
  UserCog,
  UserMinus,
  CircleCheck,
  CircleX,
  Clock
} from "lucide-react";
import { updateProfile, changePassword } from "@/lib/auth-actions";
import { toggleUserStatus, deleteUser, updateUserRole } from "@/lib/admin-actions";

export function SettingsClient({ user, adminData }: { user: any, adminData: any }) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [notifications, setNotifications] = useState({
    email: true,
    reminders: true,
    activity: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setIsSaved(false);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    setIsSaving(false);
    if (result.error) setError(result.error);
    else {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setIsSaved(false);
    const formData = new FormData(e.currentTarget);
    const result = await changePassword(formData);
    setIsSaving(false);
    if (result.error) setError(result.error);
    else {
      setIsSaved(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!mounted) return null;

  const tabs = [
    { icon: User, label: "Profile" },
    { icon: Lock, label: "Password" },
    { icon: Shield, label: "Security" },
    { icon: Bell, label: "Notifications" },
    { icon: Palette, label: "Appearance" },
  ];

  if (user.role === "admin") {
    tabs.push({ icon: LayoutDashboard, label: "Admin Dashboard" });
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button 
              key={tab.label}
              onClick={() => { setActiveTab(tab.label); setError(null); setIsSaved(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.label 
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-800" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-9">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm min-h-[500px]">
            {activeTab === "Profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Profile Information</h2>
                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Username</label>
                    <input name="username" type="text" defaultValue={user?.name || ""} required className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                    <input name="email" type="email" defaultValue={user?.email || ""} required className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all outline-none" />
                  </div>
                  {error && <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30"><AlertCircle size={18} />{error}</div>}
                  <div className="pt-4">
                    <button type="submit" disabled={isSaving} className={`min-w-[160px] flex items-center justify-center gap-2 py-3 px-8 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] ${isSaved ? "bg-green-500 text-white shadow-green-100" : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"}`}>
                      {isSaving ? <Loader2 size={20} className="animate-spin" /> : isSaved ? <Check size={20} /> : null}
                      {isSaving ? "Saving..." : isSaved ? "Saved Successfully!" : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "Password" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Current Password</label>
                    <input name="currentPassword" type="password" required className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all outline-none" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">New Password</label>
                    <input name="newPassword" type="password" required className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all outline-none" placeholder="••••••••" />
                  </div>
                  {error && <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30"><AlertCircle size={18} />{error}</div>}
                  <div className="pt-4">
                    <button type="submit" disabled={isSaving} className={`min-w-[160px] flex items-center justify-center gap-2 py-3 px-8 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] ${isSaved ? "bg-green-500 text-white shadow-green-100" : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"}`}>
                      {isSaving ? <Loader2 size={20} className="animate-spin" /> : isSaved ? <Check size={20} /> : null}
                      {isSaving ? "Updating..." : isSaved ? "Password Updated!" : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "Admin Dashboard" && adminData && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                    <Users className="text-indigo-600" />
                    User Management
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {adminData.allUsers.map((u: any) => (
                          <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">{u.username}</span>
                                <span className="text-xs text-slate-500">{u.email}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {u.isActive ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-green-500"><CircleCheck size={14} /> Active</span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs font-bold text-red-500"><CircleX size={14} /> Suspended</span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <form action={updateUserRole.bind(null, u.id, u.role === "admin" ? "user" : "admin")}>
                                <button type="submit" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${u.role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                                  {u.role}
                                </button>
                              </form>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <form action={toggleUserStatus.bind(null, u.id, u.isActive)}>
                                  <button type="submit" className="p-1.5 text-slate-400 hover:text-amber-500"><UserCog size={18} /></button>
                                </form>
                                <form action={deleteUser.bind(null, u.id)}>
                                  <button type="submit" className="p-1.5 text-slate-400 hover:text-red-500"><UserMinus size={18} /></button>
                                </form>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                    <History className="text-indigo-600" />
                    System Activity
                  </h2>
                  <div className="space-y-4">
                    {adminData.recentActivity.map((log: any) => (
                      <div key={log.id} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl">
                        <div>
                          <p className="text-sm font-bold dark:text-white">{log.action}</p>
                          <p className="text-xs text-slate-500">{log.details}</p>
                          <span className="text-[10px] font-bold text-indigo-600 uppercase mt-2 block">{log.user?.username || "System"}</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs (Security, Notifications, Appearance) omitted for brevity but they remain in full version */}
            {activeTab === "Security" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Security Settings</h2>
                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-between border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 transition-all group text-left">
                    <div className="flex items-center gap-4 text-left">
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 shadow-sm"><Lock size={24} /></div>
                      <div className="text-left">
                        <p className="text-sm font-bold dark:text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-400">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 px-4 py-2 rounded-lg transition-colors">Enable</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { id: "email" as const, label: "Email Notifications", desc: "Get updates in your inbox", icon: Mail },
                    { id: "reminders" as const, label: "Task Reminders", desc: "Alerts when tasks are due", icon: Bell },
                    { id: "activity" as const, label: "Account Activity", desc: "Security alerts and login info", icon: Shield }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-transparent hover:border-indigo-50 dark:hover:border-indigo-950/30 transition-all">
                      <div className="flex items-center gap-4">
                        <item.icon size={20} className="text-slate-400" />
                        <div>
                          <p className="text-sm font-bold dark:text-white">{item.label}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleNotification(item.id)} className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${notifications[item.id] ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${notifications[item.id] ? "right-1" : "right-7"}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Appearance" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Appearance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <button onClick={() => setTheme("light")} className={`p-6 rounded-2xl text-left transition-all ${resolvedTheme === "light" ? "border-2 border-indigo-600 bg-white ring-4 ring-indigo-50" : "border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400"}`}>
                    <Sun size={28} className={resolvedTheme === "light" ? "text-indigo-600 mb-4" : "mb-4"} />
                    <p className={`font-bold text-sm ${resolvedTheme === "light" ? "text-slate-900" : ""}`}>Light Mode</p>
                    <p className="text-xs">Clean and professional</p>
                  </button>
                  <button onClick={() => setTheme("dark")} className={`p-6 rounded-2xl text-left transition-all ${resolvedTheme === "dark" ? "border-2 border-indigo-500 bg-slate-900 ring-4 ring-indigo-900/20" : "border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400"}`}>
                    <Moon size={28} className={resolvedTheme === "dark" ? "text-indigo-400 mb-4" : "mb-4"} />
                    <p className={`font-bold text-sm ${resolvedTheme === "dark" ? "text-white" : ""}`}>Dark Mode</p>
                    <p className="text-xs">Easier on the eyes</p>
                  </button>
                </div>
              </div>
            )}
          </div>

          {(activeTab === "Profile" || activeTab === "Password") && (
            <div className="mt-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl p-8 text-left">
              <h2 className="text-xl font-bold text-red-900 dark:text-red-400 mb-2 flex items-center gap-2">
                <Shield size={20} className="text-red-500" />
                Danger Zone
              </h2>
              <p className="text-sm text-red-600 dark:text-red-400/80 mb-6 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 py-3 px-8 rounded-xl hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white font-bold transition-all active:scale-[0.98]">
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
