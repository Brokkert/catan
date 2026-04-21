import { useEffect, useState } from 'react';
import { webrtcProvider } from '../utils/yjsSync.js';

export default function SyncStatus() {
  const [peers, setPeers] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const update = () => {
      setPeers(webrtcProvider.room?.webrtcConns?.size || 0);
      setConnected((webrtcProvider.room?.provider?.connected) || (webrtcProvider.connected) || false);
    };
    const iv = setInterval(update, 1500);
    update();
    return () => clearInterval(iv);
  }, []);

  const color = peers > 0 ? 'var(--green)' : 'var(--muted)';
  const label = peers > 0 ? `${peers} verbonden` : 'zoekt verbinding…';

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
        boxShadow: peers > 0 ? `0 0 6px ${color}` : 'none',
      }} />
      {label}
    </span>
  );
}
