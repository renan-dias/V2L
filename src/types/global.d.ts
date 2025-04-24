
// Global type definitions

// Extend Window interface for VLibras
declare global {
  interface Window {
    VLibras?: {
      Widget: {
        translate: (text: string) => void;
      } | ((pluginUrl: string) => void);
    };
  }
}

export {};
