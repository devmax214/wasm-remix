let wasmModule = null;

// Import the WASM module using dynamic import
async function loadWasmModule() {
  try {
    const response = await fetch('/wasm/assemblyscript.wasm');
    if (!response.ok) {
      throw new Error(`Failed to load WASM module: ${response.statusText}`);
    }
    const bytes = await response.arrayBuffer();
    
    // Use WebAssembly.instantiate for better compatibility
    const result = await WebAssembly.instantiate(bytes, {
      env: {
        // Add any environment functions your WASM module needs
        memory: new WebAssembly.Memory({ initial: 256 }),
      }
    });
    
    wasmModule = result.instance.exports;
    
    console.log('WASM module loaded successfully');
  } catch (error) {
    console.error('Failed to load WASM module:', error);
    throw error;
  }
}

self.onmessage = async (e) => {
  try {
    const { type, data } = e.data;

    if (!wasmModule) {
      await loadWasmModule();
    }

    switch (type) {
      case 'init':
        self.postMessage({ type: 'ready' });
        break;
        
      case 'add':
        const { a, b } = data;
        const result = wasmModule.add(a, b);
        self.postMessage({ type: 'result', result });
        break;
        
      default:
        self.postMessage({ type: 'error', error: 'Unknown message type' });
    }
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({ type: 'error', error: error.message });
  }
};

// Handle errors
self.onerror = (error) => {
  console.error('Worker error:', error);
  self.postMessage({ type: 'error', error: error.message });
};
