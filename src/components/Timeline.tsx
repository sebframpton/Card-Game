import type { TimelineEntry } from '../engine/GameTypes';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineProps {
    entries: TimelineEntry[];
}

export const Timeline: React.FC<TimelineProps> = ({ entries }) => {
    return (
        <div className="w-full flex flex-col gap-1.5 px-1 h-full overflow-y-auto scrollbar-hide py-2">
            <AnimatePresence initial={false}>
                {entries.length === 0 ? (
                    <div className="text-slate-800 text-[8px] font-mono tracking-widest text-center uppercase py-4 opacity-20">Empty</div>
                ) : (
                    entries.map((entry, idx) => (
                        <motion.div
                            key={`${entry.card.id}-${idx}`}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={clsx(
                                "flex-shrink-0 w-full min-h-[40px] border rounded p-1.5 flex items-center justify-between relative transition-all duration-300 group shadow-sm",
                                {
                                    'border-red-500/20 bg-red-950/10 hover:border-red-500/40': entry.card.description.toLowerCase().includes('damage'),
                                    'border-green-500/20 bg-green-950/10 hover:border-green-500/40': entry.card.description.toLowerCase().includes('defence'),
                                    'border-cyan-500/20 bg-cyan-950/10 hover:border-cyan-500/40': !entry.card.description.toLowerCase().includes('damage') && !entry.card.description.toLowerCase().includes('defence'),
                                }
                            )}
                        >
                            <div className="flex flex-col flex-1 truncate">
                                <div className="text-[10px] font-black text-white leading-none truncate uppercase truncate">{entry.card.name}</div>
                                <div className="text-[7px] text-slate-500 font-mono mt-0.5">TURN_0{entry.turnPlayed}</div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                <div className={clsx(
                                    "text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1",
                                    entry.card.description.toLowerCase().includes('damage')
                                        ? "text-red-400 bg-red-950/50 border-red-800/50"
                                        : entry.card.description.toLowerCase().includes('defence')
                                            ? "text-green-400 bg-green-950/50 border-green-800/50"
                                            : "text-blue-400 bg-blue-950/50 border-blue-800/50"
                                )}>
                                    <span className="opacity-60 text-[7px] font-mono uppercase">
                                        {entry.card.description.toLowerCase().includes('damage') ? 'Dmg' : entry.card.description.toLowerCase().includes('defence') ? 'Def' : 'Val'}
                                    </span>
                                    <span>{entry.card.power ?? entry.card.cost}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};
