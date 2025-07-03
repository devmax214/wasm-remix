# Remix WebAssembly App

A Remix application demonstrating two different WebAssembly approaches:

1. **AssemblyScript WASM Worker** - Traditional WebAssembly with Web Workers
2. **Extism Plugin** - Modern WebAssembly plugin system

## Features

### AssemblyScript WASM Worker
- Simple arithmetic operations (addition)
- Runs in a Web Worker for non-blocking execution
- Built with AssemblyScript

### Extism Plugin
- Multiple functions: greet, calculate, text processing
- Modern plugin architecture
- Built with Rust and Extism PDK
- Supports complex data structures and operations

## Project Structure

```
remix-wasm-app/
├── app/
│   ├── hooks/
│   │   ├── useWasmWorker.ts      # AssemblyScript WASM hook
│   │   └── useExtismPlugin.ts    # Extism plugin hook
│   ├── routes/
│   │   └── _index.tsx            # Main UI with both plugins
│   └── wasm.worker.js            # Web Worker for AssemblyScript WASM
├── wasm-packages/
│   ├── package-assemblyscript/   # AssemblyScript WASM package
│   └── package-extism/           # Extism plugin package
└── public/
    └── wasm/
        ├── debug.wasm            # AssemblyScript WASM file
        └── extism-plugin.wasm    # Extism plugin WASM file
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Rust (for building Extism plugin WASM)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the WASM packages:
   ```bash
   # Build AssemblyScript WASM
   cd wasm-packages/package-assemblyscript
   npm run asbuild
   cd ../..
   
   # Build Extism plugin (requires Rust)
   cd wasm-packages/package-extism
   npm run build:all
   cd ../..
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Building the Extism Plugin

To build the Extism plugin WASM file, you need Rust installed:

1. Install Rust: https://rustup.rs/
2. Add WASM target:
   ```bash
   rustup target add wasm32-unknown-unknown
   ```
3. Build the plugin:
   ```bash
   cd wasm-packages/package-extism
   npm run build:wasm
   ```

## Usage

The application provides a web interface with two main sections:

### AssemblyScript Calculator
- Simple addition of two numbers
- Runs in a Web Worker
- Shows real-time status and results

### Extism Plugin Functions
- **Greet**: Personalized greeting with custom names
- **Calculate**: Arithmetic operations (add, subtract, multiply, divide)
- **Text Process**: Text transformation (uppercase and reverse)

## Development

### Adding New Functions

#### AssemblyScript WASM
1. Edit `wasm-packages/package-assemblyscript/assembly/index.ts`
2. Add your function
3. Rebuild: `npm run asbuild`
4. Update the worker in `app/wasm.worker.js`
5. Update the hook in `app/hooks/useWasmWorker.ts`

#### Extism Plugin
1. Edit `wasm-packages/package-extism/src/lib.rs`
2. Add your function with `#[plugin_fn]` attribute
3. Rebuild: `npm run build:wasm`
4. Update the TypeScript wrapper in `wasm-packages/package-extism/src/index.ts`
5. Update the hook in `app/hooks/useExtismPlugin.ts`

## Technologies Used

- **Remix** - Full-stack React framework
- **AssemblyScript** - TypeScript to WebAssembly compiler
- **Extism** - Universal WebAssembly plugin system
- **Rust** - Systems programming language for WASM
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

## License

MIT
