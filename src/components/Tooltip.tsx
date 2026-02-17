import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute ${positions[position]} z-50 pointer-events-none`}
                    >
                        <div className="bg-slate-900 border border-cyan-500/50 rounded-lg px-3 py-2 text-xs text-slate-300 whitespace-nowrap shadow-lg shadow-cyan-500/20 max-w-xs">
                            {content}
                            {/* Arrow */}
                            <div className={`absolute w-2 h-2 bg-slate-900 border-cyan-500/50 rotate-45 ${position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' :
                                    position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' :
                                        position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r' :
                                            'left-[-5px] top-1/2 -translate-y-1/2 border-b border-l'
                                }`} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
