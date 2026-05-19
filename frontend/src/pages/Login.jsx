import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Lock, Activity, Cpu, Database, AlertTriangle } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

// Animated floating particles
const Particle = ({ style }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: `${Math.random() * 4 + 1}px`,
      height: `${Math.random() * 4 + 1}px`,
      background: 'rgba(0, 242, 255, 0.3)',
      ...style,
    }}
  />
);

const FEATURES = [
  { icon: Cpu, title: 'AI Logic Analysis', desc: 'GPT-powered PLC code interpretation' },
  { icon: ShieldCheck, title: 'Safety Audit', desc: 'IEC 62061 / SIL compliance checks' },
  { icon: Activity, title: 'Digital Twin', desc: 'Real-time simulation & visualization' },
  { icon: Database, title: 'Multi-Format', desc: 'Supports L5X, ST, XML, EXP files' },
];

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [particles, setParticles] = useState([]);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    // Generate particles
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${Math.random() * 4 + 4}s`,
      }))
    );

    // Cycle features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDemoLogin = () => {
    // Demo mode: bypasses Firebase auth for local testing
    onLogin({
      displayName: 'Demo Engineer',
      email: 'demo@plcinsight.ai',
      photoURL: null,
      uid: 'demo-user',
    });
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (err) {
      const msg = err.code === 'auth/popup-closed-by-user'
        ? 'Login cancelled.'
        : err.message?.includes('CONFIGURATION_NOT_FOUND')
        ? 'Firebase: Enable Google Sign-In in your Firebase Console → Authentication → Sign-in method.'
        : 'Authentication failed. Please try again.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a10] flex items-stretch relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,242,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)' }} />

      {/* Grid bg */}
      <div className="absolute inset-0 bg-grid-animated opacity-60" />

      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-1 h-1 rounded-full opacity-30 pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            background: '#00f2ff',
            animation: `orb-float ${p.animationDuration} ${p.animationDelay} ease-in-out infinite alternate`,
          }}
        />
      ))}

      {/* Scan Line */}
      <div className="scan-line" />

      {/* Left Panel - Feature Showcase */}
      <div className="hidden lg:flex flex-col flex-1 justify-center px-16 py-12 relative">
        <div className="max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(0,242,255,0.2)' }}>
                <Cpu size={22} className="text-[#00f2ff]" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight text-white">PLC<span className="text-[#00f2ff]">Insight</span> AI</span>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Industrial Intelligence Platform</p>
              </div>
            </div>

            <h1 className="text-5xl font-black text-white leading-tight mb-4">
              Next-Gen
              <br />
              <span className="text-transparent bg-clip-text" 
                style={{ backgroundImage: 'linear-gradient(135deg, #00f2ff, #a855f7)' }}>
                PLC Intelligence
              </span>
              <br />
              Platform
            </h1>

            <p className="text-slate-400 text-base mb-10 leading-relaxed">
              AI-powered analysis, safety auditing, and digital twin simulation 
              for IEC 61131-3 industrial control programs.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    borderColor: activeFeature === i ? 'rgba(0,242,255,0.4)' : 'rgba(255,255,255,0.06)',
                    background: activeFeature === i ? 'rgba(0,242,255,0.06)' : 'rgba(255,255,255,0.02)'
                  }}
                  className="p-4 rounded-xl border cursor-pointer"
                  onClick={() => setActiveFeature(i)}
                >
                  <f.icon size={18} className={activeFeature === i ? 'text-[#00f2ff] mb-2' : 'text-slate-500 mb-2'} />
                  <p className={`text-xs font-bold mb-0.5 ${activeFeature === i ? 'text-white' : 'text-slate-400'}`}>
                    {f.title}
                  </p>
                  <p className="text-[10px] text-slate-600">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex space-x-6">
              {[
                { value: '150+', label: 'PLC Formats' },
                { value: '99.8%', label: 'Uptime' },
                { value: '<2s', label: 'AI Response' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-xl font-black neon-text-cyan">{s.value}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Card */}
      <div className="flex items-center justify-center w-full lg:w-[480px] lg:flex-shrink-0 p-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="glass-panel-strong p-8 rounded-2xl"
            style={{ boxShadow: '0 0 60px rgba(0,242,255,0.07), 0 0 120px rgba(168,85,247,0.04)' }}>

            {/* Logo - Mobile Only */}
            <div className="flex lg:hidden items-center space-x-2 mb-6">
              <Cpu size={20} className="text-[#00f2ff]" />
              <span className="font-black text-white">PLC<span className="text-[#00f2ff]">Insight</span> AI</span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
              <p className="text-sm text-slate-500">Sign in to access the industrial control platform</p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center space-x-2 p-3 rounded-xl mb-4 bg-[#ff3e3e]/10 border border-[#ff3e3e]/30"
                >
                  <AlertTriangle size={14} className="text-[#ff3e3e] flex-shrink-0" />
                  <p className="text-xs text-[#ff3e3e] font-semibold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Sign In */}
            <motion.button
              onClick={handleGoogleLogin}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-3 transition-all duration-300 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }} />

              {loading ? (
                <div className="w-5 h-5 border-2 border-[#00f2ff] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-slate-200">Continue with Google</span>
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center space-x-3 my-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Demo Mode */}
            <motion.button
              onClick={handleDemoLogin}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300 group"
              style={{ background: 'rgba(0,242,255,0.06)', border: '1px solid rgba(0,242,255,0.2)' }}
            >
              <Zap size={16} className="text-[#00f2ff]" />
              <span className="text-[#00f2ff] text-[13px]">Continue in Demo Mode</span>
            </motion.button>

            {/* Divider */}
            <div className="flex items-center space-x-3 my-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Secure Access</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: ShieldCheck, label: 'Safety Audit\nReady', color: '#00ff88' },
                { icon: Lock, label: 'AES-256\nEncrypted', color: '#ffab00' },
                { icon: Zap, label: 'AI-Powered\nAnalysis', color: '#00f2ff' },
              ].map((b, i) => (
                <div key={i} className="p-3 rounded-xl text-center"
                  style={{ background: `${b.color}08`, border: `1px solid ${b.color}20` }}>
                  <b.icon size={18} style={{ color: b.color, margin: '0 auto 6px' }} />
                  <p className="text-[9px] font-bold text-slate-400 leading-tight whitespace-pre-line">{b.label}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between opacity-40">
              <div className="flex items-center space-x-2">
                <div className="pulse-dot w-1.5 h-1.5" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Secure node: Alpha-7</span>
              </div>
              <span className="text-[9px] font-bold text-slate-600">v2.0.0-LTS</span>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-[10px] text-slate-600 mt-4">
            By signing in, you agree to our{' '}
            <span className="text-[#00f2ff] cursor-pointer hover:underline">Terms of Service</span>
            {' '}and{' '}
            <span className="text-[#00f2ff] cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
