import { RULES_1 } from './rules1.js';
import { RULES_2 } from './rules2.js';
import { RULES_3 } from './rules3.js';
import { RULES_4 } from './rules4.js';

export const ALL_RULES = [...RULES_1, ...RULES_2, ...RULES_3, ...RULES_4];

export const RULES_BY_ID = Object.fromEntries(ALL_RULES.map(r => [r.id, r]));

export const RULES_BY_CAT = ALL_RULES.reduce((acc, r) => {
  (acc[r.cat] = acc[r.cat] || []).push(r);
  return acc;
}, {});

export const DEFAULT_CONFIG = Object.fromEntries(ALL_RULES.map(r => [r.id, r.def]));

// Presets
export const PRESETS = [
  {
    id: 'ontdekker',
    name: '🏝️ Ontdekker',
    time: '90 min',
    rules: ['procedureel','vulkaan','ruine','maalstroom','handelspost','goudmijn','vis','specerij','goud','goudrivier','scheepswerf','handelsschip','vissersboot','seizoensrad'],
  },
  {
    id: 'veroveraar',
    name: '⚔️ Veroveraar',
    time: '2 uur',
    rules: ['procedureel','vulkaan','ruine','maalstroom','piratenschuilplaats','goudmijn','vis','specerij','goud','scheepswerf','handelsschip','oorlogsschip','vuurtoren','troepentransport','zeeslagen','piraat','monsters','pvp','militie','boogschutter','katapult','scheepssoldaat','huurlingen','plundering','eilanddominantie','versterking','fort','palissade','legerkamp','stadsmuur'],
  },
  {
    id: 'meesterbrein',
    name: '🧠 Meesterbrein',
    time: '2 uur',
    rules: ['procedureel','vulkaan','ruine','vis','specerij','goud','scheepswerf','handelsschip','kaartstapel','orakel','spionnen','contracten','itemsysteem','verrekijker','kompas','zeekaart','weegschaal','valseid','dubbelagent','kristallenbol','tijdsteen','trofeeen','trofeesets','schatkaarten','relieken','markt','tempel'],
  },
  {
    id: 'overlever',
    name: '🌊 Overlever',
    time: '2 uur',
    rules: ['procedureel','vulkaan','ruine','maalstroom','vis','specerij','goud','scheepswerf','handelsschip','vissersboot','getijden','getijdenmarkers','piraat','voedsel','seizoensrad','ziekte','winterhard','dijk','voorraadschuur','medicijnkist','regenton','vuurpot','reddingsboot'],
  },
  {
    id: 'mythisch',
    name: '🏛️ Mythisch',
    time: '2.5 uur',
    rules: '*', // all
  },
  {
    id: 'duel',
    name: '👥 2 Spelers',
    time: '90 min',
    rules: ['procedureel','vulkaan','ruine','vis','specerij','goud','scheepswerf','handelsschip','vissersboot','voedsel','seizoensrad','pvp','militie','boogschutter','barbaar_npc','marktbord','snellere_getijden','lagere_vp'],
  },
  {
    id: 'alles',
    name: '💀 ALLES',
    time: '2.5+ uur',
    rules: '*',
  },
];
