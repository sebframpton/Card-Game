import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeModalProps {
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
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
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900 border-2 border-cyan-500/50 rounded-xl p-8 max-w-2xl w-full shadow-2xl shadow-cyan-500/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center mb-6">
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                            WELCOME TO RECURSION
                        </h1>
                        <p className="text-slate-400">A strategic timeline-based card game</p>
                    </div>

                    <div className="space-y-4 text-slate-300">
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                                <span className="text-2xl">🎯</span> Objective
                            </h3>
                            <p className="text-sm">Reduce your opponent's health to 0 by playing cards strategically.</p>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                                <span className="text-2xl">⚡</span> How to Play
                            </h3>
                            <ul className="text-sm space-y-2">
                                <li>• <span className="text-cyan-400 font-semibold">Plays</span> - Resources to play cards each turn</li>
                                <li>• <span className="text-purple-400 font-semibold">Timeline</span> - Shows the history of played cards</li>
                                <li>• <span className="text-green-400 font-semibold">Progression</span> - Level up to unlock powerful effects</li>
                            </ul>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                                <span className="text-2xl">💡</span> Pro Tips
                            </h3>
                            <ul className="text-sm space-y-1">
                                <li>• Hover over stats to see detailed tooltips</li>
                                <li>• <span className="text-cyan-400">Shift + Wheel</span> on Timeline to scroll through history</li>
                                <li>• Watch the Timeline - some cards get stronger based on history</li>
                                <li>• Press ESC to access the pause menu anytime</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-cyan-900/50"
                        >
                            Let's Play!
                        </button>
                    </div>

                    <p className="text-xs text-slate-500 text-center mt-4">
                        You can access help anytime from the pause menu
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export const useWelcomeModal = () => {
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('recursion-seen-welcome');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }
    }, []);

    const closeWelcome = () => {
        localStorage.setItem('recursion-seen-welcome', 'true');
        setShowWelcome(false);
    };

    return { showWelcome, closeWelcome };
};
