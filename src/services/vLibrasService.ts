
/**
 * Service to interact with VLibras for rendering an avatar interpreter
 */

// Load VLibras script dynamically
export const loadVLibrasScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('vLibrasScript')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'vLibrasScript';
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      // Initialize VLibras after loading
      const vLibrasScript = document.createElement('script');
      vLibrasScript.textContent = `
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      `;
      document.body.appendChild(vLibrasScript);
      resolve();
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// Check if VLibras is loaded
export const isVLibrasLoaded = (): boolean => {
  return !!window.VLibras;
};

// Send text to be interpreted by VLibras
export const interpretTextWithVLibras = (text: string): void => {
  if (!isVLibrasLoaded()) {
    console.error('VLibras is not loaded');
    return;
  }
  
  try {
    // Access the VLibras widget and send the text
    if (window.VLibras && window.VLibras.Widget) {
      window.VLibras.Widget.translate(text);
    }
  } catch (error) {
    console.error('Error interpreting text with VLibras:', error);
  }
};

// Helper to customize the VLibras widget position
export const positionVLibrasWidget = (
  position: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft' = 'bottomRight'
): void => {
  if (!isVLibrasLoaded()) {
    console.error('VLibras is not loaded');
    return;
  }
  
  // Get the widget container
  const widgetContainer = document.querySelector('.vw-plugin-wrapper') as HTMLElement;
  
  if (!widgetContainer) {
    console.error('VLibras widget container not found');
    return;
  }
  
  // Reset any custom positioning
  widgetContainer.style.top = '';
  widgetContainer.style.bottom = '';
  widgetContainer.style.left = '';
  widgetContainer.style.right = '';
  
  // Apply new position
  switch (position) {
    case 'bottomRight':
      widgetContainer.style.bottom = '0';
      widgetContainer.style.right = '0';
      break;
    case 'bottomLeft':
      widgetContainer.style.bottom = '0';
      widgetContainer.style.left = '0';
      break;
    case 'topRight':
      widgetContainer.style.top = '0';
      widgetContainer.style.right = '0';
      break;
    case 'topLeft':
      widgetContainer.style.top = '0';
      widgetContainer.style.left = '0';
      break;
  }
};

// Toggle VLibras widget visibility
export const toggleVLibrasVisibility = (show: boolean): void => {
  const widgetContainer = document.querySelector('.vw-plugin-wrapper') as HTMLElement;
  
  if (!widgetContainer) {
    console.error('VLibras widget container not found');
    return;
  }
  
  widgetContainer.style.display = show ? 'block' : 'none';
};

