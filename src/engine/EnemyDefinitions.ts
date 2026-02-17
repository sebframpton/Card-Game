

export interface EnemyDef {
    id: string;
    name: string;
    hp: number;
    deckKeys: string[];
}

export const ENEMIES: Record<number, EnemyDef> = {
    1: {
        id: 'drone',
        name: 'Security Drone',
        hp: 20,
        deckKeys: [
            'strike', 'strike', 'strike',
            'defend', 'defend',
            'heavy_strike', 'quick_thinking',
            'strike', 'strike', 'defend'
        ]
    },
    2: {
        id: 'horror',
        name: 'Glitch Horror',
        hp: 40,
        deckKeys: [
            'heavy_strike', 'heavy_strike', 'execute',
            'data_leak', 'data_leak',
            'momentum', 'fortify', 'fortify',
            'strike', 'strike'
        ]
    },
    3: {
        id: 'architect',
        name: 'The Architect',
        hp: 80,
        deckKeys: [
            'execute', 'execute', 'execute',
            'barrier', 'barrier',
            'knowledge_bank', 'research',
            'momentum', 'momentum', 'heavy_strike'
        ]
    }
};

export const getEnemyForStage = (stage: number): EnemyDef => {
    return ENEMIES[stage] || ENEMIES[3]; // Fallback to boss if stage > 3
};
