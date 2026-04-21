import { useEffect, useState } from 'react';
import { DEFAULT_CONFIG, ALL_RULES } from './data/rules.js';
import { gameName, estimateMinutes, difficultyStars, urlToCfg } from './utils/game.js';
import { yConfig, yCustomRules, doc, waitForSync } from './utils/yjsSync.js';
import { initSupabaseSync } from './utils/supabaseSync.js';
import { useYConfig, useYCustomRules } from './utils/useYjs.js';
import Configurator from './tabs/Configurator.jsx';
import Printlijst from './tabs/Printlijst.jsx';
import SetupWizard from './tabs/SetupWizard.jsx';
import Speelhulp from './tabs/Speelhulp.jsx';
import Spelregels from './tabs/Spelregels.jsx';
import SyncStatus from './components/SyncStatus.jsx';

const TABS = [
  { id: 'cfg', label: 'Config', icon: '⚙️' },
  { id: 'print', label: 'Prints', icon: '🖨️' },
  { id: 'setup', label: 'Start', icon: '🎲' },
  { id: 'play', label: 'Speelhulp', icon: '🎮' },
  { id: 'rules', label: 'Regels', icon: '📜' },
];

export default function App() {
  const [tab, setTab] = useState('cfg');
  const [ready, setReady] = useState(false);
  const [config, configActions] = useYConfig();
  const [customRules, customActions] = useYCustomRules();

  useEffect(() => {
    (async () => {
      await waitForSync();
      await initSupabaseSync();
      const params = new URLSearchParams(window.location.search);
      const fromURL = params.get('rules');
      doc.transact(() => {
        if (fromURL) {
          const next = urlToCfg(fromURL, yCustomRules.toArray());
          yConfig.clear();
          Object.entries(next).forEach(([k, v]) => yConfig.set(k, v));
        } else if (yConfig.size === 0) {
          Object.entries(DEFAULT_CONFIG).forEach(([k, v]) => yConfig.set(k, v));
        } else {
          ALL_RULES.forEach(r => {
            if (yConfig.get(r.id) === undefined) yConfig.set(r.id, r.def);
          });
        }
      });
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--gold)' }}>
        <p>Laden…</p>
      </div>
    );
  }

  const name = gameName(config);
  const mins = estimateMinutes(config);
  const stars = difficultyStars(config);

  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">{name}</h1>
        <div className="app-subtitle">
          <span>⏱️ ~{mins} min</span>
          <span>{'⭐'.repeat(stars)}</span>
          <SyncStatus />
        </div>
      </header>

      <main className="app-main">
        {tab === 'cfg' && (
          <Configurator
            config={config}
            configActions={configActions}
            customRules={customRules}
            customActions={customActions}
          />
        )}
        {tab === 'print' && <Printlijst config={config} />}
        {tab === 'setup' && <SetupWizard config={config} />}
        {tab === 'play' && <Speelhulp config={config} />}
        {tab === 'rules' && <Spelregels config={config} customRules={customRules} name={name} />}
      </main>

      <nav className="bottom-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
