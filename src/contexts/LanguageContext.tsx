import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

const translations: Translations = {
  commandCenter: {
    en: 'Command Center',
    zh: '运行大屏',
  },
  subTitle: {
    en: 'Turn-Mill Multi-Channel System Control',
    zh: '车铣复合多通道系统控制',
  },
  channel: {
    en: 'Channel',
    zh: '通道',
  },
  upperTurret: {
    en: 'Upper Turret',
    zh: '第一刀塔',
  },
  lowerTurret: {
    en: 'Lower Turret',
    zh: '第二刀塔',
  },
  running: {
    en: 'RUNNING',
    zh: '正在运行',
  },
  waiting: {
    en: 'WAITING',
    zh: '等待中',
  },
  mode: {
    en: 'Mode',
    zh: '模式',
  },
  time: {
    en: 'Time',
    zh: '时间',
  },
  count: {
    en: 'Part Count',
    zh: '工件计数',
  },
  machine: {
    en: 'Machine',
    zh: '机械坐标',
  },
  relative: {
    en: 'Relative',
    zh: '相对坐标',
  },
  distToGo: {
    en: 'DistToGo',
    zh: '剩余移动',
  },
  spindle: {
    en: 'Spindle',
    zh: '主轴',
  },
  load: {
    en: 'LOAD',
    zh: '负载',
  },
  feedRate: {
    en: 'Feed Rate',
    zh: '进给速度',
  },
  parts: {
     en: 'Parts',
     zh: '产量',
  },
  monitor: {
    en: 'MONITOR',
    zh: '运行监控',
  },
  tool: {
    en: 'TOOL',
    zh: '刀具',
  },
  offset: {
    en: 'OFFSET',
    zh: '补正',
  },
  program: {
    en: 'PROGRAM',
    zh: '程序',
  },
  graphs: {
    en: 'GRAPHS',
    zh: '绘图',
  },
  io: {
     en: 'I / O',
     zh: '输入输出',
  },
  diagnos: {
    en: 'DIAGNOS',
    zh: '故障诊断',
  },
  system: {
    en: 'SYSTEM',
    zh: '系统',
  },
  mainPos: {
    en: 'MAIN POS',
    zh: '综合坐标',
  },
  relPos: {
    en: 'REL POS',
    zh: '相对位置',
  },
  distance: {
    en: 'DISTANCE',
    zh: '移动距离',
  },
  trace: {
    en: 'TRACE',
    zh: '轨迹监控',
  },
  systemOnline: {
    en: 'System Online',
    zh: '系统在线',
  },
  axis: {
    en: 'Axis',
    zh: '轴',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
