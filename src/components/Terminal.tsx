    import React, { useState, useEffect, useRef } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Terminal as TerminalIcon, Play, RotateCcw, User, Copy, Download } from 'lucide-react';
    // import { GitSimulator } from '../utils/gitSimulator';
    import toast from 'react-hot-toast';
    // Add Gemini feedback integration
    // @ts-ignore
    import { GoogleGenerativeAI } from "@google/generative-ai";

    interface TerminalLine {
      id: string;
      type: 'command' | 'output' | 'error';
      content: string;
      timestamp: number;
    }

    // const CHECK_COMMANDS = [
    //   'git log',
    //   'git log --oneline',
    //   'git log --graph',
    //   'git log --graph --oneline --decorate',
    //   'git status',
    //   'git show',
    //   // add any others you want to treat as optional
    // ];
    function isCheckCommand(cmd: string) {
      const norm = cmd.trim().toLowerCase();
      // Only match exact command or valid options (e.g., 'git log', 'git log --oneline', etc.)
      const validPatterns = [
        /^git status(\s+|$)/,
        /^git log(\s+|$)/,
        /^git show(\s+|$)/,
        /^git diff(\s+|$)/,
        /^git branch(\s+|$)/,
        /^git tag(\s+|$)/
      ];
      return validPatterns.some(re => re.test(norm));
    }

    const Terminal: React.FC = () => {
      const [lines, setLines] = useState<TerminalLine[]>([
        { id: '1', type: 'output', content: 'Welcome to the Git Learning Terminal!', timestamp: Date.now() },
        { id: '2', type: 'output', content: 'This is a fully functional Git simulator.', timestamp: Date.now() + 1 },
        { id: '3', type: 'output', content: 'Type "help" to see available commands.', timestamp: Date.now() + 2 },
      ]);
      const [currentCommand, setCurrentCommand] = useState('');
      const [isTyping, setIsTyping] = useState(false);
      // const [gitSimulator] = useState(() => new GitSimulator());
      const terminalRef = useRef<HTMLDivElement>(null);
      const inputRef = useRef<HTMLInputElement>(null);

      // Solution path tracking
      const [solutionPath, setSolutionPath] = useState<string[]>([]);
      const [currentStep, setCurrentStep] = useState(0);
      const [scenarioComplete, setScenarioComplete] = useState(false);
      const [scenarioLoaded, setScenarioLoaded] = useState(false);
      const [currentBranch, setCurrentBranch] = useState('main'); // Track current branch
      const [branchCommits, setBranchCommits] = useState<{ [branch: string]: Array<{ hash: string, msg: string }> }>({}); // Track commits per branch

      const addLine = (type: 'command' | 'output' | 'error', content: string) => {
        const newLine: TerminalLine = {
          id: Date.now().toString() + Math.random(),
          type,
          content,
          timestamp: Date.now(),
        };
        setLines(prev => [...prev, newLine]);
      };

      // Helper: normalize commands for comparison
      const normalizeCmd = (cmd: string) => cmd.replace(/\s+/g, ' ').trim().toLowerCase();
      // Helper: clean up Gemini's output (remove backticks, quotes, trim)
      const cleanCommand = (cmd: string) => (cmd || '').replace(/[`'\"]/g, '').trim();
      // Helper: extract command type/structure for relaxed checking
      function getCommandType(cmd: string) {
        const norm = cmd.trim().toLowerCase();
        if (norm.startsWith('git add')) return 'git add';
        if (norm.startsWith('git commit -m')) return 'git commit -m';
        if (norm.startsWith('git checkout -b')) return 'git checkout -b';
        if (norm.startsWith('git checkout')) return 'git checkout';
        if (norm.startsWith('git merge')) return 'git merge';
        if (norm.startsWith('git branch')) return 'git branch';
        if (norm.startsWith('git switch -c')) return 'git switch -c';
        if (norm.startsWith('git switch')) return 'git switch';
        if (norm.startsWith('git log')) return 'git log';
        if (norm.startsWith('git status')) return 'git status';
        if (norm.startsWith('git init')) return 'git init';
        if (norm.startsWith('git push')) return 'git push';
        if (norm.startsWith('git pull')) return 'git pull';
        if (norm.startsWith('git fetch')) return 'git fetch';
        if (norm.startsWith('git clone')) return 'git clone';
        if (norm.startsWith('git stash')) return 'git stash';
        if (norm.startsWith('git reset')) return 'git reset';
        if (norm.startsWith('git revert')) return 'git revert';
        if (norm.startsWith('git rebase')) return 'git rebase';
        if (norm.startsWith('git cherry-pick')) return 'git cherry-pick';
        if (norm.startsWith('git tag')) return 'git tag';
        if (norm.startsWith('git diff')) return 'git diff';
        if (norm.startsWith('git show')) return 'git show';
        if (norm.startsWith('git config')) return 'git config';
        if (norm.startsWith('git bisect')) return 'git bisect';
        // fallback: first 2-3 words
        return norm.split(' ').slice(0, 3).join(' ');
      }

      // Tutor feedback for each command type
      function getTutorFeedback(commandType: string, command: string): string {
        switch (commandType) {
          case 'git init':
            return 'Initialized a new Git repository.';
          case 'git add':
            return 'You staged file(s) for commit.';
          case 'git commit -m':
            return 'You committed your changes.';
          case 'git checkout -b':
            return 'You created and switched to a new branch.';
          case 'git checkout':
            return 'You switched branches.';
          case 'git branch':
            return 'You created or listed branches.';
          case 'git merge':
            return 'You merged a branch.';
          case 'git switch -c':
            return 'You created and switched to a new branch.';
          case 'git switch':
            return 'You switched branches.';
          case 'git log':
            return 'You viewed the commit history.';
          case 'git status':
            return 'You checked the status of your repository.';
          case 'git push':
            return 'You pushed your changes to a remote repository.';
          case 'git pull':
            return 'You pulled changes from a remote repository.';
          case 'git fetch':
            return 'You fetched changes from a remote repository.';
          case 'git clone':
            return 'You cloned a repository.';
          case 'git stash':
            return 'You stashed your changes.';
          case 'git reset':
            return 'You reset your repository state.';
          case 'git revert':
            return 'You reverted a commit.';
          case 'git rebase':
            return 'You rebased your branch.';
          case 'git cherry-pick':
            return 'You cherry-picked a commit.';
          case 'git tag':
            return 'You created or managed tags.';
          case 'git diff':
            return 'You viewed the differences between files.';
          case 'git show':
            return 'You showed details of a commit.';
          case 'git config':
            return 'You configured Git settings.';
          case 'git bisect':
            return 'You used bisect to find a bug.';
          default:
            return '';
        }
      }

      // Gemini: Extract command from hint
      const getExpectedCommandFromHint = async (hint: string) => {
        const key = (typeof window !== 'undefined' ? (localStorage.getItem('gemini_api_key') || '') : '').trim();
        if (!key) return null;
        try {
          const genAI = new GoogleGenerativeAI(key);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `Given this Git learning step: \"${hint}\", what is the exact Git command the user should run? Reply with only the command.`;
          const result = await model.generateContent(prompt);
          const text = await result.response.text();
          return text.split('\n')[0].trim(); // Only the first line, trimmed
        } catch (err) {
          return null;
        }
      };

      // Gemini: Extract full solution path from all hints
      const getSolutionPathFromHints = async (hints: string[]) => {
        const key = (typeof window !== 'undefined' ? (localStorage.getItem('gemini_api_key') || '') : '').trim();
        if (!key) return [];
        try {
          const genAI = new GoogleGenerativeAI(key);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `Given these Git learning steps (one per line), reply with the exact Git command for each step, one per line, in order. Reply with only the commands and branch name or commit is can be same as diffrent or diffrent ..only commnds matter not same name, no extra text. Ignore any steps that are not actual Git commands (like creating files or adding functions).\n${hints.map((h, i) => `${i + 1}. ${h}`).join('\n')}`;
          const result = await model.generateContent(prompt);
          const text = await result.response.text();
          // Only keep lines that start with 'git '
          return text.split('\n').map(line => line.replace(/[`'\"]/g, '').trim()).filter(line => line.startsWith('git '));
        } catch (err) {
          return [];
        }
      };

      // Load solution path from scenario
      useEffect(() => {
        const loadScenario = async () => {
          const scenarioRaw = (typeof window !== 'undefined' && localStorage.getItem('gemini_scenario'));
          let scenario = null;
          try { scenario = scenarioRaw ? JSON.parse(scenarioRaw) : null; } catch { scenario = null; }
          let commands: string[] = [];
          if (scenario && Array.isArray(scenario.solution)) {
            commands = scenario.solution.map((cmd: string) => cmd.trim());
          } else if (scenario && Array.isArray(scenario.hints)) {
            // Use Gemini to extract the full solution path from all hints
            commands = await getSolutionPathFromHints(scenario.hints);
          }
          // Ensure 'git init' is the first command
          if (commands.length === 0 || normalizeCmd(commands[0]) !== 'git init') {
            commands = ['git init', ...commands];
          }
          // Clear all old lines and reset state for new scenario
          setLines([
            { id: '1', type: 'output', content: 'Welcome to the Git Learning Terminal!', timestamp: Date.now() },
            { id: '2', type: 'output', content: 'This is a fully functional Git simulator!', timestamp: Date.now() + 1 },
            { id: '3', type: 'output', content: 'Type "help" to see available commands.', timestamp: Date.now() + 2 },
            { id: '4', type: 'output', content: 'The default repository is already set up, so no need to run git init unless an issue arises.', timestamp: Date.now() + 3 },
          ]);
          // If auto-running git init, skip the first step for the user
          let initialStep = 0;
          if (commands.length > 0 && normalizeCmd(commands[0]) === 'git init') {
            initialStep = 1;
          }
          setSolutionPath(commands);
          setCurrentStep(initialStep);
          setScenarioComplete(false);
          setScenarioLoaded(true); // Enable input immediately
          setBranchCommits({}); // Reset all commits for new scenario
          setCurrentBranch('main'); // Reset branch to main for new scenario
          // Automatically run 'git init' for the user ONLY when a new scenario is generated
          setTimeout(() => {
            addLine('command', '$ git init');
            addLine('output', '[Tutor]: Initialized a new Git repository.');
            // setScenarioLoaded(true); // Remove this line
          }, 100);
        };
        loadScenario();
      }, [localStorage.getItem('gemini_scenario')]);

      // Remove Gemini feedback integration for step-by-step checking

      const executeCommand = async (command: string) => {
        if (!command.trim() || !scenarioLoaded) return;
        // If scenario is complete and the command is not a check command, block it
        if (scenarioComplete && !isCheckCommand(command)) return;

        addLine('command', `$ ${command}`);
        setIsTyping(true);

        // If user enters a check command at any time, show fake output and do not show error or advance scenario
        if (isCheckCommand(command)) {
          const norm = command.trim().toLowerCase();
          if (norm.startsWith('git status')) {
            addLine('output', `On branch ${currentBranch}\nnothing to commit, working tree clean`);
          } else if (norm.startsWith('git log')) {
            const commits = branchCommits[currentBranch] || [];
            if (commits.length === 0) {
              addLine('output', 'No commits yet on this branch.');
            } else {
              const logLines = commits.slice().reverse().map((c, i) => {
                if (i === 0) {
                  return `commit ${c.hash} (HEAD -> ${currentBranch})\nAuthor: You <you@example.com>\nDate:   Today\n\n    ${c.msg}`;
                } else {
                  return `commit ${c.hash}\nAuthor: You <you@example.com>\nDate:   Today\n\n    ${c.msg}`;
                }
              }).join('\n\n');
              addLine('output', logLines);
            }
          } else if (norm.startsWith('git show')) {
            addLine('output', `commit 1d1afb4\nAuthor: You <you@example.com>\nDate:   Today\n\n    Initial commit\n\ndiff --git a/file.txt b/file.txt\nnew file mode 100644\nindex 0000000..e69de29`);
          } else {
            addLine('output', '[Fake output for check command]');
          }
          setIsTyping(false);
          return;
        }

        // Remove artificial delay for snappier response
        (async () => {
          if (command === 'clear') {
            setLines([]);
            setIsTyping(false);
            setScenarioComplete(false);
            setCurrentStep(0);
            setScenarioLoaded(false);
            return;
          }

          if (command === 'help') {
            const helpText = `Available commands:\n  Git Commands:\n    git init                 - Initialize a new Git repository\n    git status              - Show the working tree status\n    git add <file>          - Add file contents to the index\n    git add .               - Add all files to the index\n    git commit -m \"msg\"     - Record changes to the repository\n    git log                 - Show commit logs\n    git log --oneline       - Show commit logs in one line format\n    git branch              - List branches\n    git branch <name>       - Create a new branch\n    git branch -d <name>    - Delete a branch\n    git checkout <branch>   - Switch branches\n    git checkout -b <name>  - Create and switch to new branch\n    git switch <branch>     - Switch branches (newer syntax)\n    git switch -c <name>    - Create and switch to new branch\n    git merge <branch>      - Merge a branch\n    git remote              - List remotes\n    git remote -v           - List remotes with URLs\n    git remote add <name> <url> - Add a remote\n    git push <remote> <branch> - Push changes to remote\n    git pull <remote> <branch> - Pull changes from remote\n    git fetch <remote>      - Fetch changes from remote\n    git clone <url>         - Clone a repository\n    git stash               - Stash changes\n    git stash list          - List stashes\n    git stash pop           - Apply and remove latest stash\n    git reset HEAD~1        - Reset to previous commit\n    git reset --soft HEAD~1 - Reset keeping changes staged\n    git reset --hard HEAD~1 - Reset discarding all changes\n    git revert <commit>     - Revert a commit\n    git rebase <branch>     - Rebase current branch\n    git cherry-pick <commit> - Cherry-pick a commit\n    git tag                 - List tags\n    git tag <name>          - Create a tag\n    git tag -d <name>       - Delete a tag\n    git diff                - Show changes\n    git diff --staged       - Show staged changes\n    git show <commit>       - Show commit details\n    git config --list       - List configuration\n    git config <key> <value> - Set configuration\n    git bisect start        - Start bisecting\n    git bisect good/bad     - Mark commits during bisect`;
            addLine('output', helpText);
            setIsTyping(false);
            return;
          }

          // Tutor logic: check against solution path or Gemini-extracted command
          if (solutionPath.length > 0 && currentStep < solutionPath.length) {
            const expected = normalizeCmd(solutionPath[currentStep]);
            const userCmd = normalizeCmd(command);
            // Relaxed: compare only command type/structure
            const expectedType = getCommandType(expected);
            const userType = getCommandType(userCmd);
            if (expectedType && userType && expectedType === userType) {
              // Realistic Git-like output for key commands
              if (userType === 'git checkout -b') {
                const branchName = command.split(' ').slice(-1)[0].replace(/['"]/g, '');
                addLine('output', `Switched to a new branch '${branchName}'`);
                setCurrentBranch(branchName);
              }
              if (userType === 'git checkout') {
                const branchName = command.split(' ').slice(-1)[0].replace(/['"]/g, '');
                addLine('output', `Switched to branch '${branchName}' (${currentBranch} -> ${branchName})`);
                setCurrentBranch(branchName);
              }
              if (userType === 'git add') {
                // Extract file(s) added, strip quotes
                let files = command.split(' ').slice(2).join(' ');
                if (files && files !== '.') {
                  // Remove surrounding quotes from each file
                  files = files.split(/\s+/).map(f => f.replace(/^['"]|['"]$/g, '')).join(' ');
                  addLine('output', `added '${files}'`);
                } else if (files === '.') {
                  addLine('output', `added all files`);
                }
              }
              if (userType === 'git commit -m') {
                // Require commit message to be wrapped in quotes
                const msgMatch = command.match(/-m\s+(['"])(.+)\1$/);
                if (!msgMatch) {
                  addLine('error', '[Tutor]: Commit message must be wrapped in quotes (single or double).');
                  setIsTyping(false);
                  return;
                }
                // Simulate a commit hash and branch name
                const commitHash = Math.random().toString(16).slice(2, 9);
                const commitMsg = msgMatch[2];
                // Add commit to branchCommits
                setBranchCommits(prev => {
                  const prevCommits = prev[currentBranch] || [];
                  return { ...prev, [currentBranch]: [...prevCommits, { hash: commitHash, msg: commitMsg }] };
                });
                addLine('output', `[${currentBranch} ${commitHash}] ${commitMsg}\n 1 file changed, 1 insertion(+)`);
              }
              if (userType === 'git merge') {
                // Extract branch to merge
                const mergeBranch = command.split(' ').slice(-1)[0].replace(/['"]/g, '');
                setBranchCommits(prev => {
                  const current = prev[currentBranch] || [];
                  const toMerge = prev[mergeBranch] || [];
                  // Only add commits from toMerge that are not already in current (by hash)
                  const currentHashes = new Set(current.map(c => c.hash));
                  const merged = [...current, ...toMerge.filter(c => !currentHashes.has(c.hash))];
                  return { ...prev, [currentBranch]: merged };
                });
                addLine('output', `Merge made successfully.`);
              }
              // Find the last non-check command in the solutionPath
              let lastRealStep = solutionPath.length - 1;
              while (lastRealStep >= 0 && isCheckCommand(solutionPath[lastRealStep])) {
                lastRealStep--;
              }
              if (currentStep === lastRealStep) {
                setScenarioComplete(true);
                addLine('output', '[Tutor]: You have completed the scenario!');
                // Show congratulatory popup (set a flag or trigger a modal here if you want)
              } else {
                setCurrentStep(currentStep + 1);
                addLine('output', '[Tutor]: Correct! You are on the right track.');
              }
            } else {
              // Only show error for non-check commands
              if (!isCheckCommand(command)) {
                addLine('error', `[Tutor]: Incorrect command. Please use the correct command structure for this step.`);
              }
            }
            setIsTyping(false);
            return;
          }

          // If no solutionPath but hints are present, use Gemini to extract the command for the current step
          const scenarioRaw = (typeof window !== 'undefined' && localStorage.getItem('gemini_scenario'));
          let scenario = null;
          try { scenario = scenarioRaw ? JSON.parse(scenarioRaw) : null; } catch { scenario = null; }
          if (scenario && Array.isArray(scenario.hints) && scenario.hints[currentStep]) {
            const hint = scenario.hints[currentStep];
            const expectedCmd = await getExpectedCommandFromHint(hint);
            const userCmd = normalizeCmd(command);
            const expectedClean = normalizeCmd(cleanCommand(expectedCmd || ''));
            if (expectedClean && userCmd === expectedClean) {
              // Correct step
              if (currentStep + 1 === scenario.hints.length) {
                setScenarioComplete(true);
                addLine('output', '[Tutor]: Correct! You have completed the scenario!');
              } else {
                setCurrentStep(currentStep + 1);
                const feedback = getTutorFeedback(getCommandType(userCmd), command);
                if (feedback) {
                  addLine('output', `[Tutor]: ${feedback}`);
                }
                addLine('output', '[Tutor]: Correct! You are on the right track.');
              }
            } else {
              addLine('error', `[Tutor]: Incorrect command. The correct command for this step is: ${cleanCommand(expectedCmd || '') || hint}`);
            }
            setIsTyping(false);
            return;
          }

          // If scenario is complete, do not process further
          if (scenarioComplete) {
            setIsTyping(false);
            return;
          }

          setIsTyping(false);
        })();
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentCommand.trim() && !isTyping && scenarioLoaded) {
          // If scenario is complete and the command is not a check command, block it
          if (scenarioComplete && !isCheckCommand(currentCommand)) {
            addLine('error', '[Tutor]: Scenario complete! Only check commands are available now.');
            setCurrentCommand('');
            return;
          }
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
        // Only auto-scroll if user is near the bottom or if it's a new command execution
        if (terminalRef.current && isTyping) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, [lines, isTyping]);

      // Listen for scenario reset event
      useEffect(() => {
        const resetHandler = () => {
          setLines([
            { id: '1', type: 'output', content: 'Welcome to the Git Learning Terminal!', timestamp: Date.now() },
            { id: '2', type: 'output', content: 'This is a fully functional Git simulator. Try "git init" to start!', timestamp: Date.now() + 1 },
            { id: '3', type: 'output', content: 'Type "help" to see available commands.', timestamp: Date.now() + 2 },
            { id: '4', type: 'output', content: 'If in problem scenerio there is step for repsitory creation (git init) then ignore it becasue it is dfaulty ran in terminal .', timestamp: Date.now() + 3 },
          ]);
          setCurrentCommand('');
          setIsTyping(false);
          setScenarioComplete(false);
          setCurrentStep(0); // Reset current step on scenario reset
          setScenarioLoaded(false);
          // Optionally, reset the GitSimulator instance if needed
        };
        window.addEventListener('reset-terminal', resetHandler);
        return () => window.removeEventListener('reset-terminal', resetHandler);
      }, []);

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
              {/* Show congrats card if scenario is complete */}
              {scenarioComplete && (
                <div className="flex flex-col items-center justify-center py-12 bg-green-900/80">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-3xl font-bold text-green-200 mb-2">Congratulations!</h3>
                  <p className="text-lg text-green-100 mb-4">You have completed the scenario successfully.</p>
                  {/* You can add a popup/modal here for extra effect */}
                </div>
              )}
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
                  <span className="text-green-400 font-mono">({currentBranch}) $</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentCommand}
                    onChange={(e) => setCurrentCommand(e.target.value)}
                    placeholder="Enter a git command..."
                    className="flex-1 bg-transparent text-white font-mono focus:outline-none placeholder-gray-500"
                    disabled={isTyping || !scenarioLoaded}
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !currentCommand.trim() || !scenarioLoaded}
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