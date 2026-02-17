import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { DeckBuilder } from './components/DeckBuilder';
import { LootScreen } from './components/LootScreen';
import { useGameStore } from './engine/GameState';

function App() {
  const screen = useGameStore(state => state.screen);

  return (
    <div className="w-full h-screen bg-black overflow-hidden select-none font-sans">
      {screen === 'menu' && <MainMenu />}
      {screen === 'deckbuilder' && <DeckBuilder />}
      {screen === 'loot' && <LootScreen />}
      {screen === 'game' && <GameBoard />}
    </div>
  );
}

export default App;
