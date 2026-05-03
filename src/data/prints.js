// Printlist - dynamically filtered by active rules
// size categories for filament: hex=15, small=1, medium=3, large=8, overlay=8
// color: player/neutral/gold/blue/mixed

const STL_BASIS = 'https://www.thingiverse.com/thing:2525047';
const STL_NUMMER = 'https://www.printables.com/model/292185';
const STL_SEAFARERS = 'https://www.thingiverse.com/thing:3072272';
const STL_CK = 'https://www.thingiverse.com/thing:2865138';
const STL_RESOURCES = 'https://www.printables.com/model/591760-catan-resources';
const STL_FISH = 'https://www.thingiverse.com/thing:6682395';
const STL_SPICE = 'https://www.myminifactory.com/object/3d-print-cauldron-spice-jar-190722';
const STL_GOLD = 'https://www.printables.com/model/593486-gold-coins';
const STL_DEVCARDS = 'https://www.printables.com/model/660356-catan-development-cards';
const STL_TRAY = 'https://www.printables.com/model/136958-catan-individual-player-trays';
const STL_WAGON = 'https://www.printables.com/model/1449299-28mm-covered-wagon-western-frontier-terrain-model';
const STL_ROBBER = 'https://www.printables.com/model/178355-catan-robber';
const STL_PIRATE_SHIP = 'https://www.printables.com/model/145481-catan-seafairers-pirate-ship-no-seafoam-so-sails-c';

export const PRINT_ITEMS = [
  // Always needed (basisspel) — land hex types per soort
  { id: 'bos_hex', name: 'Landtegel — bos 🌲', qty: 7, size: 'hex', color: 'mixed', desc: 'Produceert hout', stl: STL_BASIS, always: true },
  { id: 'akkers_hex', name: 'Landtegel — akkers 🌾', qty: 7, size: 'hex', color: 'mixed', desc: 'Produceert graan', stl: STL_BASIS, always: true },
  { id: 'weiden_hex', name: 'Landtegel — weiden 🐑', qty: 7, size: 'hex', color: 'mixed', desc: 'Produceert wol', stl: STL_BASIS, always: true },
  { id: 'heuvels_hex', name: 'Landtegel — heuvels 🧱', qty: 7, size: 'hex', color: 'mixed', desc: 'Produceert baksteen', stl: STL_BASIS, always: true },
  { id: 'bergen_hex', name: 'Landtegel — bergen ⛰️', qty: 7, size: 'hex', color: 'mixed', desc: 'Produceert erts', stl: STL_BASIS, always: true },
  { id: 'woestijn_hex', name: 'Landtegel — woestijn 🏜️', qty: 1, size: 'hex', color: 'mixed', desc: 'Geen productie, rover start hier', stl: STL_BASIS, always: true },
  { id: 'water_hex', name: 'Watertegels', qty: 50, size: 'hex', color: 'blue', desc: 'Blanco watertegels (binnenring + ontdekking + reserve)', stl: STL_BASIS, always: true },
  { id: 'nummer_tokens', name: 'Nummertokens reserve', qty: 15, size: 'small', color: 'mixed', desc: 'Tokens 2-12 (reserve)', stl: STL_NUMMER, always: true },
  { id: 'dorpen', name: 'Dorpen', qty: 5, size: 'medium', color: 'player', desc: '5 dorpen per speler', stl: STL_BASIS, always: true, perPlayer: true },
  { id: 'steden', name: 'Steden', qty: 4, size: 'medium', color: 'player', desc: '4 steden per speler', stl: STL_BASIS, always: true, perPlayer: true },
  { id: 'wegen', name: 'Wegen', qty: 15, size: 'small', color: 'player', desc: '15 wegen per speler', stl: STL_BASIS, always: true, perPlayer: true },
  { id: 'rover', name: 'Rover', qty: 1, size: 'medium', color: 'neutral', desc: 'Roverfiguur', stl: STL_ROBBER, always: true },
  { id: 'havens', name: 'Haventegels', qty: 5, size: 'overlay', color: 'mixed', desc: '5 haventegels', stl: STL_BASIS, always: true },
  { id: 'basis_land', name: 'Basisplaat — land', qty: 30, size: 'hex', color: 'neutral', desc: 'Magnetische basisplaat voor land-hexen (bruin/grijs filament)', stl: STL_BASIS, always: true },
  { id: 'basis_water', name: 'Basisplaat — water', qty: 50, size: 'hex', color: 'blue', desc: 'Magnetische basisplaat voor water-hexen (blauw filament)', stl: STL_BASIS, always: true },
  { id: 'ontdekking_bak', name: 'Ontdekking-bak (opberg + trek)', qty: 1, size: 'large', color: 'neutral', desc: 'Doos met vakken die dubbel dient als opslag én trekbak. Leg de ontdekkingstegels vooraf in willekeurige volgorde in de vakken — tijdens spel pak je er steeds één uit het volgende vak.', custom: true, rule: 'procedureel' },

  // procedureel
  { id: 'jungle_hex', name: 'Jungle-hex', qty: 3, size: 'hex', color: 'mixed', desc: 'Jungletegel voor specerij', custom: true, rule: 'procedureel' },
  { id: 'koraal_hex', name: 'Koraalrif-hex', qty: 3, size: 'hex', color: 'blue', desc: 'Koraalrif voor vis', custom: true, rule: 'procedureel' },

  // vulkaan
  { id: 'vulkaan_hex', name: 'Vulkaan-hex', qty: 1, size: 'hex', color: 'mixed', desc: 'Vulkaantegel', custom: true, rule: 'vulkaan' },
  { id: 'lava_overlay', name: 'Lavategel (overlay)', qty: 2, size: 'overlay', color: 'mixed', desc: 'Overlay bij uitbarsting', custom: true, rule: 'vulkaan' },

  // ruine
  { id: 'ruine_hex', name: 'Ruïne-hex', qty: 2, size: 'hex', color: 'mixed', desc: 'Ruïnetegels', custom: true, rule: 'ruine' },

  // rif
  { id: 'rif_hex', name: 'Rif-hex (water met stenen)', qty: 2, size: 'hex', color: 'blue', desc: 'Rotsen boven water — gevaarlijk voor schepen', custom: true, rule: 'rif' },

  // piratenschuilplaats
  { id: 'piraat_hex', name: 'Piratenschuilplaats-hex', qty: 1, size: 'hex', color: 'mixed', desc: 'Piratenbasis', custom: true, rule: 'piratenschuilplaats' },

  // drakenei
  { id: 'drakenei_hex', name: 'Drakenei-hex', qty: 1, size: 'hex', color: 'mixed', desc: 'Drakenei-tegel', custom: true, rule: 'drakenei' },
  { id: 'drakenei_token', name: 'Drakenei token', qty: 1, size: 'small', color: 'mixed', desc: 'Broedtoken', custom: true, rule: 'drakenei' },
  { id: 'draak_fig', name: 'Draak figuur', qty: 1, size: 'large', color: 'mixed', desc: 'Draak-miniatuur', stl: 'https://www.thingiverse.com/search?q=dragon+miniature', rule: 'drakenei' },

  // handelspost
  { id: 'handelspost_hex', name: 'Handelspost-hex', qty: 1, size: 'hex', color: 'mixed', desc: 'Speciale haven', custom: true, rule: 'handelspost' },

  // goudmijn
  { id: 'goudmijn_hex', name: 'Goudmijn-hex', qty: 1, size: 'hex', color: 'gold', desc: 'Goudmijn-tegel', custom: true, rule: 'goudmijn' },

  // goud
  { id: 'goudmunten', name: 'Goudmunten', qty: 40, size: 'small', color: 'gold', desc: '~12mm ø, 2mm dik', stl: STL_GOLD, rule: 'goud' },

  // goudrivier
  { id: 'goudrivier_hex', name: 'Goudrivier-hex', qty: 1, size: 'hex', color: 'gold', desc: 'Wildcard grondstof', stl: STL_SEAFARERS, rule: 'goudrivier' },

  // scheepswerf
  { id: 'scheepswerf_fig', name: 'Scheepswerven', qty: 2, size: 'medium', color: 'player', desc: 'Dok/helling', custom: true, rule: 'scheepswerf', perPlayer: true },

  // handelsschip
  { id: 'handelsschip_fig', name: 'Handelsschepen', qty: 6, size: 'medium', color: 'player', desc: 'Handelsschip', stl: STL_SEAFARERS, rule: 'handelsschip', perPlayer: true },

  // oorlogsschip
  { id: 'oorlogsschip_fig', name: 'Oorlogsschepen', qty: 3, size: 'medium', color: 'player', desc: 'Groter met ram/kanon', custom: true, rule: 'oorlogsschip', perPlayer: true },

  // vissersboot
  { id: 'vissersboot_fig', name: 'Vissersbootjes', qty: 3, size: 'medium', color: 'player', desc: 'Klein roeibootje', custom: true, rule: 'vissersboot', perPlayer: true },

  // vuurtoren
  { id: 'vuurtoren_fig', name: 'Vuurtoren', qty: 1, size: 'medium', color: 'player', desc: 'Vuurtorenfiguur', stl: 'https://www.thingiverse.com/search?q=lighthouse+miniature', rule: 'vuurtoren', perPlayer: true },

  // getijden
  { id: 'overstroom_overlay', name: 'Overstroomtegels (overlay)', qty: 8, size: 'overlay', color: 'blue', desc: 'Transparant blauw', custom: true, rule: 'getijden' },

  // getijdenmarkers
  { id: 'getijden_markers', name: 'Getijdenmarkers ①②③', qty: 3, size: 'small', color: 'blue', desc: '3 markers', custom: true, rule: 'getijdenmarkers' },

  // piraat
  { id: 'piraat_schip', name: 'Piratenschip', qty: 1, size: 'medium', color: 'neutral', desc: 'Corsaire', stl: STL_SEAFARERS, rule: 'piraat' },
  { id: 'piraat_tracker', name: 'Piratenkracht-tracker', qty: 1, size: 'small', color: 'neutral', desc: 'Schijfje 2-6', custom: true, rule: 'piraat' },

  // monsters
  { id: 'wilde_beesten', name: 'Wilde beesten', qty: 4, size: 'medium', color: 'neutral', desc: 'Wolven/beren', stl: 'https://www.thingiverse.com/search?q=wolf+miniature', rule: 'monsters' },
  { id: 'stenen_golems', name: 'Stenen golems', qty: 2, size: 'medium', color: 'neutral', desc: 'Stenen golem', stl: 'https://www.thingiverse.com/search?q=stone+golem', rule: 'monsters' },
  { id: 'zeemonsters', name: 'Zeemonsters', qty: 2, size: 'medium', color: 'neutral', desc: 'Zeemonster-miniatuur', stl: 'https://www.thingiverse.com/search?q=sea+monster+miniature', rule: 'monsters' },

  // bandieten
  { id: 'bandiet_fig', name: 'Bandiet figuur', qty: 3, size: 'medium', color: 'neutral', desc: '~15mm figuur met dolk/boef-look, kampt op woestijn', custom: true, rule: 'bandieten' },
  { id: 'bandiet_trofee', name: 'Bandiet-trofee', qty: 6, size: 'small', color: 'neutral', desc: '~12mm (bandietenmasker). Verzamel door bandieten te verslaan.', custom: true, rule: 'bandieten' },

  // vrijbuiters
  { id: 'vrijbuiter_schip', name: 'Vrijbuiter-schip', qty: 3, size: 'medium', color: 'neutral', desc: '~18mm donkergrijs schip met vrijbuiter-vlag (onderscheid van piraat)', stl: STL_PIRATE_SHIP, rule: 'vrijbuiters' },
  { id: 'vrijbuiter_trofee', name: 'Vrijbuiter-trofee', qty: 6, size: 'small', color: 'neutral', desc: '~12mm doodshoofd-op-vlag. Verzamel door vrijbuiters te verslaan.', custom: true, rule: 'vrijbuiters' },

  // karavaan (land-transport)
  { id: 'karavaan_fig', name: 'Karavaan / covered wagon', qty: 2, size: 'medium', color: 'player', desc: 'Huifkar voor land-cargo-transport over wegen', stl: STL_WAGON, rule: 'karavaan', perPlayer: true },

  // havenvoorraad
  { id: 'haven_bakje', name: 'Haven-voorraadbakje', qty: 5, size: 'medium', color: 'mixed', desc: 'Klein bakje met 5 vakken (1 per grondstof) dat naast/op een haven staat. Toont zichtbaar de huidige voorraad — droppen via cargo, leeghalen via ruil.', custom: true, rule: 'havenvoorraad' },

  // seizoensrad
  { id: 'seizoensrad_fig', name: 'Seizoensrad + wijzer', qty: 1, size: 'large', color: 'mixed', desc: '~60mm ø draaibaar', custom: true, rule: 'seizoensrad' },

  // voedsel
  { id: 'verlaten_dorp', name: 'Verlaten-dorp-markers', qty: 8, size: 'small', color: 'neutral', desc: 'Past in dorp-gat', custom: true, rule: 'voedsel' },

  // ziekte
  { id: 'ziekte_tokens', name: 'Ziektetokens', qty: 8, size: 'small', color: 'neutral', desc: '~8mm schedeltje', custom: true, rule: 'ziekte' },

  // pvp
  { id: 'militie_fig', name: 'Militie', qty: 8, size: 'small', color: 'player', desc: 'Basiseenheid', stl: STL_CK, rule: 'pvp', perPlayer: true },
  { id: 'boogschutter_fig', name: 'Boogschutters', qty: 3, size: 'small', color: 'player', desc: '~10mm met boog', custom: true, rule: 'boogschutter', perPlayer: true },
  { id: 'katapult_fig', name: 'Katapult', qty: 1, size: 'medium', color: 'player', desc: 'Katapult-miniatuur', stl: 'https://www.thingiverse.com/search?q=catapult+miniature', rule: 'katapult', perPlayer: true },
  { id: 'scheepssoldaat_fig', name: 'Scheepssoldaten', qty: 4, size: 'small', color: 'player', desc: '~8mm figuur', custom: true, rule: 'scheepssoldaat', perPlayer: true },
  { id: 'huurlingen_fig', name: 'Huurlingen (grijs)', qty: 6, size: 'small', color: 'neutral', desc: 'Grijs', custom: true, rule: 'huurlingen' },

  // gebouwen
  { id: 'fort_fig', name: 'Fort', qty: 1, size: 'medium', color: 'player', desc: 'Remix stad met torens', custom: true, rule: 'fort', perPlayer: true },
  { id: 'palissade_fig', name: 'Palissades', qty: 3, size: 'small', color: 'player', desc: 'Hekwerk hexrand', custom: true, rule: 'palissade', perPlayer: true },
  { id: 'dijk_fig', name: 'Dijken', qty: 4, size: 'small', color: 'player', desc: 'Muurtje hexrand', custom: true, rule: 'dijk', perPlayer: true },
  { id: 'gildehall_fig', name: 'Gildehall', qty: 1, size: 'medium', color: 'player', desc: 'Remix metropolis', custom: true, rule: 'gildehall', perPlayer: true },
  { id: 'gildekaarten', name: 'Gilde-insignias', qty: 6, size: 'small', color: 'mixed', desc: '6 3D insignias/medallions (~15mm) per specialisatie. Pak die op bij gildehall-bouw.', custom: true, rule: 'gildehall' },
  { id: 'smederij_fig', name: 'Smederij', qty: 1, size: 'medium', color: 'player', desc: '~15mm met aambeeld', custom: true, rule: 'smederij', perPlayer: true },
  { id: 'tempel_fig', name: 'Tempel', qty: 1, size: 'medium', color: 'player', desc: '~15mm met zuilen', custom: true, rule: 'tempel', perPlayer: true },
  { id: 'markt_fig', name: 'Markt', qty: 1, size: 'medium', color: 'player', desc: '~15mm kraampje', custom: true, rule: 'markt', perPlayer: true },
  { id: 'voorraad_fig', name: 'Voorraadschuur', qty: 2, size: 'medium', color: 'player', desc: '~12mm schuurtje', custom: true, rule: 'voorraadschuur', perPlayer: true },
  { id: 'legerkamp_fig', name: 'Legerkamp', qty: 1, size: 'medium', color: 'player', desc: 'Tentjes op basis', custom: true, rule: 'legerkamp', perPlayer: true },
  { id: 'sluiproute_fig', name: 'Sluiproutes', qty: 5, size: 'small', color: 'player', desc: 'Kronkelig wegstuk', custom: true, rule: 'sluiproute', perPlayer: true },
  { id: 'stadsmuur_token', name: 'Stadsmuur-tokens', qty: 2, size: 'small', color: 'player', desc: 'Stadsmuur', stl: STL_CK, rule: 'stadsmuur', perPlayer: true },

  // skill
  { id: 'orakelschijven', name: 'Orakelschijven (2-12)', qty: 11, size: 'small', color: 'player', desc: '~15mm dubbelzijdig', custom: true, rule: 'orakel', perPlayer: true },
  { id: 'spion_fig', name: 'Spionnen', qty: 2, size: 'small', color: 'player', desc: '~8mm gehurkt', custom: true, rule: 'spionnen', perPlayer: true },
  { id: 'scroll_tokens', name: 'Scroll-tokens', qty: 8, size: 'small', color: 'mixed', desc: '~12mm perkament', custom: true, rule: 'contracten' },
  { id: 'nummerkaarten', name: 'Nummer-trekschijven', qty: 36, size: 'small', color: 'mixed', desc: '36 genummerde schijfjes (alle 2d6-combinaties). Leg ze vooraf in willekeurige volgorde in een trekbak; pak steeds de volgende in plaats van te dobbelen.', custom: true, rule: 'kaartstapel' },

  // verzamelen
  { id: 'trof_klauw', name: 'Monsterklauw-trofeeën', qty: 8, size: 'small', color: 'neutral', desc: '~12mm', custom: true, rule: 'trofeeen' },
  { id: 'trof_vlag', name: 'Piratenvlag-trofeeën', qty: 6, size: 'small', color: 'neutral', desc: '~12mm', custom: true, rule: 'trofeeen' },
  { id: 'trof_buit', name: 'Oorlogsbuit-trofeeën', qty: 6, size: 'small', color: 'gold', desc: '~12mm', custom: true, rule: 'trofeeen' },
  { id: 'trof_schub', name: 'Zeemonsterschub-trofeeën', qty: 4, size: 'small', color: 'neutral', desc: '~10mm', custom: true, rule: 'trofeeen' },
  { id: 'trof_tand', name: 'Drakentand-trofeeën', qty: 2, size: 'small', color: 'neutral', desc: '~15mm', custom: true, rule: 'trofeeen' },
  { id: 'schatfragment', name: 'Schatkaartfragmenten', qty: 6, size: 'small', color: 'mixed', desc: '~15mm puzzelstuk', custom: true, rule: 'schatkaarten' },
  { id: 'reliek_drietand', name: 'Drietand', qty: 1, size: 'medium', color: 'gold', desc: '~25mm', custom: true, rule: 'relieken' },
  { id: 'reliek_aambeeld', name: 'Aambeeld', qty: 1, size: 'small', color: 'neutral', desc: '~15mm', custom: true, rule: 'relieken' },
  { id: 'reliek_kompas', name: 'Kompas', qty: 1, size: 'small', color: 'gold', desc: '~15mm', custom: true, rule: 'relieken' },
  { id: 'reliek_kroon', name: 'Kroon', qty: 1, size: 'small', color: 'gold', desc: '~12mm', custom: true, rule: 'relieken' },
  { id: 'reliek_kelk', name: 'Kelk', qty: 1, size: 'small', color: 'gold', desc: '~15mm', custom: true, rule: 'relieken' },
  { id: 'reliek_masker', name: 'Masker', qty: 1, size: 'small', color: 'gold', desc: '~12mm', custom: true, rule: 'relieken' },

  // items
  { id: 'item_craft', name: 'Craft-item-tokens', qty: 24, size: 'small', color: 'mixed', desc: '2 per craftbaar item', custom: true, rule: 'itemsysteem' },
  { id: 'item_find', name: 'Vindbare item-tokens', qty: 20, size: 'small', color: 'mixed', desc: '1 per vindbaar item', custom: true, rule: 'itemsysteem' },

  // koopman
  { id: 'koopman_fig', name: 'Koopman figuur', qty: 1, size: 'small', color: 'neutral', desc: 'Handelaar', stl: STL_CK, rule: 'koopman' },

  // mythologie
  { id: 'godenbeeldjes', name: 'Godenbeeldjes (4)', qty: 4, size: 'large', color: 'mixed', desc: 'Poseidon/Athena/Ares/Demeter ~25mm', custom: true, rule: 'beschermgoden' },
  { id: 'godenkaarten', name: 'Goden-plaquettes', qty: 4, size: 'small', color: 'mixed', desc: '4 3D plaquettes met godnaam + icoon. Krijg bij godkeuze jouw plaquette.', custom: true, rule: 'beschermgoden' },
  { id: 'held_fig', name: 'Held figuur', qty: 1, size: 'medium', color: 'gold', desc: '~20mm, goud accent', custom: true, rule: 'helden', perPlayer: true },
  { id: 'mythische_units', name: 'Mythische eenheden', qty: 8, size: 'medium', color: 'player', desc: '3 types × 2-3 stuks', stl: 'https://www.thingiverse.com/search?q=D%26D+miniatures', rule: 'mythische_eenheden', perPlayer: true },
  { id: 'titan_fig', name: 'Titan', qty: 1, size: 'large', color: 'player', desc: '~30mm', custom: true, rule: 'mythische_eenheden', perPlayer: true },
  { id: 'gunst_tokens', name: 'Gunst-tokens', qty: 60, size: 'small', color: 'gold', desc: '~8mm sterretjes', custom: true, rule: 'gunst' },
  { id: 'tijdperkmarker', name: 'Tijdperkmarker', qty: 1, size: 'small', color: 'player', desc: '~30×8mm schuifblokje', custom: true, rule: 'tijdperken', perPlayer: true },

  // 2-speler
  { id: 'barbaar_dorpen', name: 'Barbaar-dorpen', qty: 5, size: 'medium', color: 'neutral', desc: 'Grijs', custom: true, rule: 'barbaar_npc' },
  { id: 'barbaar_wegen', name: 'Barbaar-wegen', qty: 10, size: 'small', color: 'neutral', desc: 'Grijs', custom: true, rule: 'barbaar_npc' },
  { id: 'barbaar_milities', name: 'Barbaar-milities', qty: 6, size: 'small', color: 'neutral', desc: 'Grijs', custom: true, rule: 'barbaar_npc' },
  { id: 'marktbord_fig', name: 'Marktbord', qty: 1, size: 'medium', color: 'mixed', desc: 'Plateau met 3 vakjes', custom: true, rule: 'marktbord' },

  // kaarten
  { id: 'vis_kaarten', name: 'Vis-tokens', qty: 19, size: 'small', color: 'mixed', desc: '3D visjes (~15mm). Vervangen de grondstofkaart.', stl: STL_FISH, rule: 'vis' },
  { id: 'specerij_kaarten', name: 'Specerij-potjes', qty: 14, size: 'small', color: 'mixed', desc: '3D kruidenpotjes (~12mm). Vervangen de grondstofkaart.', stl: STL_SPICE, rule: 'specerij' },
  { id: 'ontwik_tokens', name: 'Ontwikkelings-scrolls', qty: 32, size: 'small', color: 'mixed', desc: '3D opgerolde scrolls met symbool per type (ridder, uitvinding, monopolie, wegen, VP). 25 basis + 7 extra kaarten-vervanging.', stl: STL_DEVCARDS, always: true },
  { id: 'resource_tokens', name: 'Grondstof-tokens (hout/baksteen/graan/wol/erts)', qty: 80, size: 'small', color: 'mixed', desc: '3D mini-items per grondstof (stapel logs, bakstenen, graanbundels, schaapjes, ertsbrokken) — ~10-15mm. Leg op karavaan/schip voor cargo.', stl: STL_RESOURCES, always: true },
  { id: 'speler_tray', name: 'Speler-bakje (hand-organiser)', qty: 1, size: 'large', color: 'player', desc: '3D bakje met vakken per grondstof — elke speler heeft eigen bakje om tokens in te bewaren', stl: STL_TRAY, always: true, perPlayer: true },
];

export const SIZE_WEIGHT = { hex: 15, overlay: 8, large: 8, medium: 3, small: 1 };

export const COLOR_LABEL = {
  player: 'Spelerskleur (×4 spelers)',
  neutral: 'Neutraal (grijs/zwart)',
  gold: 'Goud',
  blue: 'Blauw (water/overstroming)',
  mixed: 'Divers',
};
