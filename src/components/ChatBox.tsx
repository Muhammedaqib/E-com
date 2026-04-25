"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { sendChatMessageAction } from "@/lib/actions/chat";

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: {
    name: string | null;
    email: string;
    role: string;
  };
  createdAt: Date | string;
}

export function ChatBox({ complaintId, messages, currentUserId }: { 
  complaintId: string, 
  messages: any[], 
  currentUserId: string 
}) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPending) return;

    const messageContent = content;
    setContent("");
    
    startTransition(async () => {
      const res = await sendChatMessageAction(complaintId, messageContent);
      if (res && res.error) {
        alert(res.error);
        setContent(messageContent); // Put it back on error
      }
    });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm italic">No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((m: Message) => (
          <div 
            key={m.id} 
            className={`flex flex-col ${m.senderId === currentUserId ? "items-end" : "items-start"}`}
          >
            <div className={`flex items-center gap-2 mb-1 px-1 ${m.senderId === currentUserId ? "flex-row-reverse" : "flex-row"}`}>
              <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200 uppercase tracking-tight">
                {m.sender.name || m.sender.email.split('@')[0]}
              </span>
              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded uppercase">
                {m.sender.role.replace('_', ' ')}
              </span>
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
              m.senderId === currentUserId 
                ? "bg-amber-500 text-slate-900 rounded-tr-none" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none"
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1 uppercase tracking-widest">
              {mounted ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
            </span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={onSend} className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          disabled={isPending}
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-400 disabled:opacity-50 transition-all active:scale-95"
        >
          {isPending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
