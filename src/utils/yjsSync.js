import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';

// Single shared doc — all users of the same URL see the same state.
export const doc = new Y.Doc();

// Local persistence — data survives even if nobody else is online
export const localPersistence = new IndexeddbPersistence('catan-shared-v1', doc);

// WebRTC p2p sync — realtime sync between simultaneous peers
export const webrtcProvider = new WebrtcProvider('catan-shared-v1', doc, {
  signaling: [
    'wss://y-webrtc-signaling.fly.dev',
    'wss://signaling.yjs.dev',
    'wss://demos.yjs.dev',
  ],
});

// Websocket server — keeps state on a public server so that a device
// that comes online later sees earlier changes even if no other peer
// is currently online. Public demo server — fine for hobby use.
export const wsProvider = new WebsocketProvider(
  'wss://demos.yjs.dev/ws',
  'catan-brokkert-shared-v1',
  doc,
  { connect: true }
);

// Shared state buckets
export const yConfig = doc.getMap('config');         // rule toggles
export const yCustomRules = doc.getArray('custom');  // user-added rules
export const yPrinted = doc.getMap('printed');       // print checklist
export const yBank = doc.getArray('bank');           // 4 player resource entries
export const yMeta = doc.getMap('meta');             // misc: selected preset etc
export const yPrintOverrides = doc.getMap('printOverrides'); // { itemId: { name?, qty?, hidden? } }
export const yCustomPrints = doc.getArray('customPrints');   // user-added print items
export const yParams = doc.getMap('params');                 // tweakable game-rule numbers

export function waitForSync(timeoutMs = 1500) {
  return new Promise(resolve => {
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    localPersistence.once('synced', finish);
    setTimeout(finish, timeoutMs);
  });
}
