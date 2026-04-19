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
  if (cfg.versterking) phases.push({
    n: 0, name: 'Versterking', icon: '🛡️',
    summary: 'Pak gratis milities voor begin van je beurt.',
    details: [
      'Tel je hexen mét gebouwen van jou. Deel door 3 (min 1).',
      'Zoveel milities krijg je gratis, zet ze op je gebouwen.',
      'Einde beurt: 1 eenheid mag 1 stap gratis bewegen (fortificatie).',
    ],
  });
  if (cfg.orakel) phases.push({
    n: 1, name: 'Orakel', icon: '🔮',
    summary: 'Leg een gesloten orakelschijf met jouw gok.',
    details: [
      'Leg 1 schijf 2-12 gesloten neer — jouw voorspelling voor de komende worp.',
      'Goed geraden: bonus-grondstof. Fout: tegenstanders zien jouw gok — bluf hoek.',
    ],
  });
  phases.push({
    n: 2, name: 'Productie', icon: '🎲',
    summary: cfg.kaartstapel
      ? 'Trek de volgende nummer-trekschijf uit de trek-bak.'
      : 'Werp 2 dobbelstenen.',
    details: [
      cfg.kaartstapel
        ? 'Pak de volgende schijf en leg hem naar de gebruikte stapel. Zo worden 2/12 zeldzaam maar gegarandeerd.'
        : 'Standaard 2d6. Elk nummer = hex met die pip produceert voor alle aangrenzende dorpen/steden.',
      'Dorp = 1 grondstof, stad = 2.',
    ],
  });
  const phase3Details = ['Rover verplaatst naar andere hex (mag niet op zee). Beroof 1 speler van 1 kaart.'];
  if (cfg.piraat) phase3Details.push('Piraat verplaatst ook: blokkeert alle schepen op aangrenzende water-hexen.');
  if (cfg.getijden) phase3Details.push('Extra getijdenworp: 1d6 → 1-2 niets, 3-4 vloed (1 overstroming), 5-6 stormvloed (2).');
  if (cfg.vulkaan) phase3Details.push('Twee 7\'s achter elkaar? Vulkaanuitbarsting: alle aangrenzende gebouwen vernietigd + lavategel.');
  phases.push({
    n: 3, name: 'De 7 — rover & gevaren', icon: '⚠️',
    summary: 'Bij een 7: iedereen met 8+ grondstoffen haalt de helft weg.',
    details: phase3Details,
  });
  if (cfg.voedsel) phases.push({
    n: 4, name: 'Voedselronde', icon: '🍞',
    summary: '(Bij seizoenswisseling) betaal voedsel voor je zielen.',
    details: [
      'Per 3 zielen → 1 graan of 1 vis afdragen.',
      'Tekort: dorpen verlaten, steden degraderen.',
      cfg.winterhard ? 'Winter: kosten verdubbeld.' : '',
      cfg.ziekte ? 'Bij hongersnood: kans op ziekte (verspreidt via wegen).' : '',
    ].filter(Boolean),
  });
  const handelD = ['Ruil met andere spelers (1:1 alles mag).', 'Ruil met bank: 4:1 of via haven (3:1 generiek, 2:1 resource).'];
  if (cfg.contracten) handelD.push('Contract tekenen: 3 rondes vaste 1:1 ruil met 1 speler. Verbreken = 2🪙 boete.');
  if (cfg.goud) handelD.push('Goud is volledig ruilbaar als universele munt.');
  phases.push({ n: 5, name: 'Handel', icon: '🔄', summary: 'Ruil met spelers en bank.', details: handelD });
  const bouwD = ['Betaal de kosten (zie tabel onderaan) en plaats het stuk.'];
  if (cfg.smederij) bouwD.push('Smederij: craft uitrustingsstukken (zie items).');
  if (cfg.itemsysteem) bouwD.push('Markt: koop een item voor 3🪙.');
  phases.push({ n: 6, name: 'Bouwen & smeden', icon: '🔨', summary: 'Bouw dorpen, steden, wegen, gebouwen, schepen.', details: bouwD });
  if (cfg.pvp) phases.push({
    n: 7, name: 'Mobilisatie & gevecht', icon: '⚔️',
    summary: 'Verplaats eenheden, val aan.',
    details: [
      'Verplaats elk een pad (2 stappen basis, 3 met legerkamp).',
      'Aanvalskracht bepaalt dobbelstenen: 1-2 → 1🎲, 3-4 → 2🎲, 5+ → 3🎲.',
      'Verdediger gebruikt 2🎲. Hoogste dobbelsteen wint. Gelijk = verdediger.',
      'Voorbeeld: aanvaller kracht 5 (3🎲: 6,4,2) vs verdediger kracht 2 (2🎲: 5,3). Hoogste: 6>5 aanvaller wint.',
    ],
  });
  if (cfg.procedureel) phases.push({
    n: 8, name: 'Ontdekking', icon: '🧭',
    summary: 'Trek nieuwe tegel als je schip een onverkend veld bereikt.',
    details: [
      'Pak de volgende tegel uit de Ontdekking-bak (vooraf geshuffled in vakken).',
      'Plaats de tegel, handel eventueel effect af (monster, ruïne, etc).',
      cfg.kompas ? 'Kompas-item: +1 tegel per ontdekking.' : '',
    ].filter(Boolean),
  });
  const f9 = [];
  if (cfg.trofeesets) f9.push('Claim trofee-sets voor VP.');
  if (cfg.schatkaarten) f9.push('Combineer schatkaart-fragmenten (6 = Verloren Schat, 3 VP).');
  if (cfg.versterking) f9.push('Fortificatie: 1 eenheid gratis 1 hex verplaatsen.');
  if (f9.length) phases.push({ n: 9, name: 'Verzameling & fortificatie', icon: '🏆', summary: 'Afronding van je beurt.', details: f9 });

  return phases;
}

function victoryPoints(cfg) {
  const vp = [];
  vp.push({ pts: 1, desc: 'Dorp' });
  vp.push({ pts: 2, desc: 'Stad' });
  if (cfg.fort) vp.push({ pts: 2, desc: 'Fort' });
  if (cfg.gildehall) vp.push({ pts: 3, desc: 'Gildehall' });
  if (cfg.vuurtoren) vp.push({ pts: 1, desc: 'Vuurtoren' });
  vp.push({ pts: 2, desc: 'Langste Route (min 5 wegen)' });
  vp.push({ pts: 2, desc: 'Grootste Ridderleger (min 3)' });
  if (cfg.grootste_vloot) vp.push({ pts: 2, desc: 'Grootste Vloot (min 2 oorlogsschepen)' });
  if (cfg.meesterontdekker) vp.push({ pts: 2, desc: 'Meesterontdekker (min 3 ontdekte tegels)' });
  vp.push({ pts: 1, desc: 'VP-ontwikkelingskaart' });
  if (cfg.koopman) vp.push({ pts: 1, desc: 'Koopman (op landtegel)' });
  if (cfg.relieken) vp.push({ pts: '1-2', desc: 'Relieken (variabel, Drietand 2)' });
  if (cfg.trofeesets) vp.push({ pts: '1-3', desc: 'Trofee-sets (Drakendoder 3)' });
  if (cfg.schatkaarten) vp.push({ pts: 3, desc: 'Verloren Schat (6 fragmenten)' });
  if (cfg.goudenKroon) vp.push({ pts: 1, desc: 'Gouden Kroon (item)' });
  if (cfg.geheime_missies) vp.push({ pts: 3, desc: 'Geheime missie voltooid' });
  return vp;
}

function winPoints(cfg) { return cfg.lagere_vp ? 12 : 16; }

function buildMarkdown(cfg, customRules, name) {
  let md = `# ${name}\n\n`;
  md += `## Hoe te winnen\n\n**${winPoints(cfg)} overwinningspunten** als eerste behalen.\n\n`;
  md += `## Beurtstructuur\n\n`;
  buildPhases(cfg).forEach(p => {
    md += `### Fase ${p.n} — ${p.icon} ${p.name}\n**${p.summary}**\n\n`;
    p.details.forEach(d => { md += `- ${d}\n`; });
    md += `\n`;
  });
  md += `## Overwinningspunten\n\n`;
  victoryPoints(cfg).forEach(v => md += `- **${v.pts} VP** — ${v.desc}\n`);
  if (cfg.survival_win) md += `- **Survival**: laatste speler met gebouwen wint direct.\n`;
  if (cfg.militaire_win) md += `- **Militair**: plunder alle tegenstanders voor directe winst.\n`;
  md += `\n## Bouwkosten\n\n`;
  const items = BUILD_ITEMS.filter(it => !it.rule || cfg[it.rule]);
  const byCat = items.reduce((a, it) => { (a[it.cat] = a[it.cat] || []).push(it); return a; }, {});
  Object.entries(byCat).forEach(([cat, list]) => {
    md += `### ${cat}\n`;
    list.forEach(it => md += `- **${it.name}**: ${resourceStr(it.cost)}\n`);
    md += `\n`;
  });
  md += `## Regels per categorie\n\n`;
  CATEGORIES.forEach(cat => {
    const rules = (RULES_BY_CAT[cat.id] || []).filter(r => cfg[r.id]);
    const custom = customRules.filter(r => r.cat === cat.id && cfg[r.id]);
    if (rules.length === 0 && custom.length === 0) return;
    md += `### ${cat.emoji} ${cat.name}\n\n`;
    [...rules, ...custom].forEach(r => md += `- **${r.name}**: ${r.desc}\n`);
    md += `\n`;
  });
  return md;
}

export default function Spelregels({ config, customRules, name }) {
  const phases = useMemo(() => buildPhases(config), [config]);
  const vp = useMemo(() => victoryPoints(config), [config]);
  const winVP = winPoints(config);

  const items = useMemo(() => BUILD_ITEMS.filter(it => !it.rule || config[it.rule]), [config]);
  const byCat = items.reduce((a, it) => { (a[it.cat] = a[it.cat] || []).push(it); return a; }, {});

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
      {/* Hero */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #2a1f10 0%, #1a1308 100%)', border: '1px solid var(--gold)' }}>
        <div className="row between mb">
          <h2 style={{ margin: 0 }}>{name}</h2>
          <button className="btn" onClick={download}>📥 .md</button>
        </div>
        <p style={{ fontSize: 16, margin: '8px 0' }}>
          Win door als eerste <b style={{ color: 'var(--gold)', fontSize: 22 }}>{winVP} VP</b> te behalen.
        </p>
        {config.survival_win && <p className="small">🧟 Of: laatste speler met gebouwen = directe winst.</p>}
        {config.militaire_win && <p className="small">⚔️ Of: alle tegenstanders plunderen = directe winst.</p>}
      </div>

      {/* Beurt-overzicht */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>🕹️ Je beurt in één oogopslag</h2>
        <div className="row wrap" style={{ gap: 6 }}>
          {phases.map(p => (
            <span key={p.n} className="counter-pill" style={{ fontSize: 13, padding: '6px 10px' }}>
              {p.icon} {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Per fase uitgeklapt */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>🎯 Beurtstructuur per fase</h2>
        {phases.map(p => (
          <div key={p.n} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div className="row" style={{ gap: 8, alignItems: 'baseline' }}>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <h3 style={{ margin: 0, flex: 1 }}>Fase {p.n}: {p.name}</h3>
            </div>
            <p style={{ margin: '4px 0 6px', color: 'var(--gold)', fontWeight: 600 }}>{p.summary}</p>
            <ul>
              {p.details.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Winvoorwaarden */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>👑 Waar haal je punten?</h2>
        <table>
          <thead><tr><th style={{ width: 70 }}>VP</th><th>Bron</th></tr></thead>
          <tbody>
            {vp.map((v, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 18 }}>{v.pts}</td>
                <td>{v.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bouwkosten */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>💰 Bouwkosten</h2>
        {Object.entries(byCat).map(([cat, list]) => (
          <div key={cat} style={{ marginBottom: 12 }}>
            <h3>{cat}</h3>
            <table>
              <tbody>
                {list.map(it => (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--gold)' }}>{resourceStr(it.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Regels per categorie */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>📖 Actieve regels per categorie</h2>
        {CATEGORIES.map(cat => {
          const rules = (RULES_BY_CAT[cat.id] || []).filter(r => config[r.id]);
          const custom = customRules.filter(r => r.cat === cat.id && config[r.id]);
          if (rules.length === 0 && custom.length === 0) return null;
          return (
            <details key={cat.id} style={{ marginBottom: 8, padding: '8px 12px', background: 'var(--bg-elev-2)', borderRadius: 8, borderLeft: `3px solid ${cat.color}` }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, color: cat.color, fontSize: 14 }}>
                {cat.emoji} {cat.name} — {rules.length + custom.length}
              </summary>
              <div className="mt">
                {[...rules, ...custom].map(r => (
                  <div key={r.id} style={{ padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="rule-name" style={{ fontSize: 13 }}>{r.name}</div>
                    <div className="rule-desc">{r.desc}</div>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
