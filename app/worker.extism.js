let extismPlugin = null;

// Import the Extism plugin manager
async function loadExtismPlugin() {
  try {
    // Dynamic import of the Extism plugin manager
    const { createExtismPlugin } = await import('../wasm-packages/package-extism/dist/index.js');
    
    extismPlugin = createExtismPlugin({
      wasmPath: '/wasm/extism-plugin.wasm',
      functions: ['greet', 'calculate', 'process_text']
    });
    
    await extismPlugin.initialize();
    console.log('Extism plugin loaded successfully in worker');
  } catch (error) {
    console.error('Failed to load Extism plugin:', error);
    throw error;
  }
}

self.onmessage = async (e) => {
  try {
    const { type, data } = e.data;
    
    switch (type) {
      case 'init':
        if (!extismPlugin) {
          await loadExtismPlugin();
        }
        self.postMessage({ type: 'ready' });
        break;
        
      case 'greet':
        if (!extismPlugin) {
          await loadExtismPlugin();
        }
        const greetResult = await extismPlugin.greet(data.name);
        self.postMessage({ type: 'result', result: greetResult, requestId: data.requestId });
        break;
        
      case 'calculate':
        if (!extismPlugin) {
          await loadExtismPlugin();
        }
        const calcResult = await extismPlugin.calculate(data.operation, data.a, data.b);
        self.postMessage({ type: 'result', result: calcResult, requestId: data.requestId });
        break;
        
      case 'processText':
        if (!extismPlugin) {
          await loadExtismPlugin();
        }
        const textResult = await extismPlugin.processText(data.text);
        self.postMessage({ type: 'result', result: textResult, requestId: data.requestId });
        break;
        
      case 'callFunction':
        if (!extismPlugin) {
          await loadExtismPlugin();
        }
        const funcResult = await extismPlugin.callFunction(data.functionName, data.input);
        self.postMessage({ type: 'result', result: funcResult, requestId: data.requestId });
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