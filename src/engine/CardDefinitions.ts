import type { Card, GameState } from './GameTypes';

// Helper to create unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

/* 
   HELPER FUNCTIONS FOR COMMON EFFECTS 
   These use the state actions to modify the game.
*/
const damageOpponent = (state: GameState, amount: number) => {
    const opponentId = state.players.find(p => p.id !== state.currentPlayerId)?.id;
    if (opponentId) {
        state.modifyPlayer(opponentId, p => ({ ...p, health: p.health - amount }));
    }
};

const healSelf = (state: GameState, amount: number) => {
    state.modifyPlayer(state.currentPlayerId, p => ({
        ...p,
        health: Math.min(p.maxHealth, p.health + amount)
    }));
};

const drawCards = (state: GameState, count: number, playerId?: string) => {
    const targetId = playerId || state.currentPlayerId;
    // We can call state.drawCard multiple times or implement a batch draw.
    // calculate how many times to call
    for (let i = 0; i < count; i++) {
        state.drawCard(targetId);
    }
};

const gainPlays = (state: GameState, amount: number) => {
    state.modifyPlayer(state.currentPlayerId, p => ({ ...p, plays: p.plays + amount }));
};

export const CARD_DATABASE: Record<string, Omit<Card, 'id'>> = {
    // --- BASIC ATTACKS ---
    'strike': {
        name: 'Strike',
        type: 'Action',
        cost: 1,
        description: 'Deal 2 damage.',
        power: 2,
        effect: (state) => damageOpponent(state, 2)
    },
    'heavy_strike': {
        name: 'Heavy Strike',
        type: 'Action',
        cost: 2,
        description: 'Deal 5 damage.',
        power: 5,
        effect: (state) => damageOpponent(state, 5)
    },
    'execute': {
        name: 'Execute',
        type: 'Action',
        cost: 3,
        description: 'Deal 8 damage.',
        power: 8,
        effect: (state) => damageOpponent(state, 8)
    },

    // --- BASIC DEFENSE ---
    'defend': {
        name: 'Defend',
        type: 'Action',
        cost: 1,
        description: 'Gain 3 Defence.',
        power: 3,
        effect: (state) => healSelf(state, 3)
    },
    'fortify': {
        name: 'Fortify',
        type: 'Action',
        cost: 2,
        description: 'Gain 6 Defence.',
        power: 6,
        effect: (state) => healSelf(state, 6)
    },
    'barrier': {
        name: 'Barrier',
        type: 'Action',
        cost: 3,
        description: 'Gain 10 Defence.',
        power: 10,
        effect: (state) => healSelf(state, 10)
    },

    // --- UTILITY ---
    'quick_thinking': {
        name: 'Quick Thinking',
        type: 'Action',
        cost: 0,
        description: 'Draw 1 card.',
        effect: (state) => drawCards(state, 1)
    },
    'research': {
        name: 'Research',
        type: 'Action',
        cost: 1,
        description: 'Draw 2 cards.',
        effect: (state) => drawCards(state, 2)
    },
    'meditate': {
        name: 'Meditate',
        type: 'Action',
        cost: 1,
        description: 'Gain 2 Plays.',
        effect: (state) => gainPlays(state, 2)
    },
    'overthink': {
        name: 'Overthink',
        type: 'Action',
        cost: 2,
        description: 'Draw 3 cards.',
        effect: (state) => drawCards(state, 3)
    },
    'focus': {
        name: 'Focus',
        type: 'Action',
        cost: 0,
        description: 'Gain 1 Play.',
        effect: (state) => gainPlays(state, 1)
    },

    // --- SIMPLE ECHOES (Passive/Delayed feel) ---
    'data_leak': {
        name: 'Data Leak',
        type: 'Echo',
        cost: 1,
        description: 'Deal 3 damage to opponent.',
        power: 3,
        effect: (state) => damageOpponent(state, 3)
    },
    'backup_protocol': {
        name: 'Backup Protocol',
        type: 'Echo',
        cost: 1,
        description: 'Gain 4 Defence.',
        power: 4,
        effect: (state) => healSelf(state, 4)
    },
    'system_pulse': {
        name: 'System Pulse',
        type: 'Echo',
        cost: 2,
        description: 'Deal 4 damage and gain 2 Defence.',
        power: 4,
        effect: (state) => {
            damageOpponent(state, 4);
            healSelf(state, 2);
        }
    },
    'reboot_sequence': {
        name: 'Reboot Sequence',
        type: 'Echo',
        cost: 2,
        description: 'Draw 2 cards and gain 1 Play.',
        effect: (state) => {
            drawCards(state, 2);
            gainPlays(state, 1);
        }
    },

    // --- SIMPLE RECURSORS (Scaling) ---
    'momentum': {
        name: 'Momentum',
        type: 'Recursor',
        cost: 2,
        description: 'Deal 1 damage for every card in the timeline.',
        effect: (state) => damageOpponent(state, state.timeline.length)
    },
    'knowledge_bank': {
        name: 'Knowledge Bank',
        type: 'Recursor',
        cost: 2,
        description: 'Gain 1 Defence for every card in the timeline.',
        effect: (state) => healSelf(state, state.timeline.length)
    },
    'recursive_blast': {
        name: 'Recursive Blast',
        type: 'Recursor',
        cost: 3,
        description: 'Deal 2 damage for every card in the timeline.',
        effect: (state) => damageOpponent(state, state.timeline.length * 2)
    },
    'feedback_loop': {
        name: 'Feedback Loop',
        type: 'Recursor',
        cost: 1,
        description: 'Gain 1 Play if the timeline has more than 5 cards.',
        effect: (state) => {
            if (state.timeline.length > 5) gainPlays(state, 1);
        }
    }
};

export const createCard = (key: string): Card | null => {
    const def = CARD_DATABASE[key];
    if (!def) return null;
    return {
        ...def,
        id: generateId()
    };
};

export const INITIAL_DECK_KEYS = [
    // 50 Cards Initial Pool
    'strike', 'strike', 'strike', 'strike', 'strike', 'strike', 'strike', 'strike', 'strike', 'strike',
    'defend', 'defend', 'defend', 'defend', 'defend', 'defend', 'defend', 'defend', 'defend', 'defend',
    'heavy_strike', 'heavy_strike', 'heavy_strike', 'heavy_strike', 'heavy_strike',
    'fortify', 'fortify', 'fortify', 'fortify', 'fortify',
    'quick_thinking', 'quick_thinking', 'quick_thinking', 'quick_thinking', 'quick_thinking',
    'research', 'research', 'research',
    'overthink', 'overthink',
    'meditate', 'meditate',
    'focus', 'focus',
    'momentum', 'momentum',
    'knowledge_bank', 'knowledge_bank',
    'data_leak', 'backup_protocol'
];
