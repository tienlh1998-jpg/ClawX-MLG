import React, { useEffect, useState } from 'react';
import { Activity, MessageSquare, Shield, Terminal, Zap, Bot, Send, Globe, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface Stats {
  messages: number;
  platform: string;
  uptime: number;
}

export default function App() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await window.fetch('/api/stats');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error('Received non-JSON response:', text.slice(0, 100));
          throw new TypeError("Oops, we haven't got JSON!");
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#141414] flex items-center justify-center rounded-sm">
            <Bot className="text-[#E4E3E0]" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase italic font-serif">ClawX Agent Control</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono">Mission Control v1.0.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 border border-[#141414] rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono uppercase">System Online</span>
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Stats Grid */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            icon={<MessageSquare size={20} />} 
            label="Messages Processed" 
            value={stats?.messages || 0} 
            subValue="Lifetime"
          />
          <StatCard 
            icon={<Activity size={20} />} 
            label="System Uptime" 
            value={stats ? formatUptime(stats.uptime) : '0h 0m'} 
            subValue={stats?.platform || 'Unknown'}
          />
          <StatCard 
            icon={<Zap size={20} />} 
            label="Agent Status" 
            value="Active" 
            subValue="Gemini 1.5 Pro"
            accent
          />

          {/* System Logs / Terminal */}
          <div className="sm:col-span-3 border border-[#141414] bg-[#141414] text-[#E4E3E0] p-4 rounded-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#E4E3E0]/20 pb-2">
              <div className="flex items-center gap-2">
                <Terminal size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest">System Logs</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>
            <div className="font-mono text-[11px] space-y-1 h-48 overflow-y-auto custom-scrollbar">
              <p className="opacity-50">[2024-02-23 20:57:00] Initializing database connection...</p>
              <p className="text-emerald-400">[2024-02-23 20:57:01] Database connected: agent_memory.db</p>
              <p className="opacity-50">[2024-02-23 20:57:02] Starting Telegram bot listener...</p>
              <p className="opacity-50">[2024-02-23 20:57:03] Starting Discord bot listener...</p>
              <p className="text-blue-400">[2024-02-23 20:57:04] LangGraph workflow compiled successfully.</p>
              <p className="text-emerald-400">[2024-02-23 20:57:05] Server listening on port 3000</p>
              <p className="opacity-50">[2024-02-23 20:57:10] Heartbeat: OK</p>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="md:col-span-4 space-y-6">
          <div className="border border-[#141414] p-4 bg-white/50 backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield size={14} /> Security & Access
            </h3>
            <div className="space-y-3">
              <AccessItem label="Telegram Admin" status="Configured" />
              <AccessItem label="Discord Admin" status="Configured" />
              <AccessItem label="API Key" status="Active" />
            </div>
          </div>

          <div className="border border-[#141414] p-4 bg-white/50 backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Globe size={14} /> Active Tools
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ToolBadge icon={<Globe size={12} />} label="Web Search" />
              <ToolBadge icon={<Database size={12} />} label="SQLite Memory" />
              <ToolBadge icon={<Send size={12} />} label="File Sender" />
              <ToolBadge icon={<Activity size={12} />} label="Calculator" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, accent = false }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border border-[#141414] p-5 relative overflow-hidden ${accent ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-white'}`}
    >
      <div className={`absolute top-0 right-0 p-2 opacity-10 ${accent ? 'text-white' : 'text-black'}`}>
        {icon}
      </div>
      <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1 font-mono">{label}</p>
      <p className="text-3xl font-bold tracking-tighter italic font-serif">{value}</p>
      <p className="text-[10px] uppercase tracking-widest opacity-40 mt-2 font-mono">{subValue}</p>
    </motion.div>
  );
}

function AccessItem({ label, status }: any) {
  return (
    <div className="flex justify-between items-center border-b border-[#141414]/10 pb-2">
      <span className="text-[11px] font-medium">{label}</span>
      <span className="text-[9px] font-mono bg-[#141414] text-[#E4E3E0] px-2 py-0.5 rounded-full uppercase">{status}</span>
    </div>
  );
}

function ToolBadge({ icon, label }: any) {
  return (
    <div className="flex items-center gap-2 border border-[#141414] p-2 rounded-sm hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors cursor-default group">
      <span className="opacity-50 group-hover:opacity-100">{icon}</span>
      <span className="text-[10px] font-mono uppercase">{label}</span>
    </div>
  );
}
