import React, { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import DashboardLayout from './components/DashboardLayout'
import Login from './pages/Login'
import Overview from './pages/Overview'
import PLCUpload from './pages/PLCUpload'
import AIAnalysis from './pages/AIAnalysis'
import Simulation from './pages/Simulation'
import RootCauseAnalysis from './pages/RootCauseAnalysis'
import MigrationAssistant from './pages/MigrationAssistant'
import Documentation from './pages/Documentation'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [plcData, setPlcData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (firebaseUser) => {
    setUser(firebaseUser);
  };

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a10] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-2 border-industrial-cyan border-t-transparent rounded-full animate-spin" />
          <p className="text-industrial-muted text-sm font-semibold uppercase tracking-widest">
            Initializing System...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <Overview plcData={plcData} setActiveTab={setActiveTab} />;
      case 'PLC Upload':
        return <PLCUpload setPlcData={setPlcData} setActiveTab={setActiveTab} plcData={plcData} />;
      case 'AI Analysis':
        return <AIAnalysis plcData={plcData} />;
      case 'Migration':
        return <MigrationAssistant plcData={plcData} />;
      case 'Simulation':
        return <Simulation plcData={plcData} />;
      case 'Diagnostics':
        return <RootCauseAnalysis plcData={plcData} />;
      case 'Documentation':
        return <Documentation plcData={plcData} />;
      default:
        return (
          <div className="glass-panel p-12 text-center animate-slide-up">
            <div className="w-16 h-16 bg-industrial-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-industrial-cyan/30">
              <span className="text-3xl">⚙️</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{activeTab}</h2>
            <p className="text-industrial-muted text-sm">
              This module is currently being calibrated for industrial use.
            </p>
            <div className="mt-4 inline-flex items-center space-x-2 text-xs text-industrial-cyan font-semibold uppercase tracking-widest">
              <span className="pulse-dot w-1.5 h-1.5" />
              <span>Coming Soon</span>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Ambient Background Orbs */}
      <div className="ambient-orb-1" />
      <div className="ambient-orb-2" />
      <div className="ambient-orb-3" />

      {/* Global Scan Line */}
      <div className="scan-line" />

      <DashboardLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      >
        {renderContent()}
      </DashboardLayout>
    </>
  );
}

export default App
