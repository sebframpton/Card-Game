import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../engine/GameState';
import { SaveSlotManager } from '../engine/SaveSlotManager';
import { HelpMenu } from './HelpMenu';

interface PauseMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({ isOpen, onClose }) => {
    const { setScreen } = useGameStore();
    const [showHelp, setShowHelp] = useState(false);

    const handleSave = () => {
        const activeSlotId = SaveSlotManager.getActiveSlotId();
        if (activeSlotId) {
            const slot = SaveSlotManager.getSlot(activeSlotId);
            if (slot) {
                const state = useGameStore.getState();
                const p1 = state.players.find(p => p.id === 'p1');

                try {
                    SaveSlotManager.saveToSlot(activeSlotId, slot.name, {
                        collection: state.collection,
                        runStage: state.runStage,
                        deckBuilder: state.deckBuilder,
                        playerStats: {
                            level: p1?.level ?? 1,
                            xp: p1?.xp ?? 0,
                            health: p1?.health ?? 20,
                            maxHealth: p1?.maxHealth ?? 20
                        }
                    });
                    alert('Game Saved to ' + slot.name);
                } catch (error) {
                    alert('Save failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
                }
            }
        } else {
            alert('No active save slot. Please use the Main Menu to create a save.');
        }
    };

    const handleReturnToMenu = () => {
        if (confirm('Return to main menu? Your progress will be saved.')) {
            setScreen('menu');
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                            onClick={onClose}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                        >
                            <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-lg p-8 w-96 pointer-events-auto shadow-2xl shadow-cyan-500/20">
                                <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center tracking-wider">
                                    PAUSED
                                </h2>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest rounded transition-all shadow-lg shadow-cyan-900/50 active:scale-95"
                                    >
                                        Resume
                                    </button>

                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest rounded transition-all shadow-lg shadow-purple-900/50 active:scale-95"
                                    >
                                        Save Game
                                    </button>

                                    <button
                                        onClick={() => setShowHelp(true)}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest rounded transition-all shadow-lg shadow-blue-900/50 active:scale-95"
                                    >
                                        📖 Help
                                    </button>

                                    <button
                                        onClick={handleReturnToMenu}
                                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest rounded transition-all shadow-lg shadow-red-900/50 active:scale-95"
                                    >
                                        Main Menu
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Help Menu */}
            <HelpMenu isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </>
    );
};
