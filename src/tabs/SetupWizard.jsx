import { useMemo, useState } from 'react';
import HexBoard, { axialToPixel, renderHex } from '../components/HexTile.jsx';
import { usePrintableQty } from '../utils/printableQty.js';

const PLAYER_COLORS = ['#d33', '#4a4', '#38b', '#e8b923'];
const PLAYER_NAMES = ['Rood', 'Groen', 'Blauw', 'Geel'];

// Center desert/volcano + classic 7-hex Catan starter island
function mainIslandTiles(cfg) {
  const center = cfg.vulkaan
    ? { q: 0, r: 0, type: 'vulkaan' }
    : { q: 0, r: 0, type: 'woestijn' };
  return [
    center,
    { q: 1, r: -1, type: 'bos', number: 11 },
    { q: 1, r: 0, type: 'heuvels', number: 6 },
    { q: 0, r: 1, type: 'bergen', number: 8 },
    { q: -1, r: 1, type: 'akkers', number: 4 },
    { q: -1, r: 0, type: 'weiden', number: 3 },
    { q: 0, r: -1, type: 'bos', number: 9 },
  ];
}

function mainPlusWater(cfg) {
  const main = mainIslandTiles(cfg);
  // Surrounding water ring (12 hexes in Catan Seafarers-style)
  const water = [];
  const waterCoords = [
    [2, -2], [2, -1], [2, 0], [1, 1], [0, 2], [-1, 2],
    [-2, 2], [-2, 1], [-2, 0], [-1, -1], [0, -2], [1, -2],
  ];
  waterCoords.forEach(([q, r]) => water.push({ q, r, type: 'water' }));
  return [...main, ...water];
}

// Standard Catan starting placement (2 settlements + 2 roads per player)
// Coords are hex corners (6 per hex, indexed 0-5)
function startPlacements(size) {
  // Two settlements per player colour, reasonably spread
  // Using axial (q,r) + corner index (0-5)
  const settlements = [
    { q: 1, r: -1, corner: 5, player: 0 }, { q: -1, r: 1, corner: 2, player: 0 },
    { q: 1, r: 0, corner: 4, player: 1 }, { q: -1, r: 0, corner: 1, player: 1 },
    { q: 0, r: 1, corner: 5, player: 2 }, { q: 0, r: -1, corner: 2, player: 2 },
    { q: 1, r: -1, corner: 0, player: 3 }, { q: -1, r: 1, corner: 3, player: 3 },
  ];
  function cornerPos(q, r, i) {
    const [cx, cy] = axialToPixel(q, r, size);
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return [cx + size * Math.cos(a), cy + size * Math.sin(a)];
  }
  return settlements.map(s => {
    const [x, y] = cornerPos(s.q, s.r, s.corner);
    return { ...s, x, y };
  });
}

export default function SetupWizard({ config }) {
  const qty = usePrintableQty();
  const steps = useMemo(() => buildSteps(config, qty), [config, qty]);
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div>
      <div className="wiz-indicator">
        {steps.map((s, i) => (
          <div key={i}
            className={`wiz-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            onClick={() => setStep(i)}
            style={{ cursor: 'pointer' }}
          >{i + 1}</div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Stap {step + 1}/{steps.length}: {current.title}</h2>
        {current.render(config, qty)}
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button className="btn-secondary" onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}>← Vorige</button>
        <div className="grow" />
        <button className="btn" onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}>Volgende →</button>
      </div>
    </div>
  );
}

function Chips({ items }) {
  return (
    <div className="row wrap mt" style={{ gap: 6 }}>
      {items.filter(Boolean).map((x, i) => (
        <span key={i} className="counter-pill" style={{ fontSize: 11 }}>{x}</span>
      ))}
    </div>
  );
}

function buildSteps(cfg, qty) {
  const steps = [];

  steps.push({
    title: 'Leg het hoofdeiland',
    render: () => (
      <>
        <p>Plaats de <b>7 landtegels</b> in standaard Catan-patroon. {cfg.vulkaan && <>Midden: <b>vulkaan</b> (vervangt woestijn).</>}</p>
        <p className="small muted">Voorbeeld met nummertokens:</p>
        <HexBoard tiles={mainIslandTiles(cfg)} size={36} />
      </>
    ),
  });

  steps.push({
    title: 'Leg de waterring',
    render: () => (
      <>
        <p>Leg <b>12 watertegels</b> rond het hoofdeiland. Je hebt er nog meer nodig als je <code>procedurele ontdekking</code> gebruikt.</p>
        <HexBoard tiles={mainPlusWater(cfg)} size={26} />
        <Chips items={[
          `Benodigd: 12 watertegels`,
          `Je qty: ${qty('water_hex')}×`,
          `Basisplaten water: ${qty('basis_water')}×`,
        ]} />
      </>
    ),
  });

  if (cfg.procedureel) {
    steps.push({
      title: 'Vul de Ontdekking-bak',
      render: () => (
        <>
          <p>Plaats alle ontdekkingstegels <b>geshufflede in de Ontdekking-bak</b> (3D-tegels kun je niet omdraaien, dus we gebruiken een doos met vakken waar je de volgorde vooraf door elkaar legt). Tijdens spel pak je steeds de volgende uit het eerstvolgende vak — niemand weet welke tegel er volgt. Tel bij elkaar wat erin moet:</p>
          <ul>
            <li>Open zee: <b>12</b></li>
            {cfg.specerij && <li>Jungle: <b>{qty('jungle_hex', 3)}</b></li>}
            {cfg.vis && <li>Koraalrif: <b>{qty('koraal_hex', 3)}</b></li>}
            <li>Extra land (bos/heuvels/bergen/akkers/weiden): <b>{qty('extra_land', 12)}</b></li>
            {cfg.ruine && <li>Ruïnes: <b>{qty('ruine_hex', 2)}</b></li>}
            {cfg.maalstroom && <li>Maalstroom: <b>{qty('maalstroom_hex', 1)}</b></li>}
            {cfg.rif && <li>Rif (stenen): <b>{qty('rif_hex', 2)}</b></li>}
            {cfg.piratenschuilplaats && <li>Piratenschuilplaats: <b>{qty('piraat_hex', 1)}</b></li>}
            {cfg.drakenei && <li>Drakenei: <b>{qty('drakenei_hex', 1)}</b></li>}
            {cfg.handelspost && <li>Handelspost: <b>{qty('handelspost_hex', 1)}</b></li>}
            {cfg.goudmijn && <li>Goudmijn: <b>{qty('goudmijn_hex', 1)}</b></li>}
            {cfg.goudrivier && <li>Goudrivier: <b>{qty('goudrivier_hex', 1)}</b></li>}
          </ul>
          <p className="small muted"><b>Shuffle-truc</b>: draai je om, laat een andere speler de tegels willekeurig in de vakken leggen. Of schud in een emmer en laat ze per vak "vallen" zonder te kijken.</p>
        </>
      ),
    });
  }

  steps.push({
    title: 'Plaats havens',
    render: () => (
      <>
        <p>Plaats <b>{qty('havens', 5)} haven{qty('havens', 5) === 1 ? '' : 's'}</b> aan de rand van het hoofdeiland, tegen water aan:</p>
        <ul className="small">
          <li>2× Generiek (3:1 alles)</li>
          <li>1× Hout (2:1)</li>
          <li>1× Baksteen (2:1)</li>
          <li>1× Graan (2:1)</li>
        </ul>
        {/* Small demo with havens as triangles on coast corners */}
        <HexBoard tiles={mainPlusWater(cfg)} size={22} extra={(() => {
          const haven = [
            { q: 1, r: -2, label: '3:1' },
            { q: -2, r: 1, label: '3:1' },
            { q: 2, r: 0, label: '🪵' },
            { q: 0, r: 2, label: '🧱' },
            { q: -1, r: -1, label: '🌾' },
          ];
          return haven.slice(0, qty('havens', 5)).map((h, i) => {
            const [x, y] = axialToPixel(h.q, h.r, 22);
            return (
              <g key={`hv${i}`} transform={`translate(${x}, ${y})`}>
                <circle r="7" fill="#8a5a2a" stroke="#1a1008" strokeWidth="1" />
                <text textAnchor="middle" fontSize="8" y="3" fill="#fff">{h.label}</text>
              </g>
            );
          });
        })()} />
      </>
    ),
  });

  steps.push({
    title: 'Nummertokens',
    render: () => (
      <>
        <p>Leg nummertokens op de {cfg.vulkaan ? 'productieve' : 'niet-woestijn'}-hexen. Houd <b>15 reserve</b> apart voor nieuw-ontdekte tegels.</p>
        <p className="small muted">Voorbeeld: 6 en 8 krijgen <span style={{ color: 'var(--red)' }}>rode</span> tekst (meest kans).</p>
        <HexBoard tiles={mainIslandTiles(cfg)} size={36} />
      </>
    ),
  });

  if (cfg.getijdenmarkers) {
    steps.push({
      title: 'Leg getijdenmarkers',
      render: () => (
        <>
          <p>Leg markers <b>①②③</b> op 3 willekeurige buitenrandtegels. Die bepalen welke tegels als volgende overstromen.</p>
          <div className="row wrap" style={{ gap: 10, justifyContent: 'center', fontSize: 32 }}>
            <span>①</span><span>②</span><span>③</span>
          </div>
        </>
      ),
    });
  }

  if (cfg.seizoensrad) {
    steps.push({
      title: 'Zet seizoensrad op Lente',
      render: () => (
        <>
          <p>Plaats het seizoensrad op <b>🌱 Lente</b>. Elke 4 rondes draait het door.</p>
          <p className="small muted">Lente → Zomer → Herfst → Winter → Lente</p>
          <div className="row" style={{ gap: 14, justifyContent: 'center', fontSize: 28, marginTop: 12 }}>
            <span style={{ opacity: 1 }}>🌱</span>
            <span style={{ opacity: 0.4 }}>☀️</span>
            <span style={{ opacity: 0.4 }}>🍂</span>
            <span style={{ opacity: 0.4 }}>❄️</span>
          </div>
        </>
      ),
    });
  }

  steps.push({
    title: 'Tokens & trek-bakken klaarzetten',
    render: () => (
      <ul>
        {cfg.kaartstapel && <li>Leg de <b>{qty('nummerkaarten', 36)} nummer-trekschijven</b> vooraf geshuffled in een kleine trek-bak (vervangt dobbelsteen)</li>}
        <li>Leg de <b>{qty('ontwik_tokens', 32)} ontwikkelings-scrolls</b> geshuffled in een kleine trek-bak met vakken</li>
        {cfg.vis && <li>Leg de <b>{qty('vis_kaarten', 19)} vis-tokens</b> bij de bank</li>}
        {cfg.specerij && <li>Leg de <b>{qty('specerij_kaarten', 14)} specerij-potjes</b> bij de bank</li>}
        {cfg.gildehall && <li>Leg de <b>{qty('gildekaarten', 6)} gilde-insignias</b> open zichtbaar bij de gildehall-voorraad</li>}
      </ul>
    ),
  });

  if (cfg.relieken) {
    steps.push({
      title: 'Leg relieken klaar',
      render: () => (
        <p>Leg <b>3 relieken</b> in de tempelvoorraad, <b>2 onder ruïnetegels</b>, en <b>1 Zeegod-reliek</b> apart.</p>
      ),
    });
  }

  steps.push({
    title: 'Leg tokens klaar',
    render: () => (
      <ul>
        {cfg.goud && <li>🪙 Goudmunten ({qty('goudmunten', 40)}) in bank</li>}
        {cfg.trofeeen && <li>🏆 Trofeeën per type</li>}
        {cfg.monsters && <li>👹 Monsterfiguren ({qty('wilde_beesten', 4)} beesten, {qty('stenen_golems', 2)} golems, {qty('zeemonsters', 2)} zeemonsters)</li>}
        {cfg.huurlingen && <li>⚔️ Huurlingen: {qty('huurlingen_fig', 6)} (grijs)</li>}
        {cfg.voedsel && <li>💀 Verlaten-dorp-markers ({qty('verlaten_dorp', 8)})</li>}
        {cfg.ziekte && <li>☠️ Ziektetokens ({qty('ziekte_tokens', 8)})</li>}
        {cfg.gunst && <li>⭐ Gunst-tokens ({qty('gunst_tokens', 60)})</li>}
      </ul>
    ),
  });

  steps.push({
    title: 'Per speler: pak je stukken',
    render: () => {
      const perP = [
        { c: true, label: `${qty('dorpen', 5)} dorpen` },
        { c: true, label: `${qty('steden', 4)} steden` },
        { c: true, label: `${qty('wegen', 15)} wegen` },
        { c: cfg.sluiproute, label: `${qty('sluiproute_fig', 5)} sluiproutes` },
        { c: cfg.scheepswerf, label: `${qty('scheepswerf_fig', 2)} scheepswerven` },
        { c: cfg.handelsschip, label: `${qty('handelsschip_fig', 6)} handelsschepen` },
        { c: cfg.oorlogsschip, label: `${qty('oorlogsschip_fig', 3)} oorlogsschepen` },
        { c: cfg.vissersboot, label: `${qty('vissersboot_fig', 3)} vissersbootjes` },
        { c: cfg.dijk, label: `${qty('dijk_fig', 4)} dijken` },
        { c: cfg.palissade, label: `${qty('palissade_fig', 3)} palissades` },
        { c: cfg.orakel, label: `${qty('orakelschijven', 11)} orakelschijven (2-12)` },
        { c: cfg.pvp, label: `${qty('militie_fig', 8)} milities` },
        { c: cfg.boogschutter, label: `${qty('boogschutter_fig', 3)} boogschutters` },
        { c: cfg.katapult, label: `${qty('katapult_fig', 1)} katapult` },
        { c: cfg.scheepssoldaat, label: `${qty('scheepssoldaat_fig', 4)} scheepssoldaten` },
        { c: cfg.spionnen, label: `${qty('spion_fig', 2)} spionnen` },
        { c: cfg.fort, label: `${qty('fort_fig', 1)} fort` },
        { c: cfg.gildehall, label: `${qty('gildehall_fig', 1)} gildehall` },
        { c: cfg.smederij, label: `${qty('smederij_fig', 1)} smederij` },
        { c: cfg.tempel, label: `${qty('tempel_fig', 1)} tempel` },
        { c: cfg.markt, label: `${qty('markt_fig', 1)} markt` },
        { c: cfg.voorraadschuur, label: `${qty('voorraad_fig', 2)} voorraadschuren` },
        { c: cfg.legerkamp, label: `${qty('legerkamp_fig', 1)} legerkamp` },
        { c: cfg.vuurtoren, label: `${qty('vuurtoren_fig', 1)} vuurtoren` },
        { c: cfg.stadsmuur, label: `${qty('stadsmuur_token', 2)} stadsmuren` },
        { c: cfg.helden, label: `${qty('held_fig', 1)} held` },
        { c: cfg.mythische_eenheden, label: `${qty('mythische_units', 8)} mythische eenheden + ${qty('titan_fig', 1)} titan` },
        { c: cfg.tijdperken, label: `1 tijdperkmarker` },
      ];
      return (
        <>
          <p>Iedere speler krijgt een eigen kleur. Voorbeeld stukken:</p>
          <ul style={{ columnCount: 2, columnGap: 14 }}>
            {perP.filter(x => x.c).map((x, i) => <li key={i} style={{ breakInside: 'avoid', fontSize: 13 }}>{x.label}</li>)}
          </ul>
        </>
      );
    },
  });

  if (cfg.beschermgoden) {
    steps.push({
      title: 'Kies god',
      render: () => (
        <>
          <p>Elke speler kiest een <b>beschermgod</b>:</p>
          <ul>
            <li>🔱 Poseidon — heerser van de zee</li>
            <li>🦉 Athena — strateeg, wijsheid</li>
            <li>⚔️ Ares — oorlog en kracht</li>
            <li>🌾 Demeter — overvloed en oogst</li>
          </ul>
        </>
      ),
    });
  }

  steps.push({
    title: 'Startplaatsing',
    render: () => {
      const size = 30;
      const placements = startPlacements(size);
      const settlementEls = placements.map((s, i) => (
        <g key={`p${i}`} transform={`translate(${s.x}, ${s.y})`}>
          <polygon points="-5,-2 0,-7 5,-2 5,5 -5,5" fill={PLAYER_COLORS[s.player]} stroke="#000" strokeWidth="1" />
        </g>
      ));
      return (
        <>
          <p>In <b>omgekeerde volgorde</b> plaatst elke speler <b>2 dorpen + 2 wegen</b>.</p>
          {cfg.scheepswerf && <p className="small">⛵ Minstens 1 dorp moet op een <b>kustintersectie</b> liggen.</p>}
          <HexBoard tiles={mainIslandTiles(cfg)} size={size} extra={settlementEls} />
          <Chips items={PLAYER_NAMES.map((n, i) => `${n}: 2 dorpen`)} />
        </>
      );
    },
  });

  steps.push({
    title: 'Startgrondstoffen',
    render: () => (
      <>
        <p>Elke speler ontvangt de grondstoffen rondom hun <b>2e dorp</b>.</p>
        <ul>
          <li>1 grondstof per aangrenzende productie-hex bij 2e dorp</li>
          {cfg.vis && <li>🐟 +1 vis extra (per speler)</li>}
          {cfg.goud && <li>🪙 +2 goudmunten (per speler)</li>}
        </ul>
        <p className="small muted">Tip: leg de 1e dorpen ergens slim en bouw je openingsstrategie op rond het 2e dorp — dat bepaalt je start.</p>
      </>
    ),
  });

  return steps;
}
