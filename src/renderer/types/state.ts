export interface RootState {
  logged: boolean;
  myId: number;
  imageId: number;
  images: string[];
  timer: number;
  timerStatus: TimerStatus;
  timerDefault: number;
  timerInterval: number | undefined;
}

export enum TimerStatus {
  running,
  paused,
  stopped,
}
