"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Settings, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  UserCircle, 
  Menu, 
  X,
  LayoutDashboard,
  Calendar,
  Flag,
  Tag,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";

export function HeaderActions({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, searchParams]);

  const navClass = (active: boolean) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      active 
        ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400" 
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
    }`;

  const isActive = (filter?: string, category?: string) => {
    const currentFilter = searchParams.get("filter");
    const currentCategory = searchParams.get("category");
    if (category) return currentCategory === category;
    if (filter) return currentFilter === filter;
    return !currentFilter && !currentCategory && pathname === "/";
  };

  return (
    <>
      <div className="flex items-center gap-2 lg:gap-4 relative" ref={dropdownRef}>
        <Link 
          href="/settings" 
          className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
          title="Settings"
        >
          <Settings size={20} />
        </Link>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 hover:ring-4 hover:ring-indigo-50 dark:hover:ring-indigo-900/20 transition-all"
        >
          <UserIcon size={20} />
        </button>

        {/* Desktop Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-150">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            
            {user.role === "admin" && (
              <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors">
                <Shield size={18} />
                Admin Dashboard
              </Link>
            )}

            <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <UserCircle size={18} />
              Profile Settings
            </Link>
            
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
            
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        )}

        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg lg:hidden"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar Content */}
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-lg font-bold tracking-tight dark:text-white">TaskFlow</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-1">
                <Link href="/" className={navClass(isActive())}>
                  <LayoutDashboard size={20} />
                  <span>All Tasks</span>
                </Link>
                <Link href="/?filter=upcoming" className={navClass(isActive("upcoming"))}>
                  <Calendar size={20} />
                  <span>Upcoming</span>
                </Link>
                <Link href="/?filter=important" className={navClass(isActive("important"))}>
                  <Flag size={20} />
                  <span>Important</span>
                </Link>
              </nav>

              <div className="mt-8">
                <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">My Lists</p>
                <div className="space-y-1">
                  {["Personal", "Work", "Ideas"].map(list => (
                    <Link 
                      key={list} 
                      href={`/?category=${list}`} 
                      className={navClass(isActive(undefined, list))}
                    >
                      <div className={`w-2 h-2 rounded-full transition-colors ${
                        isActive(undefined, list) ? "bg-indigo-400" : "bg-slate-300 dark:bg-slate-700"
                      }`}></div>
                      <span>{list}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors mb-2">
                <Settings size={20} />
                <span>Settings</span>
              </Link>
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
