// Rules part 4: verzamelen, overwinning, duel, mythologie, kaarten
export const RULES_4 = [
  // VERZAMELEN
  { id: 'trofeeen', cat: 'verzamelen', name: 'Trofeeën', desc: '5 types: monsterklauw, piratenvlag, oorlogsbuit, zeemonsterschub, drakentand.', def: true },
  { id: 'trofeesets', cat: 'verzamelen', name: 'Trofee-sets', desc: 'Monsterjager (1VP), Piratendoder (1VP), Zeeheld (2VP), Drakendoder (3VP), Verzamelaar (3VP).', def: true },
  { id: 'schatkaarten', cat: 'verzamelen', name: 'Schatkaartfragmenten', desc: '6 stuks. 2=info, 4=haven, 6=Verloren Schat (3VP+5 grondstoffen).', def: true },
  { id: 'relieken', cat: 'verzamelen', name: 'Relieken (6 uniek)', desc: 'Drietand (2VP), Aambeeld, Kompas, Kroon, Kelk, Masker.', def: true },

  // OVERWINNING
  { id: 'vp16', cat: 'overwinning', name: '16 VP om te winnen', desc: 'Standaard met alle modules.', def: true },
  { id: 'survival_win', cat: 'overwinning', name: 'Survival-overwinning', desc: 'Laatste met gebouwen wint.', def: true },
  { id: 'militaire_win', cat: 'overwinning', name: 'Militaire overwinning', desc: 'Plunder alle tegenstanders = directe winst.', def: false },
  { id: 'grootste_vloot', cat: 'overwinning', name: 'Grootste Vloot (2VP)', desc: 'Meeste oorlogsschepen (min 2).', def: true },
  { id: 'meesterontdekker', cat: 'overwinning', name: 'Meesterontdekker (2VP)', desc: 'Meeste ontdekte tegels (min 3).', def: true },
  { id: 'geheime_missies', cat: 'overwinning', name: 'Geheime missies (2-speler)', desc: 'Missiekaart bij start. Voltooid = +3VP.', def: false },

  // DUEL (2-speler)
  { id: 'barbaar_npc', cat: 'duel', name: 'Barbaar (neutrale 3e speler)', desc: 'Automatische tegenstander. Bij 7 breidt hij uit. Dorpen veroveren voor gebiedscontrole.', def: false },
  { id: 'marktbord', cat: 'duel', name: 'Marktbord', desc: '3 open grondstoffen, 1:1 ruilen (max 2/beurt). Vervangt handelstekort.', def: false },
  { id: 'snellere_getijden', cat: 'duel', name: 'Snellere getijden', desc: 'Bij 7: 1-2 niks, 3-6 vloed.', def: false },
  { id: 'lagere_vp', cat: 'duel', name: 'Lagere VP (12)', desc: 'Win bij 12 VP i.p.v. 16.', def: false },

  // MYTHOLOGIE
  { id: 'beschermgoden', cat: 'mythologie', name: 'Beschermgoden', desc: 'Poseidon/Athena/Ares/Demeter met passieve bonus + startgodkracht.', def: false },
  { id: 'gunst', cat: 'mythologie', name: 'Gunst (Favor)', desc: 'Resource voor godkrachten + mythische eenheden. Via tempel, orakel, offers.', def: false },
  { id: 'tijdperken', cat: 'mythologie', name: 'Tijdperken (I-IV)', desc: 'Archaïsch→Klassiek→Heroïsch→Mythisch. Sterkere krachten/eenheden per level.', def: false },
  { id: 'hulpgoden', cat: 'mythologie', name: 'Hulpgoden', desc: 'Kies 1 bij Klassiek. Extra passieve bonus (Hermes, Apollo, Artemis, Hades etc).', def: false },
  { id: 'godkrachten', cat: 'mythologie', name: 'Godkrachten', desc: '4 per god. Aardbeving, Aegisschild, Bloedlust, Overvloed etc. 1e gratis, rest kost gunst.', def: false },
  { id: 'mythische_eenheden', cat: 'mythologie', name: 'Mythische eenheden', desc: 'Hydra, Minotaurus, Griffioen, Phoenix etc. Sterk vs troepen, zwak vs helden.', def: false },
  { id: 'helden', cat: 'mythologie', name: 'Helden', desc: '1/speler. Kracht 6 vs mythen. Perseus/Achilles/Odysseus/Persephone.', def: false },

  // KAARTEN
  { id: 'ride_by_night', cat: 'kaarten', name: 'Ride by Night', desc: 'Ridder + Wegenbouw, maar 1 weg.', def: true },
  { id: 'night_of_plenty', cat: 'kaarten', name: 'Night of Plenty', desc: 'Ridder + Uitvinding, maar 1 grondstof.', def: true },
  { id: 'monorail', cat: 'kaarten', name: 'Monorail', desc: 'Monopolie + Wegenbouw, pak alle hout én baksteen.', def: true },
  { id: 'vlootadmiraal', cat: 'kaarten', name: 'Vlootadmiraal', desc: 'Verplaats al je schepen + vernietig 1 handelsschip.', def: true },
  { id: 'orakelvisioen', cat: 'kaarten', name: 'Orakelvisioen', desc: 'Bekijk bovenste 3 nummerstapelkaarten, leg terug in gewenste volgorde.', def: true },
  { id: 'goudkoorts', cat: 'kaarten', name: 'Goudkoorts', desc: 'Ontvang 3🪙 direct.', def: true },
  { id: 'koopman', cat: 'kaarten', name: 'Koopman', desc: 'Op landtegel naast gebouw: 2:1 ruil. 1VP. Stealbaar.', def: true },
];
