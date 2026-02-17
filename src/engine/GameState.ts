import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Card, TimelineEntry, Player, GameState } from './GameTypes';

import { createCard, INITIAL_DECK_KEYS, CARD_DATABASE } from './CardDefinitions';

const getInitialDeck = () => {
    return INITIAL_DECK_KEYS.map(key => createCard(key)).filter((c): c is Card => c !== null);
};

const createPlayer = (id: string, name: string, isAI: boolean = false): Player => ({
    id,
    name,
    health: 20,
    maxHealth: 20,
    plays: 3,
    maxPlays: 3,
    hand: [],
    deck: getInitialDeck(),
    discard: [],
    isAI,
    xp: 0,
    level: 1,
});

const refillHandToTen = (player: Player): Player => {
    let currentHand = [...player.hand];
    let currentDeck = [...player.deck];
    let currentDiscard = [...player.discard];

    const fillFromDeck = () => {
        while (currentHand.length < 10 && currentDeck.length > 0) {
            const [nextCard, ...restDeck] = currentDeck;
            currentHand.push(nextCard);
            currentDeck = restDeck;
        }
    };

    // First attempt to fill from current deck
    fillFromDeck();

    // If still less than 10 and we have a discard pile, reshuffle
    if (currentHand.length < 10 && currentDiscard.length > 0) {
        // Shuffle discard into deck
        currentDeck = [...currentDiscard].sort(() => Math.random() - 0.5);
        currentDiscard = [];
        // Second attempt to fill from newly reshuffled deck
        fillFromDeck();
    }

    return {
        ...player,
        hand: currentHand,
        deck: currentDeck,
        discard: currentDiscard
    };
};

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            screen: 'menu',
            timeline: [],
            players: [], // Initialized in startGame
            currentPlayerId: 'p1',
            turn: 1,
            winner: null,
            deckBuilder: {
                selectedCardKeys: [],
                maxDeckSize: 50
            },
            collection: INITIAL_DECK_KEYS,
            runStage: 1,
            pendingLoot: [],
            lastXpGain: 0,

            addToDeck: (key: string) => {
                const { deckBuilder } = get();
                if (deckBuilder.selectedCardKeys.length < deckBuilder.maxDeckSize) {
                    set({
                        deckBuilder: {
                            ...deckBuilder,
                            selectedCardKeys: [...deckBuilder.selectedCardKeys, key]
                        }
                    });
                }
            },

            removeFromDeck: (index: number) => {
                const { deckBuilder } = get();
                const newKeys = [...deckBuilder.selectedCardKeys];
                newKeys.splice(index, 1);
                set({
                    deckBuilder: {
                        ...deckBuilder,
                        selectedCardKeys: newKeys
                    }
                });
            },

            resetGame: () => set({
                screen: 'menu',
                timeline: [],
                players: [createPlayer('p1', 'Player 1'), createPlayer('p2', 'Enemy AI', true)],
                currentPlayerId: 'p1',
                turn: 1,
                winner: null
            }),

            addTimelineEntry: (card, ownerId) => set((state) => {
                const newEntry: TimelineEntry = {
                    card,
                    ownerId,
                    turnPlayed: state.turn,
                };
                const newTimeline = [...state.timeline, newEntry];
                return { timeline: newTimeline };
            }),

            playCard: (cardId, playerId) => {
                const state = get();
                const playerIndex = state.players.findIndex(p => p.id === playerId);
                if (playerIndex === -1) return;

                const player = state.players[playerIndex];
                const cardIndex = player.hand.findIndex(c => c.id === cardId);
                if (cardIndex === -1) return;

                const card = player.hand[cardIndex];

                if (player.plays < card.cost) {
                    console.warn("Not enough resources!");
                    return;
                }

                // 1. Deduct cost and move to discard
                const playersAfterPayment = [...state.players];
                playersAfterPayment[playerIndex] = {
                    ...player,
                    plays: player.plays - card.cost,
                    hand: player.hand.filter((_, i) => i !== cardIndex),
                    discard: [...player.discard, card]
                };

                // Update state immediately so effects see correctly reduced plays/hand
                set({ players: playersAfterPayment });

                // 2. Trigger effect (may draw more cards)
                card.effect(get());

                // 3. Add to timeline
                get().addTimelineEntry(card, playerId);

                // 4. Final Refill: Ensure hand is at exactly 10 after everything
                const finalState = get();
                const playersAfterEffect = [...finalState.players];
                const playerToRefill = playersAfterEffect[playerIndex];
                playersAfterEffect[playerIndex] = refillHandToTen(playerToRefill);

                set({ players: playersAfterEffect });
            },

            drawCard: (playerId) => set((state) => {
                const newPlayers = state.players.map(p => {
                    if (p.id !== playerId) return p;

                    let pCopy = { ...p };
                    if (pCopy.deck.length === 0 && pCopy.discard.length > 0) {
                        pCopy.deck = [...pCopy.discard].sort(() => Math.random() - 0.5);
                        pCopy.discard = [];
                    }

                    if (pCopy.deck.length === 0) return p;

                    const [newCard, ...remainingDeck] = pCopy.deck;
                    return {
                        ...pCopy,
                        hand: [...pCopy.hand, newCard],
                        deck: remainingDeck
                    };
                });
                return { players: newPlayers };
            }),

            startGame: (deckKeys?: string[]) => {
                // Use provided keys or fall back to initial deck (up to 50)
                const p1DeckKeys = deckKeys && deckKeys.length > 0 ? deckKeys : INITIAL_DECK_KEYS.slice(0, 50);
                const p1Deck = p1DeckKeys.map(key => createCard(key)).filter((c): c is Card => c !== null);

                // Enemy also gets a 50-card deck
                const p2Deck = INITIAL_DECK_KEYS.slice(0, 50).map(key => createCard(key)).filter((c): c is Card => c !== null);

                const p1 = createPlayer('p1', 'Player 1');
                p1.deck = p1Deck;
                // Preserve XP and Level from current state if they exist, otherwise use defaults
                const currentState = get();
                const existingP1 = currentState.players.find(p => p.id === 'p1');
                p1.xp = existingP1?.xp ?? 0;
                p1.level = existingP1?.level ?? 1;
                p1.maxHealth = existingP1?.maxHealth ?? 20;
                // Respect rehydrated health if it exists and is valid, otherwise use maxHealth
                p1.health = (existingP1?.health !== undefined && existingP1.health > 0) ? existingP1.health : p1.maxHealth;

                const p2 = createPlayer('p2', 'Enemy AI', true);
                p2.deck = p2Deck;
                // Scale enemy health based on runStage
                p2.health = 20 + (currentState.runStage - 1) * 5;
                p2.maxHealth = p2.health;

                const drawInitial = (p: Player) => refillHandToTen(p);

                set({
                    players: [drawInitial(p1), drawInitial(p2)],
                    timeline: [],
                    turn: 1,
                    currentPlayerId: 'p1',
                    screen: 'game',
                    winner: null
                });
            },

            endTurn: () => {
                const state = get();
                const nextPlayerId = state.currentPlayerId === 'p1' ? 'p2' : 'p1';
                const nextTurn = state.currentPlayerId === 'p2' ? state.turn + 1 : state.turn;

                const newPlayers = state.players.map(p => {
                    if (p.id === nextPlayerId) {
                        // Ensure hand is refilled to 10 at start of turn consistently
                        const incomingPlayer = {
                            ...p,
                            plays: p.maxPlays,
                        };
                        return refillHandToTen(incomingPlayer);
                    }
                    return p;
                });

                set({
                    currentPlayerId: nextPlayerId,
                    turn: nextTurn,
                    players: newPlayers
                });

                const nextPlayer = newPlayers.find(p => p.id === nextPlayerId);
                if (nextPlayer?.isAI) {
                    get().triggerAI();
                }
            },

            getTimelineMatches: (predicate) => {
                return get().timeline.filter(predicate);
            },

            setScreen: (screen) => set({ screen }),

            resetProgress: () => {
                set({
                    collection: INITIAL_DECK_KEYS,
                    runStage: 1,
                    deckBuilder: {
                        selectedCardKeys: [],
                        maxDeckSize: 50
                    },
                    screen: 'menu',
                    timeline: [],
                    players: [],
                    currentPlayerId: 'p1',
                    turn: 1,
                    winner: null,
                    pendingLoot: []
                });
            },

            modifyPlayer: (playerId, modifier) => set(state => {
                const newPlayers = state.players.map(p => p.id === playerId ? modifier(p) : p);

                let winner: 'p1' | 'p2' | null = state.winner;
                const p1 = newPlayers.find(p => p.id === 'p1');
                const p2 = newPlayers.find(p => p.id === 'p2');

                if (p1 && p1.health <= 0) winner = 'p2';
                if (p2 && p2.health <= 0) {
                    winner = 'p1';
                    if (state.winner === null) {
                        const p1Idx = newPlayers.findIndex(p => p.id === 'p1');
                        if (p1Idx !== -1) {
                            const currentXp = newPlayers[p1Idx].xp || 0;
                            const currentLevel = newPlayers[p1Idx].level || 1;
                            const xpGain = 100;
                            let newXp = currentXp + xpGain;
                            let newLevel = currentLevel;

                            // Dynamic threshold: 200 * current level
                            const threshold = 200;

                            while (newXp >= threshold) {
                                newXp -= threshold;
                                newLevel += 1;
                            }

                            const levelsGained = newLevel - currentLevel;

                            newPlayers[p1Idx] = {
                                ...newPlayers[p1Idx],
                                xp: newXp,
                                level: newLevel,
                                maxHealth: (newPlayers[p1Idx].maxHealth || 20) + (levelsGained * 10),
                                health: (newPlayers[p1Idx].maxHealth || 20) + (levelsGained * 10) // Optional: heal on level up
                            };

                            return {
                                players: newPlayers,
                                winner: 'p1',
                                lastXpGain: xpGain
                            };
                        }
                    }
                }

                return { players: newPlayers, winner, lastXpGain: 0 };
            }),

            setTimeline: (timeline) => set({ timeline }),

            openDeckBuilder: () => set({ screen: 'deckbuilder' }),

            nextStage: () => set(state => ({ runStage: state.runStage + 1 })),

            generateLoot: () => {
                const allKeys = Object.keys(CARD_DATABASE);
                const loot: string[] = [];
                for (let i = 0; i < 3; i++) {
                    const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
                    loot.push(randomKey);
                }
                set({ pendingLoot: loot });
            },

            claimLoot: (key: string) => set(state => ({
                collection: [...state.collection, key],
                pendingLoot: []
            })),

            triggerAI: async () => {
                const state = get();
                const aiPlayer = state.players.find(p => p.id === state.currentPlayerId && p.isAI);
                if (!aiPlayer) return;

                await new Promise(resolve => setTimeout(resolve, 1000));

                const executeTurn = () => {
                    let currentState = get();
                    let currentAI = currentState.players.find(p => p.id === currentState.currentPlayerId);
                    if (!currentAI || !currentAI.isAI) return;

                    try {
                        const playableCard = currentAI.hand.find(c =>
                            currentState.players.find(p => p.id === currentAI!.id)!.plays >= c.cost
                        );

                        if (playableCard) {
                            get().playCard(playableCard.id, currentAI.id);
                            setTimeout(executeTurn, 800);
                        } else {
                            get().endTurn();
                        }
                    } catch (error) {
                        console.error("AI Error:", error);
                        get().endTurn();
                    }
                };
                executeTurn();
            },
        }),
        {
            name: 'recursion-storage',
            partialize: (state) => ({
                collection: state.collection,
                runStage: state.runStage,
                deckBuilder: state.deckBuilder,
                timeline: state.timeline,
                // Persist player progress stats
                players: state.players.map(p => ({
                    id: p.id,
                    xp: p.xp,
                    level: p.level,
                    health: p.health,
                    maxHealth: p.maxHealth
                }))
            }),
            // Migration/Cleanup for renamed keys
            onRehydrateStorage: () => (state) => {
                if (state) {
                    const migrateKey = (key: string) => key === 'overclock' ? 'overthink' : key;

                    const migratedCollection = state.collection.map(migrateKey);
                    const migratedDeck = state.deckBuilder.selectedCardKeys.map(migrateKey);

                    // If we have persisted player stats, apply them to basic players
                    if (state.players && state.players.length > 0) {
                        const p1Stats = state.players.find(p => p.id === 'p1');
                        if (p1Stats) {
                            // Ensure any future gameplay uses these values
                            console.log('Rehydrated Level:', p1Stats.level);
                        }
                    }

                    if (
                        JSON.stringify(migratedCollection) !== JSON.stringify(state.collection) ||
                        JSON.stringify(migratedDeck) !== JSON.stringify(state.deckBuilder.selectedCardKeys)
                    ) {
                        state.setScreen(state.screen);
                        useGameStore.setState({
                            collection: migratedCollection,
                            deckBuilder: {
                                ...state.deckBuilder,
                                selectedCardKeys: migratedDeck
                            }
                        });
                    }
                }
            }
        }
    )
);
