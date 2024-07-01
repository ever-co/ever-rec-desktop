import { screen } from 'electron';

export function getWindowSize(): { height: number; width: number } {
  const display = screen.getPrimaryDisplay();
  return {
    height: display.workAreaSize.height,
    width: display.workAreaSize.width,
  };
}
