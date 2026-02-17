export type CardType = 'Action' | 'Echo' | 'Recursor';

export interface Card {
    id: string;
    name: string;
    type: CardType;
    cost: number;
    effect: (gameState: GameState) => void;
    description: string;
    power?: number;
    image?: string;
}

export interface TimelineEntry {
    card: Card;
    ownerId: string;
    turnPlayed: number;
}

export interface Player {
    id: string;
    name: string;
    health: number;
    maxHealth: number;
    plays: number;
    maxPlays: number;
    hand: Card[];
    deck: Card[];
    discard: Card[];
    isAI?: boolean;
    xp: number;
    level: number;
}

export interface GameState {
    screen: 'menu' | 'game' | 'deckbuilder' | 'loot';
    timeline: TimelineEntry[];
    players: Player[];
    currentPlayerId: string;
    turn: number;
    winner: 'p1' | 'p2' | null;

    // Deck Builder State
    deckBuilder: {
        selectedCardKeys: string[];
        maxDeckSize: number;
    };
    collection: string[];
    runStage: number;
    pendingLoot: string[];

    // Actions
    addTimelineEntry: (card: Card, ownerId: string) => void;
    playCard: (cardId: string, playerId: string) => void;
    endTurn: () => void;
    drawCard: (playerId: string) => void;
    startGame: (deckKeys?: string[]) => void;
    setTimeline: (timeline: TimelineEntry[]) => void;
    modifyPlayer: (playerId: string, modifier: (p: Player) => Player) => void;
    triggerAI: () => void;
    resetGame: () => void;
    setScreen: (screen: 'menu' | 'game' | 'deckbuilder' | 'loot') => void;
    getTimelineMatches: (predicate: (entry: TimelineEntry) => boolean) => TimelineEntry[];

    // Deck Builder Actions
    openDeckBuilder: () => void;
    addToDeck: (key: string) => void;
    removeFromDeck: (index: number) => void;

    // Progression
    nextStage: () => void;
    generateLoot: () => void;
    claimLoot: (key: string) => void;
    resetProgress: () => void;
    lastXpGain: number;
}
