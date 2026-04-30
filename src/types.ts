/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AxisData {
  name: string;
  machine: number;
  relative: number;
  distanceToGo: number;
}

export interface SpindleData {
  id: string;
  speed: number;
  load: number;
  targetSpeed: number;
}

export interface ChannelStatus {
  id: number;
  mode: 'AUTO' | 'MDI' | 'MANUAL' | 'EDIT';
  state: 'RUN' | 'HOLD' | 'STOP' | 'ALARM' | 'READY';
  programName: string;
  activeLine: string;
  activeLineNumber: number;
  feedRate: number;
  feedOverride: number;
  spindleOverride: number;
  axes: AxisData[];
  spindles: SpindleData[];
  partCount: number;
  cycleTime: string;
}

export interface MachineState {
  ch1: ChannelStatus;
  ch2: ChannelStatus;
  timestamp: string;
}
