import React, { useEffect } from 'react';
import { useGameStore } from '../engine/GameState';
import { CARD_DATABASE } from '../engine/CardDefinitions';
import { Card } from './Card';

export const LootScreen: React.FC = () => {
    const { pendingLoot, claimLoot, nextStage, openDeckBuilder, generateLoot } = useGameStore();

    useEffect(() => {
        generateLoot();
    }, []);

    const handleClaim = (key: string) => {
        claimLoot(key);
        nextStage(); // Advance stage
        openDeckBuilder(); // Go to deck builder for next fight
    };

    return (
        <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950"></div>

            <div className="z-10 text-center mb-12 animate-fade-in-up">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
                    VICTORY!
                </h1>
                <p className="text-xl text-green-400 font-mono mb-2">LEVEL UP REWARD</p>
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg px-6 py-2 inline-block">
                    <span className="text-green-300 font-bold">+10 MAX HP</span>
                </div>
                <p className="text-slate-400 mt-8">Choose a card to add to your collection:</p>
            </div>

            <div className="flex gap-8 z-10">
                {pendingLoot.map((key, index) => {
                    const def = CARD_DATABASE[key];
                    return (
                        <div
                            key={index}
                            onClick={() => handleClaim(key)}
                            className="transform transition-all duration-300 hover:scale-110 cursor-pointer group"
                        >
                            <Card card={{ ...def, id: 'loot-' + index }} disabled={true} />
                            <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-purple-500/50">
                                    CLAIM
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
