import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Play, RotateCcw, User, Copy, Download } from 'lucide-react';
import { GitSimulator } from '../utils/gitSimulator';
import toast from 'react-hot-toast';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: number;
}

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'output', content: 'Welcome to the Git Learning Terminal!', timestamp: Date.now() },
    { id: '2', type: 'output', content: 'This is a fully functional Git simulator. Try "git init" to start!', timestamp: Date.now() + 1 },
    { id: '3', type: 'output', content: 'Type "help" to see available commands.', timestamp: Date.now() + 2 },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gitSimulator] = useState(() => new GitSimulator());
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLine = (type: 'command' | 'output' | 'error', content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: Date.now(),
    };
    setLines(prev => [...prev, newLine]);
  };

  const executeCommand = (command: string) => {
    if (!command.trim()) return;

    addLine('command', `$ ${command}`);
    setIsTyping(true);

    // Simulate command execution delay
    setTimeout(() => {
      if (command === 'clear') {
        setLines([]);
        setIsTyping(false);
        return;
      }

      if (command === 'help') {
        const helpText = `Available commands:
  Git Commands:
    git init                 - Initialize a new Git repository
    git status              - Show the working tree status
    git add <file>          - Add file contents to the index
    git add .               - Add all files to the index
    git commit -m "msg"     - Record changes to the repository
    git log                 - Show commit logs
    git log --oneline       - Show commit logs in one line format
    git branch              - List branches
    git branch <name>       - Create a new branch
    git branch -d <name>    - Delete a branch
    git checkout <branch>   - Switch branches
    git checkout -b <name>  - Create and switch to new branch
    git switch <branch>     - Switch branches (newer syntax)
    git switch -c <name>    - Create and switch to new branch
    git merge <branch>      - Merge a branch
    git remote              - List remotes
    git remote -v           - List remotes with URLs
    git remote add <name> <url> - Add a remote
    git push <remote> <branch> - Push changes to remote
    git pull <remote> <branch> - Pull changes from remote
    git fetch <remote>      - Fetch changes from remote
    git clone <url>         - Clone a repository
    git stash               - Stash changes
    git stash list          - List stashes
    git stash pop           - Apply and remove latest stash
    git reset HEAD~1        - Reset to previous commit
    git reset --soft HEAD~1 - Reset keeping changes staged
    git reset --hard HEAD~1 - Reset discarding all changes
    git revert <commit>     - Revert a commit
    git rebase <branch>     - Rebase current branch
    git cherry-pick <commit> - Cherry-pick a commit
    git tag                 - List tags
    git tag <name>          - Create a tag
    git tag -d <name>       - Delete a tag
    git diff                - Show changes
    git diff --staged       - Show staged changes
    git show <commit>       - Show commit details
    git config --list       - List configuration
    git config <key> <value> - Set configuration
    git bisect start        - Start bisecting
    git bisect good/bad     - Mark commits during bisect

  System Commands:
    clear                   - Clear the terminal
    ls                      - List files
    pwd                     - Show current directory
    help                    - Show this help message`;
        
        addLine('output', helpText);
        setIsTyping(false);
        return;
      }

      const result = gitSimulator.executeCommand(command);
      
      if (result.output === 'CLEAR_TERMINAL') {
        setLines([]);
      } else if (result.output) {
        addLine(result.error ? 'error' : 'output', result.output);
      }
      
      setIsTyping(false);
    }, Math.random() * 500 + 300); // Random delay between 300-800ms
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCommand.trim() && !isTyping) {
      executeCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  const clearTerminal = () => {
    setLines([]);
  };

  const copyCommand = (command: string) => {
    const cleanCommand = command.replace(/^\$ /, '');
    navigator.clipboard.writeText(cleanCommand);
    toast.success('Command copied to clipboard!');
  };

  const exportSession = () => {
    const session = lines.map(line => {
      const timestamp = new Date(line.timestamp).toLocaleTimeString();
      return `[${timestamp}] ${line.type.toUpperCase()}: ${line.content}`;
    }).join('\n');
    
    const blob = new Blob([session], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `git-session-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Session exported!');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when clicking on terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Interactive Git Terminal
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience a fully functional Git environment with all standard commands, proper error handling, and realistic feedback. 
            Perfect for learning and practicing Git workflows safely.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-900 dark:bg-gray-950 rounded-lg shadow-2xl border border-gray-700 overflow-hidden"
        >
          {/* Terminal header */}
          <div className="bg-gray-800 dark:bg-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2">
                <TerminalIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 font-mono text-sm">git-learning-terminal</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportSession}
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm"
                title="Export session"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={clearTerminal}
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm"
                title="Clear terminal"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Terminal content */}
          <div
            ref={terminalRef}
            onClick={handleTerminalClick}
            className="h-96 overflow-y-auto p-6 font-mono text-sm cursor-text"
            style={{ scrollbarWidth: 'thin' }}
          >
            <AnimatePresence>
              {lines.map((line) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-2 group ${
                    line.type === 'command'
                      ? 'text-green-400 font-semibold'
                      : line.type === 'error'
                      ? 'text-red-400'
                      : 'text-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <pre className="whitespace-pre-wrap break-words flex-1">{line.content}</pre>
                    {line.type === 'command' && (
                      <button
                        onClick={() => copyCommand(line.content)}
                        className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-500 hover:text-gray-300 transition-all"
                        title="Copy command"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 text-gray-400"
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>Executing command...</span>
              </motion.div>
            )}
          </div>

          {/* Terminal input */}
          <div className="border-t border-gray-700 bg-gray-800 dark:bg-gray-900 p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              <User className="h-4 w-4 text-green-400" />
              <span className="text-green-400 font-mono">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                placeholder="Enter a git command..."
                className="flex-1 bg-transparent text-white font-mono focus:outline-none placeholder-gray-500"
                disabled={isTyping}
                autoFocus
              />
              <button
                type="submit"
                disabled={isTyping || !currentCommand.trim()}
                className="p-2 text-green-400 hover:text-green-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                title="Execute command"
              >
                <Play className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Quick commands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
            Quick Start Commands
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { cmd: 'git init', desc: 'Initialize repository' },
              { cmd: 'git status', desc: 'Check status' },
              { cmd: 'git add .', desc: 'Stage all files' },
              { cmd: 'git commit -m "Initial commit"', desc: 'Make first commit' },
              { cmd: 'git branch feature', desc: 'Create branch' },
              { cmd: 'git checkout -b hotfix', desc: 'Create & switch branch' },
              { cmd: 'git log --oneline', desc: 'View commit history' },
              { cmd: 'git stash', desc: 'Stash changes' }
            ].map((item, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrentCommand(item.cmd);
                  inputRef.current?.focus();
                }}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 text-left group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <code className="text-sm font-mono text-blue-600 dark:text-blue-400 block mb-1">
                  {item.cmd}
                </code>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Full Git Simulation</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Complete implementation of Git commands with proper state management and realistic behavior.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Error Handling</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Proper error messages and validation, just like real Git, to help you learn the right way.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Safe Learning</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Practice dangerous commands like reset and rebase without fear of losing real work.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Terminal;