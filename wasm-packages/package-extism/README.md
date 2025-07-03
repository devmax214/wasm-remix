# Extism Plugin Package

This package provides a WebAssembly extension using the Extism runtime for JavaScript.

## Features

- **Greet Function**: Personalized greeting with custom names
- **Calculate Function**: Basic arithmetic operations (add, subtract, multiply, divide)
- **Text Processing**: Text transformation (uppercase and reverse)

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

### Testing

```bash
npm test
```

## License

MIT 