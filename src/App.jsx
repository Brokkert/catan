import { useEffect, useState } from 'react';
import { DEFAULT_CONFIG, ALL_RULES } from './data/rules.js';
import { gameName, estimateMinutes, difficultyStars, urlToCfg } from './utils/game.js';
import { load, save, STORAGE_KEY, CUSTOM_KEY } from './utils/storage.js';
import Configurator from './tabs/Configurator.jsx';
import Printlijst from './tabs/Printlijst.jsx';
import SetupWizard from './tabs/SetupWizard.jsx';
import Speelhulp from './tabs/Speelhulp.jsx';
import Spelregels from './tabs/Spelregels.jsx';

const TABS = [
  { id: 'cfg', label: 'Config', icon: '⚙️' },
  { id: 'print', label: 'Prints', icon: '🖨️' },
  { id: 'setup', label: 'Start', icon: '🎲' },
  { id: 'play', label: 'Speelhulp', icon: '🎮' },
  { id: 'rules', label: 'Regels', icon: '📜' },
];

export default function App() {
  const [tab, setTab] = useState('cfg');
  const [config, setConfig] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const fromURL = params.get('rules');
    const customLoaded = load(CUSTOM_KEY, []);
    if (fromURL) {
      return urlToCfg(fromURL, customLoaded);
    }
    const stored = load(STORAGE_KEY, null);
    return stored || { ...DEFAULT_CONFIG };
  });
  const [customRules, setCustomRules] = useState(() => load(CUSTOM_KEY, []));

  useEffect(() => { save(STORAGE_KEY, config); }, [config]);
  useEffect(() => { save(CUSTOM_KEY, customRules); }, [customRules]);

  const toggle = (id) => setConfig(c => ({ ...c, [id]: !c[id] }));
  const setMany = (updates) => setConfig(c => ({ ...c, ...updates }));

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
        </div>
      </header>

      <main className="app-main">
        {tab === 'cfg' && (
          <Configurator
            config={config}
            setConfig={setConfig}
            toggle={toggle}
            setMany={setMany}
            customRules={customRules}
            setCustomRules={setCustomRules}
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
