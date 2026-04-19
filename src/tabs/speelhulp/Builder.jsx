import { useMemo, useState } from 'react';
import { BUILD_ITEMS, RESOURCES } from '../../data/costs.js';
import { load, BANK_KEY } from '../../utils/storage.js';

export default function Builder({ config, currentPlayer }) {
  const [manual, setManual] = useState(() => {
    const bank = load(BANK_KEY, null);
    if (bank && bank[currentPlayer]) return { ...bank[currentPlayer].resources };
    return { hout: 0, baksteen: 0, graan: 0, wol: 0, erts: 0, vis: 0, specerij: 0, goud: 0 };
  });

  function refreshFromBank() {
    const bank = load(BANK_KEY, null);
    if (bank && bank[currentPlayer]) setManual({ ...bank[currentPlayer].resources });
  }

  const activeResources = RESOURCES.filter(r => !r.rule || config[r.rule]);

  const items = useMemo(() => {
    return BUILD_ITEMS.filter(it => !it.rule || config[it.rule]);
  }, [config]);

  function check(item) {
    let missing = 0;
    for (const [res, qty] of Object.entries(item.cost)) {
      if ((manual[res] || 0) < qty) missing += qty - (manual[res] || 0);
    }
    return missing;
  }

  const byCat = items.reduce((acc, it) => {
    (acc[it.cat] = acc[it.cat] || []).push(it);
    return acc;
  }, {});

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>🔨 Wat kan ik bouwen?</h2>
      <p className="small muted">Voer je grondstoffen in of laad uit de Bank.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 6, marginBottom: 12 }}>
        {activeResources.map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 18 }}>{r.icon}</span>
            <input
              className="input"
              type="number"
              min={0}
              value={manual[r.id] || 0}
              onChange={e => setManual({ ...manual, [r.id]: parseInt(e.target.value) || 0 })}
              style={{ padding: '6px 4px', fontSize: 13 }}
            />
          </div>
        ))}
      </div>
      <button className="btn-secondary" onClick={refreshFromBank}>↻ Ververs uit Bank</button>

      <div className="mt-l">
        {Object.entries(byCat).map(([cat, list]) => (
          <div key={cat}>
            <h3>{cat}</h3>
            {list.map(it => {
              const m = check(it);
              const color = m === 0 ? 'var(--green)' : (m === 1 ? 'var(--orange)' : 'var(--red)');
              const costStr = Object.entries(it.cost).map(([r, q]) => {
                const res = RESOURCES.find(x => x.id === r);
                return `${q}${res?.icon || r}`;
              }).join(' ');
              return (
                <div key={it.id} className="rule-row">
                  <div className="rule-main">
                    <div className="rule-name" style={{ color }}>{it.name}</div>
                    <div className="rule-desc">{costStr} {m === 1 && '— 1 grondstof tekort'}</div>
                  </div>
                  <div style={{ fontSize: 20 }}>{m === 0 ? '✅' : (m === 1 ? '⚠️' : '❌')}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
