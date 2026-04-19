import { useMemo } from 'react';
import { ALL_RULES, RULES_BY_CAT } from '../data/rules.js';
import { CATEGORIES } from '../data/categories.js';
import { BUILD_ITEMS, RESOURCES } from '../data/costs.js';

function resourceStr(cost) {
  return Object.entries(cost).map(([r, q]) => {
    const res = RESOURCES.find(x => x.id === r);
    return `${q}${res?.icon || r}`;
  }).join(' ');
}

function buildPhases(cfg) {
  const phases = [];
  if (cfg.versterking) phases.push({ n: 0, name: 'Versterking', desc: 'Begin beurt: gratis milities (hexen ÷3, min 1). Plaats nieuwe eenheden op eigen gebouwen.' });
  if (cfg.orakel) phases.push({ n: 1, name: 'Orakel', desc: 'Leg geheim een orakelschijf (2-12). Goed geraden = bonus.' });
  phases.push({ n: 2, name: 'Productie', desc: cfg.kaartstapel ? 'Trek bovenste nummerkaart.' : 'Werp 2 dobbelstenen.' });
  let f3 = 'Rover verplaatst, beroof speler.';
  if (cfg.piraat) f3 += ' Piraat verplaatst ook (blokkeert schepen).';
  if (cfg.getijden) f3 += ' Getijdenworp: extra d6 (1-2 niks, 3-4 vloed, 5-6 stormvloed).';
  phases.push({ n: 3, name: 'De 7', desc: f3 });
  if (cfg.voedsel) phases.push({ n: 4, name: 'Voedselronde', desc: '(bij seizoenswisseling) Betaal 1 voedsel per 3 zielen. Tekort = hongersnood.' });
  phases.push({ n: 5, name: 'Handel', desc: 'Ruilen met spelers + bank (4:1, havens).' + (cfg.contracten ? ' Contracten: 3 rondes 1:1 ruil.' : '') });
  phases.push({ n: 6, name: 'Bouwen & Smeden', desc: 'Bouw dorpen, steden, wegen, gebouwen, schepen.' + (cfg.smederij ? ' Craft items bij smederij.' : '') + (cfg.itemsysteem ? ' Koop items op markt (3🪙).' : '') });
  if (cfg.pvp) phases.push({ n: 7, name: 'Mobilisatie & Gevecht', desc: 'Verplaats eenheden over wegen. Val gebouwen/eenheden aan met dobbelstenen.' });
  if (cfg.procedureel) phases.push({ n: 8, name: 'Ontdekking', desc: 'Trek tegel met aangrenzend schip. Onthul en plaats.' });
  const f9parts = [];
  if (cfg.trofeesets) f9parts.push('Claim trofee-sets');
  if (cfg.schatkaarten) f9parts.push('Combineer schatkaartfragmenten');
  if (cfg.versterking) f9parts.push('Fortificatie (1 eenheid gratis verplaatsen)');
  if (f9parts.length) phases.push({ n: 9, name: 'Verzameling & Fortificatie', desc: f9parts.join(' · ') });
  return phases;
}

function victoryPoints(cfg) {
  const vp = [];
  vp.push({ pts: 1, desc: 'Dorp' });
  vp.push({ pts: 2, desc: 'Stad' });
  if (cfg.fort) vp.push({ pts: 2, desc: 'Fort' });
  if (cfg.gildehall) vp.push({ pts: 3, desc: 'Gildehall' });
  if (cfg.vuurtoren) vp.push({ pts: 1, desc: 'Vuurtoren' });
  vp.push({ pts: 2, desc: 'Langste Route' });
  vp.push({ pts: 2, desc: 'Grootste Ridderleger' });
  if (cfg.grootste_vloot) vp.push({ pts: 2, desc: 'Grootste Vloot (min 2 oorlogsschepen)' });
  if (cfg.meesterontdekker) vp.push({ pts: 2, desc: 'Meesterontdekker (min 3 ontdekte tegels)' });
  vp.push({ pts: 1, desc: 'Overwinningspunt-kaart' });
  if (cfg.koopman) vp.push({ pts: 1, desc: 'Koopman (op landtegel)' });
  if (cfg.relieken) vp.push({ pts: '1-2', desc: 'Relieken (variabel, Drietand 2VP)' });
  if (cfg.trofeesets) vp.push({ pts: '1-3', desc: 'Trofee-sets (Drakendoder 3VP)' });
  if (cfg.schatkaarten) vp.push({ pts: 3, desc: 'Verloren Schat (6 fragmenten)' });
  if (cfg.goudenKroon) vp.push({ pts: 1, desc: 'Gouden Kroon (item)' });
  if (cfg.geheime_missies) vp.push({ pts: 3, desc: 'Geheime missie voltooid' });
  return vp;
}

function winPoints(cfg) {
  if (cfg.lagere_vp) return 12;
  return 16;
}

function buildMarkdown(cfg, customRules, name) {
  let md = `# ${name}\n\n`;
  md += `## Overzicht\n\nWin door **${winPoints(cfg)} overwinningspunten** te behalen.\n\n`;

  md += `## Beurtstructuur\n\n`;
  buildPhases(cfg).forEach(p => {
    md += `### Fase ${p.n} — ${p.name}\n${p.desc}\n\n`;
  });

  md += `## Winvoorwaarden\n\n`;
  victoryPoints(cfg).forEach(vp => {
    md += `- **${vp.pts} VP** — ${vp.desc}\n`;
  });
  if (cfg.survival_win) md += `- **Survival-overwinning**: laatste speler met gebouwen wint direct.\n`;
  if (cfg.militaire_win) md += `- **Militaire overwinning**: plunder alle tegenstanders voor directe winst.\n`;

  md += `\n## Bouwkosten\n\n`;
  const items = BUILD_ITEMS.filter(it => !it.rule || cfg[it.rule]);
  const byCat = items.reduce((acc, it) => {
    (acc[it.cat] = acc[it.cat] || []).push(it);
    return acc;
  }, {});
  Object.entries(byCat).forEach(([cat, list]) => {
    md += `### ${cat}\n`;
    list.forEach(it => {
      md += `- **${it.name}**: ${resourceStr(it.cost)}\n`;
    });
    md += `\n`;
  });

  md += `## Actieve Regels per Categorie\n\n`;
  CATEGORIES.forEach(cat => {
    const rules = (RULES_BY_CAT[cat.id] || []).filter(r => cfg[r.id]);
    const custom = customRules.filter(r => r.cat === cat.id && cfg[r.id]);
    if (rules.length === 0 && custom.length === 0) return;
    md += `### ${cat.emoji} ${cat.name}\n\n`;
    [...rules, ...custom].forEach(r => {
      md += `- **${r.name}**: ${r.desc}\n`;
    });
    md += `\n`;
  });

  return md;
}

export default function Spelregels({ config, customRules, name }) {
  const phases = useMemo(() => buildPhases(config), [config]);
  const vp = useMemo(() => victoryPoints(config), [config]);
  const winVP = winPoints(config);

  const items = useMemo(() => BUILD_ITEMS.filter(it => !it.rule || config[it.rule]), [config]);
  const byCat = items.reduce((acc, it) => {
    (acc[it.cat] = acc[it.cat] || []).push(it);
    return acc;
  }, {});

  function download() {
    const md = buildMarkdown(config, customRules, name);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_spelregels.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="card">
        <div className="row between mb">
          <h2 style={{ margin: 0 }}>{name}</h2>
          <button className="btn" onClick={download}>📥 Download .md</button>
        </div>
        <p>Win door <b>{winVP} overwinningspunten</b> te behalen.</p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>🎯 Beurtstructuur</h2>
        {phases.map(p => (
          <div key={p.n} style={{ marginBottom: 10 }}>
            <div className="rule-name">Fase {p.n} — {p.name}</div>
            <div className="rule-desc">{p.desc}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>👑 Winvoorwaarden</h2>
        <table>
          <thead><tr><th>VP</th><th>Bron</th></tr></thead>
          <tbody>
            {vp.map((v, i) => (
              <tr key={i}><td style={{ color: 'var(--gold)', fontWeight: 700 }}>{v.pts}</td><td>{v.desc}</td></tr>
            ))}
          </tbody>
        </table>
        {config.survival_win && <p className="small mt">🧟 <b>Survival-overwinning</b>: laatste met gebouwen wint direct.</p>}
        {config.militaire_win && <p className="small">⚔️ <b>Militaire overwinning</b>: alle tegenstanders plunderen = directe winst.</p>}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>💰 Bouwkosten</h2>
        {Object.entries(byCat).map(([cat, list]) => (
          <div key={cat}>
            <h3>{cat}</h3>
            <table>
              <tbody>
                {list.map(it => (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td style={{ textAlign: 'right' }}>{resourceStr(it.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>📖 Actieve regels</h2>
        {CATEGORIES.map(cat => {
          const rules = (RULES_BY_CAT[cat.id] || []).filter(r => config[r.id]);
          const custom = customRules.filter(r => r.cat === cat.id && config[r.id]);
          if (rules.length === 0 && custom.length === 0) return null;
          return (
            <div key={cat.id} style={{ marginBottom: 12 }}>
              <h3 style={{ color: cat.color }}>{cat.emoji} {cat.name}</h3>
              {[...rules, ...custom].map(r => (
                <div key={r.id} style={{ marginBottom: 6 }}>
                  <div className="rule-name" style={{ fontSize: 13 }}>{r.name}</div>
                  <div className="rule-desc">{r.desc}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
