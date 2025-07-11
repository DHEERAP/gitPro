import React, { useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Hero from './components/Hero';
import GitCommands from './components/GitCommands';
import Terminal from './components/Terminal';
import Quiz from './components/Quiz';
import Footer from './components/Footer';
import GeminiAISection from "./components/GeminiAISection";

function App() {
  const commandsRef = useRef<HTMLDivElement>(null);

  const scrollToCommands = () => {
    commandsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Toaster position="top-right" />
        <ThemeToggle />
        
        <Hero onGetStarted={scrollToCommands} />
        
        <div ref={commandsRef} id="commands">
          <GitCommands />
        </div>
        
        <div id="terminal">
          <Terminal />
        </div>
        
        <div id="quiz">
          <Quiz />
          <GeminiAISection />
        </div>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;