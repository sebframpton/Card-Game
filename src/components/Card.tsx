import React from 'react';
import type { Card as CardType } from '../engine/GameTypes';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface CardProps {
    card: CardType;
    onClick?: () => void;
    disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, disabled }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            whileHover={!disabled ? { scale: 1.05, y: -12 } : {}}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={clsx(
                "w-36 h-56 md:w-48 md:h-72 bg-slate-900 border-2 rounded-xl p-2 md:p-3 flex flex-col relative cursor-pointer transition-all select-none pointer-events-auto shadow-xl shrink-0 overflow-hidden",
                {
                    // Active States (Function based)
                    'border-red-500 shadow-red-950/40': !disabled && card.description.toLowerCase().includes('damage'),
                    'border-green-500 shadow-green-950/40': !disabled && card.description.toLowerCase().includes('defence'),
                    'border-cyan-500 shadow-cyan-950/40': !disabled && !card.description.toLowerCase().includes('damage') && !card.description.toLowerCase().includes('defence') && card.type !== 'Recursor',
                    'border-purple-500 shadow-purple-950/40': !disabled && card.type === 'Recursor',

                    // Disabled States
                    'border-red-900/30 opacity-50': disabled && card.description.toLowerCase().includes('damage'),
                    'border-green-900/30 opacity-50': disabled && card.description.toLowerCase().includes('defence'),
                    'border-slate-800 opacity-50': disabled && !card.description.toLowerCase().includes('damage') && !card.description.toLowerCase().includes('defence'),

                    'cursor-not-allowed': disabled,
                    'hover:bg-slate-800 hover:shadow-2xl': !disabled,
                    'z-50': isHovered
                }
            )}
            onClick={!disabled ? onClick : undefined}
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div className="text-[10px] md:text-sm font-black mb-1 md:mb-2 truncate text-slate-100 uppercase tracking-tight">{card.name}</div>
            <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-black/80 border border-slate-600 text-cyan-400 text-[10px] md:text-sm font-black w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shadow-lg z-10">
                {card.cost}
            </div>

            <div className={clsx(
                "flex-grow flex items-center justify-center mb-1 md:mb-2 overflow-hidden rounded relative border border-slate-800/50",
                {
                    'bg-red-950/40 text-red-500/30': card.description.toLowerCase().includes('damage'),
                    'bg-green-950/40 text-green-500/30': card.description.toLowerCase().includes('defence'),
                    'bg-cyan-950/40 text-cyan-500/30': !card.description.toLowerCase().includes('damage') && !card.description.toLowerCase().includes('defence') && card.type !== 'Recursor',
                    'bg-purple-950/40 text-purple-500/30': card.type === 'Recursor',
                }
            )}>
                {card.image ? (
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover opacity-90" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="text-xl md:text-2xl opacity-50 mb-1">
                            {card.type === 'Action' ? '⚡' : card.type === 'Echo' ? 'aa' : '↺'}
                        </div>
                    </div>
                )}
            </div>

            <div className="text-[9px] md:text-xs leading-tight md:leading-relaxed text-slate-300 overflow-y-auto mb-1 md:mb-2 pr-1 scrollbar-hide font-medium">
                {card.description}
            </div>

            <div className="mt-auto pt-1 md:pt-2 border-t border-slate-700/50 flex justify-between items-center">
                <div className={clsx(
                    "text-[8px] md:text-[10px] uppercase font-black tracking-widest",
                    {
                        'text-red-500': card.description.toLowerCase().includes('damage'),
                        'text-green-500': card.description.toLowerCase().includes('defence'),
                        'text-cyan-400': !card.description.toLowerCase().includes('damage') && !card.description.toLowerCase().includes('defence') && card.type !== 'Recursor',
                        'text-purple-500': card.type === 'Recursor',
                    }
                )}>
                    {card.type}
                </div>
            </div>
        </motion.div>
    );
};
