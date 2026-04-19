import { useEffect, useRef, useState } from 'react';
import { PLAYER_COLORS, PLAYER_NAMES } from './Bank.jsx';

export default function Timer({ currentPlayer, setCurrentPlayer }) {
  const [duration, setDuration] = useState(90);
  const [remaining, setRemaining] = useState(90);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 0) {
            setRunning(false);
            beep();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  }

  function reset() { setRemaining(duration); setRunning(false); }
  function next() {
    setCurrentPlayer((currentPlayer + 1) % 4);
    setRemaining(duration);
    setRunning(true);
  }

  const pct = duration > 0 ? (remaining / duration) : 0;
  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>⏱️ Beurt-timer</h2>
      <p className="small">Aan de beurt:</p>
      <div className="player-tabs">
        {[0,1,2,3].map(i => (
          <button
            key={i}
            className={`player-tab ${currentPlayer === i ? 'active' : ''}`}
            style={{ color: PLAYER_COLORS[i] }}
            onClick={() => setCurrentPlayer(i)}
          >{PLAYER_NAMES[i]}</button>
        ))}
      </div>

      <div className="timer-ring">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="80" fill="none" stroke="#2a3039" strokeWidth="8" />
          <circle
            cx="90" cy="90" r="80" fill="none"
            stroke={remaining < 10 ? '#e55' : PLAYER_COLORS[currentPlayer]}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="timer-text">{remaining}</div>
      </div>

      <div className="row" style={{ gap: 8, justifyContent: 'center' }}>
        <button className="btn" onClick={() => setRunning(r => !r)}>
          {running ? '⏸️ Pauze' : '▶️ Start'}
        </button>
        <button className="btn-secondary" onClick={reset}>🔄 Reset</button>
        <button className="btn-secondary" onClick={next}>⏭️ Volgende</button>
      </div>

      <div className="mt-l">
        <label className="small muted">Tijd per beurt (seconden):</label>
        <input
          className="input"
          type="number"
          min={10}
          max={600}
          value={duration}
          onChange={e => {
            const v = parseInt(e.target.value) || 90;
            setDuration(v);
            if (!running) setRemaining(v);
          }}
        />
      </div>
    </div>
  );
}
