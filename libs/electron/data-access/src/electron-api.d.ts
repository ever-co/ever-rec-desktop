interface ElectronAPI {
  captureScreen: (delay: number) => void;
  onScreenshotCaptured: (callback: (event: any, image: string) => void) => void;
}

interface Window {
  electronAPI: ElectronAPI;
}
