import { createExtismPlugin } from '../dist/index.js';

async function testExtismPlugin() {
  console.log('Testing Extism Plugin...');
  
  try {
    // Create plugin instance
    const plugin = createExtismPlugin({
      wasmPath: '/wasm/extism-plugin.wasm',
      functions: ['greet', 'calculate', 'process_text']
    });

    // Initialize the plugin
    await plugin.initialize();
    console.log('✓ Plugin initialized successfully');

    // Test greet function
    const greetResult = await plugin.greet('Alice');
    console.log('✓ Greet result:', greetResult);

    // Test calculate function
    const calcResult = await plugin.calculate('add', 10, 5);
    console.log('✓ Calculate result:', calcResult);

    // Test text processing
    const textResult = await plugin.processText('Hello World');
    console.log('✓ Text processing result:', textResult);

    console.log('✓ All tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error);
  }
}

testExtismPlugin(); 