
interface VLibrasWidget {
  translate: (text: string) => void;
  stop: () => void;
  enable: () => void;
}

export interface VLibras {
  Widget: {
    translate: (text: string) => void;
    stop: () => void;
    enable: () => void;
  };
}

declare global {
  interface Window {
    VLibras?: VLibras;
  }
}

export {};
