// Rules part 2: gevecht, gebouwen, skill
export const RULES_2 = [
  // GEVECHT
  { id: 'pvp', cat: 'gevecht', name: 'PvP-gevecht (Risk-stijl)', desc: 'Bouw eenheden, verplaats over wegen, val aan. Dobbelstenen op basis van kracht (1-2→1🎲, 3-4→2🎲, 5+→3🎲 aanval/2🎲 verdediging). Gelijk = verdediger wint.', def: true, core: true },
  { id: 'militie', cat: 'gevecht', name: 'Militie', desc: 'Basiseenheid. Kracht 1. 1⛰️1🌾. Max 8/speler.', def: true },
  { id: 'boogschutter', cat: 'gevecht', name: 'Boogschutters', desc: 'Kracht 2. +1 bij aanval. 1⛰️1🪵. Max 3/speler.', def: true },
  { id: 'katapult', cat: 'gevecht', name: 'Katapult', desc: 'Kracht 3. Bonusschade vs steden/forten. Vernietigt palissades. 3⛰️2🪵. Max 1.', def: true },
  { id: 'scheepssoldaat', cat: 'gevecht', name: 'Scheepssoldaten', desc: 'Kracht 1. Aan boord van schepen. 1⛰️1🐟. Max 4/speler.', def: true },
  { id: 'huurlingen', cat: 'gevecht', name: 'Huurlingen', desc: 'Kracht 1. 1🪙 elk. Max 3/gevecht. Verschijnt direct, verdwijnt na gevecht.', def: true },
  { id: 'plundering', cat: 'gevecht', name: 'Plundering & verovering', desc: 'Versla eenheden → plunder grondstoffen/goud + trofee. Of verover gebouw als eigen dorp.', def: true },
  { id: 'eilanddominantie', cat: 'gevecht', name: 'Eilanddominantie (Risk-stijl)', desc: 'Controleer alle gebouwen op eiland = gratis milities + goud bij seizoenswisseling.', def: true },
  { id: 'versterking', cat: 'gevecht', name: 'Versterkingsfase', desc: 'Begin beurt: gratis milities op basis van hexen met gebouwen (÷3, min 1). Fortificatie einde beurt.', def: true },

  // GEBOUWEN
  { id: 'fort', cat: 'gebouwen', name: 'Fort', desc: 'Vervangt stad. 2VP. +2 verdediging. 3⛰️2🧱. Max 1.', def: true },
  { id: 'palissade', cat: 'gebouwen', name: 'Palissade', desc: 'Hexrand. Vijand mag niet passeren. Vernietigbaar door katapult. 1🪵1🧱. Max 3.', def: true },
  { id: 'dijk', cat: 'gebouwen', name: 'Dijken', desc: 'Hexrand. Beschermt tegen overstroming + blokkeert vijandelijke bouw. 2🧱1🪵. Max 4.', def: true },
  { id: 'gildehall', cat: 'gebouwen', name: 'Gildehall', desc: 'Upgrade stad. 3VP. Kies specialisatie. 2⛰️2🌾1🐑1🌶️. Max 1.', def: true },
  { id: 'smederij', cat: 'gebouwen', name: 'Smederij', desc: 'Op dorp/stad. Craft uitrustingsstukken. 1⛰️1🧱1🪵. Max 1.', def: true },
  { id: 'tempel', cat: 'gebouwen', name: 'Tempel', desc: 'Op dorp/stad. Versterkt orakel, relieken, gunst. 1⛰️1🌾1🌶️. Max 1.', def: true },
  { id: 'markt', cat: 'gebouwen', name: 'Markt', desc: 'Op dorp. 3:1 bankruil + verkoop voor goud + koop items. 1🌾1🐑1🌶️. Max 1.', def: true },
  { id: 'voorraadschuur', cat: 'gebouwen', name: 'Voorraadschuur', desc: 'Op gebouw. Halveert voedsel + 2 veilige kaarten bij 7. 1🪵1🌾1🐑. Max 2.', def: true },
  { id: 'legerkamp', cat: 'gebouwen', name: 'Legerkamp', desc: 'Eenheden 1⛰️ goedkoper, 3 stappen. 2🪵1🧱1🌾. Max 1.', def: true },
  { id: 'sluiproute', cat: 'gebouwen', name: 'Sluiproutes', desc: 'Door vijandelijke wegen heen. Niet voor Langste Route. 1🪵1🐑. Max 5.', def: true },
  { id: 'stadsmuur', cat: 'gebouwen', name: 'Stadsmuren', desc: '+2 veilige kaarten bij 7. 3🪙. Max 2.', def: true },

  // SKILL
  { id: 'kaartstapel', cat: 'skill', name: 'Kaartstapel i.p.v. dobbelstenen', desc: '36 kaarten (alle 2d6 combinaties). Card-counting mogelijk.', def: true },
  { id: 'orakel', cat: 'skill', name: 'Orakelsysteem', desc: 'Elke beurt geheim getal leggen. Goed = bonus. Fout = informatielek + bluf.', def: true },
  { id: 'spionnen', cat: 'skill', name: 'Spionnen', desc: 'Geheim bij tegenstander. Stiekem grondstoffen mee. Ontdekbaar via ridder. 1⛰️1🐟. Max 2.', def: true },
  { id: 'contracten', cat: 'skill', name: 'Handelscontracten', desc: 'Scroll-token. 3 rondes 1:1 ruil. Verbreken = boete.', def: true },
];
