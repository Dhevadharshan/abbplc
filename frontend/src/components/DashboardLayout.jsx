import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Upload, 
  ShieldCheck, 
  Zap, 
  History, 
  Settings, 
  Activity,
  FileText,
  MessageSquare,
  LogOut,
  Bell,
  ChevronRight,
  Cpu
} from 'lucide-react';

const menuItems = [
  { label: 'Overview', icon: LayoutDashboard, group: 'MAIN' },
  { label: 'PLC Upload', icon: Upload, group: 'MAIN' },
  { label: 'AI Analysis', icon: Zap, group: 'INTELLIGENCE' },
  { label: 'Safety Audit', icon: ShieldCheck, group: 'INTELLIGENCE' },
  { label: 'Diagnostics', icon: MessageSquare, group: 'INTELLIGENCE' },
  { label: 'Migration', icon: History, group: 'TOOLS' },
  { label: 'Simulation', icon: Activity, group: 'TOOLS' },
  { label: 'Documentation', icon: FileText, group: 'TOOLS' },
  { label: 'Settings', icon: Settings, group: 'SYSTEM' },
];

const groupOrder = ['MAIN', 'INTELLIGENCE', 'TOOLS', 'SYSTEM'];

const groupColors = {
  MAIN: '#00f2ff',
  INTELLIGENCE: '#a855f7',
  TOOLS: '#ffab00',
  SYSTEM: '#64748b',
};

const SidebarItem = ({ icon: Icon, label, active, onClick, color }) => (
  <motion.div
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 group ${
      active
        ? 'bg-white/8'
        : 'hover:bg-white/5'
    }`}
    style={active ? { 
      background: `linear-gradient(90deg, ${color}18, transparent)`,
      borderLeft: `2px solid ${color}`,
    } : {
      borderLeft: '2px solid transparent',
    }}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-1.5 rounded-md transition-all duration-200`}
        style={active ? { background: `${color}20` } : {}}>
        <Icon 
          size={16} 
          style={{ color: active ? color : '#64748b' }} 
          className="group-hover:opacity-100 transition-opacity"
        />
      </div>
      <span 
        className={`text-sm font-semibold transition-colors duration-200`}
        style={{ color: active ? color : '#94a3b8' }}
      >
        {label}
      </span>
    </div>
    {active && (
      <ChevronRight size={12} style={{ color }} className="opacity-60" />
    )}
  </motion.div>
);

const DashboardLayout = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const [notifOpen, setNotifOpen] = useState(false);

  const grouped = groupOrder.map(g => ({
    group: g,
    items: menuItems.filter(m => m.group === g),
    color: groupColors[g],
  }));

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Automation Eng.';
  const photoURL = user?.photoURL;
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-[#060a10] text-slate-200 overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <div className="w-60 flex-shrink-0 flex flex-col border-r border-white/5 relative"
        style={{ background: 'rgba(8, 12, 20, 0.95)' }}>

        {/* Sidebar ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00f2ff]/5 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl" />
        </div>

        {/* Logo */}
        <div className="p-5 border-b border-white/5 relative">
          <div className="flex items-center space-x-2.5">
            <div className="relative w-9 h-9 bg-[#00f2ff]/10 rounded-xl flex items-center justify-center border border-[#00f2ff]/30"
              style={{ boxShadow: '0 0 12px rgba(0,242,255,0.2)' }}>
              <Cpu size={18} className="text-[#00f2ff]" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00ff88] rounded-full border-2 border-[#060a10]" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight neon-text-cyan">PLCInsight</h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">AI Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {grouped.map(({ group, items, color }) => (
            <div key={group}>
              <p className="text-[9px] font-bold tracking-[0.15em] px-3 mb-2"
                style={{ color: `${color}80` }}>
                {group}
              </p>
              <div className="space-y-0.5">
                {items.map(item => (
                  <SidebarItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    active={activeTab === item.label}
                    color={color}
                    onClick={() => setActiveTab(item.label)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            {/* Avatar */}
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName}
                className="w-9 h-9 rounded-full ring-2 ring-[#00f2ff]/30 flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#00f2ff]/15 border border-[#00f2ff]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-[#00f2ff] font-bold text-xs">{initials}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{displayName}</p>
              <p className="text-[10px] text-[#00ff88] font-bold">● Online</p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-white/5"
          style={{ background: 'rgba(6, 10, 16, 0.8)', backdropFilter: 'blur(12px)' }}>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{activeTab}</h2>
              <span className="tag-badge tag-cyan">Live</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* System Status */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
              <div className="pulse-dot w-1.5 h-1.5" />
              <span className="text-[10px] font-bold text-[#00ff88] uppercase tracking-widest">System Online</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg border border-white/10 bg-white/5 hover:border-[#00f2ff]/30 hover:bg-white/10 transition-all relative"
              >
                <Bell size={16} className="text-slate-400" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ff3e3e] rounded-full" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 glass-panel-strong p-3 z-50"
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Notifications
                    </p>
                    {[
                      { text: 'Missing E-Stop in Boiler_Control_V2', type: 'red', time: '5m ago' },
                      { text: 'Safety audit report ready', type: 'green', time: '1h ago' },
                      { text: 'AI analysis complete for Pump_P101', type: 'cyan', time: '2h ago' },
                    ].map((n, i) => (
                      <div key={i} className={`flex items-start space-x-2 p-2 rounded-lg mb-1 tag-${n.type} bg-opacity-5`}
                        style={{ background: n.type === 'red' ? 'rgba(255,62,62,0.08)' : n.type === 'green' ? 'rgba(0,255,136,0.08)' : 'rgba(0,242,255,0.08)' }}>
                        <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${n.type === 'red' ? 'bg-[#ff3e3e]' : n.type === 'green' ? 'bg-[#00ff88]' : 'bg-[#00f2ff]'}`} />
                        <div>
                          <p className="text-xs text-slate-300">{n.text}</p>
                          <p className="text-[10px] text-slate-600">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-grid-animated relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative z-10"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 flex items-center justify-center px-6 py-2 border-t border-white/5"
          style={{ background: 'rgba(6, 10, 16, 0.8)', backdropFilter: 'blur(12px)' }}>
          <p className="text-[10px] font-semibold tracking-widest uppercase"
            style={{ color: 'rgba(100,116,139,0.7)' }}>
            For{' '}
            <span style={{ color: '#ff0000', fontWeight: 800 }}>ABB</span>
            {' '}EngineeredX 2.0 · by{' '}
            <span style={{ color: '#00f2ff', fontWeight: 700 }}>Pranaya Ponnilavarasan</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
