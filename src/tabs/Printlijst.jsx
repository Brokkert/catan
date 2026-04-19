import { useMemo, useState } from 'react';
import { PRINT_ITEMS, SIZE_WEIGHT, COLOR_LABEL } from '../data/prints.js';
import { useYPrinted } from '../utils/useYjs.js';

export default function Printlijst({ config }) {
  const [printed, togglePrinted] = useYPrinted();
  const [filter, setFilter] = useState('all'); // all, todo, custom

  const activeItems = useMemo(() => {
    return PRINT_ITEMS.filter(it => it.always || config[it.rule]);
  }, [config]);

  const filteredItems = useMemo(() => {
    if (filter === 'todo') return activeItems.filter(it => !printed[it.id]);
    if (filter === 'custom') return activeItems.filter(it => it.custom);
    return activeItems;
  }, [activeItems, filter, printed]);

  const grouped = useMemo(() => {
    const g = { tegels: [], perSpeler: [], neutraal: [], tokens: [] };
    filteredItems.forEach(it => {
      if (it.size === 'hex' || it.size === 'overlay') g.tegels.push(it);
      else if (it.perPlayer) g.perSpeler.push(it);
      else if (it.color === 'neutral') g.neutraal.push(it);
      else g.tokens.push(it);
    });
    return g;
  }, [filteredItems]);

  const total = activeItems.length;
  const done = activeItems.filter(it => printed[it.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Filament estimation
  const filament = useMemo(() => {
    const totals = { player: 0, neutral: 0, gold: 0, blue: 0, mixed: 0 };
    activeItems.forEach(it => {
      const qty = it.perPlayer ? it.qty * 4 : it.qty;
      const weight = (SIZE_WEIGHT[it.size] || 3) * qty;
      totals[it.color || 'mixed'] = (totals[it.color || 'mixed'] || 0) + weight;
    });
    return totals;
  }, [activeItems]);
  const totalGram = Object.values(filament).reduce((a, b) => a + b, 0);

  const toggle = togglePrinted;

  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Voortgang</h2>
        <div className="row between small mb">
          <span>{done} van {total} items geprint</span>
          <span className="counter-pill">{pct}%</span>
        </div>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="row mt" style={{ gap: 6 }}>
          <button className={filter === 'all' ? 'btn' : 'btn-secondary'} onClick={() => setFilter('all')}>Alles</button>
          <button className={filter === 'todo' ? 'btn' : 'btn-secondary'} onClick={() => setFilter('todo')}>Nog te printen</button>
          <button className={filter === 'custom' ? 'btn' : 'btn-secondary'} onClick={() => setFilter('custom')}>Custom</button>
        </div>
      </div>

      {grouped.tegels.length > 0 && (
        <Group title="🗺️ Tegels" items={grouped.tegels} printed={printed} toggle={toggle} />
      )}
      {grouped.perSpeler.length > 0 && (
        <Group title="👤 Per Speler" items={grouped.perSpeler} printed={printed} toggle={toggle} perPlayer />
      )}
      {grouped.neutraal.length > 0 && (
        <Group title="⚪ Neutrale Stukken" items={grouped.neutraal} printed={printed} toggle={toggle} />
      )}
      {grouped.tokens.length > 0 && (
        <Group title="🎟️ Tokens & Overig" items={grouped.tokens} printed={printed} toggle={toggle} />
      )}

      <div className="card">
        <h2 style={{ marginTop: 0 }}>🧵 Filament-schatting</h2>
        <p className="small muted">
          Je hebt ongeveer <b style={{ color: 'var(--gold)' }}>{totalGram}g PLA</b> nodig,
          verdeeld over {Object.entries(filament).filter(([, g]) => g > 0).length} kleur(en).
        </p>
        <table>
          <thead>
            <tr><th>Kleur</th><th style={{ textAlign: 'right' }}>Gram</th></tr>
          </thead>
          <tbody>
            {Object.entries(filament).map(([k, g]) => g > 0 && (
              <tr key={k}>
                <td>{COLOR_LABEL[k]}</td>
                <td style={{ textAlign: 'right' }}>{g}g</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="tiny muted mt">
          Schatting obv: hex 15g, overlay 8g, groot stuk 8g, medium 3g, klein token 1g. Spelerskleur = ×4 spelers.
        </p>
      </div>
    </div>
  );
}

function Group({ title, items, printed, toggle, perPlayer }) {
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {items.map(it => {
        const qty = perPlayer ? `${it.qty}×4` : it.qty;
        return (
          <div key={it.id} className="print-row">
            <div
              className={`checkbox ${printed[it.id] ? 'checked' : ''}`}
              onClick={() => toggle(it.id)}
            >{printed[it.id] ? '✓' : ''}</div>
            <div className="print-main">
              <div className="row between">
                <div className="rule-name">{it.name}</div>
                <div className="counter-pill">{qty}×</div>
              </div>
              <div className="rule-desc">{it.desc}</div>
              <div className="row mt" style={{ gap: 6 }}>
                {it.custom ? (
                  <>
                    <span className="stl-badge custom">CUSTOM</span>
                    {it.stl && <a href={it.stl} target="_blank" rel="noreferrer" className="small">remix-basis</a>}
                  </>
                ) : (
                  it.stl && <a href={it.stl} target="_blank" rel="noreferrer">
                    <span className="stl-badge avail">STL BESCHIKBAAR</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
