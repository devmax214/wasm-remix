# AssemblyScript WebAssembly Package

This package contains AssemblyScript WebAssembly code that provides fast numerical calculations in the browser.

## Features

- **Fast Arithmetic**: Optimized addition operations in WebAssembly
- **Type Safety**: Full TypeScript support with AssemblyScript
- **Background Processing**: Runs in Web Workers for non-blocking UI
- **Easy Integration**: Simple React hooks for seamless usage

## Structure

```
package-assemblyscript/
├── assembly/
│   ├── index.ts          # Main AssemblyScript source
│   └── tsconfig.json     # TypeScript configuration
├── asconfig.json         # AssemblyScript build configuration
├── package.json          # Package dependencies and scripts
├── index.html            # Test page
├── README.md             # This file
└── tests/                # Test files
```

## Current Functions

### `add(a: i32, b: i32): i32`
Fast integer addition operation in WebAssembly.

**Parameters:**
- `a` (i32): First integer
- `b` (i32): Second integer

**Returns:**
- `i32`: Sum of a and b

**Example:**
```typescript
const result = add(5, 3); // Returns 8
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the WebAssembly module:
   ```bash
   npm run build
   ```

3. Test the build:
   ```bash
   npm run test
   ```

### Adding New Functions

1. Edit `assembly/index.ts`
2. Add your function:
   ```typescript
   export function multiply(a: i32, b: i32): i32 {
     return a * b;
   }
   ```
3. Build: `npm run build`
4. Update the worker in `app/worker.assemblyscript.js`:
   ```javascript
   case 'multiply':
     if (!wasmModule) {
       await loadWasmModule();
     }
     const { a, b } = data;
     const result = wasmModule.multiply(a, b);
     self.postMessage({ type: 'result', result });
     break;
   ```
5. Update the hook in `app/hooks/useAssemblyScriptWorker.ts`:
   ```typescript
   const multiply = useCallback((a: number, b: number): Promise<number> => {
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
       const messageHandler = (e: MessageEvent<AssemblyScriptWorkerMessage>) => {
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
       worker.postMessage({ type: 'multiply', data: { a, b } });
     });
   }, [isReady]);
   ```

## Integration

### Web Worker (`app/worker.assemblyscript.js`)
- Handles WASM loading and execution
- Provides message-based communication
- Manages memory and lifecycle
- Uses `WebAssembly.instantiate` for better compatibility

### React Hook (`app/hooks/useAssemblyScriptWorker.ts`)
- Provides easy access to WASM functions
- Manages worker state and lifecycle
- Handles errors and loading states
- Uses Vite's module worker import pattern

### Usage Example

```typescript
import { useAssemblyScriptWorker } from '~/hooks/useAssemblyScriptWorker';

function MyComponent() {
  const { add, isReady, isLoading, error } = useAssemblyScriptWorker();
  
  const handleCalculation = async () => {
    if (isReady) {
      try {
        const result = await add(5, 3);
        console.log('Result:', result); // 8
      } catch (err) {
        console.error('Calculation error:', err);
      }
    }
  };
  
  return (
    <button onClick={handleCalculation} disabled={!isReady}>
      Calculate
    </button>
  );
}
```

## Build Output

The build process generates:
- `build/debug.wasm` - WebAssembly binary (development)
- `build/release.wasm` - WebAssembly binary (production)

These files are copied to `public/wasm/` for use in the main application:
- `public/wasm/assemblyscript-debug.wasm` - Debug version
- `public/wasm/assemblyscript.wasm` - Release version

## Performance

AssemblyScript WebAssembly provides:
- **Near-native performance** for numerical operations
- **Small binary size** compared to other WASM languages
- **Fast startup time** with minimal overhead
- **Background execution** via Web Workers
- **Type safety** with TypeScript-like syntax

## License

MIT License 