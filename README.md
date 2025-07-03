# Remix WebAssembly App

A modern Remix application demonstrating WebAssembly integration with both AssemblyScript and Extism plugins, featuring background worker processing for optimal performance.

## Features

- **AssemblyScript WebAssembly**: Fast numerical calculations in WASM
- **Extism Plugin System**: Dynamic plugin loading and execution with multiple functions
- **Background Workers**: Non-blocking UI with Web Workers
- **TypeScript Support**: Full type safety across the stack
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **Dark Mode**: Automatic theme switching

## Project Structure

```
remix-wasm-app/
├── app/
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   ├── hooks/
│   │   ├── useAssemblyScriptWorker.ts  # AssemblyScript WASM hook
│   │   └── useExtismWorker.ts          # Extism plugin hook
│   ├── root.tsx
│   ├── routes/
│   │   └── _index.tsx
│   ├── tailwind.css
│   ├── worker.assemblyscript.js        # Web Worker for AssemblyScript WASM
│   └── worker.extism.js                # Web Worker for Extism plugins
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   ├── favicon.ico
│   ├── logo-dark.png
│   ├── logo-light.png
│   └── wasm/
│       ├── assemblyscript-debug.wasm   # AssemblyScript WASM binary (debug)
│       ├── assemblyscript.wasm         # AssemblyScript WASM binary (release)
│       └── extism-plugin.wasm          # Extism plugin binary
├── README.md
├── setup.sh
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── wasm-packages/
    ├── package-assemblyscript/         # AssemblyScript WASM package
    │   ├── asconfig.json
    │   ├── assembly/
    │   │   ├── index.ts
    │   │   └── tsconfig.json
    │   ├── index.html
    │   ├── package.json
    │   ├── README.md
    │   └── tests/
    └── package-extism/                 # Extism plugin package
        ├── build.sh
        ├── Cargo.toml
        ├── package-lock.json
        ├── package.json
        ├── README.md
        ├── src/
        │   ├── index.ts                # TypeScript plugin manager
        │   └── lib.rs                  # Rust plugin functions
        ├── target/
        ├── test/
        │   └── test.js
        ├── tsconfig.json
        └── vite.config.ts
```

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd remix-wasm-app
   npm install
   ```

2. **Build WASM Packages**
   ```bash
   # Build AssemblyScript WASM
   cd wasm-packages/package-assemblyscript
   npm run build
   
   # Build Extism Plugin
   cd ../package-extism
   ./build.sh
   cd ../..
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:5173`

## Architecture

### AssemblyScript WebAssembly
- **Source**: `wasm-packages/package-assemblyscript/assembly/index.ts`
- **Build**: `npm run build` in the package directory
- **Output**: `public/wasm/assemblyscript-debug.wasm` and `public/wasm/assemblyscript.wasm`
- **Worker**: `app/worker.assemblyscript.js`
- **Hook**: `app/hooks/useAssemblyScriptWorker.ts`

**Current Functions:**
- `add(a: i32, b: i32): i32` - Fast integer addition

### Extism Plugin System
- **Source**: `wasm-packages/package-extism/src/lib.rs`
- **TypeScript Manager**: `wasm-packages/package-extism/src/index.ts`
- **Build**: `./build.sh` in the package directory
- **Output**: `public/wasm/extism-plugin.wasm`
- **Worker**: `app/worker.extism.js`
- **Hook**: `app/hooks/useExtismWorker.ts`

**Current Functions:**
- `greet(name)` - Personalized greeting
- `calculate(operation, a, b)` - Arithmetic operations (add, subtract, multiply, divide)
- `process_text(text)` - Text transformation (uppercase and reverse)
- `scrape_website(url)` - **Website Scraping**:
  - Fetches the HTML content of the given URL in the worker, then passes both the URL and the HTML to the Extism plugin for processing.
  - The plugin extracts the page title, links, meta tags, visible text, and word count from the HTML.
  - **Usage:**
    - The worker fetches the URL and sends both `url` and `htmlContent` to the plugin.
    - The plugin returns a JSON object with fields like `title`, `links`, `meta_tags`, `text_content`, `word_count`, and more.

## Development

### Adding New AssemblyScript Functions

1. Edit `wasm-packages/package-assemblyscript/assembly/index.ts`
2. Add your function:
   ```typescript
   export function multiply(a: i32, b: i32): i32 {
     return a * b;
   }
   ```
3. Build the package: `npm run build`
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
     // Similar implementation to add function
   }, [isReady]);
   ```

### Adding New Extism Plugin Functions

1. Edit `wasm-packages/package-extism/src/lib.rs`
2. Add your function:
   ```rust
   #[plugin_fn]
   pub fn my_function(input: String) -> FnResult<String> {
       let input: serde_json::Value = serde_json::from_str(&input)?;
       let data = input["data"].as_str().unwrap_or("");
       Ok(format!("Processed: {}", data))
   }
   ```
3. Build the plugin: `./build.sh`
4. Update the worker in `app/worker.extism.js`:
   ```javascript
   case 'myFunction':
     if (!extismPlugin) {
       await loadExtismPlugin();
     }
     const result = await extismPlugin.myFunction(data.input);
     self.postMessage({ type: 'result', result: result, requestId: data.requestId });
     break;
   ```
5. Update the hook in `app/hooks/useExtismWorker.ts`:
   ```typescript
   const myFunction = useCallback(async (input: string): Promise<string> => {
     return createWorkerCall('myFunction', { input });
   }, [createWorkerCall]);
   ```

## Performance Benefits

- **Background Processing**: All WASM operations run in Web Workers
- **Non-blocking UI**: Main thread remains responsive during computations
- **Parallel Execution**: Multiple operations can run simultaneously
- **Memory Isolation**: Worker threads provide better memory management
- **Request Tracking**: Extism worker uses request IDs for concurrent operations

## Technologies Used

- **Remix**: Full-stack React framework
- **AssemblyScript**: TypeScript to WebAssembly compiler
- **Extism**: Universal plugin system for WebAssembly
- **Web Workers**: Background thread processing
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Rust**: For Extism plugin development

## License

MIT License - see LICENSE file for details.
