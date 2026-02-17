import React, { useState, useEffect } from 'react';
import { useGameStore } from '../engine/GameState';
import { SaveSlotManager, type SaveSlot } from '../engine/SaveSlotManager';
import { motion } from 'framer-motion';

export const MainMenu: React.FC = () => {
    const { openDeckBuilder, collection, runStage, deckBuilder, resetProgress } = useGameStore();
    const [showArchives, setShowArchives] = useState(false);
    const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
    const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

    // Load save slots on mount
    useEffect(() => {
        setSaveSlots(SaveSlotManager.getAllSlots());
        setActiveSlotId(SaveSlotManager.getActiveSlotId());
    }, [showArchives]);

    const handleStart = () => {
        openDeckBuilder();
    };

    const handleNewGame = () => {
        if (saveSlots.length >= 3) {
            alert('Maximum of 3 save slots reached. Please delete a save to create a new game.');
            setShowArchives(true);
            return;
        }

        const name = prompt('Enter a name for your new game:') || `New Game ${Date.now()}`;

        // Reset to initial state
        resetProgress();

        // Create new save slot with the fresh state
        const state = useGameStore.getState();
        const p1 = state.players.find(p => p.id === 'p1');

        const id = SaveSlotManager.createSlot(name);
        SaveSlotManager.saveToSlot(id, name, {
            collection: state.collection,
            runStage: 1,
            deckBuilder: {
                selectedCardKeys: [],
                maxDeckSize: 50
            },
            playerStats: {
                level: p1?.level ?? 1,
                xp: p1?.xp ?? 0,
                health: p1?.health ?? 20,
                maxHealth: p1?.maxHealth ?? 20
            }
        });
        SaveSlotManager.setActiveSlotId(id);
        setSaveSlots(SaveSlotManager.getAllSlots());
        setActiveSlotId(id);

        // Open deck builder to start playing
        openDeckBuilder();
    };

    const handleSaveToSlot = (slotId?: string) => {
        const name = prompt('Enter save name:') || `Save ${Date.now()}`;
        const id = slotId || SaveSlotManager.createSlot(name);

        const state = useGameStore.getState();
        const p1 = state.players.find(p => p.id === 'p1');

        try {
            SaveSlotManager.saveToSlot(id, name, {
                collection,
                runStage,
                deckBuilder,
                playerStats: {
                    level: p1?.level ?? 1,
                    xp: p1?.xp ?? 0,
                    health: p1?.health ?? 20,
                    maxHealth: p1?.maxHealth ?? 20
                }
            });
            SaveSlotManager.setActiveSlotId(id);
            setSaveSlots(SaveSlotManager.getAllSlots());
            setActiveSlotId(id);
            alert('Game saved successfully!');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to save');
        }
    };

    const handleLoadSlot = (slot: SaveSlot) => {
        const state = useGameStore.getState();
        let newPlayers = [...state.players];

        // Ensure we have at least the local player if players is empty
        if (newPlayers.length === 0) {
            newPlayers = [
                { id: 'p1', xp: 0, level: 1, health: 20, maxHealth: 20 } as any,
                { id: 'p2', xp: 0, level: 1, health: 20, maxHealth: 20, isAI: true } as any
            ];
        }

        const p1Idx = newPlayers.findIndex(p => p.id === 'p1');

        if (p1Idx !== -1) {
            newPlayers[p1Idx] = {
                ...newPlayers[p1Idx],
                level: slot.data.playerStats?.level ?? 1,
                xp: slot.data.playerStats?.xp ?? 0,
                health: slot.data.playerStats?.health ?? 20,
                maxHealth: slot.data.playerStats?.maxHealth ?? 20
            };
        }

        useGameStore.setState({
            collection: slot.data.collection,
            runStage: slot.data.runStage,
            deckBuilder: slot.data.deckBuilder,
            players: newPlayers
        });
        SaveSlotManager.setActiveSlotId(slot.id);
        setShowArchives(false);
        openDeckBuilder();
    };

    const handleDeleteSlot = (slotId: string) => {
        if (confirm('Delete this save? This action cannot be undone.')) {
            SaveSlotManager.deleteSlot(slotId);
            if (activeSlotId === slotId) {
                SaveSlotManager.setActiveSlotId(null);
                setActiveSlotId(null);
            }
            setSaveSlots(SaveSlotManager.getAllSlots());
        }
    };

    // Check if there's a saved game
    const hasSavedGame = collection.length > 0 || runStage > 1 || deckBuilder.selectedCardKeys.length > 0;

    return (
        <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-50 pointer-events-none" />

            {!showArchives ? (
                <>
                    <motion.h1
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                    >
                        RECURSION
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col gap-4 w-64 z-10"
                    >
                        <button
                            onClick={handleStart}
                            className="group relative px-6 py-3 bg-slate-900 border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-slate-900 transition-all duration-300 clip-path-slant"
                        >
                            <span className="relative z-10">{hasSavedGame ? 'Continue' : 'Start Game'}</span>
                            <div className="absolute inset-0 bg-cyan-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </button>

                        <button
                            onClick={handleNewGame}
                            className="group relative px-6 py-3 bg-slate-900 border border-green-500/50 text-green-400 font-bold uppercase tracking-widest hover:bg-green-500 hover:text-slate-900 transition-all duration-300"
                        >
                            <span className="relative z-10">New Game</span>
                            <div className="absolute inset-0 bg-green-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </button>

                        <button
                            onClick={() => setShowArchives(true)}
                            className="px-6 py-3 border font-bold uppercase tracking-widest transition-all bg-slate-900 border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-slate-900"
                        >
                            Archives ({saveSlots.length}/3 Saves)
                        </button>

                        <button
                            disabled
                            className="px-6 py-3 bg-slate-900/50 border border-slate-700 text-slate-500 font-bold uppercase tracking-widest cursor-not-allowed"
                        >
                            Paradox Run (Soon)
                        </button>
                    </motion.div>

                    <div className="absolute bottom-4 text-xs text-slate-600 font-mono flex flex-col items-center gap-1">
                        <div>System Version 0.1.0 // Timeline Stable</div>
                        <div className="text-slate-700">
                            Collection: {collection.length} cards • Stage: {runStage} • Deck: {deckBuilder.selectedCardKeys.length}/{deckBuilder.maxDeckSize}
                        </div>
                    </div>
                </>
            ) : (
                /* Archives Screen */
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-3xl z-10 p-8"
                >
                    <h2 className="text-4xl font-bold text-purple-400 mb-6 tracking-wider">ARCHIVES</h2>
                    <p className="text-slate-400 mb-6">Manage your save slots (Max: 3)</p>

                    <div className="space-y-4 mb-6">
                        {saveSlots.length === 0 ? (
                            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 text-center text-slate-500">
                                No saved games found. Create a new save or start playing!
                            </div>
                        ) : (
                            saveSlots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className={`bg-slate-900 border-2 rounded-lg p-6 transition-all ${slot.id === activeSlotId
                                        ? 'border-cyan-500/70 shadow-lg shadow-cyan-500/20'
                                        : 'border-purple-500/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-cyan-400 mb-1">{slot.name}</h3>
                                            {slot.id === activeSlotId && (
                                                <span className="text-xs text-green-400 font-mono">● ACTIVE</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {new Date(slot.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="text-sm text-slate-400 space-y-1 mb-4 grid grid-cols-2">
                                        <div>Stage: {slot.data.runStage}</div>
                                        <div>Level: {slot.data.playerStats?.level || 1}</div>
                                        <div>Collection: {slot.data.collection.length} cards</div>
                                        <div>Health: {slot.data.playerStats?.health || 20}/{slot.data.playerStats?.maxHealth || 20}</div>
                                        <div className="col-span-2">Deck: {slot.data.deckBuilder.selectedCardKeys.length}/{slot.data.deckBuilder.maxDeckSize}</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleLoadSlot(slot)}
                                            className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm uppercase rounded transition-all"
                                        >
                                            Load
                                        </button>
                                        <button
                                            onClick={() => handleSaveToSlot(slot.id)}
                                            className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm uppercase rounded transition-all"
                                        >
                                            Overwrite
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSlot(slot.id)}
                                            className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase rounded transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {saveSlots.length < 3 && (
                        <button
                            onClick={() => handleSaveToSlot()}
                            className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-widest rounded transition-all mb-4"
                        >
                            + Create New Save Slot
                        </button>
                    )}

                    <button
                        onClick={() => setShowArchives(false)}
                        className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold uppercase tracking-widest rounded transition-all"
                    >
                        Back to Main Menu
                    </button>
                </motion.div>
            )}
        </div>
    );
};
