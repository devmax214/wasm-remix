#!/bin/bash

echo "🚀 Setting up Remix WebAssembly App with Extism..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build AssemblyScript WASM
echo "🔨 Building AssemblyScript WASM..."
cd wasm-packages/package-assemblyscript
npm install
npm run asbuild
cd ../..

# Build Extism plugin TypeScript package
echo "🔨 Building Extism plugin TypeScript package..."
cd wasm-packages/package-extism
npm install
npm run build
cd ../..

# Check if Rust is installed for WASM compilation
if command -v cargo &> /dev/null; then
    echo "🦀 Rust detected! Building Extism WASM plugin..."
    cd wasm-packages/package-extism
    
    # Check if wasm32 target is installed
    if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
        echo "📦 Installing wasm32-unknown-unknown target..."
        rustup target add wasm32-unknown-unknown
    fi
    
    # Build the WASM
    npm run build:wasm
    cd ../..
    echo "✅ Extism WASM plugin built successfully!"
else
    echo "⚠️  Rust not detected. Skipping Extism WASM compilation."
    echo "   To build the Extism WASM plugin, install Rust from https://rustup.rs/"
    echo "   Then run: cd wasm-packages/package-extism && npm run build:wasm"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "The app includes:"
echo "  - AssemblyScript WASM Calculator (ready to use)"
echo "  - Extism Plugin (requires Rust for WASM compilation)" 