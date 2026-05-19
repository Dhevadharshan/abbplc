import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  FileSearch,
  ExternalLink,
  Loader2,
  AlertOctagon
} from 'lucide-react';
import axios from 'axios';

const Documentation = ({ plcData }) => {
  const [template, setTemplate] = useState('Standard ISO 9001');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const [documents, setDocuments] = useState([
    { name: 'Functional Design Specification (FDS)', status: 'Generated', date: '2024-05-16', type: 'PDF' },
    { name: 'Safety Compliance Audit Report', status: 'Generated', date: '2024-05-16', type: 'PDF' },
    { name: 'I/O Assignment List', status: 'Generated', date: '2024-05-15', type: 'EXCEL' },
    { name: 'Cause & Effect Matrix', status: 'Draft', date: '2024-05-14', type: 'DOCX' },
  ]);

  const handleGenerate = async () => {
    if (!plcData) return;
    setGenerating(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const response = await axios.post('http://localhost:8000/api/generate-docs', {
        analysis: plcData.analysis,
        template: template
      });
      
      setSuccessMsg(response.data.message);
      
      // Add the new doc to the list
      setDocuments([{
        name: `AI Generated Report (${template})`,
        status: 'Generated',
        date: new Date().toISOString().split('T')[0],
        type: 'PDF'
      }, ...documents]);
      
    } catch (err) {
      setError('Failed to generate documentation.');
    } finally {
      setGenerating(false);
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <FileSearch className="text-industrial-cyan mr-2" /> Project Documentation Vault
          </h3>
          
          <div className="space-y-3">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-industrial-border rounded-lg hover:bg-white/10 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded ${doc.type === 'PDF' ? 'bg-red-500/10 text-red-500' : doc.type === 'EXCEL' ? 'bg-green-500/10 text-green-500' : 'bg-industrial-cyan/10 text-industrial-cyan'}`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{doc.name}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-[10px] text-industrial-muted flex items-center">
                        <Clock size={10} className="mr-1" /> {doc.date}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        doc.status === 'Generated' ? 'bg-industrial-green/20 text-industrial-green' : 'bg-industrial-amber/20 text-industrial-amber'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-industrial-muted hover:text-industrial-cyan transition-colors">
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-Gen Settings */}
        <div className="space-y-6">
          <div className="glass-panel p-6 bg-industrial-cyan/5 border-industrial-cyan/30">
            <h4 className="text-sm font-bold text-industrial-cyan uppercase tracking-widest mb-4">Auto-Generation Engine</h4>
            <p className="text-xs text-industrial-muted mb-6 leading-relaxed">
              PLCInsight AI can automatically generate a full suite of industrial documentation based on the parsed logic and AI narratives.
            </p>
            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 bg-industrial-cyan text-industrial-dark font-bold rounded-lg shadow-[0_0_15px_#00f2ff] hover:scale-[1.02] transition-transform flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
            >
              {generating ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              {generating ? 'GENERATING...' : 'GENERATE ALL REPORTS'}
              {!generating && <ExternalLink size={16} className="ml-2" />}
            </button>
            
            {error && <p className="text-xs text-industrial-red mt-4 font-bold">{error}</p>}
            {successMsg && <p className="text-xs text-industrial-green mt-4 font-bold flex items-center"><CheckCircle className="mr-1" size={12}/> {successMsg}</p>}
          </div>

          <div className="glass-panel p-6">
            <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-industrial-muted">Templates</h4>
            <div className="space-y-2">
              {['Standard ISO 9001', 'ABB Engineering Standard', 'Offshore O&G Compliance'].map(t => (
                <label key={t} className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-white/5">
                  <input 
                    type="radio" 
                    name="template" 
                    checked={template === t} 
                    onChange={() => setTemplate(t)}
                    className="accent-industrial-cyan" 
                  />
                  <span className="text-xs">{t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
