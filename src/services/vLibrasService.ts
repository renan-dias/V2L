
// Import VLibras type definition
import { VLibras } from '@/types/vLibras';
import { Subtitle } from '@/types/subtitle';

export const loadVLibrasScript = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if VLibras is already loaded
      if (document.getElementById('vlibras-script')) {
        if (window.VLibras) {
          resolve();
        } else {
          // Wait for it to initialize
          setTimeout(() => {
            if (window.VLibras) {
              resolve();
            } else {
              reject(new Error('VLibras failed to initialize'));
            }
          }, 2000);
        }
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.id = 'vlibras-script';
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;

      // Initialize VLibras when script is loaded
      script.onload = () => {
        if (!window.VLibras) {
          reject(new Error('VLibras not found'));
          return;
        }

        // Initialize VLibras
        window.VLibras.Widget.enable();

        // Give it a moment to initialize
        setTimeout(() => {
          resolve();
        }, 1000);
      };

      script.onerror = () => {
        reject(new Error('Failed to load VLibras script'));
      };

      document.body.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};

export const interpretTextWithVLibras = (text: string): void => {
  if (!window.VLibras || !window.VLibras.Widget) {
    console.error('VLibras not initialized');
    return;
  }

  try {
    // Stop any current interpretation
    window.VLibras.Widget.stop();

    // Interpret the new text
    window.VLibras.Widget.translate(text);
  } catch (error) {
    console.error('Error interpreting text with VLibras:', error);
  }
};

export type VLibrasPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export const positionVLibrasWidget = (position: VLibrasPosition): void => {
  if (!window.VLibras || !window.VLibras.Widget) {
    console.error('VLibras not initialized');
    return;
  }

  try {
    const widgetElement = document.querySelector('.vw-plugin-wrapper') as HTMLElement;
    if (!widgetElement) {
      console.error('VLibras widget element not found');
      return;
    }

    // Reset position
    widgetElement.style.removeProperty('top');
    widgetElement.style.removeProperty('bottom');
    widgetElement.style.removeProperty('left');
    widgetElement.style.removeProperty('right');

    // Apply new position
    switch (position) {
      case 'topLeft':
        widgetElement.style.top = '20px';
        widgetElement.style.left = '20px';
        break;
      case 'topRight':
        widgetElement.style.top = '20px';
        widgetElement.style.right = '20px';
        break;
      case 'bottomLeft':
        widgetElement.style.bottom = '20px';
        widgetElement.style.left = '20px';
        break;
      case 'bottomRight':
        widgetElement.style.bottom = '20px';
        widgetElement.style.right = '20px';
        break;
    }
  } catch (error) {
    console.error('Error positioning VLibras widget:', error);
  }
};
