import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle2, AlertCircle, Loader2, PenLine, LayoutGrid } from 'lucide-react';
import axios from 'axios';

const LOGIC_TEMPLATES = {
  'Structured Text (ST)': `(* Example: Motor Start/Stop with Safety Interlock *)
VAR
  Start_PB     : BOOL;   (* Start pushbutton *)
  Stop_PB      : BOOL;   (* Stop pushbutton *)
  E_Stop       : BOOL;   (* Emergency stop - NC contact *)
  Motor_Run    : BOOL;   (* Motor contactor output *)
  Fault_Light  : BOOL;   (* Fault indicator *)
  Over_Temp    : BOOL;   (* Overtemperature sensor *)
END_VAR

(* Latching motor control with safety interlock *)
IF Start_PB AND E_Stop AND NOT Over_Temp THEN
  Motor_Run := TRUE;
END_IF;

IF NOT Stop_PB OR NOT E_Stop OR Over_Temp THEN
  Motor_Run := FALSE;
END_IF;

Fault_Light := Over_Temp OR NOT E_Stop;`,

  'Ladder Logic (LL)': `(* Example: Conveyor Belt Control - Ladder Logic Text Representation *)

RUNG 1: (* Start circuit *)
  |--[START_PB]--[/STOP_PB]--[/ESTOP]--+--[MOTOR_OUT]--|
  |                                      |               |
  |--[MOTOR_OUT]-------------------------+               |

RUNG 2: (* Fault detection *)
  |--[OVER_TEMP]--[FAULT_LIGHT]--|

RUNG 3: (* Auto-stop on sensor trip *)
  |--[SENSOR_A]--[SENSOR_B]--[/MOTOR_OUT]--|
  |   [TON Timer T1 PT:=T#5s]              |`,

  'Instruction List (IL)': `(* Example: Pump Control - Instruction List *)
LD    Level_High       (* Load Level High sensor *)
ANDN  Pump_Run         (* AND NOT current pump state *)
ST    Start_Cmd        (* Store start command *)

LD    Level_Low        (* Load Level Low sensor *)
OR    E_Stop_Active    (* OR emergency stop *)
ST    Stop_Cmd         (* Store stop command *)

LD    Start_Cmd
ANDN  Stop_Cmd
ST    Pump_Run

LD    Pump_Run
ST    Run_Indicator`,
};

const PLCUpload = ({ setPlcData, setActiveTab, plcData }) => {
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'type'
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [typedLogic, setTypedLogic] = useState('');
  const [logicFilename, setLogicFilename] = useState('my_logic.st');
  const [activeTemplate, setActiveTemplate] = useState(null);

  const handleLoadSample = async () => {
    setUploading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/upload-plc', {
        sample: true,
        filename: 'sample_logic.st'
      });
      setPlcData(response.data);
    } catch (err) {
      setError('Failed to load sample logic');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:8000/api/upload-plc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPlcData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyzeTyped = async () => {
    if (!typedLogic.trim()) return;
    setUploading(true);
    setError(null);
    try {
      const blob = new Blob([typedLogic], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', blob, logicFilename);
      const response = await axios.post('http://localhost:8000/api/upload-plc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPlcData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze logic');
    } finally {
      setUploading(false);
    }
  };

  const applyTemplate = (name) => {
    setTypedLogic(LOGIC_TEMPLATES[name]);
    setActiveTemplate(name);
    const extMap = { 'Structured Text (ST)': 'my_logic.st', 'Ladder Logic (LL)': 'my_logic.st', 'Instruction List (IL)': 'my_logic.st' };
    setLogicFilename(extMap[name] || 'my_logic.st');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Mode Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-industrial-border bg-black/20 p-1 gap-1">
        <button
          onClick={() => setInputMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
            inputMode === 'upload'
              ? 'bg-industrial-cyan text-industrial-dark shadow-[0_0_16px_rgba(0,242,255,0.3)]'
              : 'text-industrial-muted hover:text-white'
          }`}
        >
          <Upload size={16} />
          UPLOAD FILE
        </button>
        <button
          onClick={() => setInputMode('type')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
            inputMode === 'type'
              ? 'bg-industrial-cyan text-industrial-dark shadow-[0_0_16px_rgba(0,242,255,0.3)]'
              : 'text-industrial-muted hover:text-white'
          }`}
        >
          <PenLine size={16} />
          TYPE LOGIC
        </button>
      </div>

      {/* Upload Mode */}
      {inputMode === 'upload' && (
        <div className="glass-panel p-8 text-center border-dashed border-2 border-industrial-border hover:border-industrial-cyan transition-all group">
          <input
            type="file"
            id="plc-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".st,.l5x,.xml,.exp"
          />
          <label htmlFor="plc-upload" className="cursor-pointer block">
            <div className="w-16 h-16 bg-industrial-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-industrial-cyan" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Upload PLC Program</h3>
            <p className="text-industrial-muted mb-6">
              Drag and drop your PLC files here or click to browse.<br />
              Supports .L5X, .XML, .EXP, .ST (PLCOpen compatible)
            </p>
          </label>

          {file && (
            <div className="flex items-center justify-center space-x-3 mb-6 bg-white/5 p-3 rounded-lg border border-industrial-border">
              <FileCode className="text-industrial-amber" />
              <span className="font-medium">{file.name}</span>
              <span className="text-xs text-industrial-muted">({(file.size / 1024).toFixed(2)} KB)</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-8 py-3 rounded-lg font-bold flex items-center mx-auto transition-all ${
              !file || uploading
                ? 'bg-industrial-border text-industrial-muted cursor-not-allowed'
                : 'bg-industrial-cyan text-industrial-dark hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                ANALYZING LOGIC...
              </>
            ) : (
              'START INTELLIGENCE ANALYSIS'
            )}
          </button>

          {!file && !uploading && (
            <button
              onClick={handleLoadSample}
              className="mt-4 text-xs font-bold text-industrial-cyan hover:underline uppercase tracking-widest"
            >
              Or load sample industrial logic
            </button>
          )}
        </div>
      )}

      {/* Type Logic Mode */}
      {inputMode === 'type' && (
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <PenLine className="text-industrial-cyan" size={22} />
            <h3 className="text-lg font-bold">Type or Paste PLC Logic</h3>
          </div>

          {/* Template Buttons */}
          <div>
            <p className="text-xs text-industrial-muted uppercase tracking-widest mb-2 flex items-center gap-2">
              <LayoutGrid size={12} /> Quick Templates
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(LOGIC_TEMPLATES).map((name) => (
                <button
                  key={name}
                  onClick={() => applyTemplate(name)}
                  className={`text-xs px-3 py-1.5 rounded-md border font-semibold transition-all ${
                    activeTemplate === name
                      ? 'bg-industrial-cyan/20 border-industrial-cyan text-industrial-cyan'
                      : 'border-industrial-border text-industrial-muted hover:border-industrial-cyan/50 hover:text-white'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Filename input */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-industrial-muted uppercase tracking-widest whitespace-nowrap">Filename:</label>
            <input
              type="text"
              value={logicFilename}
              onChange={(e) => setLogicFilename(e.target.value)}
              placeholder="my_logic.st"
              className="flex-1 bg-black/30 border border-industrial-border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-industrial-cyan transition-colors"
            />
          </div>

          {/* Code Editor */}
          <textarea
            value={typedLogic}
            onChange={(e) => { setTypedLogic(e.target.value); setActiveTemplate(null); }}
            placeholder={`Type your PLC logic here...\n\nExample (Structured Text):\nVAR\n  Motor_Run : BOOL;\nEND_VAR\n\nIF Start_PB AND NOT E_Stop THEN\n  Motor_Run := TRUE;\nEND_IF;`}
            spellCheck={false}
            className="w-full h-72 bg-black/40 border border-industrial-border rounded-xl px-4 py-3 text-sm font-mono text-industrial-cyan placeholder-industrial-muted/40 focus:outline-none focus:border-industrial-cyan resize-y transition-colors leading-relaxed custom-scrollbar"
            style={{ tabSize: 2 }}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const newVal = typedLogic.substring(0, start) + '  ' + typedLogic.substring(end);
                setTypedLogic(newVal);
                setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 2; }, 0);
              }
            }}
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-industrial-muted">
              {typedLogic.length} chars · {typedLogic.split('\n').length} lines
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => { setTypedLogic(''); setActiveTemplate(null); }}
                disabled={!typedLogic}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-industrial-border text-industrial-muted hover:text-white hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                CLEAR
              </button>
              <button
                onClick={handleAnalyzeTyped}
                disabled={!typedLogic.trim() || uploading}
                className={`px-8 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                  !typedLogic.trim() || uploading
                    ? 'bg-industrial-border text-industrial-muted cursor-not-allowed'
                    : 'bg-industrial-cyan text-industrial-dark hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    ANALYZING...
                  </>
                ) : (
                  'ANALYZE LOGIC'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {plcData && (
        <div className="glass-panel p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center space-x-3 text-industrial-green mb-4">
            <CheckCircle2 size={24} />
            <h4 className="text-lg font-bold">Analysis Complete</h4>
          </div>
          <div className="bg-black/30 rounded p-4 border border-industrial-border max-h-64 overflow-y-auto custom-scrollbar">
            <pre className="text-xs text-industrial-cyan">
              {JSON.stringify(plcData.analysis, null, 2)}
            </pre>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('AI Analysis')}
              className="p-3 bg-industrial-cyan/10 border border-industrial-cyan/30 rounded-lg text-xs font-bold hover:bg-industrial-cyan/20 transition-colors"
            >
              VIEW CONTROL NARRATIVE
            </button>
            <button
              onClick={() => setActiveTab('AI Analysis')}
              className="p-3 bg-industrial-amber/10 border border-industrial-amber/30 rounded-lg text-xs font-bold hover:bg-industrial-amber/20 transition-colors"
            >
              GENERATE SAFETY REPORT
            </button>
            <button
              onClick={() => setActiveTab('Simulation')}
              className="p-3 bg-white/5 border border-industrial-border rounded-lg text-xs font-bold hover:bg-white/10 transition-colors"
            >
              OPEN SIMULATION
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="glass-panel p-4 border-industrial-red/50 bg-industrial-red/10 flex items-center space-x-3 text-industrial-red">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PLCUpload;
