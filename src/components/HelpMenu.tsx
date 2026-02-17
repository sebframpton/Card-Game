import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpMenu: React.FC<HelpMenuProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'basics' | 'cards' | 'tips'>('basics');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-900 border-2 border-cyan-500/50 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl shadow-cyan-500/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-3xl font-black text-cyan-400 mb-4">📖 HELP & GUIDE</h2>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveTab('basics')}
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'basics'
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                                }`}
                        >
                            Basics
                        </button>
                        <button
                            onClick={() => setActiveTab('cards')}
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'cards'
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            Card Types
                        </button>
                        <button
                            onClick={() => setActiveTab('tips')}
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'tips'
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            Tips
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto text-slate-300 space-y-3 text-sm">
                        {activeTab === 'basics' && (
                            <>
                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                                    <h3 className="text-cyan-400 font-bold mb-2">🎯 Objective</h3>
                                    <p>Reduce your opponent's health to 0 before they do the same to you!</p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                                    <h3 className="text-purple-400 font-bold mb-2">⚡ Resources</h3>
                                    <ul className="space-y-1">
                                        <li>• <span className="text-cyan-400 font-semibold">Plays</span>: Resources to play cards each turn (refreshes every turn)</li>
                                        <li>• <span className="text-green-400 font-semibold">Health</span>: Your life total - don't let it reach 0!</li>
                                        <li>• <span className="text-purple-400 font-semibold">XP</span>: Experience points - gain 200 to level up</li>
                                    </ul>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                                    <h3 className="text-green-400 font-bold mb-2">🔄 Timeline</h3>
                                    <p>Shows the history of played cards. Some cards trigger bonus effects based on timeline patterns!</p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                                    <h3 className="text-blue-400 font-bold mb-2">⌨️ Controls</h3>
                                    <ul className="space-y-1">
                                        <li>• Click cards to play them</li>
                                        <li>• Press ESC to pause</li>
                                        <li>• Hover over stats for tooltips</li>
                                    </ul>
                                </div>
                            </>
                        )}

                        {activeTab === 'cards' && (
                            <>
                                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                                    <h3 className="text-red-400 font-bold mb-2">⚡ Actions</h3>
                                    <p>Direct damage and effects. Play these to deal damage to your opponent or buff yourself!</p>
                                </div>

                                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
                                    <h3 className="text-blue-400 font-bold mb-2">🔄 Echoes</h3>
                                    <p>Cards that trigger based on timeline patterns. Look for "Memory Tags" to see what they check for!</p>
                                </div>

                                <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-3">
                                    <h3 className="text-purple-400 font-bold mb-2">↺ Recursors</h3>
                                    <p>Advanced cards with recursive effects. These scale based on how many times certain effects have occurred!</p>
                                </div>
                            </>
                        )}

                        {activeTab === 'tips' && (
                            <>
                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                                    <h3 className="text-cyan-400 font-bold mb-2">💡 Strategy Tips</h3>
                                    <ul className="space-y-2">
                                        <li>• <span className="font-semibold">Watch the Timeline:</span> Many cards get stronger based on what's been played!</li>
                                        <li>• <span className="font-semibold">Balance Your Deck:</span> Mix cheap and expensive cards for flexibility.</li>
                                        <li>• <span className="font-semibold">Read Card Text:</span> Some cards have powerful combo effects!</li>
                                        <li>• <span className="font-semibold">Plan Ahead:</span> Think about what the enemy might play next turn.</li>
                                    </ul>
                                </div>

                                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3">
                                    <h3 className="text-green-400 font-bold mb-2">🏆 Progression</h3>
                                    <p>Win battles to earn new cards for your collection. Higher stages have tougher enemies but better rewards!</p>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-4 w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider rounded-lg transition-all"
                    >
                        Close
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
