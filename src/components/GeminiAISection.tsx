    // import React, { useState, useEffect, useRef } from "react";
    // // @ts-ignore
    // import { GoogleGenerativeAI } from "@google/generative-ai";

    // const GEMINI_API_KEY_STORAGE = "gemini_api_key";

    // const GeminiAISection: React.FC = () => {
    // const [apiKey, setApiKey] = useState<string>("");
    // const [inputKey, setInputKey] = useState<string>("");
    // const [hasKey, setHasKey] = useState<boolean>(false);
    // const [prompt, setPrompt] = useState<string>("");
    // const [response, setResponse] = useState<string>("");
    // const [loading, setLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string>("");
    // const inputRef = useRef<HTMLInputElement>(null);

    // useEffect(() => {
    //     const storedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    //     if (storedKey) {
    //     setApiKey(storedKey);
    //     setHasKey(true);
    //     }
    // }, []);

    // const handleSaveKey = () => {
    //     if (inputKey.trim()) {
    //     localStorage.setItem(GEMINI_API_KEY_STORAGE, inputKey.trim());
    //     setApiKey(inputKey.trim());
    //     setHasKey(true);
    //     setInputKey("");
    //     setError("");
    //     } else {
    //     setError("Please enter a valid API key.");
    //     }
    // };

    // const handleRemoveKey = () => {
    //     localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    //     setApiKey("");
    //     setHasKey(false);
    //     setResponse("");
    //     setPrompt("");
    //     setError("");
    // };

    // const handleAsk = async () => {
    //     setError("");
    //     setResponse("");
    //     if (!prompt.trim()) {
    //     setError("Please enter a prompt.");
    //     return;
    //     }
    //     setLoading(true);
    //     try {
    //     const genAI = new GoogleGenerativeAI(apiKey);
    //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    //     const result = await model.generateContent(prompt);
    //     const text = await result.response.text();
    //     setResponse(text);
    //     } catch (err: any) {
    //     setError("Failed to get response. Please check your API key or try again.");
    //     } finally {
    //     setLoading(false);
    //     }
    // };

    // // UI for API key input (first screenshot)
    // if (!hasKey) {
    //     return (
    //     <section className="flex flex-col items-center justify-center min-h-[60vh] py-10">
    //         <h2 className="text-3xl md:text-4xl font-bold text-center mb-0 text-green-400" style={{lineHeight:1.1}}>
    //         Solve Your Git Doubts Instantly —
    //         </h2>
    //         <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-400" style={{lineHeight:1.1}}>
    //         Enter Your Gemini AI API Key
    //         </h3>
    //         <p className="text-center text-lg text-gray-300 mb-2 max-w-xl">
    //         To use this AI-powered Git help desk, you need a free Gemini API key from Google. Generate your key, paste it below, and start asking any Git question!
    //         </p>
    //         <a
    //         href="https://aistudio.google.com/app/apikey"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="text-blue-400 underline mb-2 text-base"
    //         >
    //         Get your Gemini API key here
    //         </a>
    //         <div className="text-gray-400 text-xs mb-2">(Requires a Google account. Click the link, sign in, and copy your API key.)</div>
    //         <div className="bg-gray-800/80 rounded-lg p-4 mb-6 mt-2 text-gray-300 text-sm max-w-md w-full">
    //         <ol className="list-decimal list-inside space-y-1">
    //             <li>Click the link above and sign in with your Google account.</li>
    //             <li>Click "Create API key" and copy the generated key.</li>
    //             <li>Paste your API key below and click <b>Save API Key</b>.</li>
    //             <li>Start asking your Git questions below!</li>
    //         </ol>
    //         </div>
    //         <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 rounded-xl p-8 flex flex-col items-center w-full max-w-2xl shadow-2xl border border-gray-700">
    //         <div className="flex flex-col items-center w-full mb-4">
    //             <span className="text-3xl mb-2">🔑</span>
    //             <input
    //             ref={inputRef}
    //             type="password"
    //             className="bg-gray-800 text-gray-200 px-4 py-2 rounded w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base text-center tracking-wide"
    //             placeholder="Paste your Gemini API key here"
    //             value={inputKey}
    //             onChange={e => setInputKey(e.target.value)}
    //             onKeyDown={e => e.key === "Enter" && handleSaveKey()}
    //             />
    //         </div>
    //         <button
    //             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded transition mb-2 w-full max-w-xs text-lg shadow"
    //             onClick={handleSaveKey}
    //         >
    //             Save API Key
    //         </button>
    //         {error && <div className="text-red-400 mt-2 text-sm">{error}</div>}
    //         </div>
    //     </section>
    //     );
    // }

    // // UI for prompt/response (second screenshot)
    // return (
    //     <section className="flex flex-col items-center justify-center min-h-[50vh] py-10">
    //     <h2 className="text-3xl md:text-4xl font-bold text-center mb-0 text-green-400" style={{lineHeight:1.1}}>
    //         Instantly Solve Your Git Doubts with
    //     </h2>
    //     <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-400" style={{lineHeight:1.1}}>
    //         Gemini AI
    //     </h3>
    //     <p className="text-center text-lg text-gray-300 mb-4 max-w-xl">
    //         Stuck with a Git command or concept? Ask below and get clear, AI-powered answers—just like having an expert by your side!
    //     </p>
    //     <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 rounded-xl p-8 flex flex-col items-center w-full max-w-2xl shadow-2xl border border-gray-700 mb-6">
    //         <div className="flex items-center w-full mb-4 relative">
    //         <span className="text-2xl mr-2 text-blue-400">➤</span>
    //         <span className="font-bold text-lg text-white mr-auto">Ask Gemini AI</span>
    //         <button
    //             className="absolute right-0 top-1 text-red-400 text-sm underline hover:text-red-300"
    //             onClick={handleRemoveKey}
    //         >
    //             Change API Key
    //         </button>
    //         </div>
    //         <div className="flex items-center w-full mb-2">
    //         <input
    //             type="text"
    //             className="bg-gray-800 text-gray-200 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-base tracking-wide"
    //             placeholder="Type your prompt and press Enter..."
    //             value={prompt}
    //             onChange={e => setPrompt(e.target.value)}
    //             onKeyDown={e => e.key === "Enter" && !loading && handleAsk()}
    //             disabled={loading}
    //         />
    //         <button
    //             className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition flex-shrink-0 text-lg shadow"
    //             onClick={handleAsk}
    //             disabled={loading}
    //         >
    //             {loading ? "..." : "Ask"}
    //         </button>
    //         </div>
    //         {error && <div className="text-red-400 mt-2 text-sm w-full">{error}</div>}
    //         {response && (
    //         <div className="bg-gray-800 rounded p-4 mt-4 w-full text-gray-200 whitespace-pre-line border border-gray-700">
    //             {response}
    //         </div>
    //         )}
    //     </div>
    //     </section>
    // );
    // };

    // export default GeminiAISection; 




    import React, { useState, useEffect, useRef } from "react";
// @ts-ignore
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY_STORAGE = "gemini_api_key";

const GeminiAISection: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [inputKey, setInputKey] = useState<string>("");
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    if (storedKey) {
      setApiKey(storedKey);
      setHasKey(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (inputKey.trim()) {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, inputKey.trim());
      setApiKey(inputKey.trim());
      setHasKey(true);
      setInputKey("");
      setError("");
    } else {
      setError("Please enter a valid API key.");
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    setApiKey("");
    setHasKey(false);
    setResponse("");
    setPrompt("");
    setError("");
  };

  const handleAsk = async () => {
    setError("");
    setResponse("");
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      setResponse(text);
    } catch (err: any) {
      setError("Failed to get response. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[70vh] py-10 px-4">
        <div className="w-full max-w-xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-500">
            Solve Your Git Doubts Instantly — Enter Your Gemini AI API Key
          </h2>
          <p className="text-gray-300 text-base md:text-lg">
            To use this AI-powered Git help desk, you need a free Gemini API key from Google. Generate your key, paste it below, and start asking any Git question!
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline text-base"
          >
            Get your Gemini API key here
          </a>
          <div className="bg-gray-800/80 rounded-lg p-4 text-gray-300 text-sm">
            <ol className="list-decimal list-inside space-y-1 text-left">
              <li>Click the link above and sign in with your Google account.</li>
              <li>Click "Create API key" and copy the generated key.</li>
              <li>Paste your API key below and click <b>Save API Key</b>.</li>
              <li>Start asking your Git questions below!</li>
            </ol>
          </div>
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">🔑</span>
              <input
                ref={inputRef}
                type="password"
                className="bg-gray-800 text-gray-200 px-4 py-2 rounded w-full max-w-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Paste your Gemini API key here"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveKey()}
              />
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition w-full max-w-xs"
                onClick={handleSaveKey}
              >
                Save API Key
              </button>
              {error && <div className="text-red-400 mt-2 text-sm">{error}</div>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] py-10 px-4">
      <div className="w-full max-w-xl text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-500">
          Instantly Solve Your Git Doubts with Gemini AI
        </h2>
        <p className="text-gray-300 text-base md:text-lg">
          Stuck with a Git command or concept? Ask below and get clear, AI-powered answers — just like having an expert by your side!
        </p>
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-xl">➤</span>
              <span className="font-semibold text-white">Ask Gemini AI</span>
            </div>
            <button
              onClick={handleRemoveKey}
              className="text-sm text-red-400 hover:underline"
            >
              Change API Key
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-grow bg-gray-800 text-gray-200 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your prompt and press Enter..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleAsk()}
              disabled={loading}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
              onClick={handleAsk}
              disabled={loading}
            >
              {loading ? "..." : "Ask"}
            </button>
          </div>
          {error && <div className="text-red-400 mt-2 text-sm text-left">{error}</div>}
          {response && (
            <div className="bg-gray-800 mt-4 rounded p-4 text-gray-200 whitespace-pre-line border border-gray-700">
              {response}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GeminiAISection;