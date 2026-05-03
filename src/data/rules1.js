// Rules part 1: bord, grondstoffen, schepen, dreiging, survival
export const RULES_1 = [
  // BORD
  { id: 'procedureel', cat: 'bord', name: 'Procedurele ontdekking', desc: 'Begin met alleen hoofdeiland + waterring. Alle ontdekkingstegels leg je vooraf in willekeurige volgorde in de Ontdekking-bak (volgorde is voor iedereen onbekend). Tijdens spel pak je de volgende tegel uit het eerstvolgende vak. Elke game verloopt anders.', def: true, core: true },
  { id: 'vulkaan', cat: 'bord', name: 'Vulkaan', desc: 'Vervangt woestijn. Geen productie, rover start erop. Bij twee 7\'s achter elkaar: uitbarsting vernietigt aangrenzende gebouwen + lavategel.', def: true },
  { id: 'ruine', cat: 'bord', name: 'Ruïne-tegels (2×)', desc: 'In trekstapel. Geeft reliek of items bij ontdekking. Geen productie.', def: true },
  { id: 'maalstroom', cat: 'bord', name: 'Draaikolk-tegel', desc: 'Permanent gevaarlijk water. Schip dat erop vaart: reddingsworp 1-2 = vernietigd, 3-6 = veilig.', def: true },
  { id: 'rif', cat: 'bord', name: 'Rif-tegel (rotsen)', desc: 'Watertegel met stenen. Schip dat erdoor vaart: reddingsworp 1-2 = beschadigd (terug naar thuishaven), 3-6 = veilig.', def: true },
  { id: 'piratenschuilplaats', cat: 'bord', name: 'Piratenschuilplaats-tegel', desc: 'Bij ontdekking: piratenbasis. Verover met oorlogsschip + kracht 4 om piraat permanent te verwijderen.', def: true },
  { id: 'drakenei', cat: 'bord', name: 'Drakenei-tegel', desc: 'Bij ontdekking: ei broedt 4 rondes. Daarna verschijnt draak op vulkaan als eindgame-boss. Vernietig ei (kracht 3) om dit te voorkomen.', def: true },
  { id: 'handelspost', cat: 'bord', name: 'Handelspost-tegel', desc: 'Speciale haven (2:1 op alles) voor de ontdekker.', def: true },
  { id: 'goudmijn', cat: 'bord', name: 'Goudmijn-tegel', desc: 'Produceert goudmunten bij nummerrol.', def: true },

  // GRONDSTOFFEN
  { id: 'vis', cat: 'grondstoffen', name: 'Vis (6e grondstof)', desc: 'Van koraalrif-tegels en vissersbootjes. Bruikbaar als voedsel.', def: true, core: true },
  { id: 'specerij', cat: 'grondstoffen', name: 'Specerij (7e grondstof)', desc: 'Zeldzaam, alleen van jungletegels op buiteneilanden. Niet via 4:1 bankruil.', def: true, core: true },
  { id: 'goud', cat: 'grondstoffen', name: 'Goud als valuta', desc: 'Munttokens. Verdien via handel/plundering/goudmijnen. Besteed aan huurlingen, omkoping, items, stadsmuren.', def: true, core: true },
  { id: 'goudrivier', cat: 'grondstoffen', name: 'Goudrivier-tegel', desc: 'Wildcard: bij productie kies je een willekeurige grondstof.', def: true },

  // SCHEPEN
  { id: 'scheepswerf', cat: 'schepen', name: 'Scheepswerf', desc: 'Op kustintersectie. Vereist voor schepen. 2🪵1🧱1⛰️. Max 2/speler. Bevolking: 1 ziel.', def: true, core: true },
  { id: 'handelsschip', cat: 'schepen', name: 'Handelsschepen', desc: 'Zeeroute over water. Trek 1 ontdekkingstegel aan rand. 1🪵1🐑. Max 6/speler. Bevolking: 1 ziel.', def: true, core: true },
  { id: 'oorlogsschip', cat: 'schepen', name: 'Oorlogsschepen', desc: 'Sterker. Kan piraten verslaan, vijandelijke schepen aanvallen. Trek 2 tegels. 1🪵1🐑1⛰️. Max 3/speler.', def: true },
  { id: 'vissersboot', cat: 'schepen', name: 'Vissersbootjes', desc: 'Klein scheepje op watertegel. Produceert vis bij aangrenzende nummerrol. 1🪵1🐟. Max 3/speler.', def: true },
  { id: 'vuurtoren', cat: 'schepen', name: 'Vuurtoren', desc: 'Op kustintersectie. 1 VP. Beschermt schepen in straal van 3 watertegels tegen piraten. 2⛰️1🧱1🐟. Max 1.', def: true },
  { id: 'troepentransport', cat: 'schepen', name: 'Troepentransport', desc: 'Handelsschip: max 2 eenheden aan boord. Oorlogsschip: max 3. Ontschepen op kust.', def: true },
  { id: 'zeeslagen', cat: 'schepen', name: 'Zeeslagen', desc: 'Oorlogsschip vs vijandelijk schip: gevechtsresolutie als op land. Winnaar krijgt grondstof + trofee.', def: true },

  // DREIGING
  { id: 'getijden', cat: 'dreiging', name: 'Getijden/overstroming', desc: 'Bij een 7: extra dobbelsteen voor getij. 1-2 niks, 3-4 vloed (1 overstroming), 5-6 stormvloed (2). Dorpen vernietigd tenzij dijk.', def: true },
  { id: 'getijdenmarkers', cat: 'dreiging', name: 'Getijdenmarkers ①②③', desc: '3 markers zodat je kunt zien welke tegels als volgende overstromen. Tactisch dijken bouwen.', def: true },
  { id: 'piraat', cat: 'dreiging', name: 'Piraat op zee', desc: 'Maritieme rover. Verplaatst bij een 7. Blokkeert schepen. Wordt sterker: kracht 2→6. Omkopbaar voor 2🪙.', def: true },
  { id: 'monsters', cat: 'dreiging', name: 'Monsters op buiteneilanden', desc: 'Bij ontdekking landtegel: symbool op achterkant bepaalt of er een monster staat (deterministic, geen dobbelsteen).', def: true },
  { id: 'monsterspawn', cat: 'dreiging', name: 'Monsterspawns', desc: 'Elke 3e seizoenswisseling verschijnt nieuw monster op willekeurige onbewoonde tegel.', def: true },
  { id: 'draak', cat: 'dreiging', name: 'De Draak (eindgame-boss)', desc: 'Kracht 8. Elke seizoenswisseling vliegt naar willekeurige tegel en vernietigt gebouwen. Coalitie mogelijk om te verslaan.', def: true },
  { id: 'bandieten', cat: 'dreiging', name: 'Bandietenkamp (woestijn)', desc: 'Bij seizoenswissel spawnt een bandiet op de woestijn, mits rover er niet staat. Steelt 1 grondstof van aangrenzende speler per ronde. Kracht 2. Versla voor 1🪙 + bandiet-trofee. Rover op woestijn houdt ze weg; bij rover erop vluchten ze en laten 1🪙 schat achter.', def: true },
  { id: 'vrijbuiters', cat: 'dreiging', name: 'Vrijbuiters (zee)', desc: 'Bij seizoenswissel spawnt een vrijbuiter-schip op willekeurige onbewoonde watertegel. Blokkeert schepen, steelt 1 vis van aangrenzende vissersboot per ronde. Kracht 2. Versla met oorlogsschip voor 1🪙 + vrijbuiter-trofee.', def: true },

  // SURVIVAL
  { id: 'voedsel', cat: 'survival', name: 'Voedsel/hongersnood', desc: 'Elke seizoenswisseling: betaal 1 graan of vis per 3 zielen. Tekort = dorpen verlaten, steden degraderen.', def: true },
  { id: 'seizoensrad', cat: 'survival', name: 'Seizoensrad', desc: 'Elke 4 rondes: Lente (wol+vis ×2), Zomer (graan+specerij ×2), Herfst (hout+baksteen ×2), Winter (niks ×2, voedsel ×2).', def: true },
  { id: 'ziekte', cat: 'survival', name: 'Ziekte-mechanic', desc: 'Bij hongersnood kans op ziekte. Verspreidt via wegen, ook naar tegenstanders. Genezen: 1🌶️ of 2🐟 of 1🪙.', def: true },
  { id: 'winterhard', cat: 'survival', name: 'Winterhardheid', desc: 'In de winter zijn voedselkosten verdubbeld.', def: true },
];
