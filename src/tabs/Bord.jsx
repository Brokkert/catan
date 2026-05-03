import { useMemo, useState } from 'react';
import HexBoard, { axialToPixel, renderHex } from '../components/HexTile.jsx';
import { useYBoard, useYParams, useYTileDraws, useYDrawHistory } from '../utils/useYjs.js';
import { usePrintableQty } from '../utils/printableQty.js';
import { predictTile } from '../utils/tilePredictor.js';

const NEIGHBOR_DIRS = [
  [1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1],
];

function neighborsOf(q, r) {
  return NEIGHBOR_DIRS.map(([dq, dr]) => [q + dq, r + dr]);
}

// Standard Catan starting island as random tile mix + center desert/volcano
function seedHoofdeiland(cfg, params, mainSeed) {
  const center = cfg.vulkaan ? 'vulkaan' : 'woestijn';
  const pool = ['bos', 'bos', 'bos', 'bos', 'akkers', 'akkers', 'akkers', 'akkers',
                'weiden', 'weiden', 'weiden', 'weiden', 'heuvels', 'heuvels', 'heuvels',
                'bergen', 'bergen', 'bergen'];
  let s = mainSeed;
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const ring = [[1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1]];
  const nums = [11, 6, 8, 4, 3, 9];
  const tiles = [{ q: 0, r: 0, type: center }];
  ring.forEach(([q, r], i) => tiles.push({ q, r, type: arr[i], number: nums[i] }));
  return tiles;
}

function defaultWaterRing() {
  return [
    [2, -2], [2, -1], [2, 0], [1, 1], [0, 2], [-1, 2],
    [-2, 2], [-2, 1], [-2, 0], [-1, -1], [0, -2], [1, -2],
  ].map(([q, r]) => ({ q, r, type: 'water' }));
}

export default function Bord({ config }) {
  const qty = usePrintableQty();
  const [board, boardActions] = useYBoard();
  const [params] = useYParams();
  const [draws, drawActions] = useYTileDraws();
  const [history, historyActions] = useYDrawHistory();
  const [selected, setSelected] = useState(null);
  const [seedInput, setSeedInput] = useState(() => Math.floor(Math.random() * 10000));
  const [pendingDraw, setPendingDraw] = useState(null);

  const tiles = useMemo(() => Object.entries(board).map(([k, v]) => {
    const [q, r] = k.split(',').map(Number);
    return { q, r, ...v };
  }), [board]);

  const isInitialised = tiles.length > 0;

  // Find empty positions adjacent to existing tiles (where you can explore to)
  const drawableSpots = useMemo(() => {
    const occupied = new Set(Object.keys(board));
    const spots = new Set();
    tiles.forEach(t => {
      neighborsOf(t.q, t.r).forEach(([nq, nr]) => {
        const k = `${nq},${nr}`;
        if (!occupied.has(k)) spots.add(k);
      });
    });
    return [...spots].map(k => {
      const [q, r] = k.split(',').map(Number);
      return { q, r };
    });
  }, [board, tiles]);

  function initBoard() {
    const main = seedHoofdeiland(config, params, seedInput);
    const water = defaultWaterRing();
    [...main, ...water].forEach(t => {
      boardActions.setTile(t.q, t.r, { type: t.type, number: t.number });
    });
  }

  function resetBoard() {
    if (!confirm('Weet je zeker? Heel het bord wordt gewist.')) return;
    boardActions.reset();
    drawActions.reset();
    historyActions.reset();
  }

  function drawAt(q, r) {
    // Auto-detect neighbors for context
    const neighborTypes = neighborsOf(q, r)
      .map(([nq, nr]) => board[`${nq},${nr}`]?.type)
      .filter(Boolean);
    const t = predictTile(qty, draws, config, neighborTypes, history);
    if (!t) {
      alert('Geen tegels meer beschikbaar in de pool.');
      return;
    }
    setPendingDraw({ q, r, type: t.sub, kind: t.kind, itemId: t.id });
    setSelected(`${q},${r}`);
  }

  function confirmPlace() {
    if (!pendingDraw) return;
    boardActions.setTile(pendingDraw.q, pendingDraw.r, { type: pendingDraw.type });
    drawActions.draw(pendingDraw.itemId);
    historyActions.append({
      q: pendingDraw.q, r: pendingDraw.r,
      type: pendingDraw.type, ts: Date.now(),
    });
    setPendingDraw(null);
    setSelected(null);
  }

  function cancelDraw() {
    setPendingDraw(null);
    setSelected(null);
  }

  // Compute viewbox
  const allPoints = useMemo(() => {
    const pts = [...tiles, ...drawableSpots];
    if (pts.length === 0) return { vb: '-100 -100 200 200', size: 32 };
    const size = 32;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    pts.forEach(t => {
      const [x, y] = axialToPixel(t.q, t.r, size);
      minX = Math.min(minX, x - size);
      maxX = Math.max(maxX, x + size);
      minY = Math.min(minY, y - size);
      maxY = Math.max(maxY, y + size);
    });
    const pad = 12;
    return {
      vb: `${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`,
      size,
    };
  }, [tiles, drawableSpots]);

  if (!isInitialised) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>🗺️ Live bord</h2>
        <p>Het bord is nog leeg. Genereer een hoofdeiland + waterring om te beginnen — alle spelers zien dezelfde state via Supabase.</p>
        <div className="row mt" style={{ gap: 8, alignItems: 'center' }}>
          <span className="small muted">Shuffle-seed:</span>
          <input
            className="input"
            type="number"
            value={seedInput}
            onChange={e => setSeedInput(parseInt(e.target.value) || 1)}
            style={{ width: 110 }}
          />
          <button className="btn" onClick={initBoard}>🎲 Genereer bord</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="row between mb">
          <h2 style={{ margin: 0 }}>🗺️ Live bord</h2>
          <button className="btn-secondary" onClick={resetBoard}
            style={{ padding: '6px 12px', fontSize: 12 }}>↺ Wis bord</button>
        </div>
        <p className="small muted">
          Tap op een leeg vakje (gestippeld) om een nieuwe tegel te trekken — app berekent buurt automatisch.
          Tegels: <b>{tiles.length}</b> · Trekkingen: <b>{history.length}</b>
        </p>
      </div>

      <div className="card" style={{ background: 'radial-gradient(ellipse, #1a2a3a 0%, #070a10 100%)', padding: 6 }}>
        <svg viewBox={allPoints.vb} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}>
          {tiles.map((t, i) => {
            const [x, y] = axialToPixel(t.q, t.r, allPoints.size);
            return renderHex(t.type, x, y, allPoints.size, `t${i}`, t.number);
          })}
          {drawableSpots.map(s => {
            const [x, y] = axialToPixel(s.q, s.r, allPoints.size);
            const k = `${s.q},${s.r}`;
            const isSelected = selected === k;
            const points = Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI / 3) * i + Math.PI / 6;
              return `${x + allPoints.size * Math.cos(a)},${y + allPoints.size * Math.sin(a)}`;
            }).join(' ');
            return (
              <g key={k} onClick={() => drawAt(s.q, s.r)}>
                <polygon points={points}
                  fill={isSelected ? 'rgba(232,185,35,0.2)' : 'rgba(255,255,255,0.04)'}
                  stroke={isSelected ? 'var(--gold)' : '#888'}
                  strokeWidth={isSelected ? '2' : '1.2'}
                  strokeDasharray="3 3" />
                <text x={x} y={y + 5} textAnchor="middle" fontSize={allPoints.size * 0.5}
                  fill={isSelected ? 'var(--gold)' : '#666'}>+</text>
              </g>
            );
          })}
        </svg>
      </div>

      {pendingDraw && (
        <div className="card mt" style={{ background: '#1a1a25', textAlign: 'center' }}>
          <p className="small muted">Voorgestelde tegel voor positie ({pendingDraw.q},{pendingDraw.r}):</p>
          <svg viewBox="-50 -50 100 100" style={{ width: 100, height: 100, display: 'block', margin: '0 auto' }}>
            {renderHex(pendingDraw.type, 0, 0, 40, 'preview')}
          </svg>
          <h2 style={{ color: 'var(--gold)', textTransform: 'capitalize', margin: '8px 0' }}>{pendingDraw.type}</h2>
          <div className="row" style={{ gap: 8, justifyContent: 'center' }}>
            <button className="btn" onClick={confirmPlace}>✓ Plaats</button>
            <button className="btn-secondary" onClick={cancelDraw}>✕ Annuleer</button>
          </div>
        </div>
      )}
    </div>
  );
}
