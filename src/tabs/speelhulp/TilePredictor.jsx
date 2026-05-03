import { useState } from 'react';
import { renderHex } from '../../components/HexTile.jsx';
import { usePrintableQty } from '../../utils/printableQty.js';
import { useYTileDraws } from '../../utils/useYjs.js';
import { NEIGHBOR_OPTIONS, predictTile, summary, buildPool } from '../../utils/tilePredictor.js';

export default function TilePredictor({ config }) {
  const qty = usePrintableQty();
  const [draws, drawActions] = useYTileDraws();
  const [neighbors, setNeighbors] = useState([]);
  const [result, setResult] = useState(null);

  const { land, water, total } = summary(qty, draws, config);
  const pool = buildPool(qty, draws, config);

  function toggleNeighbor(id) {
    const idx = neighbors.indexOf(id);
    if (idx >= 0) setNeighbors(neighbors.filter((_, i) => i !== idx));
    else if (neighbors.length < 6) setNeighbors([...neighbors, id]);
  }

  function addCount(id) {
    if (neighbors.length < 6) setNeighbors([...neighbors, id]);
  }

  function trek() {
    const t = predictTile(qty, draws, config, neighbors);
    if (!t) return;
    setResult(t);
    drawActions.draw(t.id);
  }

  function undo() {
    if (!result) return;
    drawActions.undo(result.id);
    setResult(null);
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>🧭 Trek volgende tegel</h2>
      <p className="small muted">
        Selecteer wat er rond je positie ligt — de kans op de volgende tegel past zich aan op realistische geo-logica
        (rif → kust dichtbij, maalstroom → diepe zee, etc.).
      </p>

      <div className="row between mt mb">
        <span className="small muted">Pool: <b style={{ color: 'var(--gold)' }}>{total}</b> tegels • {land} land • {water} water</span>
        <button className="btn-secondary" onClick={drawActions.reset}
          style={{ padding: '4px 10px', fontSize: 11 }}>↺ Reset pool</button>
      </div>

      <h3>Aangrenzende tegels (max 6)</h3>
      <div className="row wrap" style={{ gap: 6 }}>
        {NEIGHBOR_OPTIONS.map(n => {
          const count = neighbors.filter(x => x === n.id).length;
          return (
            <button
              key={n.id}
              onClick={() => addCount(n.id)}
              className={count > 0 ? 'btn' : 'btn-secondary'}
              style={{ padding: '6px 10px', fontSize: 12 }}
            >
              {n.emoji} {n.label}{count > 0 ? ` ×${count}` : ''}
            </button>
          );
        })}
      </div>
      {neighbors.length > 0 && (
        <button onClick={() => setNeighbors([])}
          className="btn-secondary mt" style={{ fontSize: 11 }}>✕ Wis selectie</button>
      )}

      <div className="mt-l">
        <button className="btn" onClick={trek} disabled={total === 0}
          style={{ width: '100%', padding: 14, fontSize: 16 }}>
          🎴 Trek tegel
        </button>
      </div>

      {result && (
        <div className="card mt" style={{ background: '#1a1a25', textAlign: 'center', padding: 20 }}>
          <p className="small muted">De volgende tegel is:</p>
          <svg viewBox="-50 -50 100 100" style={{ width: 120, height: 120, display: 'block', margin: '0 auto' }}>
            {renderHex(result.sub, 0, 0, 40, 'preview')}
          </svg>
          <h2 style={{ color: 'var(--gold)', textTransform: 'capitalize', margin: '8px 0' }}>{result.sub}</h2>
          <p className="small muted">Pak deze tegel uit je voorraad en plaats hem op de gekozen positie.</p>
          <button onClick={undo} className="btn-secondary mt"
            style={{ fontSize: 12 }}>↺ Herstel — niet getrokken</button>
        </div>
      )}

      <details className="mt-l" style={{ fontSize: 12 }}>
        <summary style={{ cursor: 'pointer', color: 'var(--muted)' }}>Pool-detail per type</summary>
        <table className="mt">
          <tbody>
            {pool.map(t => (
              <tr key={t.id}>
                <td>{t.sub}</td>
                <td style={{ textAlign: 'right' }}>{t.remaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
