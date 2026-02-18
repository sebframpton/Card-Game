import React, { useState, useEffect } from 'react';
import { useGameStore } from '../engine/GameState';
import { Card } from './Card';
import { Timeline } from './Timeline';
import clsx from 'clsx';
import { PauseMenu } from './PauseMenu';
import { WelcomeModal, useWelcomeModal } from './WelcomeModal';
import { Tooltip } from './Tooltip';
import { motion } from 'framer-motion';

export const GameBoard: React.FC = () => {
    const { players, timeline, currentPlayerId, playCard, endTurn, turn, winner, resetGame, runStage } = useGameStore();
    const [isPaused, setIsPaused] = useState(false);
    const { showWelcome, closeWelcome } = useWelcomeModal();

    // Handle ESC key to toggle pause (desktop only)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsPaused(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const player = players.find(p => p.id === 'p1');
    const opponent = players.find(p => p.id === 'p2');

    if (!player || !opponent) return <div>Error: Players not found</div>;

    const getHealthPercent = (current: number, max: number) =>
        Math.max(0, Math.min(100, (current / max) * 100));

    const isPlayerTurn = currentPlayerId === 'p1';

    return (
        <div className="w-full h-[100dvh] bg-slate-950 text-slate-100 flex flex-col overflow-hidden relative">

            {showWelcome && <WelcomeModal onClose={closeWelcome} />}

            {/* GAME OVER OVERLAY */}
            {winner && (
                <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center animate-fade-in p-4 text-center backdrop-blur-md">
                    <motion.h1
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-5xl md:text-8xl font-black mb-4 tracking-tighter ${winner === 'p1' ? 'text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'text-red-500 underline decoration-red-900'}`}
                    >
                        {winner === 'p1' ? 'VICTORY' : 'DEFEAT'}
                    </motion.h1>

                    {winner === 'p1' && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-slate-900/80 border border-purple-500/30 p-5 md:p-6 rounded-2xl mb-8 max-w-sm w-full shadow-2xl"
                        >
                            <div className="text-purple-400 font-black text-xl md:text-2xl mb-2 tracking-widest">+100 XP RECOVERED</div>
                            <div className="h-4 bg-black rounded-full overflow-hidden border border-slate-700 mb-2 p-0.5">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full"
                                    initial={{ width: `${Math.max(0, ((player.xp - 100) / 200) * 100)}%` }}
                                    animate={{ width: `${(player.xp / 200) * 100}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-slate-500">
                                <span>LEVEL {player.level}</span>
                                <span>{player.xp} / 200 XP</span>
                            </div>
                        </motion.div>
                    )}

                    <button
                        onClick={() => {
                            if (winner === 'p1') {
                                useGameStore.getState().setScreen('loot');
                            } else {
                                resetGame();
                            }
                        }}
                        className={`px-8 md:px-10 py-3 md:py-4 rounded-xl text-lg md:text-xl font-black tracking-widest shadow-2xl transition-all active:scale-95
                            ${winner === 'p1'
                                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-purple-900/50'
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/50'}`}
                    >
                        {winner === 'p1' ? 'CLAIM REWARDS' : 'TRY AGAIN'}
                    </button>
                </div>
            )}

            {/* ── Top Bar ─────────────────────────────────────────────────────── */}
            <div className="h-12 md:h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 md:px-6 shrink-0">
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="font-bold text-base md:text-xl tracking-wider text-cyan-400">RECURSION</div>
                    <div className={`px-2 md:px-3 py-1 rounded border text-[9px] md:text-[10px] font-black uppercase tracking-tighter shadow-lg ${isPlayerTurn
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                    >
                        {isPlayerTurn ? '⚡ YOUR TURN' : '🤖 ENEMY TURN'}
                    </div>
                </div>

                <div className="flex gap-2 md:gap-8 text-xs items-center">
                    <Tooltip content="Current battle stage">
                        <div className="hidden sm:block text-slate-400">
                            Stage: <span className="font-mono text-purple-400 font-bold">{runStage}</span>
                        </div>
                    </Tooltip>
                    <Tooltip content="Turn number">
                        <div className="text-slate-400">
                            Turn: <span className="font-mono text-cyan-400">{turn}</span>
                        </div>
                    </Tooltip>
                    <button
                        onClick={() => setIsPaused(true)}
                        className="px-2 md:px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 rounded border border-slate-700 transition-colors"
                    >
                        {/* Show "ESC" hint only on desktop */}
                        <span className="hidden md:inline">Menu (ESC)</span>
                        <span className="md:hidden">Menu</span>
                    </button>
                </div>
            </div>

            {/* ── Main Battle Area ─────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col relative min-h-0 p-3 md:p-6 gap-2 md:gap-4">

                {/* Enemy HUD */}
                <div className="flex justify-center">
                    <div className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-2xl p-3 md:p-6 backdrop-blur-md shadow-2xl border-red-500/20">
                        <div className="flex items-center gap-3 md:gap-6">
                            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-slate-800 border-2 border-red-500 flex items-center justify-center font-black text-xl md:text-3xl shrink-0 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                                {opponent?.health}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs md:text-base text-slate-400 mb-1 md:mb-2 font-black tracking-widest uppercase">
                                    <span>{opponent?.name || 'Enemy AI'}</span>
                                    <span>{opponent?.health} / {opponent?.maxHealth}</span>
                                </div>
                                <div className="h-4 md:h-8 bg-slate-950 rounded-full overflow-hidden border-2 border-slate-800 shadow-inner p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getHealthPercent(opponent?.health || 0, opponent?.maxHealth || 20)}%` }}
                                        className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Timeline — centre strip ── */}
                <div className="flex-1 flex flex-col min-h-0 opacity-80 hover:opacity-100 transition-opacity duration-500">
                    <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-500/40 font-black text-center border-b border-slate-800 pb-2 mb-2">
                        Operational_History
                    </div>
                    <div className="flex-1 flex gap-4 overflow-hidden">
                        {/* Player column */}
                        <div className="flex-1 flex flex-col items-center min-w-0">
                            <div className="text-[9px] font-black text-green-500/50 mb-2 uppercase tracking-widest">USER_UPLINK</div>
                            <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                                <Timeline entries={timeline.filter(e => e.ownerId === 'p1')} />
                            </div>
                        </div>
                        {/* Divider */}
                        <div className="w-px bg-slate-800/60 shrink-0" />
                        {/* Enemy column */}
                        <div className="flex-1 flex flex-col items-center min-w-0">
                            <div className="text-[9px] font-black text-red-500/50 mb-2 uppercase tracking-widest">AI_SEQUENCE</div>
                            <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                                <Timeline entries={timeline.filter(e => e.ownerId === 'p2')} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 text-[8px] text-slate-700 font-mono animate-pulse uppercase tracking-widest text-center bg-black/40 py-1.5 rounded">
                        [ LOG_VIEW_ACTIVE ]
                    </div>
                </div>

                {/* Player HUD */}
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl bg-slate-900/95 border-2 border-cyan-500/40 rounded-2xl md:rounded-3xl p-4 md:p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                        <div className="flex items-center gap-4 md:gap-12">
                            <Tooltip content={`System Integrity: ${player.health}/${player.maxHealth}`}>
                                <div className="w-14 h-14 md:w-24 md:h-24 rounded-full bg-slate-950 border-4 border-green-500 flex items-center justify-center font-black text-2xl md:text-4xl shrink-0 shadow-[0_0_40px_rgba(34,197,94,0.4)] relative">
                                    <div className="absolute inset-0 rounded-full animate-pulse border border-green-500/50 scale-110" />
                                    {player.health}
                                </div>
                            </Tooltip>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-end mb-2 md:mb-3">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] md:text-[12px] px-2 py-0.5 md:py-1 bg-purple-600 text-white font-black rounded-lg uppercase tracking-widest shadow-lg shadow-purple-900/40">
                                                LVL {player.level}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-1.5 bg-blue-600 text-white border border-blue-400/50 rounded-full text-[10px] md:text-[12px] font-black shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                                <span className="animate-bounce">⚡</span>
                                                <span>PLAYS: {player.plays}/{player.maxPlays}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] md:text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">Integrity</div>
                                        <div className="text-lg md:text-2xl font-black text-green-400 font-mono leading-none">
                                            {player.health} <span className="text-slate-700 text-xs md:text-sm">/ {player.maxHealth}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-3 md:h-6 bg-slate-950 rounded-full overflow-hidden border-2 border-slate-800 shadow-inner p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getHealthPercent(player.health, player.maxHealth)}%` }}
                                        className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                    />
                                </div>

                                {/* XP Bar */}
                                <div className="mt-2 md:mt-3">
                                    <div className="flex justify-between text-[8px] md:text-[9px] text-slate-500 font-mono uppercase mb-1">
                                        <span>Progression</span>
                                        <span>{Math.max(0, Math.min(100, Math.round((player.xp / 200) * 100)))}%</span>
                                    </div>
                                    <div className="h-1 md:h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.max(0, Math.min(100, (player.xp / 200) * 100))}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Hand & Controls ──────────────────────────────────────────────── */}
            <div className={clsx(
                "border-t transition-all duration-500 pb-3 md:pb-4 pt-2 px-3 md:px-4 shadow-2xl backdrop-blur-md shrink-0 relative z-20",
                isPlayerTurn
                    ? "bg-cyan-950/40 border-cyan-500/30 shadow-[0_-20px_50px_rgba(34,211,238,0.1)]"
                    : "bg-slate-900/80 border-slate-800"
            )}>
                {/* Hand */}
                <div className="flex justify-start md:justify-center gap-3 md:gap-4 overflow-x-auto py-3 md:py-6 scrollbar-hide px-2 md:px-8 min-h-[160px] md:min-h-[220px]">
                    {player.hand.length > 0 ? (
                        player.hand.map((card) => (
                            <div key={card.id} className="shrink-0 group relative scale-90 md:scale-100 origin-bottom">
                                <Card
                                    card={card}
                                    onClick={() => playCard(card.id, player.id)}
                                    disabled={!isPlayerTurn || winner !== null || card.cost > player.plays}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-slate-600 text-xs md:text-sm flex items-center justify-center p-6 md:p-8 border-2 border-dashed border-slate-800 rounded-2xl w-full max-w-sm mx-auto">
                            NO_DATA_PACKETS_IN_MEMORY
                        </div>
                    )}
                </div>

                {/* End Turn Area */}
                <div className="flex flex-col items-center mt-1 md:mt-2 px-2 md:px-4 gap-1 md:gap-2">
                    {isPlayerTurn ? (
                        <>
                            <button
                                onClick={() => endTurn()}
                                disabled={winner !== null}
                                className="w-full max-w-sm py-3 md:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 disabled:from-slate-700 disabled:to-slate-600 text-white font-black rounded-xl text-sm md:text-base uppercase tracking-widest transition-all shadow-lg shadow-cyan-900/50 disabled:shadow-none disabled:cursor-not-allowed group relative overflow-hidden"
                            >
                                <span className="flex items-center justify-center gap-2 relative z-10">
                                    Finalize Turn <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform">⏭️</span>
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-white/20"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                />
                            </button>
                            <div className="text-[9px] md:text-[10px] text-slate-500 font-mono tracking-tighter uppercase font-black">
                                HAND_CAPACITY: {player.hand.length} / 10
                            </div>
                        </>
                    ) : (
                        <div className="w-full max-w-sm py-3 md:py-4 bg-slate-800/50 text-slate-500 font-bold rounded-xl text-xs md:text-base uppercase tracking-widest border border-slate-700 text-center animate-pulse">
                            AI_PROCESSING_SEQUENCE...
                        </div>
                    )}
                </div>
            </div>

            <PauseMenu isOpen={isPaused} onClose={() => setIsPaused(false)} />
        </div>
    );
};
