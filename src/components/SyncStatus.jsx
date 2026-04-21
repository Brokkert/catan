import { useEffect, useState } from 'react';
import { webrtcProvider, wsProvider } from '../utils/yjsSync.js';

export default function SyncStatus() {
  const [peers, setPeers] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const update = () => {
      setPeers(webrtcProvider.room?.webrtcConns?.size || 0);
      setWsConnected(wsProvider.wsconnected);
    };
    const iv = setInterval(update, 1500);
    update();
    wsProvider.on('status', update);
    return () => {
      clearInterval(iv);
      wsProvider.off('status', update);
    };
  }, []);

  const serverOk = wsConnected;
  const color = serverOk ? 'var(--green)' : (peers > 0 ? '#b88e1a' : 'var(--muted)');
  const label = serverOk
    ? (peers > 0 ? `☁️+${peers}` : '☁️ online')
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
        boxShadow: serverOk ? `0 0 6px ${color}` : 'none',
      }} />
      {label}
    </span>
  );
}
