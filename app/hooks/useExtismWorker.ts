import { useCallback, useEffect, useRef, useState } from 'react';

interface ExtismWorkerMessage {
  type: 'init' | 'greet' | 'calculate' | 'processText' | 'callFunction' | 'result' | 'ready' | 'error';
  data?: any;
  result?: string;
  error?: string;
  requestId?: string;
}

interface ExtismWorkerState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useExtismWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<ExtismWorkerState>(({
    isReady: false,
    isLoading: false,
    error: null,
  }));

  useEffect(() => {
    // Use Vite's module worker import pattern
    workerRef.current = new Worker(new URL('../worker.extism.js', import.meta.url), {
      type: 'module',
    });

    const worker = workerRef.current;

    worker.onmessage = (e: MessageEvent<ExtismWorkerMessage>) => {
      const { type, error } = e.data;

      switch (type) {
        case 'ready':
          setState(prev => ({ ...prev, isReady: true, isLoading: false, error: null }));
          console.log('Extism plugin initialized successfully in worker');
          break;
        case 'error':
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: error || 'Unknown error occurred' 
          }));
          break;
      }
    };

    worker.onerror = (e) => {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: e.message || 'Worker error occurred' 
      }));
    };

    // Initialize the worker
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    worker.postMessage({ type: 'init' });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const createWorkerCall = useCallback((type: string, data: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      if (!state.isReady) {
        reject(new Error('Worker not ready'));
        return;
      }

      const worker = workerRef.current;
      const requestId = Math.random().toString(36).substr(2, 9);
      
      const messageHandler = (e: MessageEvent<ExtismWorkerMessage>) => {
        const { type: responseType, result, error, requestId: responseRequestId } = e.data;

        if (responseType === 'result' && responseRequestId === requestId) {
          worker.removeEventListener('message', messageHandler);
          resolve(result!);
        } else if (responseType === 'error' && responseRequestId === requestId) {
          worker.removeEventListener('message', messageHandler);
          reject(new Error(error || 'Unknown error'));
        }
      };

      worker.addEventListener('message', messageHandler);
      worker.postMessage({ type, data: { ...data, requestId } });
    });
  }, [state.isReady]);

  const greet = useCallback(async (name: string): Promise<string> => {
    return createWorkerCall('greet', { name });
  }, [createWorkerCall]);

  const calculate = useCallback(async (operation: string, a: number, b: number): Promise<string> => {
    return createWorkerCall('calculate', { operation, a, b });
  }, [createWorkerCall]);

  const processText = useCallback(async (text: string): Promise<string> => {
    return createWorkerCall('processText', { text });
  }, [createWorkerCall]);

  const callFunction = useCallback(async (functionName: string, input: string): Promise<string> => {
    return createWorkerCall('callFunction', { functionName, input });
  }, [createWorkerCall]);

  return {
    ...state,
    greet,
    calculate,
    processText,
    callFunction,
  };
} 