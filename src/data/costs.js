// Build costs for "Wat kan ik bouwen?"
// Resources: hout (🪵), baksteen (🧱), graan (🌾), wol (🐑), erts (⛰️), vis (🐟), specerij (🌶️), goud (🪙)
export const BUILD_ITEMS = [
  { id: 'weg', name: 'Weg', cat: 'Basis', cost: { hout: 1, baksteen: 1 }, rule: null },
  { id: 'dorp', name: 'Dorp', cat: 'Basis', cost: { hout: 1, baksteen: 1, graan: 1, wol: 1 }, rule: null },
  { id: 'stad', name: 'Stad', cat: 'Basis', cost: { graan: 2, erts: 3 }, rule: null },
  { id: 'ontwikkelingskaart', name: 'Ontwikkelingskaart', cat: 'Basis', cost: { graan: 1, wol: 1, erts: 1 }, rule: null },

  { id: 'scheepswerf_b', name: 'Scheepswerf', cat: 'Schepen', cost: { hout: 2, baksteen: 1, erts: 1 }, rule: 'scheepswerf' },
  { id: 'handelsschip_b', name: 'Handelsschip', cat: 'Schepen', cost: { hout: 1, wol: 1 }, rule: 'handelsschip' },
  { id: 'oorlogsschip_b', name: 'Oorlogsschip', cat: 'Schepen', cost: { hout: 1, wol: 1, erts: 1 }, rule: 'oorlogsschip' },
  { id: 'vissersboot_b', name: 'Vissersbootje', cat: 'Schepen', cost: { hout: 1, vis: 1 }, rule: 'vissersboot' },
  { id: 'vuurtoren_b', name: 'Vuurtoren', cat: 'Schepen', cost: { erts: 2, baksteen: 1, vis: 1 }, rule: 'vuurtoren' },

  { id: 'militie_b', name: 'Militie', cat: 'Eenheden', cost: { erts: 1, graan: 1 }, rule: 'militie' },
  { id: 'boogschutter_b', name: 'Boogschutter', cat: 'Eenheden', cost: { erts: 1, hout: 1 }, rule: 'boogschutter' },
  { id: 'katapult_b', name: 'Katapult', cat: 'Eenheden', cost: { erts: 3, hout: 2 }, rule: 'katapult' },
  { id: 'scheepssoldaat_b', name: 'Scheepssoldaat', cat: 'Eenheden', cost: { erts: 1, vis: 1 }, rule: 'scheepssoldaat' },
  { id: 'huurling_b', name: 'Huurling', cat: 'Eenheden', cost: { goud: 1 }, rule: 'huurlingen' },

  { id: 'fort_b', name: 'Fort', cat: 'Gebouwen', cost: { erts: 3, baksteen: 2 }, rule: 'fort' },
  { id: 'palissade_b', name: 'Palissade', cat: 'Gebouwen', cost: { hout: 1, baksteen: 1 }, rule: 'palissade' },
  { id: 'dijk_b', name: 'Dijk', cat: 'Gebouwen', cost: { baksteen: 2, hout: 1 }, rule: 'dijk' },
  { id: 'gildehall_b', name: 'Gildehall', cat: 'Gebouwen', cost: { erts: 2, graan: 2, wol: 1, specerij: 1 }, rule: 'gildehall' },
  { id: 'smederij_b', name: 'Smederij', cat: 'Gebouwen', cost: { erts: 1, baksteen: 1, hout: 1 }, rule: 'smederij' },
  { id: 'tempel_b', name: 'Tempel', cat: 'Gebouwen', cost: { erts: 1, graan: 1, specerij: 1 }, rule: 'tempel' },
  { id: 'markt_b', name: 'Markt', cat: 'Gebouwen', cost: { graan: 1, wol: 1, specerij: 1 }, rule: 'markt' },
  { id: 'voorraad_b', name: 'Voorraadschuur', cat: 'Gebouwen', cost: { hout: 1, graan: 1, wol: 1 }, rule: 'voorraadschuur' },
  { id: 'legerkamp_b', name: 'Legerkamp', cat: 'Gebouwen', cost: { hout: 2, baksteen: 1, graan: 1 }, rule: 'legerkamp' },
  { id: 'sluiproute_b', name: 'Sluiproute', cat: 'Gebouwen', cost: { hout: 1, wol: 1 }, rule: 'sluiproute' },
  { id: 'stadsmuur_b', name: 'Stadsmuur', cat: 'Gebouwen', cost: { goud: 3 }, rule: 'stadsmuur' },
  { id: 'spion_b', name: 'Spion', cat: 'Gebouwen', cost: { erts: 1, vis: 1 }, rule: 'spionnen' },

  { id: 'item_markt', name: 'Item (via markt)', cat: 'Items', cost: { goud: 3 }, rule: 'itemsysteem' },
  { id: 'strijdbijl_c', name: 'Strijdbijl (craft)', cat: 'Items', cost: { erts: 2, hout: 1 }, rule: 'strijdbijl' },
  { id: 'schild_c', name: 'Schild van Catan (craft)', cat: 'Items', cost: { erts: 3, wol: 1 }, rule: 'schild' },
  { id: 'ramsteven_c', name: 'Ramsteven (craft)', cat: 'Items', cost: { hout: 2, erts: 1 }, rule: 'ramsteven' },
  { id: 'vissersnet_c', name: 'Vissersnet (craft)', cat: 'Items', cost: { wol: 1, vis: 2 }, rule: 'vissersnet' },
  { id: 'handelsring_c', name: 'Handelsring (craft)', cat: 'Items', cost: { goud: 1, specerij: 1 }, rule: 'handelsring' },
  { id: 'orakelsteen_c', name: 'Orakelsteen (craft)', cat: 'Items', cost: { specerij: 2, erts: 1 }, rule: 'orakelsteen' },
  { id: 'stormmantel_c', name: 'Stormmantel (craft)', cat: 'Items', cost: { wol: 1, vis: 1, specerij: 1 }, rule: 'stormmantel' },
  { id: 'goudenKroon_c', name: 'Gouden Kroon (craft)', cat: 'Items', cost: { goud: 5 }, rule: 'goudenKroon' },
  { id: 'kruidenvoorraad_c', name: 'Kruidenvoorraad (craft)', cat: 'Items', cost: { specerij: 2, vis: 1 }, rule: 'kruidenvoorraad' },
];

export const RESOURCES = [
  { id: 'hout', name: 'Hout', icon: '🪵' },
  { id: 'baksteen', name: 'Baksteen', icon: '🧱' },
  { id: 'graan', name: 'Graan', icon: '🌾' },
  { id: 'wol', name: 'Wol', icon: '🐑' },
  { id: 'erts', name: 'Erts', icon: '⛰️' },
  { id: 'vis', name: 'Vis', icon: '🐟', rule: 'vis' },
  { id: 'specerij', name: 'Specerij', icon: '🌶️', rule: 'specerij' },
  { id: 'goud', name: 'Goud', icon: '🪙', rule: 'goud' },
];
