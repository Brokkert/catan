// Reusable single-hex renderer with 3D-plate look.
// Used in SetupWizard and anywhere else we want to show a plate + tile.

const TYPE_STYLES = {
  bos: { color: '#2d5a2d', shade: '#1a3a1a', emoji: '🌲' },
  heuvels: { color: '#c2622c', shade: '#7a3d18', emoji: '🧱' },
  bergen: { color: '#6b6b6b', shade: '#3d3d3d', emoji: '⛰️' },
  akkers: { color: '#e0b93a', shade: '#9c7d1a', emoji: '🌾' },
  weiden: { color: '#7bb33a', shade: '#4c7822', emoji: '🐑' },
  woestijn: { color: '#caa86a', shade: '#8a6f3a', emoji: '🏜️' },
  vulkaan: { color: '#4a1212', shade: '#2a0505', emoji: '🌋' },
  water: { color: '#2a5a8a', shade: '#174068', emoji: '', water: true },
  koraal: { color: '#2a7099', shade: '#174a6a', emoji: '🐟', water: true },
  rif: { color: '#355a75', shade: '#1a3a55', emoji: '🪨', water: true },
  maalstroom: { color: '#1a3a5a', shade: '#0a1f35', emoji: '🌀', water: true },
  draaikolk: { color: '#1a3a5a', shade: '#0a1f35', emoji: '🌀', water: true },
  jungle: { color: '#1e4a1e', shade: '#0c2d0c', emoji: '🌴' },
  ruine: { color: '#5a4a3a', shade: '#2f251c', emoji: '🏛️' },
  goudmijn: { color: '#8a6a1a', shade: '#5a4010', emoji: '💰' },
  goudrivier: { color: '#d4a02a', shade: '#9c7010', emoji: '✨' },
  handelspost: { color: '#8a6a2a', shade: '#5a4015', emoji: '⚓' },
  drakenei: { color: '#3a1a3a', shade: '#1f0a1f', emoji: '🥚' },
  piraat: { color: '#2a1a1a', shade: '#110808', emoji: '🏴\u200d☠️' },
  empty: { color: 'transparent', shade: 'transparent', emoji: '', empty: true },
};

function axialToPixel(q, r, size) {
  const x = size * Math.sqrt(3) * (q + r / 2);
  const y = size * 1.5 * r;
  return [x, y];
}

function hexPoints(cx, cy, size, inset = 0) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k + Math.PI / 6;
    return `${cx + (size - inset) * Math.cos(a)},${cy + (size - inset) * Math.sin(a)}`;
  }).join(' ');
}

// Render a single hex at cx,cy with plate style
export function renderHex(type, cx, cy, size, key, number, overlay) {
  const t = TYPE_STYLES[type] || TYPE_STYLES.empty;
  const rimWidth = Math.max(4, size * 0.28);
  const pts = hexPoints(cx, cy, size);
  const midPts = hexPoints(cx, cy, size, rimWidth / 2);
  const hiPts = hexPoints(cx, cy, size, 1.5);
  const innerPts = hexPoints(cx, cy, size, rimWidth);
  const plateColor = t.water ? '#0c1a2a' : '#1a130a';
  const plateHi = t.water ? '#3a6a8a' : '#5a4522';
  const plateMid = t.water ? '#1a3048' : '#2a2010';
  const gradId = `g-${key}`;

  if (t.empty) {
    return (
      <g key={key}>
        <polygon points={pts} fill={plateColor} stroke="#000" strokeWidth="1" />
        <polygon points={midPts} fill="none" stroke={plateMid} strokeWidth="1.5" />
        <polygon points={hiPts} fill="none" stroke={plateHi} strokeWidth="0.8" />
        <polygon points={innerPts} fill="#000" opacity="0.65" />
      </g>
    );
  }

  return (
    <g key={key}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={t.color} />
          <stop offset="100%" stopColor={t.shade} />
        </radialGradient>
      </defs>
      <polygon points={pts} fill={plateColor} stroke="#000" strokeWidth="1" />
      <polygon points={midPts} fill="none" stroke={plateMid} strokeWidth="1.5" />
      <polygon points={hiPts} fill="none" stroke={plateHi} strokeWidth="0.8" />
      <polygon points={innerPts} fill="#000" opacity="0.65" />
      <polygon points={innerPts} fill={`url(#${gradId})`} stroke={t.shade} strokeWidth="0.5" />
      {t.emoji && <text x={cx} y={cy + 4} textAnchor="middle" fontSize={size * 0.5}
        style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }}>{t.emoji}</text>}
      {number && (
        <g transform={`translate(${cx}, ${cy + size * 0.35})`}>
          <circle r={size * 0.22} fill="#f0e6d2" stroke="#8a6a3a" strokeWidth="0.6" />
          <text y={size * 0.1} textAnchor="middle" fontSize={size * 0.28} fontWeight="700"
            fill={(number === 6 || number === 8) ? '#c22' : '#222'}>{number}</text>
        </g>
      )}
      {overlay}
    </g>
  );
}

// Board of specified tiles. tiles = [{q, r, type, number?}]
export default function HexBoard({ tiles, size = 26, extra }) {
  if (!tiles.length) return null;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  tiles.forEach(t => {
    const [x, y] = axialToPixel(t.q, t.r, size);
    minX = Math.min(minX, x - size);
    maxX = Math.max(maxX, x + size);
    minY = Math.min(minY, y - size);
    maxY = Math.max(maxY, y + size);
  });
  const pad = 6;
  const vb = `${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`;

  return (
    <div style={{ background: 'radial-gradient(ellipse, #1a2a3a 0%, #070a10 100%)', borderRadius: 10, padding: 6 }}>
      <svg viewBox={vb} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {tiles.map((t, i) => {
          const [x, y] = axialToPixel(t.q, t.r, size);
          return renderHex(t.type, x, y, size, i, t.number, t.overlay);
        })}
        {extra}
      </svg>
    </div>
  );
}

export { axialToPixel };
