import { useMemo, useState, useEffect } from 'react';
import { PRINT_ITEMS, SIZE_WEIGHT, COLOR_LABEL } from '../data/prints.js';
import { useYPrinted, useYPrintOverrides, useYCustomPrints } from '../utils/useYjs.js';
import Modal from '../components/Modal.jsx';
import BoardPreview from '../components/BoardPreview.jsx';

function countOf(printed, id) {
  const v = printed[id];
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? Infinity : 0;
  return 0;
}

export default function Printlijst({ config }) {
  const [printed, printedActions] = useYPrinted();
  const [overrides, setOverride] = useYPrintOverrides();
  const [customs, customActions] = useYCustomPrints();
  const [filter, setFilter] = useState('all');
  const [editMode, setEditMode] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [addingSize, setAddingSize] = useState('medium');
  const [addingName, setAddingName] = useState('');
  const [addingQty, setAddingQty] = useState(1);

  const activeBaseItems = useMemo(() => {
    return PRINT_ITEMS.filter(it => it.always || config[it.rule]);
  }, [config]);

  const activeItems = useMemo(() => {
    const base = activeBaseItems
      .map(it => {
        const o = overrides[it.id];
        if (!o) return it;
        return { ...it, name: o.name ?? it.name, qty: o.qty ?? it.qty, hidden: o.hidden };
      })
      .filter(it => !it.hidden);
    const cus = customs.map(c => ({ ...c, custom: true, isCustomAdded: true }));
    return [...base, ...cus];
  }, [activeBaseItems, overrides, customs]);

  const isDone = (it) => countOf(printed, it.id) >= (it.perPlayer ? it.qty * 4 : it.qty);

  const filteredItems = useMemo(() => {
    if (filter === 'todo') return activeItems.filter(it => !isDone(it));
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
  const done = activeItems.filter(isDone).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

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

  function addCustomPrint() {
    if (!addingName.trim()) return;
    const id = 'cp_' + Date.now();
    customActions.add({
      id,
      name: addingName.trim(),
      qty: addingQty || 1,
      size: addingSize,
      color: 'mixed',
      desc: '',
      custom: true,
    });
    setAddingName('');
    setAddingQty(1);
  }

  return (
    <div>
      <div className="card">
        <div className="row between mb">
          <h2 style={{ margin: 0 }}>Voortgang</h2>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn-secondary" onClick={() => setShowBoard(true)}
              style={{ padding: '6px 12px', fontSize: 12 }}>🧩 Bord</button>
            <button className={editMode ? 'btn' : 'btn-secondary'}
              onClick={() => setEditMode(!editMode)}
              style={{ padding: '6px 12px', fontSize: 12 }}>{editMode ? '✓ Klaar' : '✏️ Bewerk'}</button>
          </div>
        </div>
        <div className="row between small mb">
          <span>{done} van {total} items compleet</span>
          <span className="counter-pill">{pct}%</span>
        </div>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        {!editMode && (
          <div className="row mt" style={{ gap: 6 }}>
            <button className={filter === 'all' ? 'btn' : 'btn-secondary'} onClick={() => setFilter('all')}>Alles</button>
            <button className={filter === 'todo' ? 'btn' : 'btn-secondary'} onClick={() => setFilter('todo')}>Nog te printen</button>
            <button className={filter === 'custom' ? 'btn' : 'btn-secondary'} onClick={() => setFilter('custom')}>Custom</button>
          </div>
        )}
      </div>

      {editMode && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>➕ Eigen item toevoegen</h3>
          <div className="col">
            <input className="input" placeholder="Naam"
              value={addingName} onChange={e => setAddingName(e.target.value)} />
            <div className="row" style={{ gap: 6 }}>
              <input className="input" type="number" min={1} style={{ width: 80 }}
                value={addingQty} onChange={e => setAddingQty(parseInt(e.target.value) || 1)} />
              <select className="input" value={addingSize}
                onChange={e => setAddingSize(e.target.value)} style={{ flex: 1 }}>
                <option value="hex">Hex tegel (~15g)</option>
                <option value="overlay">Overlay (~8g)</option>
                <option value="large">Groot (~8g)</option>
                <option value="medium">Medium (~3g)</option>
                <option value="small">Klein (~1g)</option>
              </select>
            </div>
            <button className="btn" onClick={addCustomPrint}>Toevoegen</button>
          </div>
        </div>
      )}

      {grouped.tegels.length > 0 && (
        <Group title="🗺️ Tegels" items={grouped.tegels}
          printed={printed} printedActions={printedActions}
          editMode={editMode} setOverride={setOverride}
          customActions={customActions} />
      )}
      {grouped.perSpeler.length > 0 && (
        <Group title="👤 Per Speler" items={grouped.perSpeler} perPlayer
          printed={printed} printedActions={printedActions}
          editMode={editMode} setOverride={setOverride}
          customActions={customActions} />
      )}
      {grouped.neutraal.length > 0 && (
        <Group title="⚪ Neutrale Stukken" items={grouped.neutraal}
          printed={printed} printedActions={printedActions}
          editMode={editMode} setOverride={setOverride}
          customActions={customActions} />
      )}
      {grouped.tokens.length > 0 && (
        <Group title="🎟️ Tokens & Overig" items={grouped.tokens}
          printed={printed} printedActions={printedActions}
          editMode={editMode} setOverride={setOverride}
          customActions={customActions} />
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
      </div>

      {showBoard && (
        <Modal onClose={() => setShowBoard(false)} title="🧩 Bord-voorbeeld">
          <BoardPreview activeItems={activeItems} printed={printed} />
        </Modal>
      )}
    </div>
  );
}

function Group({ title, items, printed, printedActions, perPlayer, editMode, setOverride, customActions }) {
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {items.map(it => (
        <PrintRow key={it.id} item={it} perPlayer={perPlayer}
          printed={printed} printedActions={printedActions}
          editMode={editMode} setOverride={setOverride}
          customActions={customActions} />
      ))}
    </div>
  );
}

function PrintRow({ item, perPlayer, printed, printedActions, editMode, setOverride, customActions }) {
  const totalQty = perPlayer ? item.qty * 4 : item.qty;
  const have = countOf(printed, item.id);
  const done = have >= totalQty;
  const halfDone = have > 0 && !done;

  function dec(e) { e?.stopPropagation(); printedActions.setCount(item.id, Math.max(0, have - 1)); }
  function inc(e) { e?.stopPropagation(); printedActions.setCount(item.id, Math.min(totalQty, have + 1)); }
  function toggle() { printedActions.toggle(item.id, totalQty); }

  return (
    <div className="print-row">
      {!editMode && (
        <div
          className={`checkbox ${done ? 'checked' : halfDone ? 'partial' : ''}`}
          onClick={toggle}
        >{done ? '✓' : halfDone ? '·' : ''}</div>
      )}
      <div className="print-main">
        {editMode ? (
          <EditRow item={item} setOverride={setOverride} customActions={customActions} />
        ) : (
          <>
            <div className="row between">
              <div className="rule-name">{item.name}</div>
              <div className="row" style={{ gap: 4 }}>
                <button className="plusminus" onClick={dec} style={{ width: 26, height: 26, fontSize: 14 }}>−</button>
                <div className="counter-pill" style={{ minWidth: 52, textAlign: 'center', color: done ? 'var(--green)' : (halfDone ? 'var(--orange)' : 'var(--gold)') }}>
                  {have}/{totalQty}
                </div>
                <button className="plusminus" onClick={inc} style={{ width: 26, height: 26, fontSize: 14 }}>+</button>
              </div>
            </div>
            <div className="rule-desc">{item.desc}</div>
            <div className="row mt" style={{ gap: 6 }}>
              {item.custom ? (
                <>
                  <span className="stl-badge custom">CUSTOM</span>
                  {item.stl && <a href={item.stl} target="_blank" rel="noreferrer" className="small">remix-basis</a>}
                </>
              ) : (
                item.stl && <a href={item.stl} target="_blank" rel="noreferrer">
                  <span className="stl-badge avail">STL BESCHIKBAAR</span>
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EditRow({ item, setOverride, customActions }) {
  const isCustomAdded = item.isCustomAdded;
  const [nameText, setNameText] = useState(item.name);
  const [qtyText, setQtyText] = useState(String(item.qty));

  useEffect(() => { setNameText(item.name); }, [item.name]);
  useEffect(() => { setQtyText(String(item.qty)); }, [item.qty]);

  function commitName(val) {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (isCustomAdded) customActions.update(item.id, { name: trimmed });
    else setOverride(item.id, { name: trimmed });
  }
  function commitQty(n) {
    if (!Number.isFinite(n) || n < 0) return;
    if (isCustomAdded) customActions.update(item.id, { qty: n });
    else setOverride(item.id, { qty: n });
  }
  function bump(delta) {
    const current = Number.isFinite(parseInt(qtyText)) ? parseInt(qtyText) : item.qty;
    const next = Math.max(0, current + delta);
    setQtyText(String(next));
    commitQty(next);
  }
  function handleDelete() {
    if (isCustomAdded) customActions.remove(item.id);
    else setOverride(item.id, { hidden: true });
  }
  function handleRestore() {
    setOverride(item.id, { name: null, qty: null, hidden: null });
  }

  return (
    <div className="col">
      <input className="input" value={nameText}
        onChange={e => setNameText(e.target.value)}
        onBlur={e => commitName(e.target.value)} />
      <div className="row" style={{ gap: 6, alignItems: 'center' }}>
        <button className="plusminus" onClick={() => bump(-1)}>−</button>
        <input className="input" type="number" inputMode="numeric" min={0}
          value={qtyText}
          onChange={e => {
            setQtyText(e.target.value);
            if (e.target.value === '') return;
            const n = parseInt(e.target.value);
            if (Number.isFinite(n)) commitQty(n);
          }}
          onBlur={e => {
            if (e.target.value === '') {
              setQtyText(String(item.qty));
            }
          }}
          style={{ width: 70, textAlign: 'center' }} />
        <button className="plusminus" onClick={() => bump(1)}>+</button>
        <span className="small muted" style={{ alignSelf: 'center' }}>
          {item.size}{item.perPlayer ? ' · ×4' : ''}
        </span>
        <div className="grow" />
        {isCustomAdded ? (
          <button onClick={handleDelete}
            style={{ background: 'var(--red)', color: '#000', borderRadius: 6, padding: '6px 10px', fontSize: 11, fontWeight: 700 }}>🗑️</button>
        ) : (
          <>
            <button onClick={handleRestore}
              style={{ background: 'var(--bg-elev-2)', color: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 10px', fontSize: 11 }}>↺</button>
            <button onClick={handleDelete}
              style={{ background: 'var(--red)', color: '#000', borderRadius: 6, padding: '6px 10px', fontSize: 11, fontWeight: 700 }}>🗑️</button>
          </>
        )}
      </div>
    </div>
  );
}
