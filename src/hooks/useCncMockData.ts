import { useState, useEffect } from 'react';
import { MachineState, ChannelStatus } from '../types';

const generateMockAxes = (channel: number, names: string[]): any[] => {
  return names.map(name => {
    // If the name already ends with a digit (like Z3), don't append the channel number
    const fullName = /\d$/.test(name) ? name : `${name}${channel}`;
    return {
      name: fullName,
      machine: (Math.random() * 200 - 100),
      relative: (Math.random() * 200 - 100),
      distanceToGo: Math.random() < 0.1 ? Math.random() * 5 : 0
    };
  });
};

const INITIAL_STATE: MachineState = {
  timestamp: new Date().toISOString(),
  ch1: {
    id: 1,
    mode: 'AUTO',
    state: 'RUN',
    programName: 'O0100_MAIN_SHAFT.nc',
    activeLine: 'G01 X50.0 Z-20.0 F0.25',
    activeLineNumber: 45,
    feedRate: 450,
    feedOverride: 100,
    spindleOverride: 100,
    axes: [],
    spindles: [
      { id: 'S1', speed: 1200, targetSpeed: 1200, load: 35 },
      { id: 'S2', speed: 0, targetSpeed: 0, load: 0 }
    ],
    partCount: 154,
    cycleTime: '00:12:45'
  },
  ch2: {
    id: 2,
    mode: 'AUTO',
    state: 'RUN',
    programName: 'O0200_SUB_BACK_FINISH.nc',
    activeLine: 'G01 X30.0 Z-5.0 F0.15',
    activeLineNumber: 12,
    feedRate: 320,
    feedOverride: 110,
    spindleOverride: 100,
    axes: [],
    spindles: [
      { id: 'S3', speed: 800, targetSpeed: 800, load: 22 },
      { id: 'S4', speed: 0, targetSpeed: 0, load: 0 }
    ],
    partCount: 154,
    cycleTime: '00:08:22'
  }
};

export function useCncMockData() {
  const [state, setState] = useState<MachineState>(INITIAL_STATE);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const updateChannel = (ch: ChannelStatus, channelNum: number, axisNames: string[]): ChannelStatus => {
          if (ch.state !== 'RUN') return ch;

          return {
            ...ch,
            activeLineNumber: ch.activeLineNumber + (Math.random() > 0.9 ? 1 : 0),
            axes: ch.axes.length === 0 
              ? generateMockAxes(channelNum, axisNames)
              : ch.axes.map(a => ({
                  ...a,
                  machine: a.machine + (Math.random() - 0.5) * 0.05,
                  relative: a.relative + (Math.random() - 0.5) * 0.05
                })),
            spindles: ch.spindles.map(s => ({
              ...s,
              speed: s.targetSpeed > 0 ? s.targetSpeed + (Math.random() - 0.5) * 5 : 0,
              load: s.targetSpeed > 0 ? (s.load + (Math.random() - 0.5) * 2) : 0
            }))
          };
        };

        return {
          ...prev,
          timestamp: new Date().toISOString(),
          ch1: updateChannel(prev.ch1, 1, ['X', 'Z', 'C', 'Y']),
          ch2: updateChannel(prev.ch2, 2, ['X', 'Z', 'C', 'Y', 'Z3'])
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return state;
}
