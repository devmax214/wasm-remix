import { useCallback, useEffect, useRef, useState } from 'react';
import { createExtismPlugin, type ExtismPluginManager } from '../../wasm-packages/package-extism/dist/index.js';

interface ExtismPluginState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useExtismPlugin() {
  const pluginRef = useRef<ExtismPluginManager | null>(null);
  const [state, setState] = useState<ExtismPluginState>({
    isReady: false,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const initializePlugin = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const plugin = createExtismPlugin({
          wasmPath: '/wasm/extism-plugin.wasm',
          functions: ['greet', 'calculate', 'process_text']
        });

        await plugin.initialize();
        pluginRef.current = plugin;

        setState(prev => ({ ...prev, isReady: true, isLoading: false }));
        console.log('Extism plugin initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Extism plugin:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }));
      }
    };

    initializePlugin();

    return () => {
      if (pluginRef.current) {
        pluginRef.current.destroy();
        pluginRef.current = null;
      }
    };
  }, []);

  const greet = useCallback(async (name: string): Promise<string> => {
    if (!pluginRef.current) {
      throw new Error('Plugin not initialized');
    }
    return pluginRef.current.greet(name);
  }, []);

  const calculate = useCallback(async (operation: string, a: number, b: number): Promise<string> => {
    if (!pluginRef.current) {
      throw new Error('Plugin not initialized');
    }
    return pluginRef.current.calculate(operation, a, b);
  }, []);

  const processText = useCallback(async (text: string): Promise<string> => {
    if (!pluginRef.current) {
      throw new Error('Plugin not initialized');
    }
    return pluginRef.current.processText(text);
  }, []);

  const callFunction = useCallback(async (functionName: string, input: string): Promise<string> => {
    if (!pluginRef.current) {
      throw new Error('Plugin not initialized');
    }
    return pluginRef.current.callFunction(functionName, input);
  }, []);

  return {
    ...state,
    greet,
    calculate,
    processText,
    callFunction,
  };
} 