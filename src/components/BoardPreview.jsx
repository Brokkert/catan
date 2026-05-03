import { useMemo, useState } from 'react';

// Tile types with display color, gradient shade, emoji, and whether it produces (gets number token)
const HEX_TYPES = {
  bos_hex: [{ type: 'bos', color: '#2d5a2d', shade: '#1a3a1a', emoji: '🌲', produces: true }],
  akkers_hex: [{ type: 'akkers', color: '#e0b93a', shade: '#9c7d1a', emoji: '🌾', produces: true }],
  weiden_hex: [{ type: 'weiden', color: '#7bb33a', shade: '#4c7822', emoji: '🐑', produces: true }],
  heuvels_hex: [{ type: 'heuvels', color: '#c2622c', shade: '#7a3d18', emoji: '🧱', produces: true }],
  bergen_hex: [{ type: 'bergen', color: '#6b6b6b', shade: '#3d3d3d', emoji: '⛰️', produces: true }],
  woestijn_hex: [{ type: 'woestijn', color: '#caa86a', shade: '#8a6f3a', emoji: '🏜️', produces: false }],
  jungle_hex: [{ type: 'jungle', color: '#1e4a1e', shade: '#0c2d0c', emoji: '🌴', produces: true }],
  koraal_hex: [{ type: 'koraal', color: '#2a7099', shade: '#174a6a', emoji: '🐟', produces: true, water: true }],
  vulkaan_hex: [{ type: 'vulkaan', color: '#4a1212', shade: '#2a0505', emoji: '🌋', produces: false, isVolcano: true }],
  ruine_hex: [{ type: 'ruine', color: '#5a4a3a', shade: '#2f251c', emoji: '🏛️', produces: false }],
  maalstroom_hex: [{ type: 'draaikolk', color: '#1a3a5a', shade: '#0a1f35', emoji: '🌀', produces: false, water: true }],
  rif_hex: [{ type: 'rif', color: '#355a75', shade: '#1a3a55', emoji: '🪨', produces: false, water: true }],
  piraat_hex: [{ type: 'piraat', color: '#2a1a1a', shade: '#110808', emoji: '🏴\u200d☠️', produces: false }],
  drakenei_hex: [{ type: 'drakenei', color: '#3a1a3a', shade: '#1f0a1f', emoji: '🥚', produces: false }],
  handelspost_hex: [{ type: 'handelspost', color: '#8a6a2a', shade: '#5a4015', emoji: '⚓', produces: false }],
  goudmijn_hex: [{ type: 'goudmijn', color: '#8a6a1a', shade: '#5a4010', emoji: '💰', produces: true }],
  goudrivier_hex: [{ type: 'goudrivier', color: '#d4a02a', shade: '#9c7010', emoji: '✨', produces: true }],
  water_hex: [{ type: 'water', color: '#2a5a8a', shade: '#174068', emoji: '', produces: false, water: true }],
};

const NUMBER_POOL = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
const PLAYER_COLORS = ['#d33', '#4a4', '#38b', '#e8b923'];

function countOf(printed, id) {
  const v = printed[id];
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? Infinity : 0;
  return 0;
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function seededShuffle(arr, seed) {
  const rand = seededRandom(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

function hexCorner(cx, cy, size, i) {
  const a = (Math.PI / 3) * i + Math.PI / 6;
  return [cx + size * Math.cos(a), cy + size * Math.sin(a)];
}

function roundKey(x, y) {
  return `${Math.round(x * 10)},${Math.round(y * 10)}`;
}

export default function BoardPreview({ activeItems, printed }) {
  const [seed, setSeed] = useState(() => Date.now() % 10000);

  const {
    landPool, waterPool, plates, figures,
  } = useMemo(() => {
    const landPool = [];
    const waterPool = [];
    activeItems.forEach(it => {
      if (it.size !== 'hex') return;
      if (it.id === 'basis_land' || it.id === 'basis_water') return;
      const have = Math.min(countOf(printed, it.id), it.qty);
      if (have <= 0) return;
      const mapping = HEX_TYPES[it.id];
      if (!mapping) {
        for (let i = 0; i < have; i++) {
          landPool.push({ type: 'custom', color: '#555', shade: '#333', emoji: '❓', label: it.name });
        }
        return;
      }
      const totalMappingCount = mapping.reduce((s, m) => s + (m.count || 1), 0);
      mapping.forEach(m => {
        const share = Math.round(have * (m.count || 1) / totalMappingCount);
        for (let i = 0; i < share; i++) {
          const hex = { ...m, label: it.name };
          if (m.water) waterPool.push(hex);
          else landPool.push(hex);
        }
      });
    });

    const plates = {
      land: countOf(printed, 'basis_land'),
      water: countOf(printed, 'basis_water'),
    };

    // If user has basisplaten printed, first N tiles get a plate; overflow
    // renders loose (no rim) so it's visible that a plate is missing.
    // If no plates yet, tiles are shown loose.
    const markPlate = (arr, plateCount) => {
      arr.forEach((t, i) => { t.hasPlate = plateCount === 0 ? null : i < plateCount; });
    };
    markPlate(landPool, plates.land);
    markPlate(waterPool, plates.water);

    let overflowLand = Math.max(0, landPool.length - plates.land);
    let overflowWater = Math.max(0, waterPool.length - plates.water);
    if (plates.land === 0) overflowLand = 0;
    if (plates.water === 0) overflowWater = 0;

    // Pad with empty plates if more plates than tiles
    const emptyLand = Math.max(0, plates.land - landPool.length);
    const emptyWater = Math.max(0, plates.water - waterPool.length);
    for (let i = 0; i < emptyLand; i++) {
      landPool.push({ type: 'empty-land', color: 'transparent', shade: 'transparent', emoji: '', empty: true, hasPlate: true });
    }
    for (let i = 0; i < emptyWater; i++) {
      waterPool.push({ type: 'empty-water', color: 'transparent', shade: 'transparent', emoji: '', empty: true, water: true, hasPlate: true });
    }
    plates.overflowLand = overflowLand;
    plates.overflowWater = overflowWater;

    const figures = {
      rover: countOf(printed, 'rover') > 0,
      piraat: countOf(printed, 'piraat_schip') > 0,
      draak: countOf(printed, 'draak_fig') > 0,
      dorpen: countOf(printed, 'dorpen'),         // per player × 4
      steden: countOf(printed, 'steden'),
      wegen: countOf(printed, 'wegen'),
      handelsschip: countOf(printed, 'handelsschip_fig'),
      oorlogsschip: countOf(printed, 'oorlogsschip_fig'),
      vissersboot: countOf(printed, 'vissersboot_fig'),
      vuurtoren: countOf(printed, 'vuurtoren_fig'),
      havens: countOf(printed, 'havens'),
      monsters: countOf(printed, 'wilde_beesten') + countOf(printed, 'stenen_golems') + countOf(printed, 'zeemonsters'),
      nummers: countOf(printed, 'nummer_tokens'),
    };

    return { landPool, waterPool, plates, figures };
  }, [activeItems, printed]);

  const totalTiles = landPool.length + waterPool.length;

  const board = useMemo(() => {
    if (totalTiles === 0) return null;
    const rand = seededRandom(seed);
    const shuffledLand = seededShuffle(landPool, seed);
    const shuffledWater = seededShuffle(waterPool, seed + 1);

    // Place land first (inner rings), then water (outer rings)
    const hexes = [];
    let landIdx = 0, waterIdx = 0;
    for (let r = 0; r < 6 && hexes.length < totalTiles; r++) {
      const ring = hexRing(r);
      for (const [q, rr] of ring) {
        if (hexes.length >= totalTiles) break;
        let hex;
        if (landIdx < shuffledLand.length) {
          hex = shuffledLand[landIdx++];
        } else if (waterIdx < shuffledWater.length) {
          hex = shuffledWater[waterIdx++];
        } else break;
        hexes.push({ q, r: rr, ...hex });
      }
    }

    // Assign number tokens to productive tiles
    const numbers = seededShuffle(NUMBER_POOL, seed + 2);
    let nIdx = 0;
    hexes.forEach(h => {
      if (h.produces && nIdx < numbers.length && figures.nummers > 0) {
        h.number = numbers[nIdx++];
      }
    });

    // Place rover on first volcano, else first desert
    let roverHex = hexes.find(h => h.isVolcano) || hexes.find(h => h.type === 'woestijn');
    if (!roverHex || !figures.rover) roverHex = null;

    // Place piraat on an outer water tile
    let piraatHex = null;
    if (figures.piraat) {
      const waters = hexes.filter(h => h.water && !h.empty);
      if (waters.length) piraatHex = waters[Math.floor(rand() * waters.length)];
    }

    // Place draak on volcano
    let draakHex = null;
    if (figures.draak) {
      draakHex = hexes.find(h => h.isVolcano);
    }

    // Compute corners (for settlements) and edges (for roads)
    const size = 30;
    const cornerMap = new Map(); // key -> { x, y, hexes: [h] }
    const edgeMap = new Map();   // key -> { x1, y1, x2, y2, hexes: [h] }
    hexes.forEach(h => {
      const [cx, cy] = axialToPixel(h.q, h.r, size);
      const corners = [];
      for (let i = 0; i < 6; i++) corners.push(hexCorner(cx, cy, size, i));
      corners.forEach((c, i) => {
        const k = roundKey(c[0], c[1]);
        if (!cornerMap.has(k)) cornerMap.set(k, { x: c[0], y: c[1], hexes: [] });
        cornerMap.get(k).hexes.push(h);
        const next = corners[(i + 1) % 6];
        const ek1 = roundKey(c[0], c[1]) + '|' + roundKey(next[0], next[1]);
        const ek2 = roundKey(next[0], next[1]) + '|' + roundKey(c[0], c[1]);
        const ek = ek1 < ek2 ? ek1 : ek2;
        if (!edgeMap.has(ek)) edgeMap.set(ek, { x1: c[0], y1: c[1], x2: next[0], y2: next[1], hexes: [] });
        edgeMap.get(ek).hexes.push(h);
      });
    });

    // Settlements/cities at land corners. Use total printed across players.
    const settlementsAvail = Math.min(figures.dorpen, 20);
    const citiesAvail = Math.min(figures.steden, 12);
    const landCorners = [...cornerMap.values()].filter(c =>
      c.hexes.some(h => !h.water && !h.empty)
    );
    const shuffledCorners = seededShuffle(landCorners, seed + 3);
    const settlements = [];
    for (let i = 0; i < settlementsAvail && i < shuffledCorners.length; i++) {
      settlements.push({ ...shuffledCorners[i], player: i % 4 });
    }
    const cities = [];
    for (let i = 0; i < citiesAvail && i + settlements.length < shuffledCorners.length; i++) {
      cities.push({ ...shuffledCorners[settlementsAvail + i], player: i % 4 });
    }

    // Roads: on edges adjacent to settlements first, then random
    const roadsAvail = Math.min(figures.wegen, 30);
    const landEdges = [...edgeMap.values()].filter(e =>
      e.hexes.some(h => !h.water && !h.empty)
    );
    const shuffledEdges = seededShuffle(landEdges, seed + 4);
    const roads = [];
    for (let i = 0; i < roadsAvail && i < shuffledEdges.length; i++) {
      roads.push({ ...shuffledEdges[i], player: i % 4 });
    }

    // Ships on water edges
    const shipsAvail = Math.min(
      figures.handelsschip + figures.oorlogsschip + figures.vissersboot,
      24
    );
    const waterEdges = [...edgeMap.values()].filter(e =>
      e.hexes.every(h => h.water || h.empty)
    );
    const shuffledWaterEdges = seededShuffle(waterEdges, seed + 5);
    const ships = [];
    for (let i = 0; i < shipsAvail && i < shuffledWaterEdges.length; i++) {
      ships.push({ ...shuffledWaterEdges[i], player: i % 4 });
    }

    // Harbors on coast edges (land-water boundary)
    const harborsAvail = Math.min(figures.havens, 9);
    const coastEdges = [...edgeMap.values()].filter(e => {
      const hasLand = e.hexes.some(h => !h.water && !h.empty);
      const hasWater = e.hexes.some(h => h.water || h.empty);
      return hasLand && hasWater;
    });
    const shuffledCoastEdges = seededShuffle(coastEdges, seed + 6);
    const harbors = [];
    for (let i = 0; i < harborsAvail && i < shuffledCoastEdges.length; i++) {
      harbors.push(shuffledCoastEdges[i]);
    }

    // Vuurtoren on coast corner (land-water)
    let vuurtorenCorner = null;
    if (figures.vuurtoren > 0) {
      const coastCorners = [...cornerMap.values()].filter(c => {
        const hasLand = c.hexes.some(h => !h.water && !h.empty);
        const hasWater = c.hexes.some(h => h.water || h.empty);
        return hasLand && hasWater;
      });
      if (coastCorners.length) vuurtorenCorner = coastCorners[Math.floor(rand() * coastCorners.length)];
    }

    return { hexes, size, roverHex, piraatHex, draakHex, settlements, cities, roads, ships, harbors, vuurtorenCorner };
  }, [landPool, waterPool, seed, totalTiles, figures]);

  if (!board) {
    return (
      <div>
        <p className="muted">Geen tegels of basisplaten geprint. Zet bij 🗺️ Tegels het aantal hoger om hier iets te zien.</p>
      </div>
    );
  }

  const { hexes, size, roverHex, piraatHex, draakHex, settlements, cities, roads, ships, harbors, vuurtorenCorner } = board;

  const bounds = (() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    hexes.forEach(h => {
      const [x, y] = axialToPixel(h.q, h.r, size);
      minX = Math.min(minX, x - size);
      maxX = Math.max(maxX, x + size);
      minY = Math.min(minY, y - size);
      maxY = Math.max(maxY, y + size);
    });
    return { minX, minY, maxX, maxY };
  })();

  const padding = 14;
  const viewBox = `${bounds.minX - padding} ${bounds.minY - padding} ${bounds.maxX - bounds.minX + 2 * padding} ${bounds.maxY - bounds.minY + 2 * padding}`;

  const realLand = hexes.filter(h => !h.water && !h.empty).length;
  const realWater = hexes.filter(h => h.water && !h.empty).length;
  const emptyLand = hexes.filter(h => h.empty && !h.water).length;
  const emptyWater = hexes.filter(h => h.empty && h.water).length;

  return (
    <div>
      <div className="row between mb">
        <div className="small muted">
          Land: {realLand}{emptyLand > 0 ? ` (+${emptyLand})` : ''}
          {' · '}
          Water: {realWater}{emptyWater > 0 ? ` (+${emptyWater})` : ''}
        </div>
        <button
          className="btn"
          onClick={() => setSeed(Math.floor(Math.random() * 1_000_000))}
          style={{ padding: '8px 14px', fontSize: 14 }}
        >🎲 Schud</button>
      </div>

      {(plates.overflowLand > 0 || plates.overflowWater > 0) && (
        <p className="small mb" style={{ color: 'var(--orange)' }}>
          ⚠️ Tekort basisplaten:{' '}
          {plates.overflowLand > 0 && `${plates.overflowLand} land-tegels passen niet`}
          {plates.overflowLand > 0 && plates.overflowWater > 0 && ' · '}
          {plates.overflowWater > 0 && `${plates.overflowWater} water-tegels passen niet`}
        </p>
      )}

      <div style={{ background: 'radial-gradient(ellipse, #1a2a3a 0%, #070a10 100%)', borderRadius: 10, padding: 6, overflow: 'auto' }}>
        <svg viewBox={viewBox} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <filter id="hexshadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" />
              <feOffset dx="0" dy="1" result="offsetblur" />
              <feComponentTransfer><feFuncA type="linear" slope="0.6" /></feComponentTransfer>
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {hexes.map((h, i) => (
              <radialGradient key={i} id={`g${i}`} cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor={h.color} />
                <stop offset="100%" stopColor={h.shade} />
              </radialGradient>
            ))}
          </defs>

          {/* Tiles */}
          {hexes.map((h, i) => {
            const [x, y] = axialToPixel(h.q, h.r, size);
            const points = Array.from({ length: 6 }, (_, k) => {
              const a = (Math.PI / 3) * k + Math.PI / 6;
              return `${x + size * Math.cos(a)},${y + size * Math.sin(a)}`;
            }).join(' ');
            const rimWidth = 10;
            const innerPoints = Array.from({ length: 6 }, (_, k) => {
              const a = (Math.PI / 3) * k + Math.PI / 6;
              return `${x + (size - rimWidth) * Math.cos(a)},${y + (size - rimWidth) * Math.sin(a)}`;
            }).join(' ');
            const rimHighlight = Array.from({ length: 6 }, (_, k) => {
              const a = (Math.PI / 3) * k + Math.PI / 6;
              return `${x + (size - 2) * Math.cos(a)},${y + (size - 2) * Math.sin(a)}`;
            }).join(' ');
            const rimMidline = Array.from({ length: 6 }, (_, k) => {
              const a = (Math.PI / 3) * k + Math.PI / 6;
              return `${x + (size - 5) * Math.cos(a)},${y + (size - 5) * Math.sin(a)}`;
            }).join(' ');
            if (h.empty) {
              const plateColor = h.water ? '#0c1a2a' : '#1a130a';
              const plateHi = h.water ? '#3a6a8a' : '#6a5530';
              const plateMid = h.water ? '#1a3048' : '#2a2010';
              return (
                <g key={i} filter="url(#hexshadow)">
                  <polygon points={points} fill={plateColor} stroke="#000" strokeWidth="1.5" />
                  <polygon points={rimMidline} fill="none" stroke={plateMid} strokeWidth="2.5" />
                  <polygon points={rimHighlight} fill="none" stroke={plateHi} strokeWidth="1.2" />
                  <polygon points={innerPoints} fill="#000" opacity="0.7" />
                </g>
              );
            }
            if (h.hasPlate === false) {
              // Overflow tile — no plate, render without rim with dashed warning border
              return (
                <g key={i}>
                  <polygon points={innerPoints} fill={`url(#g${i})`} opacity="0.7" />
                  <polygon points={points} fill="transparent" stroke="#e8892b" strokeWidth="1.5" strokeDasharray="2 2" />
                  {h.emoji && <text x={x} y={y + 5} textAnchor="middle" fontSize="14" opacity="0.8">{h.emoji}</text>}
                  <text x={x} y={y + size - 4} textAnchor="middle" fontSize="5" fill="#e8892b" fontWeight="700">geen plaat</text>
                </g>
              );
            }
            const plateColor = h.water ? '#0c1a2a' : '#1a130a';
            const plateHi = h.water ? '#3a6a8a' : '#5a4522';
            const plateMid = h.water ? '#1a3048' : '#2a2010';
            return (
              <g key={i} filter="url(#hexshadow)">
                {/* outer rim bottom edge (dark) */}
                <polygon points={points} fill={plateColor} stroke="#000" strokeWidth="1.5" />
                {/* rim body (mid tone) */}
                <polygon points={rimMidline} fill="none" stroke={plateMid} strokeWidth="2.5" />
                {/* rim top highlight (lit edge) */}
                <polygon points={rimHighlight} fill="none" stroke={plateHi} strokeWidth="1.2" />
                {/* inset socket shadow */}
                <polygon points={innerPoints} fill="#000" opacity="0.65" />
                {/* actual tile surface */}
                <polygon points={innerPoints} fill={`url(#g${i})`} stroke={h.shade} strokeWidth="0.7" />
                {h.emoji && <text x={x} y={y + 5} textAnchor="middle" fontSize="14" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }}>{h.emoji}</text>}
              </g>
            );
          })}

          {/* Number tokens */}
          {hexes.map((h, i) => {
            if (!h.number) return null;
            const [x, y] = axialToPixel(h.q, h.r, size);
            const isRed = h.number === 6 || h.number === 8;
            return (
              <g key={`n${i}`} transform={`translate(${x}, ${y + 10})`}>
                <circle r="7" fill="#f0e6d2" stroke="#8a6a3a" strokeWidth="0.7" />
                <text y="3" textAnchor="middle" fontSize="9" fontWeight="700"
                  fill={isRed ? '#c22' : '#222'}>{h.number}</text>
              </g>
            );
          })}

          {/* Harbors */}
          {harbors.map((h, i) => {
            const mx = (h.x1 + h.x2) / 2;
            const my = (h.y1 + h.y2) / 2;
            return (
              <g key={`hv${i}`} transform={`translate(${mx}, ${my})`}>
                <circle r="4.5" fill="#8a5a2a" stroke="#3a2a10" strokeWidth="0.7" />
                <text y="2" textAnchor="middle" fontSize="6" fill="#fff">⚓</text>
              </g>
            );
          })}

          {/* Roads */}
          {roads.map((r, i) => (
            <line key={`r${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke={PLAYER_COLORS[r.player]} strokeWidth="3" strokeLinecap="round" />
          ))}

          {/* Ships */}
          {ships.map((s, i) => {
            const mx = (s.x1 + s.x2) / 2;
            const my = (s.y1 + s.y2) / 2;
            return (
              <g key={`s${i}`} transform={`translate(${mx}, ${my})`}>
                <circle r="3.5" fill={PLAYER_COLORS[s.player]} stroke="#000" strokeWidth="0.5" />
                <text y="1.5" textAnchor="middle" fontSize="4.5">⛵</text>
              </g>
            );
          })}

          {/* Settlements */}
          {settlements.map((s, i) => (
            <g key={`st${i}`} transform={`translate(${s.x}, ${s.y})`}>
              <polygon points="-3,-1 0,-4 3,-1 3,3 -3,3" fill={PLAYER_COLORS[s.player]} stroke="#000" strokeWidth="0.5" />
            </g>
          ))}

          {/* Cities */}
          {cities.map((c, i) => (
            <g key={`ct${i}`} transform={`translate(${c.x}, ${c.y})`}>
              <polygon points="-4,-2 -2,-5 0,-2 4,-2 4,3 -4,3" fill={PLAYER_COLORS[c.player]} stroke="#000" strokeWidth="0.5" />
            </g>
          ))}

          {/* Vuurtoren */}
          {vuurtorenCorner && (
            <g transform={`translate(${vuurtorenCorner.x}, ${vuurtorenCorner.y})`}>
              <rect x="-2" y="-6" width="4" height="8" fill="#f0e6d2" stroke="#000" strokeWidth="0.4" />
              <polygon points="-3,-6 3,-6 0,-9" fill="#e8b923" stroke="#000" strokeWidth="0.4" />
            </g>
          )}

          {/* Rover */}
          {roverHex && (() => {
            const [x, y] = axialToPixel(roverHex.q, roverHex.r, size);
            return (
              <g transform={`translate(${x - 8}, ${y - 8})`}>
                <circle r="5" fill="#222" stroke="#000" strokeWidth="0.5" />
                <text y="2" textAnchor="middle" fontSize="8" fill="#fff">🦹</text>
              </g>
            );
          })()}

          {/* Piraat */}
          {piraatHex && (() => {
            const [x, y] = axialToPixel(piraatHex.q, piraatHex.r, size);
            return (
              <g transform={`translate(${x}, ${y - 8})`}>
                <text textAnchor="middle" fontSize="14">🏴‍☠️</text>
              </g>
            );
          })()}

          {/* Draak */}
          {draakHex && (() => {
            const [x, y] = axialToPixel(draakHex.q, draakHex.r, size);
            return (
              <g transform={`translate(${x + 8}, ${y - 8})`}>
                <text textAnchor="middle" fontSize="14">🐉</text>
              </g>
            );
          })()}
        </svg>
      </div>

      <Legend figures={figures} settlements={settlements.length} cities={cities.length} roads={roads.length} ships={ships.length} harbors={harbors.length} />
    </div>
  );
}

function Legend({ figures, settlements, cities, roads, ships, harbors }) {
  const items = [];
  if (settlements) items.push(`🏠 ${settlements} dorpen`);
  if (cities) items.push(`🏰 ${cities} steden`);
  if (roads) items.push(`➖ ${roads} wegen`);
  if (ships) items.push(`⛵ ${ships} schepen`);
  if (harbors) items.push(`⚓ ${harbors} havens`);
  if (figures.rover) items.push('🦹 rover');
  if (figures.piraat) items.push('🏴‍☠️ piraat');
  if (figures.draak) items.push('🐉 draak');
  if (figures.vuurtoren) items.push('🏛️ vuurtoren');
  return (
    <p className="tiny muted mt">
      {items.length ? items.join(' · ') : 'Tik 🎲 voor een andere opstelling.'}
    </p>
  );
}
