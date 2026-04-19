const SEASONS = [
  { id: 'spring', name: '🌱 Lente', double: 'Wol + Vis ×2', tint: 'season-tint-spring', bg: 'season-spring' },
  { id: 'summer', name: '☀️ Zomer', double: 'Graan + Specerij ×2', tint: 'season-tint-summer', bg: 'season-summer' },
  { id: 'autumn', name: '🍂 Herfst', double: 'Hout + Baksteen ×2', tint: 'season-tint-autumn', bg: 'season-autumn' },
  { id: 'winter', name: '❄️ Winter', double: 'Geen productie ×2, voedsel ×2', tint: 'season-tint-winter', bg: 'season-winter' },
];

export default function Seasons({ season, setSeason }) {
  const idx = SEASONS.findIndex(s => s.id === season);
  const current = SEASONS[idx];

  function next() {
    setSeason(SEASONS[(idx + 1) % SEASONS.length].id);
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>🌤️ Seizoensrad</h2>
      <div className="center">
        <div style={{ fontSize: 48, margin: '12px 0' }}>{current.name}</div>
        <p><b>Dubbele productie:</b> {current.double}</p>
        <button className="btn" onClick={next}>⟳ Draai naar volgend seizoen</button>
      </div>
    </div>
  );
}

export { SEASONS };
