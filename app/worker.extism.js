let extismPlugin = null;

// Import the Extism plugin manager
async function loadExtismPlugin() {
  try {
    // Dynamic import of the Extism plugin manager
    const { createExtismPlugin } = await import('../wasm-packages/package-extism/dist/index.js');
    
    extismPlugin = createExtismPlugin({
      wasmPath: '/wasm/extism-plugin.wasm',
      functions: ['greet', 'calculate', 'process_text', 'scrape_website']
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
    
    // Initialize plugin if not already loaded (except for init message)
    if (type !== 'init' && !extismPlugin) {
      await loadExtismPlugin();
    }
    
    switch (type) {
      case 'init':
        if (!extismPlugin) {
          await loadExtismPlugin();
        }
        self.postMessage({ type: 'ready' });
        break;
        
      case 'greet':
        const greetResult = await extismPlugin.greet(data.name);
        self.postMessage({ type: 'result', result: greetResult, requestId: data.requestId });
        break;
        
      case 'calculate':
        const calcResult = await extismPlugin.calculate(data.operation, data.a, data.b);
        self.postMessage({ type: 'result', result: calcResult, requestId: data.requestId });
        break;
        
      case 'processText':
        const textResult = await extismPlugin.processText(data.text);
        self.postMessage({ type: 'result', result: textResult, requestId: data.requestId });
        break;
        
      case 'scrapeWebsite':
        try {
          const response = await fetch(data.url);
          if (!response.ok) {
            throw new Error('Failed to fetch URL: ' + response.status);
          }
          const htmlContent = await response.text();
          const scrapeResult = await extismPlugin.scrapeWebsite(data.url, htmlContent);
          self.postMessage({ type: 'result', result: scrapeResult, requestId: data.requestId });
        } catch (fetchError) {
          self.postMessage({ type: 'error', error: fetchError.message, requestId: data.requestId });
        }
        break;
        
      case 'callFunction':
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