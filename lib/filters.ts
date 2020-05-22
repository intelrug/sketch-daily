export function toTimer(time: string | number) {
  const secs = parseFloat(String(time));
  const minutes: number | string = Math.floor(secs / 60);
  let seconds: number | string = Math.floor(secs - minutes * 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes ? `${minutes}m.` : ''} ${seconds}s.`;
}
