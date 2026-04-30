import React from 'react';
import { motion } from 'motion/react';
import { ChannelStatus, AxisData, SpindleData } from '../types';
import { Settings, Play, Pause, AlertTriangle, Clock, Hash, Cpu, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// --- Sub-components ---

const AxisRow: React.FC<{ axis: AxisData; color: string; labels: { distToGo: string } }> = ({ axis, color, labels }) => (
  <div className="flex justify-between items-end border-b border-cnc-border pb-1 mb-2 last:mb-0 transition-all hover:bg-white/5 px-1">
    <span className={`font-bold italic text-sm ${color}`}>{axis.name}</span>
    <span className="text-2xl font-mono tracking-tighter text-white num-display">
      {axis.machine >= 0 ? ' ' : ''}{axis.machine.toFixed(3)}
    </span>
    <div className="hidden xl:flex flex-col items-end gap-0">
       <span className="text-[10px] text-cnc-dim leading-none uppercase">{labels.distToGo}</span>
       <span className={`text-sm font-mono ${axis.distanceToGo > 0 ? 'text-cnc-warning' : 'text-cnc-muted'} leading-none`}>
         {axis.distanceToGo.toFixed(3)}
       </span>
    </div>
  </div>
);

const SpindleGauge: React.FC<{ spindle: SpindleData; labels: { spindle: string; load: string } }> = ({ spindle, labels }) => (
  <div className="bg-cnc-border/40 p-2 rounded border border-cnc-border-light/30">
    <div className="text-[10px] text-cnc-muted uppercase mb-1 flex justify-between">
      <span>{labels.spindle} {spindle.id}</span>
      <span className="text-cnc-ch1">{spindle.load.toFixed(0)}% {labels.load}</span>
    </div>
    <div className="text-lg font-mono text-cyan-400 tabular-nums">
      {spindle.speed.toFixed(0)} <span className="text-[10px] text-cnc-dim">RPM</span>
    </div>
    <div className="mt-1 h-0.5 bg-cnc-bg rounded-full overflow-hidden">
       <div 
         className="h-full bg-cyan-500 transition-all duration-500" 
         style={{ width: `${Math.min(100, (spindle.load / 120) * 100)}%` }}
       />
    </div>
  </div>
);

const ProgramPreview: React.FC<{ status: ChannelStatus; channelColor: string; labels: { feedRate: string; load: string } }> = ({ status, channelColor, labels }) => (
  <div className="bg-cnc-panel/50 border border-cnc-border p-3 font-mono text-[11px] leading-relaxed flex flex-col h-full rounded">
    <div className="text-cnc-muted mb-1 flex justify-between border-b border-cnc-border pb-1">
       <span className="truncate max-w-[150px]">{status.programName}</span>
       <span className="text-cnc-dim italic">N{status.activeLineNumber - 1}</span>
    </div>
    <div className="text-white/40 italic">N{(status.activeLineNumber - 1).toString().padStart(4, '0')} G00 X200. Z100.</div>
    <div className={`${channelColor} bg-white/5 border-l-2 border-current px-2 my-1 font-bold`}>
      N{status.activeLineNumber.toString().padStart(4, '0')} {status.activeLine}
    </div>
    <div className="text-white/40 italic">N{(status.activeLineNumber + 1).toString().padStart(4, '0')} M08</div>
    
    <div className="mt-auto pt-6 space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between uppercase text-[9px] font-bold text-cnc-muted">
           <span>{labels.feedRate}</span>
           <span className="text-cnc-run">{status.feedOverride}%</span>
        </div>
        <div className="h-1 bg-cnc-border rounded-full overflow-hidden">
           <div className="h-full bg-cnc-run" style={{ width: `${status.feedOverride}%` }} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between uppercase text-[9px] font-bold text-cnc-muted">
           <span>{labels.load} S{status.id === 1 ? '1' : '3'}</span>
           <span className="text-cnc-ch1">{status.spindles[0].load.toFixed(0)}%</span>
        </div>
        <div className="h-1 bg-cnc-border rounded-full overflow-hidden">
           <div className="h-full bg-cnc-ch1" style={{ width: `${status.spindles[0].load}%` }} />
        </div>
      </div>
    </div>
  </div>
);

// --- Main Channel Component ---

export const ChannelView: React.FC<{ status: ChannelStatus }> = ({ status }) => {
  const { t } = useLanguage();
  const isCh1 = status.id === 1;
  const channelColorClass = isCh1 ? 'text-cnc-ch1' : 'text-cnc-ch2';
  const channelBgClass = isCh1 ? 'bg-cnc-ch1/10 border-cnc-ch1/30' : 'bg-cnc-ch2/10 border-cnc-ch2/30';
  const channelBorderClass = isCh1 ? 'border-cnc-ch1' : 'border-cnc-ch2';

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'RUN': return 'text-cnc-run border-cnc-run/50 bg-cnc-run/10';
      case 'ALARM': return 'text-cnc-alarm border-cnc-alarm/50 bg-cnc-alarm/10';
      case 'HOLD': return 'text-cnc-warning border-cnc-warning/50 bg-cnc-warning/10';
      default: return 'text-cnc-muted border-cnc-border bg-cnc-border/10';
    }
  };

  const getStatusText = (state: string) => {
    if (state === 'RUN') return t('running');
    if (state === 'HOLD') return t('waiting');
    return state;
  };

  return (
    <div className="flex flex-col h-full bg-cnc-bg border-2 border-cnc-border rounded-lg overflow-hidden select-none">
      {/* Channel Header */}
      <div className={`flex items-center justify-between px-4 py-2 ${channelBgClass} border-l-4 ${channelBorderClass}`}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest">
            {t('channel')} {status.id} - {status.id === 1 ? t('upperTurret') : t('lowerTurret')}
          </span>
          <span className={`text-[10px] px-2 rounded-sm font-bold border ${getStatusColor(status.state)}`}>
            {getStatusText(status.state)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-cnc-muted">
           <span>{t('mode')}: {status.mode}</span>
           <span className="text-white">{status.cycleTime}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-cnc-border p-px">
        {/* Left Side: Coordinates & Spindles */}
        <div className="bg-cnc-panel p-4 flex flex-col h-full">
           <div className="flex-1">
              {status.axes.map(axis => (
                <AxisRow 
                  key={axis.name} 
                  axis={axis} 
                  color={channelColorClass} 
                  labels={{ distToGo: t('distToGo') }}
                />
              ))}
           </div>
           
           <div className="mt-4 grid grid-cols-2 gap-2">
              {status.spindles.map(s => (
                <SpindleGauge 
                  key={s.id} 
                  spindle={s} 
                  labels={{ spindle: t('spindle'), load: t('load') }} 
                />
              ))}
           </div>
        </div>

        {/* Right Side: G-Code & Feed */}
        <ProgramPreview 
          status={status} 
          channelColor={channelColorClass} 
          labels={{ feedRate: t('feedRate'), load: t('load') }} 
        />
      </div>

      {/* Mini Status Bar */}
      <div className="px-4 py-1 bg-cnc-panel border-t border-cnc-border flex justify-between items-center text-[9px] font-bold text-cnc-dim uppercase tracking-wider">
         <div className="flex gap-4">
            <span>{t('parts')}: <span className="text-cnc-text">{status.partCount}</span></span>
            <span>{t('feedRate')}: <span className="text-cnc-run">{status.feedRate} mm/m</span></span>
         </div>
         <span className="font-mono">M830S_SYS_MOD_{status.id}</span>
      </div>
    </div>
  );
};
