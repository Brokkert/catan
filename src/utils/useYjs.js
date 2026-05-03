import { useEffect, useState, useCallback } from 'react';
import { doc, yConfig, yCustomRules, yPrinted, yBank, yMeta, yPrintOverrides, yCustomPrints, yParams, yTileDraws, yBoard, yDrawHistory } from './yjsSync.js';

export const DEFAULT_PARAMS = {
  hoofdeiland_tegels: 7,
  waterring_tegels: 12,
  havens: 5,
  getijdenmarkers: 3,
  startdorpen_per_speler: 2,
  startwegen_per_speler: 2,
  startvis: 1,
  startgoud: 2,
};

export const PARAM_LABELS = {
  hoofdeiland_tegels: 'Hoofdeiland tegels',
  waterring_tegels: 'Waterring tegels',
  havens: 'Havens',
  getijdenmarkers: 'Getijdenmarkers',
  startdorpen_per_speler: 'Startdorpen per speler',
  startwegen_per_speler: 'Startwegen per speler',
  startvis: 'Startbonus vis (bij vis-regel)',
  startgoud: 'Startbonus goud (bij goud-regel)',
};

function useObserved(target, getValue) {
  const [value, setValue] = useState(getValue);
  useEffect(() => {
    const update = () => setValue(getValue());
    target.observeDeep(update);
    update();
    return () => target.unobserveDeep(update);
  }, [target]);
  return value;
}

// Config — Y.Map of boolean flags
export function useYConfig() {
  const config = useObserved(yConfig, () => Object.fromEntries(yConfig.entries()));
  const set = useCallback((id, value) => {
    doc.transact(() => {
      yConfig.set(id, value);
      yMeta.set('preset', null);
    });
  }, []);
  const setMany = useCallback((updates) => {
    doc.transact(() => {
      Object.entries(updates).forEach(([k, v]) => yConfig.set(k, v));
      yMeta.set('preset', null);
    });
  }, []);
  const replace = useCallback((next, presetId = null) => {
    doc.transact(() => {
      yConfig.clear();
      Object.entries(next).forEach(([k, v]) => yConfig.set(k, v));
      yMeta.set('preset', presetId);
    });
  }, []);
  return [config, { set, setMany, replace }];
}

// Meta — Y.Map of misc state
export function useYMeta() {
  const meta = useObserved(yMeta, () => Object.fromEntries(yMeta.entries()));
  return meta;
}

// Print overrides — edits to predefined print items (name, qty, hidden)
export function useYPrintOverrides() {
  const overrides = useObserved(yPrintOverrides, () => {
    const out = {};
    yPrintOverrides.forEach((v, k) => { out[k] = v; });
    return out;
  });
  const setOverride = useCallback((itemId, patch) => {
    const current = yPrintOverrides.get(itemId) || {};
    const next = { ...current, ...patch };
    // Clean nulls — a null/undefined value means reset that field
    Object.keys(next).forEach(k => { if (next[k] == null) delete next[k]; });
    if (Object.keys(next).length === 0) yPrintOverrides.delete(itemId);
    else yPrintOverrides.set(itemId, next);
  }, []);
  return [overrides, setOverride];
}

// Tweakable game-rule parameters (hoofdeiland size, waterring, starting counts)
export function useYParams() {
  const params = useObserved(yParams, () => {
    const base = { ...DEFAULT_PARAMS };
    yParams.forEach((v, k) => { base[k] = v; });
    return base;
  });
  const setParam = useCallback((key, value) => {
    const v = Math.max(0, value | 0);
    if (v === DEFAULT_PARAMS[key]) yParams.delete(key);
    else yParams.set(key, v);
  }, []);
  const resetParams = useCallback(() => {
    doc.transact(() => { yParams.clear(); });
  }, []);
  return [params, { setParam, resetParams }];
}

// Live board — Y.Map with key "q,r" → tile object
export function useYBoard() {
  const board = useObserved(yBoard, () => Object.fromEntries(yBoard.entries()));
  const setTile = useCallback((q, r, tile) => {
    yBoard.set(`${q},${r}`, tile);
  }, []);
  const removeTile = useCallback((q, r) => yBoard.delete(`${q},${r}`), []);
  const reset = useCallback(() => { doc.transact(() => yBoard.clear()); }, []);
  const getTile = useCallback((q, r) => board[`${q},${r}`], [board]);
  return [board, { setTile, removeTile, reset, getTile }];
}

// Draw history (chronological)
export function useYDrawHistory() {
  const history = useObserved(yDrawHistory, () => yDrawHistory.toArray());
  const append = useCallback((entry) => yDrawHistory.push([entry]), []);
  const reset = useCallback(() => {
    doc.transact(() => yDrawHistory.delete(0, yDrawHistory.length));
  }, []);
  return [history, { append, reset }];
}

// Tile draws — { itemId: count_drawn }
export function useYTileDraws() {
  const draws = useObserved(yTileDraws, () => Object.fromEntries(yTileDraws.entries()));
  const draw = useCallback((id) => {
    yTileDraws.set(id, (yTileDraws.get(id) || 0) + 1);
  }, []);
  const undo = useCallback((id) => {
    const n = (yTileDraws.get(id) || 0) - 1;
    if (n <= 0) yTileDraws.delete(id);
    else yTileDraws.set(id, n);
  }, []);
  const reset = useCallback(() => {
    doc.transact(() => { yTileDraws.clear(); });
  }, []);
  return [draws, { draw, undo, reset }];
}

// Custom print items — user-added items
export function useYCustomPrints() {
  const items = useObserved(yCustomPrints, () => yCustomPrints.toArray());
  const add = useCallback((item) => yCustomPrints.push([item]), []);
  const update = useCallback((id, patch) => {
    const list = yCustomPrints.toArray();
    const idx = list.findIndex(i => i.id === id);
    if (idx < 0) return;
    const next = { ...list[idx], ...patch };
    doc.transact(() => {
      yCustomPrints.delete(idx, 1);
      yCustomPrints.insert(idx, [next]);
    });
  }, []);
  const remove = useCallback((id) => {
    const idx = yCustomPrints.toArray().findIndex(i => i.id === id);
    if (idx >= 0) yCustomPrints.delete(idx, 1);
  }, []);
  return [items, { add, update, remove }];
}

// Custom rules — Y.Array of rule objects
export function useYCustomRules() {
  const rules = useObserved(yCustomRules, () => yCustomRules.toArray());
  const add = useCallback((rule) => {
    yCustomRules.push([rule]);
  }, []);
  const remove = useCallback((id) => {
    const idx = yCustomRules.toArray().findIndex(r => r.id === id);
    if (idx >= 0) yCustomRules.delete(idx, 1);
  }, []);
  return [rules, { add, remove }];
}

// Printed — Y.Map of item id -> number (count printed)
export function useYPrinted() {
  const printed = useObserved(yPrinted, () => Object.fromEntries(yPrinted.entries()));
  const setCount = useCallback((id, count) => {
    yPrinted.set(id, Math.max(0, count | 0));
  }, []);
  const toggle = useCallback((id, fullQty) => {
    const current = yPrinted.get(id) || 0;
    const target = typeof current === 'boolean'
      ? (current ? 0 : fullQty)
      : (current >= fullQty ? 0 : fullQty);
    yPrinted.set(id, target);
  }, []);
  return [printed, { setCount, toggle }];
}

// Bank — Y.Array of 4 player objects
export function useYBank() {
  const ensureSize = useCallback(() => {
    while (yBank.length < 4) {
      yBank.push([{ resources: { hout: 0, baksteen: 0, graan: 0, wol: 0, erts: 0, vis: 0, specerij: 0, goud: 0 }, bevolking: 0 }]);
    }
  }, []);
  useEffect(() => { ensureSize(); }, [ensureSize]);

  const bank = useObserved(yBank, () => {
    ensureSize();
    return yBank.toArray();
  });
  const updatePlayer = useCallback((idx, mutator) => {
    ensureSize();
    const current = yBank.get(idx);
    const next = mutator({ ...current, resources: { ...current.resources } });
    doc.transact(() => {
      yBank.delete(idx, 1);
      yBank.insert(idx, [next]);
    });
  }, [ensureSize]);
  return [bank, updatePlayer];
}
