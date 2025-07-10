import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Copy, Star, Lightbulb, Play, Terminal } from 'lucide-react';
import { gitCommands, GitCommand } from '../data/gitCommands';
import toast from 'react-hot-toast';

const GitCommands: React.FC = () => {
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    toast.success('Command copied to clipboard!');
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const toggleCommand = (commandId: string) => {
    setExpandedCommand(expandedCommand === commandId ? null : commandId);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Git Commands Timeline
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master Git step-by-step with our interactive command timeline. Click on any command to dive deeper!
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 opacity-30"></div>

          {gitCommands.map((command, index) => (
            <motion.div
              key={command.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative mb-8"
            >
              {/* Timeline dot */}
              <div className="absolute left-2 md:left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>

              {/* Command card */}
              <div className="ml-12 md:ml-20">
                <motion.div
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 ${
                    expandedCommand === command.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => toggleCommand(command.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Terminal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <code className="text-lg font-mono font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                            {command.command}
                          </code>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(command.difficulty)}`}>
                          {command.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(command.command);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Copy className={`h-4 w-4 ${copiedCommand === command.command ? 'text-green-600' : ''}`} />
                        </motion.button>
                        <motion.div
                          animate={{ rotate: expandedCommand === command.id ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-2">
                      {command.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {command.description}
                    </p>
                  </div>

                  <AnimatePresence>
                    {expandedCommand === command.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                      >
                        <div className="p-6 space-y-6">
                          {/* Importance */}
                          <div className="flex items-start space-x-3">
                            <Star className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Why it's important</h4>
                              <p className="text-gray-600 dark:text-gray-300">{command.importance}</p>
                            </div>
                          </div>

                          {/* Use case */}
                          <div className="flex items-start space-x-3">
                            <Play className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Real-world use case</h4>
                              <p className="text-gray-600 dark:text-gray-300">{command.useCase}</p>
                            </div>
                          </div>

                          {/* Code example */}
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Code Example</h4>
                            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                                <code>{command.example}</code>
                              </pre>
                            </div>
                          </div>

                          {/* Output */}
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">What happens</h4>
                            <div className="bg-gray-800 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-blue-300 font-mono text-sm whitespace-pre-wrap">
                                <code>{command.output}</code>
                              </pre>
                            </div>
                          </div>

                          {/* Pro tip */}
                          <div className="flex items-start space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                            <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">💡 Pro Tip</h4>
                              <p className="text-gray-600 dark:text-gray-300">{command.proTip}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GitCommands;