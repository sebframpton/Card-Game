// Save Slot Manager for handling multiple game saves
export interface SaveSlot {
    id: string;
    name: string;
    timestamp: number;
    data: {
        collection: string[];
        runStage: number;
        deckBuilder: {
            selectedCardKeys: string[];
            maxDeckSize: number;
        };
        playerStats: {
            level: number;
            xp: number;
            health: number;
            maxHealth: number;
        };
    };
}

const SAVE_SLOTS_KEY = 'recursion-save-slots';
const MAX_SLOTS = 3;

export const SaveSlotManager = {
    // Get all save slots
    getAllSlots(): SaveSlot[] {
        const stored = localStorage.getItem(SAVE_SLOTS_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    // Get a specific slot by ID
    getSlot(id: string): SaveSlot | null {
        const slots = this.getAllSlots();
        return slots.find(slot => slot.id === id) || null;
    },

    // Save current game state to a slot
    saveToSlot(slotId: string, slotName: string, data: SaveSlot['data']): void {
        const slots = this.getAllSlots();
        const existingIndex = slots.findIndex(s => s.id === slotId);

        const slot: SaveSlot = {
            id: slotId,
            name: slotName,
            timestamp: Date.now(),
            data
        };

        if (existingIndex >= 0) {
            slots[existingIndex] = slot;
        } else {
            if (slots.length >= MAX_SLOTS) {
                throw new Error(`Maximum of ${MAX_SLOTS} save slots reached`);
            }
            slots.push(slot);
        }

        localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
    },

    // Delete a save slot
    deleteSlot(id: string): void {
        const slots = this.getAllSlots();
        const filtered = slots.filter(s => s.id !== id);
        localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(filtered));
    },

    // Get the currently active slot ID
    getActiveSlotId(): string | null {
        return localStorage.getItem('recursion-active-slot');
    },

    // Set the active slot
    setActiveSlotId(id: string | null): void {
        if (id) {
            localStorage.setItem('recursion-active-slot', id);
        } else {
            localStorage.removeItem('recursion-active-slot');
        }
    },

    // Create a new empty slot
    createSlot(_name: string): string {
        const id = `slot-${Date.now()}`;
        return id;
    }
};
