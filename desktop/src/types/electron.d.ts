// Типы для Electron API
export interface ElectronAPI {
  platform: string;
  getVersion(): Promise<string>;
  getSystemInfo(): Promise<SystemInfo>;
  
  window: {
    minimize(): Promise<void>;
    maximize(): Promise<void>;
    close(): Promise<void>;
    isMaximized(): Promise<boolean>;
  };
  
  notifications: {
    show(title: string, body: string): Promise<void>;
    isSupported(): Promise<boolean>;
  };
  
  fs: {
    readFile(path: string): Promise<string>;
    writeFile(path: string, data: string): Promise<void>;
    exists(path: string): Promise<boolean>;
  };
  
  settings: {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    getAll(): Promise<Record<string, any>>;
    reset(): Promise<void>;
  };
  
  onMenuAction(callback: (action: string) => void): void;
  removeAllListeners(channel: string): void;
  getUserDataPath(): Promise<string>;
  isOnline(): boolean;
  getDisplayInfo(): Promise<DisplayInfo>;
  
  autoLaunch: {
    isEnabled(): Promise<boolean>;
    enable(): Promise<void>;
    disable(): Promise<void>;
  };
}

export interface SystemInfo {
  platform: string;
  arch: string;
  version: string;
  totalMemory: number;
  freeMemory: number;
  cpuCount: number;
}

export interface DisplayInfo {
  primary: boolean;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  workArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  scaleFactor: number;
}

// Расширение глобального объекта Window
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
