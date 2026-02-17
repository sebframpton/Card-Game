import React from 'react';
import { useGameStore } from '../engine/GameState';
import { CARD_DATABASE } from '../engine/CardDefinitions';
import { Card } from './Card';
import { clsx } from 'clsx';

export const DeckBuilder: React.FC = () => {
    const { deckBuilder, collection, addToDeck, removeFromDeck, startGame, resetGame } = useGameStore();

    // Only show cards that are in the user's collection
    const availableCards = Object.entries(CARD_DATABASE).filter(([key]) =>
        collection.includes(key)
    );

    // Group cards by type or faction for better browsing? 
    // For now, simple grid.

    const isDeckFull = deckBuilder.selectedCardKeys.length >= deckBuilder.maxDeckSize;

    return (
        <div className="w-full h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
            {/* Left: Collection */}
            <div className="flex-1 h-full flex flex-col border-r border-slate-800 p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-cyan-400 tracking-tight">Card Collection</h2>
                        <p className="text-slate-500 text-sm mt-1">Select cards to add to your deck</p>
                    </div>
                    <button onClick={resetGame} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors">
                        Back to Menu
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-8 pb-32">
                        {availableCards.map(([key, def]) => (
                            <div key={key} className="relative group">
                                <div
                                    onClick={() => addToDeck(key)}
                                    className="cursor-pointer transition-all duration-300"
                                >
                                    <Card
                                        card={{ ...def, id: 'preview' }}
                                        disabled={isDeckFull}
                                    />
                                    {/* Add Button Overlay on Hover */}
                                    <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none z-20">
                                        <div className="bg-black/90 text-cyan-400 px-6 py-2 rounded-full font-bold border border-cyan-500/50 transform scale-90 group-hover:scale-100 transition-transform shadow-2xl">
                                            ADD +
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Current Deck */}
            <div className="w-96 shrink-0 h-full flex flex-col p-6 bg-slate-900/95 border-l border-cyan-900/30">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-purple-400">Your Deck</h2>
                    <div className={clsx("font-mono text-sm px-2 py-1 rounded",
                        isDeckFull ? "bg-green-500/20 text-green-400" : "bg-slate-800 text-slate-400")}>
                        {deckBuilder.selectedCardKeys.length} / {deckBuilder.maxDeckSize}
                    </div>
                </div>
                <p className="text-xs text-slate-500 mb-6 italic">A complete deck of 50 cards is required to initiate.</p>

                <div className="flex-1 overflow-y-auto space-y-1 mb-6 pr-2 custom-scrollbar">
                    {deckBuilder.selectedCardKeys.length > 0 ? (
                        deckBuilder.selectedCardKeys.map((key, index) => {
                            const def = CARD_DATABASE[key];
                            if (!def) return null; // Safety check

                            return (
                                <div
                                    key={index}
                                    onClick={() => removeFromDeck(index)}
                                    className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700 hover:bg-red-900/20 hover:border-red-500/50 group transition-all duration-200"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="text-[10px] text-slate-500 w-4 font-mono">{index + 1}</span>
                                        <span className="font-bold text-sm truncate">{def.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] bg-black/50 px-1.5 py-0.5 rounded text-cyan-400 font-mono">{def.cost}</span>
                                        <div className="hidden group-hover:block text-[10px] text-red-500 font-bold uppercase tracking-tighter">DEL</div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-slate-800 rounded-xl p-8 text-center text-sm">
                            Deck is empty.<br />Select cards from your collection.
                        </div>
                    )}
                </div>

                <button
                    onClick={() => startGame(deckBuilder.selectedCardKeys)}
                    disabled={!isDeckFull}
                    className={`w-full py-4 rounded-xl text-lg font-black tracking-widest shadow-2xl transition-all active:scale-95 ${isDeckFull
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/50'
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                        }`}
                >
                    INITIATE SEQUENCE
                </button>
            </div>
        </div>
    );
};
