import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Settings2, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  FileDown,
  Play,
  Loader2,
  AlertOctagon
} from 'lucide-react';
import axios from 'axios';

const MigrationAssistant = ({ plcData }) => {
  const [source, setSource] = useState('Siemens S7-1500');
  const [target, setTarget] = useState('ABB AC800M');
  const [migrationResult, setMigrationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMigrate = async () => {
    if (!plcData) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/migrate', {
        source_vendor: source,
        target_vendor: target,
        content: plcData.raw_content
      });
      setMigrationResult(response.data);
    } catch (err) {
      setError('Failed to run migration analysis. Please check your connection.');
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
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-bold text-industrial-muted uppercase tracking-widest block mb-2">Source Hardware</label>
            <div className="p-3 bg-white/5 border border-industrial-border rounded-lg flex items-center space-x-3">
              <Cpu className="text-industrial-muted" size={20} />
              <select 
                value={source} 
                onChange={(e) => setSource(e.target.value)}
                className="bg-transparent border-none text-industrial-text w-full focus:ring-0 cursor-pointer"
              >
                <option value="Siemens S7-1500">Siemens S7-1500</option>
                <option value="Allen Bradley ControlLogix">Allen Bradley ControlLogix</option>
                <option value="Schneider Modicon M580">Schneider Modicon M580</option>
                <option value="Generic IEC 61131-3">Generic IEC 61131-3</option>
              </select>
            </div>
          </div>

          <div className="bg-industrial-cyan/10 p-3 rounded-full flex-shrink-0 cursor-pointer hover:bg-industrial-cyan/20 transition-colors" onClick={handleMigrate}>
            {loading ? <Loader2 className="text-industrial-cyan animate-spin" /> : <Play className="text-industrial-cyan ml-1" />}
          </div>

          <div className="flex-1 w-full">
            <label className="text-[10px] font-bold text-industrial-muted uppercase tracking-widest block mb-2">Target Architecture</label>
            <div className="p-3 bg-industrial-cyan/5 border border-industrial-cyan/30 rounded-lg flex items-center space-x-3">
              <Cpu className="text-industrial-cyan" size={20} />
              <select 
                value={target} 
                onChange={(e) => setTarget(e.target.value)}
                className="bg-transparent border-none text-industrial-text w-full focus:ring-0 cursor-pointer"
              >
                <option value="ABB AC800M">ABB AC800M</option>
                <option value="Siemens S7-1500">Siemens S7-1500</option>
                <option value="Mitsubishi iQ-R">Mitsubishi iQ-R</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass-panel p-4 border-industrial-red/50 bg-industrial-red/10 flex items-center space-x-3 text-industrial-red">
          <AlertOctagon size={20} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {migrationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Conversion Logic */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                <Settings2 className="text-industrial-cyan mr-2" /> Logic Translation Engine
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 rounded border border-industrial-border max-h-64 overflow-y-auto custom-scrollbar">
                    <p className="text-[10px] font-bold text-industrial-muted mb-2 uppercase">Source Snippet</p>
                    <pre className="text-xs text-industrial-text font-mono">
                      {migrationResult.source_code}
                    </pre>
                  </div>
                  <div className="p-4 bg-industrial-cyan/5 rounded border border-industrial-cyan/20 max-h-64 overflow-y-auto custom-scrollbar">
                    <p className="text-[10px] font-bold text-industrial-cyan mb-2 uppercase">Target Snippet</p>
                    <pre className="text-xs text-industrial-cyan font-mono">
                      {migrationResult.target_code}
                    </pre>
                  </div>
                </div>

                {migrationResult.warnings?.map((warning, idx) => (
                  <div key={idx} className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start space-x-3">
                    <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                    <div className="text-xs">
                      <p className="font-bold text-amber-500">{warning.title}</p>
                      <p className="text-industrial-muted mt-1">{warning.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold mb-4">Tag Mapping Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-industrial-border">
                      <th className="py-3 px-2 text-[10px] font-bold text-industrial-muted uppercase">Source Tag</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-industrial-muted uppercase">Target Tag</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-industrial-muted uppercase">Data Type</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-industrial-muted uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {migrationResult.tag_mapping?.map((row, i) => (
                      <tr key={i} className="border-b border-industrial-border/50 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2 font-mono">{row.src}</td>
                        <td className="py-3 px-2 font-mono text-industrial-cyan">{row.dst}</td>
                        <td className="py-3 px-2">{row.type}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            row.status === 'MAPPED' ? 'bg-industrial-green/20 text-industrial-green' : 'bg-industrial-amber/20 text-industrial-amber'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Migration Report */}
          <div className="space-y-6">
            <div className="glass-panel p-6 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-industrial-cyan relative mb-4">
                <span className="text-2xl font-bold">{migrationResult.score}%</span>
                <div className="absolute inset-0 border-4 border-industrial-cyan rounded-full animate-ping opacity-20" />
              </div>
              <h4 className="text-lg font-bold">Migration Score</h4>
              <p className="text-xs text-industrial-muted mt-2">Score represents syntax and logic compatibility between architectures.</p>
            </div>

            <div className="glass-panel p-6">
              <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-industrial-muted">Automated Actions</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded bg-industrial-cyan/10 border border-industrial-cyan/20 hover:bg-industrial-cyan/20 transition-colors">
                  <span className="text-xs font-bold text-industrial-cyan">GENERATE TARGET CODE</span>
                  <FileDown size={16} className="text-industrial-cyan" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded bg-white/5 border border-industrial-border hover:bg-white/10 transition-colors">
                  <span className="text-xs font-bold">DOWNLOAD TAG LIST</span>
                  <FileDown size={16} />
                </button>
              </div>
            </div>

            <div className="glass-panel p-4 bg-industrial-green/5 border-industrial-green/20">
              <div className="flex items-center space-x-2 text-industrial-green mb-2">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold">AI ASSISTANT ACTIVE</span>
              </div>
              <p className="text-[10px] text-industrial-muted italic">
                "{migrationResult.ai_note}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MigrationAssistant;
