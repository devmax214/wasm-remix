import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { useAssemblyScriptWorker } from "~/hooks/useAssemblyScriptWorker";
import { useExtismWorker } from "~/hooks/useExtismWorker";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix WebAssembly App" },
    { name: "description", content: "A Remix app with AssemblyScript WebAssembly and Extism plugins" },
  ];
};

export default function Index() {
  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(3);
  const [assemblyResult, setAssemblyResult] = useState<number | null>(null);
  const [assemblyLoading, setAssemblyLoading] = useState(false);
  const [assemblyError, setAssemblyError] = useState<string | null>(null);

  // Extism Plugin
  const [extismName, setExtismName] = useState("World");
  const [greetResult, setGreetResult] = useState<string | null>(null);
  const [greetLoading, setGreetLoading] = useState(false);
  const [greetError, setGreetError] = useState<string | null>(null);

  const [calcOperation, setCalcOperation] = useState("add");
  const [calcNum1, setCalcNum1] = useState(0);
  const [calcNum2, setCalcNum2] = useState(0);
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  const [processTextInput, setProcessTextInput] = useState("");
  const [processTextResult, setProcessTextResult] = useState<string | null>(null);
  const [processTextLoading, setProcessTextLoading] = useState(false);
  const [processTextError, setProcessTextError] = useState<string | null>(null);

  const { add, isReady, isLoading, error } = useAssemblyScriptWorker();
  const { 
    greet, 
    calculate, 
    processText, 
    callFunction,
    isReady: extismReady, 
    isLoading: extismIsLoading, 
    error: extismErrorState 
  } = useExtismWorker();

  const handleAssemblyAdd = async () => {
    try {
      setAssemblyLoading(true);
      setAssemblyError(null);
      const result = await add(num1, num2);
      setAssemblyResult(result);
    } catch (err) {
      setAssemblyError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setAssemblyLoading(false);
    }
  };

  const handleExtismGreet = async () => {
    try {
      setGreetLoading(true);
      setGreetError(null);
      const result = await greet(extismName);
      setGreetResult(result);
    } catch (err) {
      setGreetError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGreetLoading(false);
    }
  };

  const handleExtismCalculate = async () => {
    try {
      setCalcLoading(true);
      setCalcError(null);
      const result = await calculate(calcOperation, calcNum1, calcNum2);
      setCalcResult(result);
    } catch (err) {
      setCalcError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setCalcLoading(false);
    }
  };

  const handleExtismProcessText = async () => {
    try {
      setProcessTextLoading(true);
      setProcessTextError(null);
      const result = await processText(processTextInput);
      setProcessTextResult(result);
    } catch (err) {
      setProcessTextError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setProcessTextLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-16">
          <header className="flex flex-col items-center gap-9">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 text-center">
              Remix + WebAssembly + Extism
            </h1>
            <div className="h-[144px] w-[434px]">
              <img
                src="/logo-light.png"
                alt="Remix"
                className="block w-full dark:hidden"
              />
              <img
                src="/logo-dark.png"
                alt="Remix"
                className="hidden w-full dark:block"
              />
            </div>
          </header>

          {/* AssemblyScript WebAssembly Calculator */}
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
                AssemblyScript WASM Calculator
              </h2>
              
              {/* Status */}
              <div className="mb-6">
                {isLoading && (
                  <div className="text-blue-600 dark:text-blue-400 text-sm text-center">
                    Loading AssemblyScript WASM...
                  </div>
                )}
                {isReady && (
                  <div className="text-green-600 dark:text-green-400 text-sm text-center">
                    ✓ AssemblyScript WASM ready
                  </div>
                )}
                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm text-center">
                    Error: {error}
                  </div>
                )}
              </div>

              {/* Calculator Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="input-a" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Number
                  </label>
                  <input
                    id="input-a"
                    type="number"
                    value={num1}
                    onChange={(e) => setNum1(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter first number"
                  />
                </div>
                
                <div>
                  <label htmlFor="input-b" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Second Number
                  </label>
                  <input
                    id="input-b"
                    type="number"
                    value={num2}
                    onChange={(e) => setNum2(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter second number"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleAssemblyAdd}
                disabled={!isReady || assemblyLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {assemblyLoading ? 'Calculating...' : 'Add Numbers'}
              </button>

              {/* Result */}
              {assemblyResult !== null && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-green-700 dark:text-green-300 mb-1">Result</div>
                    <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {num1} + {num2} = {assemblyResult}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Calculated in AssemblyScript WASM
                    </div>
                  </div>
                </div>
              )}

              {assemblyError && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-red-700 dark:text-red-300 mb-1">Error</div>
                    <div className="text-2xl font-bold text-red-800 dark:text-red-200">
                      {assemblyError}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Extism Plugin */}
          <div className="w-full max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
                Extism WebAssembly Plugin
              </h2>
              
              {/* Status */}
              <div className="mb-6">
                {extismIsLoading && (
                  <div className="text-blue-600 dark:text-blue-400 text-sm text-center">
                    Loading Extism plugin...
                  </div>
                )}
                {extismReady && (
                  <div className="text-green-600 dark:text-green-400 text-sm text-center">
                    ✓ Extism plugin ready
                  </div>
                )}
                {extismErrorState && (
                  <div className="text-red-600 dark:text-red-400 text-sm text-center">
                    Error: {extismErrorState}
                  </div>
                )}
              </div>

              {/* Plugin Functions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Greet Function */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Greet</h3>
                  <div>
                    <label htmlFor="extism-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      id="extism-name"
                      type="text"
                      value={extismName}
                      onChange={(e) => setExtismName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter name"
                    />
                  </div>
                  <button
                    onClick={handleExtismGreet}
                    disabled={!extismReady || greetLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-sm"
                  >
                    {greetLoading ? 'Processing...' : 'Greet'}
                  </button>
                  {greetResult && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <div className="text-sm text-purple-800 dark:text-purple-200">{greetResult}</div>
                    </div>
                  )}
                  {greetError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="text-sm text-red-800 dark:text-red-200">{greetError}</div>
                    </div>
                  )}
                </div>

                {/* Calculate Function */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Calculate</h3>
                  <div className="space-y-2">
                    <div>
                      <label htmlFor="extism-operation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Operation
                      </label>
                      <select
                        id="extism-operation"
                        value={calcOperation}
                        onChange={(e) => setCalcOperation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      >
                        <option value="add">Add</option>
                        <option value="subtract">Subtract</option>
                        <option value="multiply">Multiply</option>
                        <option value="divide">Divide</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={calcNum1}
                        onChange={(e) => setCalcNum1(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="A"
                      />
                      <input
                        type="number"
                        value={calcNum2}
                        onChange={(e) => setCalcNum2(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="B"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleExtismCalculate}
                    disabled={!extismReady || calcLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-sm"
                  >
                    {calcLoading ? 'Processing...' : 'Calculate'}
                  </button>
                  {calcResult && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <div className="text-sm text-purple-800 dark:text-purple-200">{calcResult}</div>
                    </div>
                  )}
                  {calcError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="text-sm text-red-800 dark:text-red-200">{calcError}</div>
                    </div>
                  )}
                </div>

                {/* Text Processing Function */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Text Process</h3>
                  <div>
                    <label htmlFor="extism-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text
                    </label>
                    <input
                      id="extism-text"
                      type="text"
                      value={processTextInput}
                      onChange={(e) => setProcessTextInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter text"
                    />
                  </div>
                  <button
                    onClick={handleExtismProcessText}
                    disabled={!extismReady || processTextLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-sm"
                  >
                    {processTextLoading ? 'Processing...' : 'Process'}
                  </button>
                  {processTextResult && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <div className="text-sm text-purple-800 dark:text-purple-200">{processTextResult}</div>
                    </div>
                  )}
                  {processTextError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="text-sm text-red-800 dark:text-red-200">{processTextError}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <p className="leading-6 text-gray-700 dark:text-gray-200 font-medium">
              Learn More
            </p>
            <ul className="space-y-2">
              {resources.map(({ href, text, icon }) => (
                <li key={href}>
                  <a
                    className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icon}
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

const resources = [
  {
    href: "https://remix.run/start/quickstart",
    text: "Quick Start (5 min)",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M8.51851 12.0741L7.92592 18L15.6296 9.7037L11.4815 7.33333L12.0741 2L4.37036 10.2963L8.51851 12.0741Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "https://remix.run/start/tutorial",
    text: "Tutorial (30 min)",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M4.561 12.749L3.15503 14.1549M3.00811 8.99944H1.01978M3.15503 3.84489L4.561 5.2508M8.3107 1.70923L8.3107 3.69749M13.4655 3.84489L12.0595 5.2508M18.1868 17.0974L16.635 18.6491C16.4636 18.8205 16.1858 18.8205 16.0144 18.6491L13.568 16.2028C13.383 16.0178 13.0784 16.0347 12.915 16.239L11.2697 18.2956C11.047 18.5739 10.6029 18.4847 10.505 18.142L7.85215 8.85711C7.75756 8.52603 8.06365 8.21994 8.39472 8.31453L17.6796 10.9673C18.0223 11.0653 18.1115 11.5094 17.8332 11.7321L15.7766 13.3773C15.5723 13.5408 15.5554 13.8454 15.7404 14.0304L18.1868 16.4767C18.3582 16.6481 18.3582 16.926 18.1868 17.0974Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "https://remix.run/docs",
    text: "Remix Docs",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M9.99981 10.0751V9.99992M17.4688 17.4688C15.889 19.0485 11.2645 16.9853 7.13958 12.8604C3.01467 8.73546 0.951405 4.11091 2.53116 2.53116C4.11091 0.951405 8.73546 3.01467 12.8604 7.13958C16.9853 11.2645 19.0485 15.889 17.4688 17.4688ZM2.53132 17.4688C0.951566 15.8891 3.01483 11.2645 7.13974 7.13963C11.2647 3.01471 15.8892 0.951453 17.469 2.53121C19.0487 4.11096 16.9854 8.73551 12.8605 12.8604C8.73562 16.9853 4.11107 19.0486 2.53132 17.4688Z"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "https://rmx.as/discord",
    text: "Join Discord",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 24 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M15.0686 1.25995L14.5477 1.17423L14.2913 1.63578C14.1754 1.84439 14.0545 2.08275 13.9422 2.31963C12.6461 2.16488 11.3406 2.16505 10.0445 2.32014C9.92822 2.08178 9.80478 1.84975 9.67412 1.62413L9.41449 1.17584L8.90333 1.25995C7.33547 1.51794 5.80717 1.99419 4.37748 2.66939L4.19 2.75793L4.07461 2.93019C1.23864 7.16437 0.46302 11.3053 0.838165 15.3924L0.868838 15.7266L1.13844 15.9264C2.81818 17.1714 4.68053 18.1233 6.68582 18.719L7.18892 18.8684L7.50166 18.4469C7.96179 17.8268 8.36504 17.1824 8.709 16.4944L8.71099 16.4904C10.8645 17.0471 13.128 17.0485 15.2821 16.4947C15.6261 17.1826 16.0293 17.8269 16.4892 18.4469L16.805 18.8725L17.3116 18.717C19.3056 18.105 21.1876 17.1751 22.8559 15.9238L23.1224 15.724L23.1528 15.3923C23.5873 10.6524 22.3579 6.53306 19.8947 2.90714L19.7759 2.73227L19.5833 2.64518C18.1437 1.99439 16.6386 1.51826 15.0686 1.25995ZM16.6074 10.7755L16.6074 10.7756C16.5934 11.6409 16.0212 12.1444 15.4783 12.1444C14.9297 12.1444 14.3493 11.6173 14.3493 10.7877C14.3493 9.94885 14.9378 9.41192 15.4783 9.41192C16.0471 9.41192 16.6209 9.93851 16.6074 10.7755ZM8.49373 12.1444C7.94513 12.1444 7.36471 11.6173 7.36471 10.7877C7.36471 9.94885 7.95323 9.41192 8.49373 9.41192C9.06038 9.41192 9.63892 9.93712 9.6417 10.7815C9.62517 11.6239 9.05462 12.1444 8.49373 12.1444Z"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];
