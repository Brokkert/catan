import { useMemo, useState } from 'react';
import { ALL_RULES, RULES_BY_CAT, PRESETS, DEFAULT_CONFIG } from '../data/rules.js';
import { CATEGORIES } from '../data/categories.js';
import { shareURL } from '../utils/game.js';
import { qrCodeURL } from '../utils/storage.js';
import { useYMeta, useYParams, PARAM_LABELS, DEFAULT_PARAMS } from '../utils/useYjs.js';
import Switch from '../components/Switch.jsx';
import Modal from '../components/Modal.jsx';

export default function Configurator({ config, configActions, customRules, customActions }) {
  const meta = useYMeta();
  const selectedPreset = meta.preset;
  const [params, paramActions] = useYParams();
  const [showQR, setShowQR] = useState(false);
  const [addingTo, setAddingTo] = useState(null);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  const totalCount = ALL_RULES.length + customRules.length;
  const activeCount = useMemo(() => {
    let n = 0;
    ALL_RULES.forEach(r => { if (config[r.id]) n++; });
    customRules.forEach(r => { if (config[r.id]) n++; });
    return n;
  }, [config, customRules]);

  function toggle(id) {
    configActions.set(id, !config[id]);
  }

  function expectedConfigFor(preset) {
    const next = {};
    if (preset.rules === '*') {
      ALL_RULES.forEach(r => { next[r.id] = true; });
      customRules.forEach(r => { next[r.id] = true; });
    } else {
      ALL_RULES.forEach(r => { next[r.id] = r.core || preset.rules.includes(r.id); });
      customRules.forEach(r => { next[r.id] = false; });
    }
    return next;
  }

  function applyPreset(preset) {
    configActions.replace(expectedConfigFor(preset), preset.id);
  }

  function categoryAllOn(catId, on) {
    const updates = {};
    ALL_RULES.filter(r => r.cat === catId).forEach(r => {
      if (r.core && !on) return;
      updates[r.id] = on;
    });
    customRules.filter(r => r.cat === catId).forEach(r => { updates[r.id] = on; });
    configActions.setMany(updates);
  }

  function submitCustom() {
    if (!customName.trim() || !addingTo) return;
    const id = 'custom_' + Date.now();
    const newRule = { id, cat: addingTo, name: customName.trim(), desc: customDesc.trim(), custom: true };
    customActions.add(newRule);
    configActions.set(id, true);
    setCustomName('');
    setCustomDesc('');
    setAddingTo(null);
  }

  function removeCustom(id) {
    customActions.remove(id);
    configActions.set(id, undefined);
  }

  const url = shareURL(config);

  return (
    <div>
      <div className="card">
        <div className="row between mb">
          <h2 style={{ margin: 0 }}>Presets</h2>
          <span className="counter-pill">{activeCount} / {totalCount} actief</span>
        </div>
        <div className="preset-grid">
          {PRESETS.map(p => (
            <button
              key={p.id}
              className={`preset-btn ${selectedPreset === p.id ? 'active' : ''}`}
              onClick={() => applyPreset(p)}
            >
              {p.name}
              <span className="preset-label">{p.time}</span>
            </button>
          ))}
        </div>
        <div className="row" style={{ gap: 8, marginTop: 8 }}>
          <button className="btn" onClick={() => setShowQR(true)}>📱 Deel config</button>
          <button className="btn-secondary" onClick={() => configActions.replace({ ...DEFAULT_CONFIG })}>Reset naar default</button>
        </div>
      </div>

      <details className="card" style={{ padding: '10px 14px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--gold)' }}>
          ⚙️ Startaantallen (geavanceerd) — pas Catan-geometrie aan
        </summary>
        <p className="small muted mt">Normaal Catan-regels. Wijzig alleen als je een grotere of kleinere opstelling wilt.</p>
        {Object.entries(DEFAULT_PARAMS).map(([key, def]) => (
          <div key={key} className="row" style={{ gap: 10, alignItems: 'center', padding: '6px 0' }}>
            <span className="grow small">{PARAM_LABELS[key]}</span>
            <button className="plusminus" onClick={() => paramActions.setParam(key, (params[key] ?? def) - 1)}>−</button>
            <span className="counter-pill" style={{ minWidth: 40, textAlign: 'center' }}>{params[key] ?? def}</span>
            <button className="plusminus" onClick={() => paramActions.setParam(key, (params[key] ?? def) + 1)}>+</button>
          </div>
        ))}
        <button className="btn-secondary mt" onClick={paramActions.resetParams} style={{ fontSize: 12 }}>↺ Reset naar Catan-standaard</button>
      </details>

      {CATEGORIES.map(cat => {
        const catRules = RULES_BY_CAT[cat.id] || [];
        const catCustom = customRules.filter(r => r.cat === cat.id);
        const allRulesInCat = [...catRules, ...catCustom];
        if (allRulesInCat.length === 0 && catCustom.length === 0) return null;

        return (
          <div key={cat.id} className="card">
            <div className="cat-header">
              <div className="cat-title" style={{ color: cat.color }}>
                {cat.emoji} {cat.name}
              </div>
              <div className="cat-actions">
                <button className="cat-btn" onClick={() => categoryAllOn(cat.id, true)}>Alles aan</button>
                <button className="cat-btn" onClick={() => categoryAllOn(cat.id, false)}>Uit</button>
                <button className="cat-btn" onClick={() => setAddingTo(cat.id)}>+</button>
              </div>
            </div>
            {allRulesInCat.map(r => (
              <div key={r.id} className="rule-row">
                <div className="rule-main">
                  <div className="rule-name">
                    {r.name}
                    {r.core && <span className="core-badge">CORE</span>}
                    {r.custom && (
                      <>
                        <span className="custom-badge">EIGEN</span>
                        <button
                          onClick={() => removeCustom(r.id)}
                          style={{ marginLeft: 8, background: 'transparent', color: 'var(--red)', fontSize: 11 }}
                        >verwijder</button>
                      </>
                    )}
                  </div>
                  <div className="rule-desc">{r.desc}</div>
                </div>
                <Switch
                  on={!!config[r.id]}
                  disabled={r.core}
                  onClick={() => toggle(r.id)}
                />
              </div>
            ))}
          </div>
        );
      })}

      {addingTo && (
        <Modal onClose={() => setAddingTo(null)} title="Eigen regel toevoegen">
          <div className="col">
            <input
              className="input"
              placeholder="Naam van de regel"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
            />
            <textarea
              className="textarea"
              rows={3}
              placeholder="Beschrijving"
              value={customDesc}
              onChange={e => setCustomDesc(e.target.value)}
            />
            <div className="row">
              <button className="btn" onClick={submitCustom}>Toevoegen</button>
              <button className="btn-secondary" onClick={() => setAddingTo(null)}>Annuleer</button>
            </div>
          </div>
        </Modal>
      )}

      {showQR && (
        <Modal onClose={() => setShowQR(false)} title="📱 Deel je configuratie">
          <div className="center">
            <img src={qrCodeURL(url)} alt="QR" style={{ width: '100%', maxWidth: 260, borderRadius: 8 }} />
            <p className="small muted">Scan om dezelfde configuratie te openen</p>
            <div className="col">
              <input className="input" readOnly value={url} onClick={e => e.target.select()} />
              <button className="btn" onClick={() => navigator.clipboard?.writeText(url)}>📋 Kopieer link</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
