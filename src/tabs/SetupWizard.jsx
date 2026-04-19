import { useMemo, useState } from 'react';

const HEX_COLORS = {
  bos: '#2d5a2d',
  heuvels: '#c2622c',
  bergen: '#6b6b6b',
  akkers: '#e0b93a',
  weiden: '#7bb33a',
  vulkaan: '#4a1212',
  woestijn: '#caa86a',
  water: '#2a5a8a',
};

function HexGrid({ vulkaanActive }) {
  const center = vulkaanActive ? { label: 'Vulkaan', color: HEX_COLORS.vulkaan } : { label: 'Woestijn', color: HEX_COLORS.woestijn };
  const ring = [
    { label: 'Bos', color: HEX_COLORS.bos },
    { label: 'Heuvels', color: HEX_COLORS.heuvels },
    { label: 'Bergen', color: HEX_COLORS.bergen },
    { label: 'Akkers', color: HEX_COLORS.akkers },
    { label: 'Weiden', color: HEX_COLORS.weiden },
    { label: 'Bos', color: HEX_COLORS.bos },
  ];
  return (
    <div className="hex-grid">
      <div className="hex-row">
        <div className="hex" style={{ background: ring[0].color }}>{ring[0].label}</div>
        <div className="hex" style={{ background: ring[1].color }}>{ring[1].label}</div>
      </div>
      <div className="hex-row">
        <div className="hex" style={{ background: ring[5].color }}>{ring[5].label}</div>
        <div className="hex" style={{ background: center.color, border: '2px solid var(--gold)' }}>{center.label}</div>
        <div className="hex" style={{ background: ring[2].color }}>{ring[2].label}</div>
      </div>
      <div className="hex-row">
        <div className="hex" style={{ background: ring[4].color }}>{ring[4].label}</div>
        <div className="hex" style={{ background: ring[3].color }}>{ring[3].label}</div>
      </div>
    </div>
  );
}

export default function SetupWizard({ config }) {
  const steps = useMemo(() => buildSteps(config), [config]);
  const [step, setStep] = useState(0);

  const current = steps[step];

  return (
    <div>
      <div className="wiz-indicator">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`wiz-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            onClick={() => setStep(i)}
            style={{ cursor: 'pointer' }}
          >{i + 1}</div>
        ))}
      </div>

      <div className="card">
        <div className="row between mb">
          <h2 style={{ margin: 0 }}>Stap {step + 1}/{steps.length}: {current.title}</h2>
        </div>
        {current.render(config)}
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button
          className="btn-secondary"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >← Vorige</button>
        <div className="grow" />
        <button
          className="btn"
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
        >Volgende →</button>
      </div>
    </div>
  );
}

function buildSteps(cfg) {
  const steps = [];
  steps.push({ title: 'Leg het hoofdeiland', render: () => (
    <>
      <p>Leg de 7 landtegels in standaard Catan-patroon. {cfg.vulkaan && <><b>Midden: Vulkaan</b> (vervangt woestijn).</>}</p>
      <HexGrid vulkaanActive={cfg.vulkaan} />
      <p className="small muted">Elke tegel grenst aan 3 andere landtegels (of zee aan de rand).</p>
    </>
  ) });

  steps.push({ title: 'Leg de waterring', render: () => (
    <p>Leg <b>12 watertegels</b> rondom het hoofdeiland. Deze vormen de binnenring waarop je kunt varen.</p>
  ) });

  if (cfg.procedureel) {
    steps.push({ title: 'Bereid de trekstapel voor', render: () => (
      <>
        <p>Tel alle extra tegels op die in de trekstapel moeten:</p>
        <ul>
          {cfg.procedureel && <li>12 open zee tegels</li>}
          {cfg.specerij && <li>3 jungle-hexes</li>}
          {cfg.vis && <li>3 koraalrif-hexes</li>}
          <li>2-3 extra bos/heuvels/bergen/akkers/weiden</li>
          {cfg.ruine && <li>2 ruïne-tegels</li>}
          {cfg.maalstroom && <li>1 maalstroom-tegel</li>}
          {cfg.piratenschuilplaats && <li>1 piratenschuilplaats-tegel</li>}
          {cfg.drakenei && <li>1 drakenei-tegel</li>}
          {cfg.handelspost && <li>1 handelspost-tegel</li>}
          {cfg.goudmijn && <li>1 goudmijn-tegel</li>}
          {cfg.goudrivier && <li>1 goudrivier-tegel</li>}
        </ul>
        <p><b>Schud de stapel en leg de mistkant omhoog.</b></p>
      </>
    ) });
  }

  steps.push({ title: 'Plaats havens', render: () => (
    <p>Plaats <b>5 haventegels</b> aan de rand van het hoofdeiland: 2× generiek 3:1, 1× hout 2:1, 1× baksteen 2:1, 1× graan 2:1.</p>
  ) });

  steps.push({ title: 'Nummertokens', render: () => (
    <p>Leg de nummertokens op het hoofdeiland (niet op vulkaan/woestijn). Houd <b>15 reserve</b> apart voor nieuw-ontdekte tegels.</p>
  ) });

  if (cfg.getijdenmarkers) {
    steps.push({ title: 'Leg getijdenmarkers', render: () => (
      <p>Leg markers <b>①②③</b> op 3 willekeurige buitenrandtegels. Deze bepalen welke tegels als volgende overstromen.</p>
    ) });
  }

  if (cfg.seizoensrad) {
    steps.push({ title: 'Zet seizoensrad op Lente', render: () => (
      <p>Plaats het seizoensrad op <b>🌱 Lente</b>. Elke 4 rondes draait het door.</p>
    ) });
  }

  steps.push({ title: 'Schud kaartstapels', render: () => (
    <>
      <ul>
        {cfg.kaartstapel && <li>Schud de 36 nummerkaartstapel (alle 2d6 combinaties)</li>}
        <li>Schud de ontwikkelingskaartenstapel</li>
        {(cfg.ride_by_night || cfg.night_of_plenty || cfg.monorail || cfg.vlootadmiraal || cfg.orakelvisioen || cfg.goudkoorts || cfg.koopman) && (
          <li>Voeg extra ontwikkelingskaarten toe aan de stapel</li>
        )}
      </ul>
    </>
  ) });

  if (cfg.relieken) {
    steps.push({ title: 'Leg relieken klaar', render: () => (
      <p>Leg <b>3 relieken</b> in de tempelvoorraad, <b>2 onder ruïnetegels</b>, en <b>1 Zeegod-reliek</b> apart.</p>
    ) });
  }

  steps.push({ title: 'Leg tokens klaar', render: () => (
    <ul>
      {cfg.goud && <li>Goudmunten (voorraad)</li>}
      {cfg.trofeeen && <li>Trofeeën per type</li>}
      {cfg.monsters && <li>Monsterfiguren</li>}
      {cfg.huurlingen && <li>Huurlingen (grijs)</li>}
      {cfg.voedsel && <li>Verlaten-dorp-markers</li>}
      {cfg.ziekte && <li>Ziektetokens</li>}
      {cfg.gunst && <li>Gunst-tokens</li>}
      <li>Ontwikkelingskaartenstapel</li>
    </ul>
  ) });

  steps.push({ title: 'Per speler: pak je stukken', render: () => (
    <ul>
      <li>5 dorpen, 4 steden, 15 wegen</li>
      {cfg.sluiproute && <li>5 sluiproutes</li>}
      {cfg.scheepswerf && <li>2 scheepswerven</li>}
      {cfg.handelsschip && <li>6 handelsschepen</li>}
      {cfg.oorlogsschip && <li>3 oorlogsschepen</li>}
      {cfg.vissersboot && <li>3 vissersbootjes</li>}
      {cfg.dijk && <li>4 dijken</li>}
      {cfg.palissade && <li>3 palissades</li>}
      {cfg.orakel && <li>11 orakelschijven (2-12)</li>}
      {cfg.pvp && <li>8 milities, {cfg.boogschutter && '3 boogschutters, '}{cfg.katapult && '1 katapult, '}{cfg.scheepssoldaat && '4 scheepssoldaten'}</li>}
      {cfg.spionnen && <li>2 spionnen</li>}
      {cfg.fort && <li>1 fort</li>}
      {cfg.gildehall && <li>1 gildehall</li>}
      {cfg.smederij && <li>1 smederij</li>}
      {cfg.tempel && <li>1 tempel</li>}
      {cfg.markt && <li>1 markt</li>}
      {cfg.voorraadschuur && <li>2 voorraadschuren</li>}
      {cfg.legerkamp && <li>1 legerkamp</li>}
      {cfg.vuurtoren && <li>1 vuurtoren</li>}
      {cfg.stadsmuur && <li>2 stadsmuur-tokens</li>}
      {cfg.helden && <li>1 held</li>}
      {cfg.mythische_eenheden && <li>Mythische eenheden + 1 titan</li>}
      {cfg.gunst && <li>Gunstteller</li>}
      {cfg.tijdperken && <li>Tijdperkmarker</li>}
    </ul>
  ) });

  if (cfg.beschermgoden) {
    steps.push({ title: 'Kies god', render: () => (
      <p>Elke speler kiest een <b>beschermgod</b>: Poseidon, Athena, Ares, of Demeter. Pak de bijbehorende godenkaart.</p>
    ) });
  }

  steps.push({ title: 'Startplaatsing', render: () => (
    <>
      <p>In <b>omgekeerde volgorde</b>: 2 dorpen + 2 wegen per speler.</p>
      {cfg.scheepswerf && <p>⛵ Minstens 1 dorp moet op een <b>kustintersectie</b> liggen.</p>}
    </>
  ) });

  steps.push({ title: 'Startgrondstoffen', render: () => (
    <>
      <p>Elke speler ontvangt de grondstoffen rondom hun <b>2e dorp</b>.</p>
      {cfg.vis && <p>🐟 +1 vis extra</p>}
      {cfg.goud && <p>🪙 +2 goudmunten</p>}
    </>
  ) });

  return steps;
}
