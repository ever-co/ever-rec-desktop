interface ElectronAPI {
  startCapture: (interval: number) => void;
  stopCapture: () => void;
  onScreenshotCaptured: (
    callback: (event: any, screenshot: any) => void
  ) => void;
}

interface Window {
  electronAPI: ElectronAPI;
}
