import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Network, 
  ShieldAlert,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

// --- Animated Counter Hook ---
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const executionData = [
  { time: '08:00', load: 42, anomalies: 1, memory: 55 },
  { time: '09:00', load: 58, anomalies: 0, memory: 62 },
  { time: '10:00', load: 71, anomalies: 2, memory: 68 },
  { time: '11:00', load: 65, anomalies: 0, memory: 70 },
  { time: '12:00', load: 80, anomalies: 3, memory: 75 },
  { time: '13:00', load: 76, anomalies: 1, memory: 72 },
  { time: '14:00', load: 61, anomalies: 0, memory: 64 },
  { time: '15:00', load: 55, anomalies: 0, memory: 60 },
  { time: '16:00', load: 68, anomalies: 1, memory: 66 },
  { time: '17:00', load: 73, anomalies: 0, memory: 69 },
];

const recentProjects = [
  { name: 'Boiler_Control_V4', type: 'ST', status: 'warning', issues: 3, health: 82 },
  { name: 'Pump_Station_P101', type: 'L5X', status: 'ok', issues: 0, health: 98 },
  { name: 'Packing_Line_3', type: 'XML', status: 'error', issues: 7, health: 64 },
  { name: 'Conveyor_Belt_A', type: 'ST', status: 'ok', issues: 1, health: 91 },
  { name: 'HVAC_Zone_Control', type: 'L5X', status: 'warning', issues: 2, health: 76 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel-strong p-3 text-xs">
        <p className="font-bold text-slate-300 mb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, suffix = '', subValue, icon: Icon, color, trend, trendUp }) => {
  const count = useCounter(parseFloat(value));
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="holo-card p-5 relative overflow-hidden"
    >
      {/* BG Glow */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ background: `radial-gradient(circle at 80% 20%, ${color}, transparent 60%)` }} />

      <div className="flex justify-between items-start mb-4">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <div className="p-2 rounded-lg" style={{ background: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>

      <div className="flex items-end space-x-1 mb-2">
        <h3 className="text-3xl font-black text-white">
          {count}{suffix}
        </h3>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-500">{subValue}</p>
        {trend && (
          <div className={`flex items-center space-x-1 text-[11px] font-bold ${trendUp ? 'text-[#00ff88]' : 'text-[#ff3e3e]'}`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Bottom progress bar */}
      <div className="mt-3 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full" 
          style={{ 
            width: `${typeof value === 'string' ? parseFloat(value) : value}%`, 
            background: color,
            maxWidth: '100%'
          }} />
      </div>
    </motion.div>
  );
};

const Overview = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value="12"
          subValue="+2 from last month"
          icon={Cpu}
          color="#00f2ff"
          trend="+16.7%"
          trendUp={true}
        />
        <StatCard
          title="Safety Compliance"
          value="94"
          suffix="%"
          subValue="3 critical alerts pending"
          icon={ShieldAlert}
          color="#ff3e3e"
          trend="-2.1%"
          trendUp={false}
        />
        <StatCard
          title="Logic Health Score"
          value="88"
          suffix=".5"
          subValue="Optimal performance"
          icon={CheckCircle2}
          color="#00ff88"
          trend="+4.3%"
          trendUp={true}
        />
        <StatCard
          title="Active Connections"
          value="24"
          subValue="OPC UA / Modbus"
          icon={Network}
          color="#ffab00"
          trend="+3"
          trendUp={true}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-panel p-5"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-base font-bold text-white">System Execution Load</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time CPU & memory tracking</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-[11px] font-semibold text-[#00f2ff]">
                <div className="w-2 h-2 rounded-full bg-[#00f2ff] mr-1.5" /> CPU Load
              </span>
              <span className="flex items-center text-[11px] font-semibold text-[#a855f7]">
                <div className="w-2 h-2 rounded-full bg-[#a855f7] mr-1.5" /> Memory
              </span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={executionData}>
                <defs>
                  <linearGradient id="gradLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="time" stroke="#374151" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis stroke="#374151" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="load" name="CPU Load" stroke="#00f2ff" strokeWidth={2} fill="url(#gradLoad)" />
                <Area type="monotone" dataKey="memory" name="Memory" stroke="#a855f7" strokeWidth={2} fill="url(#gradMemory)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Critical Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white">Critical Alerts</h3>
            <span className="tag-badge tag-red">3 Active</span>
          </div>
          <div className="space-y-3">
            {[
              { 
                title: 'Missing E-Stop Logic', 
                project: 'Boiler_Control_V2', 
                severity: 'critical',
                color: '#ff3e3e',
                bg: 'rgba(255,62,62,0.08)',
                border: 'rgba(255,62,62,0.3)',
                time: '5 min ago'
              },
              { 
                title: 'Recursive SFC Jump', 
                project: 'Packing_Line_3', 
                severity: 'warning',
                color: '#ffab00',
                bg: 'rgba(255,171,0,0.08)',
                border: 'rgba(255,171,0,0.3)',
                time: '23 min ago'
              },
              { 
                title: 'PID Loop Unstable', 
                project: 'HVAC_Zone_Control', 
                severity: 'warning',
                color: '#ffab00',
                bg: 'rgba(255,171,0,0.08)',
                border: 'rgba(255,171,0,0.3)',
                time: '1h ago'
              },
              { 
                title: 'Optimization Available', 
                project: 'Pump_Station_P101', 
                severity: 'info',
                color: '#00f2ff',
                bg: 'rgba(0,242,255,0.08)',
                border: 'rgba(0,242,255,0.3)',
                time: '2h ago'
              },
            ].map((alert, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-xl cursor-pointer hover:brightness-110 transition-all"
                style={{ background: alert.bg, border: `1px solid ${alert.border}` }}>
                <AlertTriangle size={14} style={{ color: alert.color, marginTop: 2, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{alert.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{alert.project}</p>
                </div>
                <span className="text-[9px] text-slate-600 flex-shrink-0 mt-0.5">{alert.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all hover:bg-white/5 text-slate-500 border border-white/5 hover:border-white/10 hover:text-slate-300">
            View All Diagnostics →
          </button>
        </motion.div>
      </div>

      {/* Recent Projects Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-5"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent PLC Projects</h3>
            <p className="text-xs text-slate-500">Uploaded and analyzed programs</p>
          </div>
          <button className="btn-primary text-[10px] px-4 py-2">
            + New Analysis
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Project Name', 'Format', 'Health Score', 'Issues', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentProjects.map((p, i) => (
                <tr key={i} className="hover:bg-white/3 transition-colors group">
                  <td className="py-3 pr-4">
                    <span className="font-semibold text-slate-200 font-mono text-xs">{p.name}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="tag-badge tag-cyan">{p.type}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full w-20">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${p.health}%`,
                            background: p.health > 90 ? '#00ff88' : p.health > 75 ? '#ffab00' : '#ff3e3e'
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{
                        color: p.health > 90 ? '#00ff88' : p.health > 75 ? '#ffab00' : '#ff3e3e'
                      }}>{p.health}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-bold ${p.issues === 0 ? 'text-[#00ff88]' : p.issues < 3 ? 'text-[#ffab00]' : 'text-[#ff3e3e]'}`}>
                      {p.issues === 0 ? '✓ None' : `${p.issues} found`}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`tag-badge ${p.status === 'ok' ? 'tag-green' : p.status === 'warning' ? 'tag-amber' : 'tag-red'}`}>
                      {p.status === 'ok' ? 'Healthy' : p.status === 'warning' ? 'Warning' : 'Critical'}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="text-[10px] font-bold text-[#00f2ff] opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                      ANALYZE →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
