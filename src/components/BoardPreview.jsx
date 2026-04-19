import { useMemo, useState } from 'react';

// Map print item IDs to logical hex types + display color + emoji
const HEX_TYPES = {
  land_hex: [
    { type: 'bos', color: '#2d5a2d', emoji: '🌲', count: 2 },
    { type: 'heuvels', color: '#c2622c', emoji: '🧱', count: 1 },
    { type: 'bergen', color: '#6b6b6b', emoji: '⛰️', count: 1 },
    { type: 'akkers', color: '#e0b93a', emoji: '🌾', count: 1 },
    { type: 'weiden', color: '#7bb33a', emoji: '🐑', count: 1 },
    { type: 'woestijn', color: '#caa86a', emoji: '🏜️', count: 1 },
  ],
  extra_land: [
    { type: 'bos', color: '#2d5a2d', emoji: '🌲', count: 3 },
    { type: 'heuvels', color: '#c2622c', emoji: '🧱', count: 2 },
    { type: 'bergen', color: '#6b6b6b', emoji: '⛰️', count: 2 },
    { type: 'akkers', color: '#e0b93a', emoji: '🌾', count: 3 },
    { type: 'weiden', color: '#7bb33a', emoji: '🐑', count: 2 },
  ],
  jungle_hex: [{ type: 'jungle', color: '#1e4a1e', emoji: '🌴' }],
  koraal_hex: [{ type: 'koraal', color: '#2a7099', emoji: '🐟' }],
  vulkaan_hex: [{ type: 'vulkaan', color: '#4a1212', emoji: '🌋' }],
  ruine_hex: [{ type: 'ruine', color: '#5a4a3a', emoji: '🏛️' }],
  maalstroom_hex: [{ type: 'maalstroom', color: '#1a3a5a', emoji: '🌀' }],
  piraat_hex: [{ type: 'piraat', color: '#2a1a1a', emoji: '🏴\u200d☠️' }],
  drakenei_hex: [{ type: 'drakenei', color: '#3a1a3a', emoji: '🥚' }],
  handelspost_hex: [{ type: 'handelspost', color: '#8a6a2a', emoji: '⚓' }],
  goudmijn_hex: [{ type: 'goudmijn', color: '#8a6a1a', emoji: '💰' }],
  goudrivier_hex: [{ type: 'goudrivier', color: '#d4a02a', emoji: '✨' }],
  water_hex: [{ type: 'water', color: '#2a5a8a', emoji: '🌊' }],
  open_zee: [{ type: 'water', color: '#2a5a8a', emoji: '🌊' }],
};

function countOf(printed, id) {
  const v = printed[id];
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? Infinity : 0;
  return 0;
}

// Simple seeded shuffle for deterministic-ish randomness per click
function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Axial hex rings. Ring 0 = center. Ring r has 6r hexes.
function hexRing(radius) {
  if (radius === 0) return [[0, 0]];
  const results = [];
  let x = -radius, y = radius;
  const dirs = [[1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1]];
  for (const [dx, dy] of dirs) {
    for (let i = 0; i < radius; i++) {
      results.push([x, y]);
      x += dx; y += dy;
    }
  }
  return results;
}

function axialToPixel(q, r, size) {
  const x = size * Math.sqrt(3) * (q + r / 2);
  const y = size * 1.5 * r;
  return [x, y];
}

export default function BoardPreview({ activeItems, printed }) {
  const [seed, setSeed] = useState(() => Date.now() % 1000);

  const { landPool, waterPool, plates } = useMemo(() => {
    const landPool = [];
    const waterPool = [];
    activeItems.forEach(it => {
      if (it.size !== 'hex') return;
      if (it.id === 'basis_land' || it.id === 'basis_water') return; // base plates aren't board tiles
      const have = Math.min(countOf(printed, it.id), it.qty);
      if (have <= 0) return;
      const mapping = HEX_TYPES[it.id];
      if (!mapping) {
        // Unknown hex item (user-added custom) → treat as land
        for (let i = 0; i < have; i++) {
          landPool.push({ type: 'custom', color: '#555', emoji: '❓', label: it.name });
        }
        return;
      }
      // Distribute count proportionally across mapped types
      const totalMappingCount = mapping.reduce((s, m) => s + (m.count || 1), 0);
      mapping.forEach(m => {
        const share = Math.round(have * (m.count || 1) / totalMappingCount);
        for (let i = 0; i < share; i++) {
          const hex = { ...m, label: it.name };
          if (it.id === 'water_hex' || it.id === 'open_zee' || it.id === 'koraal_hex' || it.id === 'maalstroom_hex') {
            waterPool.push(hex);
          } else {
            landPool.push(hex);
          }
        }
      });
    });

    const plates = {
      land: countOf(printed, 'basis_land'),
      water: countOf(printed, 'basis_water'),
    };
    return { landPool, waterPool, plates };
  }, [activeItems, printed, seed]);

  const totalTiles = landPool.length + waterPool.length;

  const hexes = useMemo(() => {
    if (totalTiles === 0) return [];
    const shuffledLand = seededShuffle(landPool, seed);
    const shuffledWater = seededShuffle(waterPool, seed + 1);

    const result = [];
    // Place 1 land in center, then expanding rings — prefer land first inside, water outside
    let landIdx = 0, waterIdx = 0;
    for (let r = 0; r < 6 && result.length < totalTiles; r++) {
      const ring = hexRing(r);
      for (const [q, rr] of ring) {
        if (result.length >= totalTiles) break;
        const radius = Math.max(Math.abs(q), Math.abs(rr), Math.abs(q + rr));
        let hex;
        if (radius <= 1 && landIdx < shuffledLand.length) {
          hex = shuffledLand[landIdx++];
        } else if (radius === 2 && landIdx < shuffledLand.length) {
          hex = shuffledLand[landIdx++];
        } else if (waterIdx < shuffledWater.length) {
          hex = shuffledWater[waterIdx++];
        } else if (landIdx < shuffledLand.length) {
          hex = shuffledLand[landIdx++];
        } else {
          break;
        }
        result.push({ q, r: rr, ...hex });
      }
    }
    return result;
  }, [landPool, waterPool, seed, totalTiles]);

  const size = 28;
  const bounds = useMemo(() => {
    if (hexes.length === 0) return { minX: -50, minY: -50, maxX: 50, maxY: 50 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    hexes.forEach(h => {
      const [x, y] = axialToPixel(h.q, h.r, size);
      minX = Math.min(minX, x - size);
      maxX = Math.max(maxX, x + size);
      minY = Math.min(minY, y - size);
      maxY = Math.max(maxY, y + size);
    });
    return { minX, minY, maxX, maxY };
  }, [hexes]);

  const padding = 10;
  const viewBox = `${bounds.minX - padding} ${bounds.minY - padding} ${bounds.maxX - bounds.minX + 2 * padding} ${bounds.maxY - bounds.minY + 2 * padding}`;

  if (totalTiles === 0) {
    return (
      <div>
        <p className="muted">Geen hex-tegels geprint. Zet bij de printlijst het aantal hoger voor minimaal de land- of watertegels om hier een bord te zien.</p>
      </div>
    );
  }

  const plateWarning = [];
  if (plates.land < landPool.length) plateWarning.push(`${landPool.length - plates.land} land-basisplaten tekort`);
  if (plates.water < waterPool.length) plateWarning.push(`${waterPool.length - plates.water} water-basisplaten tekort`);

  return (
    <div>
      <div className="row between mb">
        <div className="small muted">
          {landPool.length} land · {waterPool.length} water · {totalTiles} totaal
        </div>
        <button className="btn-secondary" onClick={() => setSeed(s => s + 1)}
          style={{ padding: '6px 12px', fontSize: 12 }}>🎲 Shuffle</button>
      </div>

      <div style={{ background: '#0a1420', borderRadius: 8, padding: 8, overflow: 'auto' }}>
        <svg viewBox={viewBox} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {hexes.map((h, i) => {
            const [x, y] = axialToPixel(h.q, h.r, size);
            const points = Array.from({ length: 6 }, (_, k) => {
              const a = (Math.PI / 3) * k + Math.PI / 6;
              return `${x + size * Math.cos(a)},${y + size * Math.sin(a)}`;
            }).join(' ');
            return (
              <g key={i}>
                <polygon points={points} fill={h.color} stroke="#0d1117" strokeWidth="1.5" />
                <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fill="#fff">{h.emoji}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {plateWarning.length > 0 && (
        <p className="small mt" style={{ color: 'var(--orange)' }}>
          ⚠️ {plateWarning.join(' · ')}
        </p>
      )}
      <p className="tiny muted mt">
        Placeholder-preview: hexen worden willekeurig gerangschikt. Tik 🎲 om te shuffelen.
      </p>
    </div>
  );
}
