#!/bin/bash

# Build the Rust WASM plugin
echo "Building Rust WASM plugin..."

# Check if cargo is installed
if ! command -v cargo &> /dev/null; then
    echo "Error: cargo is not installed. Please install Rust first."
    exit 1
fi

# Build the WASM module
cargo build --target wasm32-unknown-unknown --release

# Copy the built WASM to the public directory
mkdir -p ../../public/wasm
cp target/wasm32-unknown-unknown/release/extism_plugin.wasm ../../public/wasm/extism-plugin.wasm

echo "WASM plugin built successfully!"
echo "Output: ../../public/wasm/extism-plugin.wasm" 