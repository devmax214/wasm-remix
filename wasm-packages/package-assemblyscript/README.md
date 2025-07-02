# WASM Module

This directory contains the AssemblyScript WebAssembly module for the Remix WASM application.

## Overview

This module is written in AssemblyScript and compiled to WebAssembly (WASM) for high-performance computation in the browser. It provides native-speed operations that can be called from JavaScript.

## Project Structure

```
wasm-module/
├── assembly/          # AssemblyScript source code
│   ├── index.ts      # Main entry point
│   └── tsconfig.json # TypeScript configuration for AssemblyScript
├── build/            # Compiled output (generated)
├── tests/            # Test files
├── asconfig.json     # AssemblyScript compiler configuration
├── package.json      # Node.js dependencies and scripts
└── index.html        # Development server entry point
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
npm install
```

## Development

### Build the WASM module

```bash
# Build debug version (with source maps and debugging info)
npm run asbuild:debug

# Build release version (optimized for production)
npm run asbuild:release

# Build both debug and release versions
npm run asbuild
```

### Run tests

```bash
npm test
```

### Start development server

```bash
npm start
```

This will start a local server to test the WASM module in the browser.

## Build Configuration

The build process is configured in `asconfig.json`:

- **Debug target**: Includes source maps and debugging information
- **Release target**: Optimized for production with level 3 optimization

## Usage

The compiled WASM module exports functions that can be imported and used in JavaScript:

```javascript
import { yourFunction } from './wasm-module';

// Use the WASM function
const result = yourFunction(42);
```

## Integration with Remix

This WASM module is integrated with the main Remix application through:

1. The compiled WASM file is copied to `public/wasm/` directory
2. A Web Worker (`app/wasm.worker.js`) handles WASM loading and execution
3. React hooks (`app/hooks/useWasmWorker.ts`) provide easy access to WASM functions

## Development Workflow

1. Write AssemblyScript code in the `assembly/` directory
2. Build the module using `npm run asbuild`
3. Test your changes with `npm test`
4. The compiled WASM file will be available for the main application

## Troubleshooting

### Common Issues

1. **Build fails**: Make sure you have AssemblyScript installed globally or as a dev dependency
2. **WASM not loading**: Check that the build output is correctly placed in the public directory
3. **Type errors**: Ensure your AssemblyScript code follows the language constraints

### Debugging

- Use the debug build for development as it includes source maps
- Check the browser console for WASM loading errors
- Use the development server to test WASM functionality in isolation

## Contributing

When adding new functionality:

1. Add your AssemblyScript code to the `assembly/` directory
2. Update tests in the `tests/` directory
3. Rebuild the module with `npm run asbuild`
4. Test integration with the main application

## License

This project follows the same license as the main application. 