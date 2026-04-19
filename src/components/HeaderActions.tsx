"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, User as UserIcon, LogOut, Shield, UserCircle } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function HeaderActions({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4 relative" ref={dropdownRef}>
      <Link 
        href="/settings" 
        className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
        title="Settings"
      >
        <Settings size={20} />
      </Link>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 hover:ring-4 hover:ring-indigo-50 transition-all"
      >
        <UserIcon size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-150">
          <div className="px-4 py-3 border-b border-slate-100 mb-2">
            <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <UserCircle size={18} />
            Profile Settings
          </Link>
          
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Shield size={18} />
            Security
          </Link>
          
          <div className="h-px bg-slate-100 my-2"></div>
          
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
