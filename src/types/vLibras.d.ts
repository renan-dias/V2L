
interface VLibrasWidget {
  translate(text: string): void;
}

interface VLibras {
  Widget: VLibrasWidget | ((pluginUrl: string) => void) | { translate: (text: string) => void };
}

declare global {
  interface Window {
    VLibras?: VLibras;
  }
}

export {};
