import { createPlugin, type Plugin } from 'extism';

export interface ExtismPluginConfig {
  wasmPath: string;
  functions?: string[];
}

export class ExtismPluginManager {
  private plugin: Plugin | null = null;
  private config: ExtismPluginConfig;

  constructor(config: ExtismPluginConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // Load the WASM file
      const response = await fetch(this.config.wasmPath);
      if (!response.ok) {
        throw new Error(`Failed to load WASM file: ${response.statusText}`);
      }
      const wasmBytes = await response.arrayBuffer();

      // Initialize the Extism plugin
      this.plugin = await createPlugin(wasmBytes);

      console.log('Extism plugin initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Extism plugin:', error);
      throw error;
    }
  }

  async callFunction(functionName: string, input: string): Promise<string> {
    if (!this.plugin) {
      throw new Error('Plugin not initialized. Call initialize() first.');
    }

    try {
      const result = await this.plugin.call(functionName, input);
      return result?.text() || '';
    } catch (error) {
      console.error(`Error calling function ${functionName}:`, error);
      throw error;
    }
  }

  // Sample functions that can be called
  async greet(name: string): Promise<string> {
    return this.callFunction('greet', JSON.stringify({ name }));
  }

  async calculate(operation: string, a: number, b: number): Promise<string> {
    return this.callFunction('calculate', JSON.stringify({ operation, a, b }));
  }

  async processText(text: string): Promise<string> {
    return this.callFunction('process_text', JSON.stringify({ text }));
  }

  async scrapeWebsite(url: string, htmlContent?: string): Promise<string> {
    const input = htmlContent 
      ? JSON.stringify({ url, html_content: htmlContent })
      : JSON.stringify({ url });
    return this.callFunction('scrape_website', input);
  }

  isInitialized(): boolean {
    return this.plugin !== null;
  }

  destroy(): void {
    this.plugin = null;
  }
}

// Export a factory function for easy usage
export function createExtismPlugin(config: ExtismPluginConfig): ExtismPluginManager {
  return new ExtismPluginManager(config);
}

// Export types
export type { Plugin } from 'extism'; 