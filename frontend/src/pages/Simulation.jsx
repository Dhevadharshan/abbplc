import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, AlertTriangle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Simulation = ({ plcData }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [level, setLevel] = useState(45);
  const [pumpActive, setPumpActive] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // Mock simulation logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setLevel(prev => {
          if (prev < 20 && !pumpActive) {
            setPumpActive(true);
            setAlerts(a => [...a, "Pump P101 Started: Low Level threshold reached"]);
          }
          if (prev > 90 && pumpActive) {
            setPumpActive(false);
            setAlerts(a => [...a, "Pump P101 Stopped: High Level threshold reached"]);
          }
          
          return pumpActive ? prev + 1.5 : prev - 0.5;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isRunning, pumpActive]);

  if (!plcData) {
    return (
      <div className="glass-panel p-12 text-center animate-slide-up">
        <AlertTriangle className="mx-auto text-industrial-amber mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2">No PLC Logic Loaded</h2>
        <p className="text-industrial-muted text-sm">
          Please upload a PLC project file or load a sample from the Upload tab first.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Simulation Mimic */}
      <div className="lg:col-span-2 glass-panel p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold flex items-center">
            <Activity className="text-industrial-cyan mr-2" /> Digital Twin: Tank System
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 rounded ${isRunning ? 'bg-industrial-red/20 text-industrial-red' : 'bg-industrial-cyan/20 text-industrial-cyan'}`}
            >
              {isRunning ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button 
              onClick={() => {setLevel(45); setIsRunning(false); setPumpActive(false); setAlerts([]);}}
              className="p-2 rounded bg-white/5 text-industrial-muted hover:text-industrial-text"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="relative h-96 bg-black/40 rounded-xl border border-industrial-border flex items-center justify-center">
          {/* Tank SVG */}
          <div className="relative w-48 h-72 border-x-4 border-b-4 border-industrial-border rounded-b-3xl overflow-hidden bg-industrial-dark/50">
            {/* Water Level */}
            <motion.div 
              className="absolute bottom-0 w-full bg-industrial-cyan/40"
              animate={{ height: `${level}%` }}
              transition={{ type: "tween", ease: "linear" }}
            >
              <div className="absolute top-0 w-full h-4 bg-industrial-cyan/60 blur-[2px] animate-pulse" />
            </motion.div>
            
            {/* Level Markers */}
            <div className="absolute left-2 h-full flex flex-col justify-between py-4 text-[10px] text-industrial-muted font-mono">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
          </div>

          {/* Pump Component */}
          <div className="absolute right-12 bottom-12 text-center">
            <motion.div 
              animate={pumpActive ? { rotate: 360 } : {}}
              transition={pumpActive ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
              className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-2 ${pumpActive ? 'border-industrial-cyan shadow-[0_0_15px_#00f2ff]' : 'border-industrial-border'}`}
            >
              <div className="w-1 h-8 bg-industrial-cyan/50 rounded-full" />
              <div className="w-8 h-1 bg-industrial-cyan/50 rounded-full absolute" />
            </motion.div>
            <p className={`text-xs font-bold ${pumpActive ? 'text-industrial-cyan' : 'text-industrial-muted'}`}>PUMP P-101</p>
          </div>

          {/* Value Display */}
          <div className="absolute top-8 left-8 glass-panel p-4 border-industrial-cyan/30">
            <p className="text-[10px] text-industrial-muted uppercase font-bold tracking-widest mb-1">Process Variable</p>
            <h4 className="text-2xl font-mono font-bold text-industrial-cyan">{level.toFixed(1)}%</h4>
          </div>
        </div>
      </div>

      {/* Simulation Controls & Logs */}
      <div className="glass-panel p-6 flex flex-col">
        <h3 className="text-lg font-bold mb-4">Event Logs</h3>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {alerts.length === 0 && (
            <p className="text-sm text-industrial-muted italic text-center mt-8">No simulation events recorded.</p>
          )}
          {[...alerts].reverse().map((alert, i) => (
            <div key={i} className="p-3 bg-white/5 rounded border border-industrial-border text-xs flex items-start space-x-2 animate-in slide-in-from-right-2">
              <AlertTriangle size={14} className="text-industrial-amber mt-0.5 shrink-0" />
              <span>{alert}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-industrial-border">
          <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-industrial-muted">Control Parameters</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span>Simulation Speed</span>
                <span>1.0x</span>
              </div>
              <input type="range" className="w-full accent-industrial-cyan bg-industrial-border h-1 rounded-full appearance-none cursor-pointer" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span>Inflow Rate</span>
                <span>1.5 L/s</span>
              </div>
              <input type="range" className="w-full accent-industrial-cyan bg-industrial-border h-1 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
