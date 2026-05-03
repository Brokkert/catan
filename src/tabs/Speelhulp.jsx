import { useState } from 'react';
import Bank from './speelhulp/Bank.jsx';
import Timer from './speelhulp/Timer.jsx';
import Builder from './speelhulp/Builder.jsx';
import Seasons, { SEASONS } from './speelhulp/Seasons.jsx';
import Events from './speelhulp/Events.jsx';
import TilePredictor from './speelhulp/TilePredictor.jsx';

const SUBTABS = [
  { id: 'bank', label: '🏦 Bank' },
  { id: 'timer', label: '⏱️ Timer' },
  { id: 'build', label: '🔨 Bouwen' },
  { id: 'tile', label: '🧭 Trek tegel' },
  { id: 'season', label: '🌤️ Seizoen' },
  { id: 'events', label: '🎲 Events' },
];

export default function Speelhulp({ config }) {
  const [subTab, setSubTab] = useState('bank');
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [season, setSeason] = useState('spring');

  const tintClass = config.seizoensrad ? (SEASONS.find(s => s.id === season)?.tint || '') : '';

  const available = SUBTABS.filter(t => {
    if (t.id === 'season' && !config.seizoensrad) return false;
    if (t.id === 'tile' && !config.procedureel) return false;
    return true;
  });

  return (
    <div className={tintClass} style={{ padding: 0, margin: -16, minHeight: '80vh' }}>
      <div style={{ padding: 16 }}>
        <div className="player-tabs" style={{ marginBottom: 12 }}>
          {available.map(t => (
            <button
              key={t.id}
              className={`player-tab ${subTab === t.id ? 'active' : ''}`}
              onClick={() => setSubTab(t.id)}
            >{t.label}</button>
          ))}
        </div>

        {subTab === 'bank' && <Bank config={config} currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer} />}
        {subTab === 'timer' && <Timer currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer} />}
        {subTab === 'build' && <Builder config={config} currentPlayer={currentPlayer} />}
        {subTab === 'tile' && config.procedureel && <TilePredictor config={config} />}
        {subTab === 'season' && config.seizoensrad && <Seasons season={season} setSeason={setSeason} />}
        {subTab === 'events' && <Events config={config} />}
      </div>
    </div>
  );
}
