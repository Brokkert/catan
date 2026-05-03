import { ALL_RULES, RULES_BY_ID } from '../data/rules.js';
import { CATEGORIES } from '../data/categories.js';

// Category is "active" if >=1 rule is on
export function activeCategories(cfg) {
  const actives = {};
  CATEGORIES.forEach(c => { actives[c.id] = false; });
  ALL_RULES.forEach(r => {
    if (cfg[r.id]) actives[r.cat] = true;
  });
  return actives;
}

export function activeRuleCount(cfg) {
  return Object.values(cfg).filter(Boolean).length;
}

export function gameName(cfg) {
  const a = activeCategories(cfg);
  const twoPlayer = cfg.barbaar_npc || cfg.marktbord || cfg.snellere_getijden || cfg.lagere_vp;

  let base = 'CATANIA: Onontdekt';
  const allOn = ALL_RULES.every(r => cfg[r.id]);
  if (allOn) base = 'CATANIA: De Archipel — Complete Editie';
  else if (a.mythologie) base = 'CATANIA: Goden & Glorie';
  else if (a.items && a.verzamelen) base = 'CATANIA: De Archipel';
  else if (a.dreiging && cfg.draak && cfg.monsters) base = 'CATANIA: Monsters & Getijden';
  else if (cfg.getijden && cfg.voedsel) base = 'CATANIA: Bloed & Getijden';
  else if (a.gevecht && cfg.eilanddominantie) base = 'CATANIA: De Veroveraar';

  return (twoPlayer && !allOn) ? base + ' · Duel' : base;
}

const TIME_PER_CAT = {
  bord: 0,
  grondstoffen: 5,
  schepen: 10,
  dreiging: 10,
  survival: 15,
  gevecht: 20,
  gebouwen: 5,
  skill: 15,
  items: 10,
  verzamelen: 10,
  overwinning: 0,
  duel: -10,
  mythologie: 20,
  kaarten: 5,
};

export function estimateMinutes(cfg) {
  const a = activeCategories(cfg);
  let mins = 60;
  CATEGORIES.forEach(c => {
    if (a[c.id]) mins += (TIME_PER_CAT[c.id] || 0);
  });
  return Math.max(45, mins);
}

export function difficultyStars(cfg) {
  const a = activeCategories(cfg);
  const count = Object.values(a).filter(Boolean).length;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  if (count <= 9) return 4;
  return 5;
}

// URL param encoding/decoding
export function cfgToURL(cfg) {
  const on = ALL_RULES.filter(r => cfg[r.id]).map(r => r.id);
  return on.join(',');
}
export function urlToCfg(str, customRules = []) {
  const on = new Set((str || '').split(',').filter(Boolean));
  const cfg = {};
  ALL_RULES.forEach(r => { cfg[r.id] = on.has(r.id); });
  customRules.forEach(cr => { cfg[cr.id] = on.has(cr.id); });
  return cfg;
}

export function shareURL(cfg) {
  const params = new URLSearchParams(window.location.search);
  params.set('rules', cfgToURL(cfg));
  const base = window.location.origin + window.location.pathname;
  return base + '?' + params.toString();
}
