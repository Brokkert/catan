// Tegel-voorspeller: weegt kansen op basis van actieve regels + buurttegels.
// Geeft de logica voor: "wat trek ik als volgende tegel?"
// Gebaseerd op echte geografische intuïtie: rif → land dichterbij, etc.

import { PRINT_ITEMS } from '../data/prints.js';

const TILE_ITEMS = [
  { id: 'bos_hex', kind: 'land', sub: 'bos' },
  { id: 'akkers_hex', kind: 'land', sub: 'akkers' },
  { id: 'weiden_hex', kind: 'land', sub: 'weiden' },
  { id: 'heuvels_hex', kind: 'land', sub: 'heuvels' },
  { id: 'bergen_hex', kind: 'land', sub: 'bergen' },
  { id: 'jungle_hex', kind: 'land', sub: 'jungle' },
  { id: 'goudmijn_hex', kind: 'land', sub: 'goudmijn' },
  { id: 'goudrivier_hex', kind: 'land', sub: 'goudrivier' },
  { id: 'ruine_hex', kind: 'land', sub: 'ruine' },
  { id: 'handelspost_hex', kind: 'land', sub: 'handelspost' },
  { id: 'piraat_hex', kind: 'land', sub: 'piraat' },
  { id: 'drakenei_hex', kind: 'land', sub: 'drakenei' },
  { id: 'vulkaan_hex', kind: 'land', sub: 'vulkaan' },
  { id: 'woestijn_hex', kind: 'land', sub: 'woestijn' },
  { id: 'water_hex', kind: 'water', sub: 'water' },
  { id: 'koraal_hex', kind: 'water', sub: 'koraal' },
  { id: 'rif_hex', kind: 'water', sub: 'rif' },
];

export const NEIGHBOR_OPTIONS = [
  { id: 'water', emoji: '🌊', label: 'Water (open zee)' },
  { id: 'koraal', emoji: '🐟', label: 'Koraalrif' },
  { id: 'rif', emoji: '🪨', label: 'Rif (rotsen)' },
  { id: 'bos', emoji: '🌲', label: 'Bos' },
  { id: 'akkers', emoji: '🌾', label: 'Akkers' },
  { id: 'weiden', emoji: '🐑', label: 'Weiden' },
  { id: 'heuvels', emoji: '🧱', label: 'Heuvels' },
  { id: 'bergen', emoji: '⛰️', label: 'Bergen' },
  { id: 'jungle', emoji: '🌴', label: 'Jungle' },
  { id: 'vulkaan', emoji: '🌋', label: 'Vulkaan' },
  { id: 'woestijn', emoji: '🏜️', label: 'Woestijn' },
];

export function buildPool(qty, draws, config) {
  return TILE_ITEMS
    .filter(t => {
      const item = PRINT_ITEMS.find(p => p.id === t.id);
      if (!item) return false;
      if (!item.always && !config[item.rule]) return false;
      const total = qty(t.id, item.qty);
      const drawn = draws[t.id] || 0;
      return total - drawn > 0;
    })
    .map(t => {
      const item = PRINT_ITEMS.find(p => p.id === t.id);
      return { ...t, remaining: qty(t.id, item.qty) - (draws[t.id] || 0) };
    });
}

function applyWeights(pool, neighbors) {
  const counts = neighbors.reduce((a, n) => { a[n] = (a[n] || 0) + 1; return a; }, {});
  const totalLand = (counts.bos || 0) + (counts.akkers || 0) + (counts.weiden || 0)
    + (counts.heuvels || 0) + (counts.bergen || 0) + (counts.jungle || 0);
  return pool.map(tile => {
    let weight = tile.remaining;
    if (counts.rif && tile.kind === 'land') weight *= 1.6;
    if (counts.rif && tile.sub === 'water') weight *= 0.5;
    if (counts.koraal && tile.kind === 'land') weight *= 1.3;
    if (counts.vulkaan && (tile.sub === 'bergen' || tile.sub === 'heuvels')) weight *= 2.0;
    if ((counts.water || 0) >= 3 && tile.kind === 'water') weight *= 1.4;
    if ((counts.water || 0) >= 4 && tile.kind === 'land') weight *= 0.6;
    if (totalLand >= 3 && tile.kind === 'land') weight *= 1.4;
    if (totalLand >= 4 && tile.kind === 'water') weight *= 0.5;
    if ((counts[tile.sub] || 0) >= 2) weight *= 1.5;
    if (counts.jungle && tile.sub === 'jungle') weight *= 1.7;
    if (counts.bergen && (tile.sub === 'bergen' || tile.sub === 'heuvels')) weight *= 1.4;
    if (counts.heuvels && tile.sub === 'bergen') weight *= 1.3;
    return { ...tile, weight: Math.max(0.01, weight) };
  });
}

// Smart context-aware predictor.
// history = [{type, ts, q, r}], drawCount = total draws so far
function applySmartWeights(pool, neighbors, history = [], totalPool = 0) {
  let weighted = applyWeights(pool, neighbors);
  const totalDraws = history.length;

  // PITY: if last 3 draws all water → boost land x1.6, vice versa
  const last3 = history.slice(-3).map(h => h.type);
  if (last3.length === 3) {
    const allWater = last3.every(t => ['water', 'koraal', 'rif'].includes(t));
    const allLand = last3.every(t => !['water', 'koraal', 'rif'].includes(t));
    if (allWater) {
      weighted = weighted.map(t => ({ ...t, weight: t.weight * (t.kind === 'land' ? 1.7 : 0.6) }));
    } else if (allLand) {
      weighted = weighted.map(t => ({ ...t, weight: t.weight * (t.kind === 'water' ? 1.7 : 0.7) }));
    }
  }

  // DRAMA-CURVE: based on % of pool consumed
  const consumed = totalPool > 0 ? totalDraws / totalPool : 0;
  const exotic = ['drakenei', 'goudmijn', 'goudrivier', 'ruine', 'vulkaan', 'piraat', 'handelspost'];
  const safe = ['water', 'bos', 'akkers'];
  if (consumed < 0.25) {
    // early: boost safe, dampen exotic
    weighted = weighted.map(t => ({
      ...t,
      weight: t.weight * (safe.includes(t.sub) ? 1.3 : exotic.includes(t.sub) ? 0.4 : 1),
    }));
  } else if (consumed > 0.6) {
    // late: boost exotic, fewer plain water
    weighted = weighted.map(t => ({
      ...t,
      weight: t.weight * (exotic.includes(t.sub) ? 1.8 : t.sub === 'water' ? 0.7 : 1),
    }));
  }

  // GUARANTEED-RARE: every 5th draw boost a rare type that hasn't appeared yet
  if (totalDraws > 0 && totalDraws % 5 === 0) {
    const seen = new Set(history.map(h => h.type));
    weighted = weighted.map(t => ({
      ...t,
      weight: t.weight * (exotic.includes(t.sub) && !seen.has(t.sub) ? 3 : 1),
    }));
  }

  return weighted;
}

export function predictTile(qty, draws, config, neighbors, history = []) {
  const pool = buildPool(qty, draws, config);
  if (pool.length === 0) return null;
  const totalPool = pool.reduce((s, t) => s + t.remaining, 0) + history.length;
  const weighted = applySmartWeights(pool, neighbors, history, totalPool);
  const total = weighted.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of weighted) {
    r -= t.weight;
    if (r <= 0) return t;
  }
  return weighted[weighted.length - 1];
}

export function summary(qty, draws, config) {
  const pool = buildPool(qty, draws, config);
  const land = pool.filter(t => t.kind === 'land').reduce((s, t) => s + t.remaining, 0);
  const water = pool.filter(t => t.kind === 'water').reduce((s, t) => s + t.remaining, 0);
  return { land, water, total: land + water };
}
