# Extism Plugin Package

This package provides a WebAssembly extension using the Extism runtime for JavaScript, featuring multiple functions for text processing, calculations, and greetings.

## Features

- **Greet Function**: Personalized greeting with custom names
- **Calculate Function**: Basic arithmetic operations (add, subtract, multiply, divide)
- **Text Processing**: Text transformation (uppercase and reverse)
- **TypeScript Manager**: Full TypeScript support with plugin management
- **Background Workers**: Non-blocking execution via Web Workers
- **Request Tracking**: Concurrent operation support with request IDs

## Current Functions

### `greet(name)`
Generates a personalized greeting message.

**Parameters:**
- `name` (string): Name to greet

**Returns:**
- `string`: Greeting message in format "Hello, {name}! Welcome to Extism!"

**Example:**
```javascript
const greeting = await plugin.greet('Alice');
// Returns: "Hello, Alice! Welcome to Extism!"
```

### `calculate(operation, a, b)`
Performs arithmetic operations on two numbers.

**Parameters:**
- `operation` (string): One of "add", "subtract", "multiply", "divide"
- `a` (number): First operand
- `b` (number): Second operand

**Returns:**
- `string`: JSON string with result, operation, and operands

**Example:**
```javascript
const result = await plugin.calculate('add', 10, 5);
// Returns: '{"result":15,"operation":"add","a":10,"b":5}'
```

### `process_text(text)`
Processes and transforms text.

**Parameters:**
- `text` (string): Text to process

**Returns:**
- `string`: JSON string with original text, processed text (uppercase + reversed), and length

**Example:**
```javascript
const result = await plugin.processText('Hello World');
// Returns: '{"original":"Hello World","processed":"DLROW OLLEH","length":11}'
```

## Installation

```bash
npm install
```

## Building

### Build TypeScript Package
```bash
npm run build
```

### Build WASM Plugin (requires Rust)
```bash
npm run build:wasm
```

### Build Everything
```bash
npm run build:all
```

## Usage

### Direct Usage
```javascript
import { createExtismPlugin } from './dist/index.js';

// Create plugin instance
const plugin = createExtismPlugin({
  wasmPath: '/wasm/extism-plugin.wasm',
  functions: ['greet', 'calculate', 'process_text']
});

// Initialize the plugin
await plugin.initialize();

// Use the plugin functions
const greeting = await plugin.greet('Alice');
const result = await plugin.calculate('add', 10, 5);
const processed = await plugin.processText('Hello World');
```

### React Hook Usage
```typescript
import { useExtismWorker } from '~/hooks/useExtismWorker';

function MyComponent() {
  const { greet, calculate, processText, isReady, isLoading, error } = useExtismWorker();
  
  const handleGreet = async () => {
    if (isReady) {
      try {
        const result = await greet('Alice');
        console.log('Greeting:', result);
      } catch (err) {
        console.error('Greet error:', err);
      }
    }
  };
  
  return (
    <button onClick={handleGreet} disabled={!isReady}>
      Greet
    </button>
  );
}
```

## API

### `createExtismPlugin(config)`

Creates a new Extism plugin manager instance.

**Parameters:**
- `config.wasmPath` (string): Path to the WASM file
- `config.functions` (string[]): Array of available function names

### Plugin Methods

- `initialize()`: Initialize the plugin
- `greet(name)`: Generate a greeting message
- `calculate(operation, a, b)`: Perform arithmetic operations
- `processText(text)`: Process and transform text
- `callFunction(name, input)`: Call any plugin function directly
- `isInitialized()`: Check if plugin is initialized
- `destroy()`: Clean up plugin resources

## Development

### Prerequisites

- Node.js 18+
- Rust (for WASM compilation)
- wasm32-unknown-unknown target: `rustup target add wasm32-unknown-unknown`

### Project Structure

```
package-extism/
├── src/
│   ├── index.ts          # TypeScript plugin manager
│   └── lib.rs            # Rust plugin functions
├── build.sh              # Build script for WASM
├── Cargo.toml            # Rust dependencies
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
└── test/
    └── test.js           # Test file
```

### Adding New Functions

1. Edit `src/lib.rs`:
   ```rust
   #[plugin_fn]
   pub fn my_function(input: String) -> FnResult<String> {
       let input: serde_json::Value = serde_json::from_str(&input)?;
       let data = input["data"].as_str().unwrap_or("");
       Ok(format!("Processed: {}", data))
   }
   ```

2. Build the plugin: `./build.sh`

3. Update the worker in `app/worker.extism.js`:
   ```javascript
   case 'myFunction':
     if (!extismPlugin) {
       await loadExtismPlugin();
     }
     const result = await extismPlugin.myFunction(data.input);
     self.postMessage({ type: 'result', result: result, requestId: data.requestId });
     break;
   ```

4. Update the hook in `app/hooks/useExtismWorker.ts`:
   ```typescript
   const myFunction = useCallback(async (input: string): Promise<string> => {
     return createWorkerCall('myFunction', { input });
   }, [createWorkerCall]);
   ```

### Testing

```bash
npm test
```

## Integration

### Web Worker (`app/worker.extism.js`)
- Handles plugin loading and execution
- Provides message-based communication
- Manages plugin lifecycle
- Uses request IDs for concurrent operations

### React Hook (`app/hooks/useExtismWorker.ts`)
- Provides easy access to plugin functions
- Manages worker state and lifecycle
- Handles errors and loading states
- Uses Vite's module worker import pattern

## Performance

Extism plugins provide:
- **Dynamic loading** of WebAssembly modules
- **Background execution** via Web Workers
- **Concurrent operations** with request tracking
- **Type safety** with TypeScript
- **Memory management** with automatic cleanup

## License

MIT 