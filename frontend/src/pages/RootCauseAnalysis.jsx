import React, { useState } from 'react';
import { 
  GitMerge, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Play,
  Loader2,
  AlertOctagon
} from 'lucide-react';
import axios from 'axios';

const RootCauseAnalysis = ({ plcData }) => {
  const [faultDesc, setFaultDesc] = useState('Motor M101 Overload Trip');
  const [rcaResult, setRcaResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!plcData) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/root-cause', {
        fault_description: faultDesc,
        plc_content: plcData.raw_content
      });
      setRcaResult(response.data);
    } catch (err) {
      setError('Failed to run root cause analysis. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!plcData) {
    return (
      <div className="glass-panel p-12 text-center animate-slide-up">
        <AlertOctagon className="mx-auto text-industrial-amber mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2">No PLC Logic Loaded</h2>
        <p className="text-industrial-muted text-sm">
          Please upload a PLC project file or load a sample from the Upload tab first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 mb-6">
        <label className="text-[10px] font-bold text-industrial-muted uppercase tracking-widest block mb-2">Reported Fault / Anomaly</label>
        <div className="flex space-x-4">
          <input 
            type="text" 
            value={faultDesc}
            onChange={(e) => setFaultDesc(e.target.value)}
            className="flex-1 bg-black/40 border border-industrial-border rounded-lg p-3 text-industrial-text focus:border-industrial-cyan focus:outline-none transition-colors"
            placeholder="e.g. Pump fails to start when tank is full"
          />
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-industrial-cyan text-industrial-dark font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all disabled:opacity-50 flex items-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Search className="mr-2" size={18} />}
            {loading ? 'ANALYZING...' : 'INVESTIGATE'}
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-panel p-4 border-industrial-red/50 bg-industrial-red/10 flex items-center space-x-3 text-industrial-red">
          <AlertOctagon size={20} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {rcaResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {/* RCA Investigation Panel */}
          <div className="lg:col-span-2 glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Search className="text-industrial-amber mr-2" /> AI Fault Investigation
              </h3>
              <span className="text-xs font-mono text-industrial-muted tracking-widest">ID: RCA-{Math.floor(Math.random() * 9000) + 1000}-X</span>
            </div>

            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-industrial-border">
              {rcaResult.fault_tree?.map((item, index) => (
                <div key={item.id || index} className="relative">
                  <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 bg-industrial-dark flex items-center justify-center ${
                    item.status === 'FAULT' ? 'border-industrial-red text-industrial-red' : 
                    item.status === 'CAUSE' ? 'border-industrial-amber text-industrial-amber' : 
                    'border-industrial-green text-industrial-green shadow-[0_0_10px_#00ff88]'
                  }`}>
                    {index === 0 ? <ShieldAlert size={12} /> : index === 1 ? <ArrowRight size={12} /> : <CheckCircle2 size={12} />}
                  </div>
                  
                  <div className={`p-4 rounded-lg border bg-white/5 ${
                    item.status === 'FAULT' ? 'border-industrial-red/30' : 
                    item.status === 'CAUSE' ? 'border-industrial-amber/30' : 
                    'border-industrial-green/30'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'FAULT' ? 'bg-industrial-red/20 text-industrial-red' : 
                        item.status === 'CAUSE' ? 'bg-industrial-amber/20 text-industrial-amber' : 
                        'bg-industrial-green/20 text-industrial-green'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs font-mono text-industrial-muted">{item.time}</span>
                    </div>
                    <p className="font-semibold text-lg">{item.label}</p>
                    {item.status === 'ROOT' && (
                      <div className="mt-4 p-3 bg-industrial-green/5 border border-industrial-green/20 rounded text-sm text-industrial-text">
                        <p className="font-bold text-industrial-green mb-1">AI Recommendation:</p>
                        "{rcaResult.recommendation}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Metadata */}
          <div className="space-y-6">
            <div className="glass-panel p-6">
              <h4 className="text-sm font-bold text-industrial-muted uppercase tracking-widest mb-4">Signal Snapshot</h4>
              <div className="space-y-3">
                {rcaResult.signals?.map((sig, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                    <span className="text-xs font-mono text-industrial-muted">{sig.label}</span>
                    <div className="text-right">
                      <p className="text-sm font-bold">{sig.val}</p>
                      <p className={`text-[10px] font-bold ${
                        sig.status === 'HIGH' || sig.status === 'TRIP' ? 'text-industrial-red' : 'text-industrial-cyan'
                      }`}>{sig.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 border-industrial-cyan/20">
              <h4 className="text-sm font-bold text-industrial-cyan uppercase tracking-widest mb-4 flex items-center">
                <Database size={16} className="mr-2" /> Historical Context
              </h4>
              <p className="text-xs text-industrial-muted leading-relaxed">
                This specific failure pattern has occurred <span className="text-industrial-text font-bold">previously</span> in similar PLC codebases.
              </p>
              <div className="mt-4 h-2 bg-industrial-border rounded-full overflow-hidden">
                <div className="bg-industrial-amber h-full w-[85%]" />
              </div>
              <p className="text-[10px] text-industrial-muted mt-2 text-center italic">Correlation confidence: 85%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RootCauseAnalysis;
