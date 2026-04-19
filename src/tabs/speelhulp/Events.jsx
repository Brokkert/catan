import { useMemo, useState } from 'react';
import { EVENTS } from '../../data/events.js';
import Modal from '../../components/Modal.jsx';

export default function Events({ config }) {
  const [event, setEvent] = useState(null);

  const pool = useMemo(() => {
    return EVENTS.filter(e => !e.requires || config[e.requires]);
  }, [config]);

  function draw() {
    if (pool.length === 0) return;
    const e = pool[Math.floor(Math.random() * pool.length)];
    setEvent(e);
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>🎲 Random Events</h2>
      <p className="small muted">{pool.length} events beschikbaar in deze configuratie.</p>
      <button className="btn" onClick={draw}>🃏 Trek Event</button>

      {event && (
        <Modal onClose={() => setEvent(null)}>
          <div className="event-card">
            <h2 style={{ color: 'var(--gold)', margin: '0 0 12px' }}>{event.title}</h2>
            <p>{event.desc}</p>
            <button className="btn mt" onClick={() => setEvent(null)}>OK</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
