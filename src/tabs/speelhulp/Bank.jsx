import { RESOURCES } from '../../data/costs.js';
import { useYBank } from '../../utils/useYjs.js';

const PLAYER_COLORS = ['#e55', '#3a7', '#5aa9e6', '#e8b923'];
const PLAYER_NAMES = ['Rood', 'Groen', 'Blauw', 'Geel'];

export default function Bank({ config, currentPlayer, setCurrentPlayer }) {
  const [bank, updatePlayer] = useYBank();

  const active = RESOURCES.filter(r => !r.rule || config[r.rule]);
  const p = bank[currentPlayer] || { resources: {}, bevolking: 0 };

  function set(key, delta) {
    updatePlayer(currentPlayer, (prev) => ({
      ...prev,
      resources: { ...prev.resources, [key]: Math.max(0, (prev.resources[key] || 0) + delta) },
    }));
  }

  function setBev(delta) {
    updatePlayer(currentPlayer, (prev) => ({
      ...prev,
      bevolking: Math.max(0, (prev.bevolking || 0) + delta),
    }));
  }

  const zielen = p.bevolking || 0;
  const voedselNodig = Math.ceil(zielen / 3);
  const voedselAanwezig = (p.resources?.graan || 0) + (p.resources?.vis || 0);

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>🏦 Bank / Resource Tracker</h2>
      <div className="player-tabs">
        {[0,1,2,3].map(i => (
          <button
            key={i}
            className={`player-tab ${currentPlayer === i ? 'active' : ''}`}
            style={{ color: PLAYER_COLORS[i] }}
            onClick={() => setCurrentPlayer(i)}
          >{PLAYER_NAMES[i]}</button>
        ))}
      </div>

      {active.map(r => (
        <div key={r.id} className="resource-row">
          <span className="icon">{r.icon}</span>
          <span className="name">{r.name}</span>
          <button className="plusminus" onClick={() => set(r.id, -1)}>−</button>
          <span className="value">{p.resources?.[r.id] || 0}</span>
          <button className="plusminus" onClick={() => set(r.id, 1)}>+</button>
        </div>
      ))}

      <div className="resource-row" style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 12 }}>
        <span className="icon">👥</span>
        <span className="name">Bevolking (zielen)</span>
        <button className="plusminus" onClick={() => setBev(-1)}>−</button>
        <span className="value">{zielen}</span>
        <button className="plusminus" onClick={() => setBev(1)}>+</button>
      </div>

      {config.voedsel && (
        <div className="mt">
          <p className="small">
            🍞 Je hebt <b>{zielen} zielen</b>, dus <b>{voedselNodig} voedsel</b> nodig per seizoenswisseling.
            {' '}
            <span style={{ color: voedselAanwezig >= voedselNodig ? 'var(--green)' : 'var(--red)' }}>
              Je hebt {voedselAanwezig} (graan+vis).
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export { PLAYER_COLORS, PLAYER_NAMES };
