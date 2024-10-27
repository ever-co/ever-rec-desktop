import { screen } from 'electron';

/**
 * Returns the size of the primary display.
 *
 * If the size cannot be determined for any reason, returns a default size of 1920x1080.
 *
 * @returns {Object} An object with `height` and `width` properties.
 */
export function getWindowSize(): { height: number; width: number } {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { height: screenHeight, width: screenWidth } = primaryDisplay.workAreaSize;

  return {
    height: screenHeight || 1080,
    width: screenWidth || 1920,
  };
}
