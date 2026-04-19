import { useMemo } from 'react';
import { PRINT_ITEMS } from '../data/prints.js';
import { useYPrintOverrides, useYCustomPrints } from './useYjs.js';

export function usePrintableQty() {
  const [overrides] = useYPrintOverrides();
  const [customs] = useYCustomPrints();

  const map = useMemo(() => {
    const m = {};
    PRINT_ITEMS.forEach(it => {
      const o = overrides[it.id] || {};
      if (!o.hidden) m[it.id] = o.qty ?? it.qty;
    });
    customs.forEach(c => { m[c.id] = c.qty; });
    return m;
  }, [overrides, customs]);

  const qty = (id, fallback = 0) => map[id] ?? fallback;
  return qty;
}
