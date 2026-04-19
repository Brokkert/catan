import { useEffect, useState, useCallback } from 'react';
import { doc, yConfig, yCustomRules, yPrinted, yBank } from './yjsSync.js';

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
    yConfig.set(id, value);
  }, []);
  const setMany = useCallback((updates) => {
    doc.transact(() => {
      Object.entries(updates).forEach(([k, v]) => yConfig.set(k, v));
    });
  }, []);
  const replace = useCallback((next) => {
    doc.transact(() => {
      yConfig.clear();
      Object.entries(next).forEach(([k, v]) => yConfig.set(k, v));
    });
  }, []);
  return [config, { set, setMany, replace }];
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

// Printed — Y.Map of item id -> boolean
export function useYPrinted() {
  const printed = useObserved(yPrinted, () => Object.fromEntries(yPrinted.entries()));
  const toggle = useCallback((id) => {
    yPrinted.set(id, !yPrinted.get(id));
  }, []);
  return [printed, toggle];
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
