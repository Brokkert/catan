import { useEffect, useState } from 'react';
import { webrtcProvider } from '../utils/yjsSync.js';
import { onSupabaseStatus, supabase } from '../utils/supabaseSync.js';

export default function SyncStatus() {
  const [peers, setPeers] = useState(0);
  const [cloudOk, setCloudOk] = useState(false);

  useEffect(() => {
    const update = () => {
      setPeers(webrtcProvider.room?.webrtcConns?.size || 0);
      // Supabase realtime channel connection status
      const ch = supabase.realtime.channels.find(c => c.topic.includes('catan_shared'));
      setCloudOk(ch?.state === 'joined');
    };
    const iv = setInterval(update, 1500);
    update();
    const off = onSupabaseStatus(update);
    return () => { clearInterval(iv); off(); };
  }, []);

  const color = cloudOk ? 'var(--green)' : (peers > 0 ? '#b88e1a' : 'var(--muted)');
  const label = cloudOk
    ? (peers > 0 ? `☁️+${peers}` : '☁️ cloud')
    : (peers > 0 ? `${peers} peers` : 'verbinden…');

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 10,
      color,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: cloudOk ? `0 0 6px ${color}` : 'none',
      }} />
      {label}
    </span>
  );
}
