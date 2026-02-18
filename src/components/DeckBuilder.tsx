import React, { useState } from 'react';
import { useGameStore } from '../engine/GameState';
import { CARD_DATABASE } from '../engine/CardDefinitions';
import { Card } from './Card';
import { clsx } from 'clsx';

export const DeckBuilder: React.FC = () => {
    const { deckBuilder, collection, addToDeck, removeFromDeck, startGame, resetGame } = useGameStore();
    const [mobileTab, setMobileTab] = useState<'collection' | 'deck'>('collection');

    const availableCards = Object.entries(CARD_DATABASE).filter(([key]) =>
        collection.includes(key)
    );

    const isDeckFull = deckBuilder.selectedCardKeys.length >= deckBuilder.maxDeckSize;

    // ─── Shared panels ────────────────────────────────────────────────────────

    const CollectionPanel = (
        <div className="flex-1 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 md:mb-6 px-4 md:px-8 pt-4 md:pt-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 tracking-tight">
                        Card Collection
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm mt-1">
                        Select cards to add to your deck
                    </p>
                </div>
                <button
                    onClick={resetGame}
                    className="px-3 py-1.5 md:px-4 md:py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                    Back
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-10">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 md:gap-8 pb-8">
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
                                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none z-20">
                                    <div className="bg-black/90 text-cyan-400 px-4 md:px-6 py-2 rounded-full font-bold border border-cyan-500/50 transform scale-90 group-hover:scale-100 transition-transform shadow-2xl text-sm">
                                        ADD +
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const DeckPanel = (
        <div className="flex flex-col h-full p-4 md:p-6 bg-slate-900/95">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl md:text-2xl font-bold text-purple-400">Your Deck</h2>
                <div className={clsx(
                    "font-mono text-sm px-2 py-1 rounded",
                    isDeckFull ? "bg-green-500/20 text-green-400" : "bg-slate-800 text-slate-400"
                )}>
                    {deckBuilder.selectedCardKeys.length} / {deckBuilder.maxDeckSize}
                </div>
            </div>
            <p className="text-xs text-slate-500 mb-4 italic">
                A complete deck of 50 cards is required to initiate.
            </p>

            <div className="flex-1 overflow-y-auto space-y-1 mb-4 pr-1 custom-scrollbar">
                {deckBuilder.selectedCardKeys.length > 0 ? (
                    deckBuilder.selectedCardKeys.map((key, index) => {
                        const def = CARD_DATABASE[key];
                        if (!def) return null;

                        return (
                            <div
                                key={index}
                                onClick={() => removeFromDeck(index)}
                                className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700 hover:bg-red-900/20 hover:border-red-500/50 active:bg-red-900/30 group transition-all duration-200"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-[10px] text-slate-500 w-4 font-mono">{index + 1}</span>
                                    <span className="font-bold text-sm truncate">{def.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] bg-black/50 px-1.5 py-0.5 rounded text-cyan-400 font-mono">
                                        {def.cost}
                                    </span>
                                    {/* Always visible on touch devices, hover-only on desktop */}
                                    <div className="block md:hidden group-active:block text-[10px] text-red-500 font-bold uppercase tracking-tighter">
                                        DEL
                                    </div>
                                    <div className="hidden md:group-hover:block text-[10px] text-red-500 font-bold uppercase tracking-tighter">
                                        DEL
                                    </div>
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
                className={`w-full py-3 md:py-4 rounded-xl text-base md:text-lg font-black tracking-widest shadow-2xl transition-all active:scale-95 ${isDeckFull
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/50'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                    }`}
            >
                INITIATE SEQUENCE
            </button>
        </div>
    );

    // ─── Mobile: tabbed layout ─────────────────────────────────────────────────
    // ─── Desktop: side-by-side layout ─────────────────────────────────────────

    return (
        <div className="w-full h-[100dvh] bg-slate-950 text-slate-100 flex flex-col overflow-hidden">

            {/* Mobile tab bar */}
            <div className="md:hidden flex border-b border-slate-800 shrink-0">
                <button
                    onClick={() => setMobileTab('collection')}
                    className={clsx(
                        "flex-1 py-3 text-sm font-bold tracking-wide transition-colors",
                        mobileTab === 'collection'
                            ? "text-cyan-400 border-b-2 border-cyan-400 -mb-px"
                            : "text-slate-500"
                    )}
                >
                    Collection
                </button>
                <button
                    onClick={() => setMobileTab('deck')}
                    className={clsx(
                        "flex-1 py-3 text-sm font-bold tracking-wide transition-colors relative",
                        mobileTab === 'deck'
                            ? "text-purple-400 border-b-2 border-purple-400 -mb-px"
                            : "text-slate-500"
                    )}
                >
                    Deck
                    {deckBuilder.selectedCardKeys.length > 0 && (
                        <span className={clsx(
                            "ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-mono",
                            isDeckFull ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-300"
                        )}>
                            {deckBuilder.selectedCardKeys.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile content */}
            <div className="md:hidden flex-1 overflow-hidden flex flex-col">
                {mobileTab === 'collection' ? CollectionPanel : DeckPanel}
            </div>

            {/* Desktop: side-by-side */}
            <div className="hidden md:flex flex-1 overflow-hidden">
                <div className="flex-1 h-full flex flex-col border-r border-slate-800">
                    {CollectionPanel}
                </div>
                <div className="w-96 shrink-0 h-full border-l border-cyan-900/30">
                    {DeckPanel}
                </div>
            </div>

        </div>
    );
};
