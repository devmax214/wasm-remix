import { useCallback, useEffect, useRef, useState } from 'react';

interface WasmWorkerMessage {
  type: 'init' | 'add' | 'result' | 'ready' | 'error';
  data?: any;
  result?: number;
  error?: string;
}

export function useWasmWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use Vite's module worker import pattern
    workerRef.current = new Worker(new URL('../wasm.worker.js', import.meta.url), {
      type: 'module',
    });

    const worker = workerRef.current;

    worker.onmessage = (e: MessageEvent<WasmWorkerMessage>) => {
      const { type, result, error } = e.data;

      switch (type) {
        case 'ready':
          setIsReady(true);
          setIsLoading(false);
          setError(null);
          break;
        case 'result':
          setIsLoading(false);
          setError(null);
          break;
        case 'error':
          setIsLoading(false);
          setError(error || 'Unknown error occurred');
          break;
      }
    };

    worker.onerror = (e) => {
      setIsLoading(false);
      setError(e.message || 'Worker error occurred');
    };

    // Initialize the worker
    setIsLoading(true);
    worker.postMessage({ type: 'init' });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const add = useCallback((a: number, b: number): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      if (!isReady) {
        reject(new Error('Worker not ready'));
        return;
      }

      const worker = workerRef.current;
      const messageHandler = (e: MessageEvent<WasmWorkerMessage>) => {
        const { type, result, error } = e.data;

        if (type === 'result') {
          worker.removeEventListener('message', messageHandler);
          resolve(result!);
        } else if (type === 'error') {
          worker.removeEventListener('message', messageHandler);
          reject(new Error(error || 'Unknown error'));
        }
      };

      worker.addEventListener('message', messageHandler);
      worker.postMessage({ type: 'add', data: { a, b } });
    });
  }, [isReady]);

  return {
    add,
    isReady,
    isLoading,
    error,
  };
} 