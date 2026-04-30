import { useCncMockData } from './hooks/useCncMockData';
import { ChannelView } from './components/ChannelView';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Maximize2, Monitor, ShieldCheck, Database, HardDrive, Cpu, Languages } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

export default function App() {
  const state = useCncMockData();
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-cnc-bg flex flex-col p-4 gap-4 selection:bg-cnc-ch1 selection:text-white border-4 border-cnc-border">
      {/* Global Header */}
      <header className="flex justify-between items-center bg-cnc-panel border-b border-cnc-border-light p-3 rounded-t-lg shadow-inner">
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold tracking-tighter text-cnc-ch1 flex items-center gap-2">
            
            MITSUBISHI CNC <span className="text-white">M830S</span>
          </div>
          <div className="px-3 py-1 bg-green-900/50 text-cnc-run border border-cnc-run/50 text-[10px] font-black rounded animate-pulse tracking-widest">{t('running')}</div>
          <div className="text-[10px] text-cnc-muted font-mono uppercase tracking-wider">{state.ch1.programName}</div>
        </div>
        <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-cnc-dim items-center">
          <div>{t('mode')}: <span className="text-cnc-warning">{state.ch1.mode}</span></div>
          <div>{t('time')}: <span className="text-white">{new Date().toLocaleTimeString()}</span></div>
          <div>{t('count')}: <span className="text-white">{state.ch1.partCount.toString().padStart(4, '0')} / 1000</span></div>
          
          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors text-white"
          >
            <Languages size={14} />
            <span className="text-[10px] font-bold">{language === 'en' ? '中文' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Area */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key="ch1" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-full min-h-0"
          >
            <ChannelView status={state.ch1} />
          </motion.div>

          <motion.div 
            key="ch2" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-full min-h-0"
          >
            <ChannelView status={state.ch2} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
