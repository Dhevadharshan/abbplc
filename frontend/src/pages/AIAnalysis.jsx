import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertOctagon, 
  Zap, 
  ArrowRightLeft,
  Bot,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const AIAnalysis = ({ plcData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [safety, setSafety] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!plcData) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const [analysisRes, safetyRes] = await Promise.all([
          axios.post('http://localhost:8000/api/ai-analysis', {
            plc_content: plcData.raw_content,
            filename: plcData.filename,
            format: plcData.format
          }),
          axios.post('http://localhost:8000/api/safety-audit', {
            tags: plcData.analysis?.tags || [],
            logic: plcData.analysis?.logic || plcData.analysis?.rungs || [],
            raw_content: plcData.raw_content
          })
        ]);
        setAnalysis(analysisRes.data);
        setSafety(safetyRes.data);
      } catch (err) {
        setError('Failed to fetch AI analysis. Check backend and API key.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [plcData]);

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

  if (loading) {
    return (
      <div className="glass-panel p-12 text-center animate-pulse">
        <Loader2 className="mx-auto text-industrial-cyan animate-spin mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2">AI is analyzing logic...</h2>
        <p className="text-industrial-muted text-sm">
          Generating control narratives and safety audits via OpenAI GPT-4o.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-12 text-center border-industrial-red/50">
        <AlertOctagon className="mx-auto text-industrial-red mb-4" size={48} />
        <h2 className="text-xl font-bold text-industrial-red mb-2">{error}</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Control Narrative Section */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-industrial-cyan">
            <FileText size={24} />
            <h3 className="text-xl font-bold">AI Control Narrative</h3>
          </div>
          <Bot className="text-industrial-muted animate-pulse" size={20} />
        </div>
        
        <div className="bg-black/30 rounded-lg p-5 border border-industrial-border space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-industrial-cyan uppercase tracking-wider">Sequence of Operation</h4>
            <ul className="text-sm leading-relaxed space-y-2 list-decimal list-inside">
              {analysis?.sequence_of_operation?.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
          
          <div className="pt-4 border-t border-industrial-border">
            <h4 className="text-sm font-bold text-industrial-amber uppercase tracking-wider">Maintenance Notes</h4>
            <ul className="text-sm list-disc list-inside space-y-1 mt-2">
              {analysis?.maintenance_notes?.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Safety Compliance Audit */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center space-x-2 text-industrial-red">
          <ShieldCheck size={24} />
          <h3 className="text-xl font-bold">Safety Compliance Audit</h3>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          {safety?.critical_issues?.map((issue, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-industrial-red/5 border border-industrial-red/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertOctagon className="text-industrial-red" size={24} />
                <div>
                  <p className="font-bold">{issue.title}</p>
                  <p className="text-xs text-industrial-muted">{issue.description}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-industrial-red text-[10px] font-bold rounded">CRITICAL</span>
            </div>
          ))}

          {safety?.warnings?.map((warning, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-industrial-amber/5 border border-industrial-amber/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="text-industrial-amber" size={24} />
                <div>
                  <p className="font-bold">{warning.title}</p>
                  <p className="text-xs text-industrial-muted">{warning.description}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-industrial-amber text-[10px] font-bold rounded">WARNING</span>
            </div>
          ))}

          <div className="p-4 bg-industrial-cyan/5 border border-industrial-cyan/20 rounded-lg mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">Safety Compliance Score</span>
              <span className="text-xl font-bold text-industrial-cyan">{safety?.score}/100</span>
            </div>
            <div className="w-full bg-industrial-border h-2 rounded-full overflow-hidden">
              <div 
                className="bg-industrial-cyan h-full shadow-[0_0_10px_#00f2ff] transition-all duration-1000" 
                style={{ width: `${safety?.score || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logic Visualization Mock */}
      <div className="lg:col-span-2 glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-industrial-green">
            <Zap size={24} />
            <h3 className="text-xl font-bold">Interlock Dependency Graph</h3>
          </div>
          <button className="text-xs font-bold text-industrial-cyan flex items-center hover:underline">
            EXPAND FULL TOPOLOGY <ArrowRightLeft size={14} className="ml-1" />
          </button>
        </div>
        
        <div className="h-64 bg-black/40 rounded-lg border border-industrial-border flex items-center justify-center overflow-hidden">
           {/* This will be replaced by Mermaid.js in the next iteration */}
           <div className="text-center">
              <div className="flex items-center justify-center space-x-8 mb-4">
                <div className="w-16 h-16 rounded border-2 border-industrial-cyan flex items-center justify-center text-[10px] font-bold">INPUT_1</div>
                <ArrowRightLeft className="text-industrial-muted" />
                <div className="w-24 h-16 rounded border-2 border-industrial-amber flex items-center justify-center text-[10px] font-bold">LOGIC_BLOCK</div>
                <ArrowRightLeft className="text-industrial-muted" />
                <div className="w-16 h-16 rounded border-2 border-industrial-green flex items-center justify-center text-[10px] font-bold">OUTPUT_A</div>
              </div>
              <p className="text-xs text-industrial-muted italic">Dynamic logic flow visualization for {plcData.filename}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
