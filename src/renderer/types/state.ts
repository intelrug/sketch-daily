import { StatsBase } from 'fs';

export interface RootState {
  logged: boolean;
  myId: number;
  path: string;
  folders: StatsBase<bigint>[];
  folderIds: string[];
  imageId: number;
  images: string[];
  timer: number;
  timerStatus: TimerStatus;
  timerDefault: number;
  timerInterval: number | undefined;
  randomizePictures: boolean;
  picturesCount: number;
}

export type Folder = StatsBase<bigint> & { path: string };

export enum TimerStatus {
  running,
  paused,
  stopped,
}
