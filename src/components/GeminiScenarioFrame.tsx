
// // 
// import React, { useState, useEffect, useRef } from "react";
// // @ts-ignore
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const GEMINI_API_KEY_STORAGE = "gemini_api_key";
// const PROMPT = `Generate a random Git or GitHub scenario for me to practice. Each time, follow this structure:\n\n🎯 Title of the scenario (short and clear)\n🔥 Difficulty level: Easy, Medium, or Advanced\n📝 Short description of the task (1–2 lines)\n💡 Bullet-point hints (clear, step-by-step, minimum 3 steps)\n\nEach time, randomly choose the difficulty: sometimes Easy, sometimes Medium, sometimes Advanced. Do not always return Medium.\n\nMake sure each scenario is different every time and includes concepts like:\n- Branching\n- Commits\n- Pull requests\n- Rebasing\n- Merging\n- Conflict resolution\n- Remote setups\n- GitHub workflows\n\nAvoid repeating the same task. Vary the difficulty, commands, and use cases to help me learn Git better.`;

// function parseScenario(text: string) {
//   const titleMatch = text.match(/🎯\s*(.*)/);
//   const diffMatch = text.match(/🔥\s*Difficulty level:\s*(.*)/);
//   const descMatch = text.match(/📝\s*(.*)/);
//   const hintsMatch = text.match(/💡[\s\S]*?(?:\n|^)([\s\S]*)/);
//   let hints: string[] = [];
//   if (hintsMatch && hintsMatch[1]) {
//     hints = hintsMatch[1]
//       .split(/\n|\r/)
//       .map(h => h.replace(/^[-•\d.\s]+/, "").trim())
//       .filter(Boolean);
//   }
//   return {
//     title: titleMatch ? titleMatch[1].trim() : "Git Scenario",
//     difficulty: diffMatch ? diffMatch[1].trim() : "Unknown",
//     description: descMatch ? descMatch[1].trim() : "",
//     hints,
//   };
// }

// const GeminiScenarioFrame: React.FC = () => {
//   const [apiKey, setApiKey] = useState<string>("");
//   const [inputKey, setInputKey] = useState<string>("");
//   const [hasKey, setHasKey] = useState<boolean>(false);
//   const [scenario, setScenario] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [showHints, setShowHints] = useState<boolean>(false);
//   const [rawError, setRawError] = useState<any>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const storedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
//     if (storedKey) {
//       setApiKey(storedKey);
//       setHasKey(true);
//     }
//   }, []);

//   const handleSaveKey = () => {
//     const cleanKey = inputKey.trim();
//     if (cleanKey) {
//       localStorage.setItem(GEMINI_API_KEY_STORAGE, cleanKey);
//       setApiKey(cleanKey);
//       setHasKey(true);
//       setInputKey("");
//       setError("");
//       setRawError(null);
//     } else {
//       setError("Please enter a valid API key.");
//     }
//   };

//   const handleRemoveKey = () => {
//     localStorage.removeItem(GEMINI_API_KEY_STORAGE);
//     setApiKey("");
//     setHasKey(false);
//     setScenario(null);
//     setError("");
//     setRawError(null);
//   };

//   const handleGenerate = async () => {
//     setError("");
//     setRawError(null);
//     setScenario(null);
//     setShowHints(false);
//     setLoading(true);
//     try {
//       const key = localStorage.getItem(GEMINI_API_KEY_STORAGE);
//       if (!key) {
//         setError("No API key found. Please enter and save your Gemini API key first.");
//         setLoading(false);
//         return;
//       }
//       setApiKey(key);
//       const genAI = new GoogleGenerativeAI(key);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       const result = await model.generateContent(PROMPT);
//       const text = await result.response.text();
//       setScenario(parseScenario(text));
//     } catch (err: any) {
//       setError("Failed to get scenario. " + (err?.message || "Please check your API key or try again."));
//       setRawError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const apiKeyBox = (
//     <div className="bg-gray-900/90 border border-gray-700 rounded-xl p-6 flex flex-col items-center w-full max-w-xs shadow-xl mb-4">
//       <span className="text-2xl mb-2">🔑</span>
//       <input
//         ref={inputRef}
//         type="password"
//         className="bg-gray-800 text-gray-200 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-base text-center tracking-wide mb-2"
//         placeholder="Paste Gemini API key"
//         value={inputKey}
//         onChange={e => setInputKey(e.target.value)}
//         onKeyDown={e => e.key === "Enter" && handleSaveKey()}
//       />
//       <button
//         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition w-full text-lg shadow"
//         onClick={handleSaveKey}
//       >
//         Save API Key
//       </button>
//       {error && <div className="text-red-400 mt-2 text-sm">{error}</div>}
//       {rawError && (
//         <details className="text-red-300 text-xs mt-1 w-full">
//           <summary>Show technical error</summary>
//           <pre className="whitespace-pre-wrap break-all">{JSON.stringify(rawError, null, 2)}</pre>
//         </details>
//       )}
//     </div>
//   );

//   return (
//     <section className="flex flex-col md:flex-row items-center justify-center w-full py-8">
//       {!hasKey && <div className="md:mr-8 mb-4 md:mb-0">{apiKeyBox}</div>}
//       <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 rounded-xl p-8 flex flex-col items-center w-full max-w-2xl shadow-2xl border border-gray-700">
//         <div className="flex items-center w-full mb-4 relative">
//           <span className="text-2xl mr-2 text-blue-400">🧩</span>
//           <span className="font-bold text-2xl text-white mr-auto">Practice a Git Scenario</span>
//           {hasKey && (
//             <button
//               className="absolute right-0 top-1 text-red-400 text-sm underline hover:text-red-300"
//               onClick={handleRemoveKey}
//             >
//               Change API Key
//             </button>
//           )}
//         </div>
//         {hasKey && (
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded transition mb-4 w-full max-w-xs text-lg shadow"
//             onClick={handleGenerate}
//             disabled={loading}
//           >
//             {loading ? "Generating..." : "Generate New Task"}
//           </button>
//         )}
//         {scenario && (
//           <div className="w-full mt-2">
//             <div className="flex items-center mb-2">
//               <span className="font-bold text-lg text-white mr-2">{scenario.title}</span>
//               <span className={`px-2 py-1 rounded text-xs font-semibold ml-2 ${scenario.difficulty === "Easy" ? "bg-green-700 text-green-200" : scenario.difficulty === "Medium" ? "bg-yellow-700 text-yellow-200" : "bg-red-700 text-red-200"}`}>{scenario.difficulty}</span>
//             </div>
//             <div className="text-gray-300 mb-2 text-base">{scenario.description}</div>
//             <div className="mb-2">
//               <button
//                 className="flex items-center text-blue-400 hover:text-blue-300 text-base font-semibold focus:outline-none"
//                 onClick={() => setShowHints(h => !h)}
//               >
//                 <span className="mr-1">💡</span> Hints
//                 <svg className={`ml-1 w-4 h-4 transition-transform ${showHints ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
//               </button>
//               {showHints && (
//                 <ul className="bg-gray-800 rounded mt-2 p-3 text-gray-200 text-sm list-decimal list-inside">
//                   {scenario.hints.map((hint: string, idx: number) => (
//                     <li key={idx}>{hint}</li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         )}
//         {error && hasKey && <div className="text-red-400 mt-2 text-sm w-full">{error}</div>}
//         {rawError && hasKey && (
//           <details className="text-red-300 text-xs mt-1 w-full">
//             <summary>Show technical error</summary>
//             <pre className="whitespace-pre-wrap break-all">{JSON.stringify(rawError, null, 2)}</pre>
//           </details>
//         )}
//         {!scenario && hasKey && !loading && (
//           <div className="text-gray-400 text-sm mt-2">Click "Generate New Task" to get a new scenario!</div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default GeminiScenarioFrame;





import React, { useState, useEffect, useRef } from "react";
// @ts-ignore
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Key, Lightbulb, RefreshCw, Terminal, GitBranch, ChevronDown, ChevronUp } from "lucide-react";

const GEMINI_API_KEY_STORAGE = "gemini_api_key";
// const PROMPT = `Generate a random Git or GitHub scenario for me to practice. Each time, follow this structure:\n\n🎯 Title of the scenario (short and clear)\n🔥 Difficulty level: Easy, Medium, or Advanced\n📝 Short description of the task (1–2 lines)\n💡 Bullet-point hints (clear, step-by-step, minimum 3 steps)\n\nEach time, randomly choose the difficulty: sometimes Easy, sometimes Medium, sometimes Advanced. Do not always return Medium.\n\nMake sure each scenario is different every time and includes concepts like:\n- Branching\n- Commits\n- Pull requests\n- Rebasing\n- Merging\n- Conflict resolution\n- Remote setups\n- GitHub workflows\n\nAvoid repeating the same task. Vary the difficulty, commands, and use cases to help me learn Git better.`;
const PROMPT = `Generate a unique Git or GitHub scenario for me to practice. Follow this structure strictly:

🎯 Title of the scenario (short and clear)
🔥 Difficulty level: Easy, Medium, or Advanced (randomly vary)
📝 Short description of the task (1–2 lines)
💡 Bullet-point hints (clear, step-by-step, minimum 3 steps)

Important guidelines:
- Rotate and balance the difficulty so that Easy, Medium, and Advanced scenarios appear with roughly equal frequency. Do not favor any one difficulty.
- Make each scenario different from the previous one.
- Rotate through different Git topics such as:
  - Branching
  - Commits
  - Pull requests
  - Rebasing
  - Merging
  - Conflict resolution
  - Remote repositories
  - GitHub workflows
- Avoid repetition. Provide fresh commands, use cases, and learning angles every time.

Make the scenario engaging, realistic, and practical for developers to practice.`;

function parseScenario(text: string) {
  const titleMatch = text.match(/🎯\s*(.*)/);
  const diffMatch = text.match(/🔥\s*Difficulty level:\s*(.*)/);
  const descMatch = text.match(/📝\s*(.*)/);
  const hintsMatch = text.match(/💡[\s\S]*?(?:\n|^)([\s\S]*)/);
  let hints: string[] = [];
  if (hintsMatch && hintsMatch[1]) {
    hints = hintsMatch[1]
      .split(/\n|\r/)
      .map(h => h.replace(/^[-•\d.\s]+/, "").trim())
      .filter(Boolean);
  }
  return {
    title: titleMatch ? titleMatch[1].trim() : "Git Scenario",
    difficulty: diffMatch ? diffMatch[1].trim() : "Unknown",
    description: descMatch ? descMatch[1].trim() : "",
    hints,
  };
}

const GeminiScenarioFrame: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [inputKey, setInputKey] = useState<string>("");
  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showHints, setShowHints] = useState<boolean>(false);
  const [rawError, setRawError] = useState<any>(null);
  // Removed inputRef and any focus/scroll logic

  // Always check for API key in localStorage on every render
  const hasKey = Boolean((typeof window !== 'undefined') && (localStorage.getItem(GEMINI_API_KEY_STORAGE) || '').trim());

  useEffect(() => {
    // Only sync apiKey state with localStorage, do not clear it on every load
    const storedKey = (localStorage.getItem(GEMINI_API_KEY_STORAGE) || '').trim();
    setApiKey(storedKey);
    if (!storedKey) {
      setScenario(null);
      setError("");
      setRawError(null);
      setInputKey("");
    }
  }, [hasKey]);

  const handleSaveKey = () => {
    const cleanKey = inputKey.trim();
    if (cleanKey) {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, cleanKey);
      setApiKey(cleanKey);
      setInputKey("");
      setError("");
      setRawError(null);
    } else {
      setError("Please enter a valid API key.");
    }
  };

  // Reset API key and show input page again
  const handleResetKey = () => {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    setApiKey("");
    setScenario(null);
    setError("");
    setRawError(null);
    setInputKey("");
  };

  const handleGenerate = async () => {
    setError("");
    setRawError(null);
    setScenario(null);
    setShowHints(false);
    setLoading(true);
    try {
      const key = (localStorage.getItem(GEMINI_API_KEY_STORAGE) || "").trim();
      if (!key) {
        setError("No API key found. Please enter and save your Gemini API key first.");
        setLoading(false);
        return;
      }
      setApiKey(key);
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(PROMPT);
      const text = await result.response.text();
      setScenario(parseScenario(text));
    } catch (err: any) {
      // If error is a quota error (429), show a simple message
      if (err?.message?.includes('429') || err?.message?.toLowerCase().includes('quota')) {
        setError('You have exceeded your daily Gemini API limit. Please try again tomorrow or use a different API key.');
        setRawError(null);
      } else {
        setError("Failed to get scenario. " + (err?.message || "Please check your API key or try again."));
        setRawError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Medium":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Advanced":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#181e29] px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 text-center">
          Set your API key first.
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl text-center">
        To experience scenario-based Git problem practice using the AI-powered terminal below, you need a free Gemini API key from Google. Generate your key and paste it below!
        </p>
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline mb-2 text-base"
        >
          Get your Gemini API key here
        </a>
        <div className="text-slate-400 text-xs mb-2">(Requires a Google account. Click the link, sign in, and copy your API key.)</div>
        <div className="bg-slate-800/80 rounded-xl p-6 mt-2 mb-8 text-slate-300 text-sm max-w-md w-full shadow-lg">
          <ol className="list-decimal list-inside space-y-1">
            <li>Click the link above and sign in with your Google account.</li>
            <li>Click "Create API key" and copy the generated key.</li>
            <li>Paste your API key below and click <b>Save API Key</b>.</li>
            <li>Start asking your Git questions below!</li>
          </ol>
        </div>
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 rounded-2xl p-8 flex flex-col items-center w-full max-w-xl shadow-2xl border border-slate-700">
          <span className="text-3xl mb-4 text-blue-300">🔑</span>
          <input
            type="password"
            className="bg-slate-800 text-slate-200 px-4 py-3 rounded w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base text-center tracking-wide mb-4"
            placeholder="Paste your Gemini API key here"
            value={inputKey}
            onChange={e => setInputKey(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSaveKey()}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded transition mb-2 w-full max-w-xs text-lg shadow"
            onClick={handleSaveKey}
          >
            Save API Key
          </button>
          {error && <div className="text-red-400 mt-2 text-sm">{error}</div>}
          {rawError && (
            <details className="text-red-300 text-xs mt-1 w-full">
              <summary>Show technical error</summary>
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(rawError, null, 2)}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Remove the old top-right Change API Key link; only keep the new one next to the heading */}
      {!scenario && (
        <div className="text-center mb-8 flex flex-col items-center relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 mt-8 shadow-lg">
            <GitBranch className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Ready to Practice Git?
          </h1>
          <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto">
            Generate a new scenario to practice your Git skills. Each scenario comes with step-by-step hints to guide you through the solution.
          </p>
          {hasKey && (
            <button
              onClick={handleResetKey}
              className="inline-block border border-red-400 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold mb-8 hover:bg-red-400 hover:text-white transition-colors"
              type="button"
            >
              Reset API Key
            </button>
          )}
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-10">
            <Terminal className="w-4 h-4" />
            <span>Solve them in Below terminal for the best practice</span>
          </div>
        </div>
      )}
      {/* Scenario card spacing improved and modular */}
      <div className="flex justify-center mt-16 mb-16"> {/* Use mt-16 for consistent gap below heading */}
        <div className="w-full max-w-2xl">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
            {scenario ? (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Git based Problem Scenarios</h2>
                  <button
                    onClick={handleGenerate}
                    className="text-slate-400 hover:text-white text-xl transition-colors disabled:opacity-50"
                    title="Refresh scenario"
                    disabled={loading}
                    aria-label="Refresh scenario"
                    type="button"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 19A9 9 0 1119 5.635" /></svg>
                    )}
                  </button>
                </div>

                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-3">{scenario.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyStyles(scenario.difficulty)}`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                    {/* Removed the old refresh button */}
                  </div>
                  
                  <p className="text-slate-300 mb-6 leading-relaxed">{scenario.description}</p>
                  
                  <div className="border border-blue-500/30 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="w-full bg-blue-500/10 hover:bg-blue-500/20 border-b border-blue-500/30 px-4 py-3 flex items-center justify-between text-blue-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        <span className="font-medium">Hints</span>
                      </div>
                      {showHints ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    {showHints && (
                      <div className="bg-slate-900/30 p-4">
                        <ol className="space-y-3">
                          {scenario.hints.map((hint: string, idx: number) => (
                            <li key={idx} className="flex gap-3 text-slate-300">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center text-sm font-medium">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{hint}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generating...
                      </div>
                    ) : (
                      "Generate New Scenario"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Generating Scenario...
                    </div>
                  ) : (
                    "Generate New Scenario"
                  )}
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>Click above to get your first practice scenario</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-8 mb-8">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                  {rawError && (
                    <details className="mt-2">
                      <summary className="text-red-300 text-xs cursor-pointer hover:text-red-200">
                        Show technical details
                      </summary>
                      <pre className="mt-2 text-xs text-red-300 bg-red-500/5 p-2 rounded overflow-auto">
                        {JSON.stringify(rawError, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiScenarioFrame;