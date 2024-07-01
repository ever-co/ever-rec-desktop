interface ElectronAPI {
  startCapture: (interval: number) => void;
  stopCapture: () => void;
  onScreenshotCaptured: (callback: (event: any, image: string) => void) => void;
}

interface Window {
  electronAPI: ElectronAPI;
}
