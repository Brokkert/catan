import { createClient } from '@supabase/supabase-js';
import * as Y from 'yjs';
import { doc } from './yjsSync.js';

const SUPABASE_URL = 'https://ogqytxojtnddzsjidyjf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bo2NeFurx39ErHGee1gfLw_xyYc81yi';
const ROOM = 'catan-shared-v1';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { params: { eventsPerSecond: 10 } },
});

export let supabaseReady = false;
const listeners = new Set();

function emit() { listeners.forEach(fn => fn()); }
export function onSupabaseStatus(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function encodeState() {
  const update = Y.encodeStateAsUpdate(doc);
  let binary = '';
  for (let i = 0; i < update.length; i++) binary += String.fromCharCode(update[i]);
  return btoa(binary);
}

function decodeState(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

let applyingRemote = false;
let saveTimer = null;
let lastSavedUpdatedAt = null;

async function loadFromSupabase() {
  const { data, error } = await supabase
    .from('catan_shared')
    .select('state, updated_at')
    .eq('id', ROOM)
    .maybeSingle();
  if (error) {
    console.warn('[supabase] load error:', error.message);
    return;
  }
  if (data?.state) {
    try {
      applyingRemote = true;
      Y.applyUpdate(doc, decodeState(data.state), 'supabase');
    } finally {
      applyingRemote = false;
    }
    lastSavedUpdatedAt = data.updated_at;
  }
  supabaseReady = true;
  emit();
}

function scheduleSave() {
  if (applyingRemote) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const state = encodeState();
    const { error } = await supabase
      .from('catan_shared')
      .upsert({ id: ROOM, state, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) console.warn('[supabase] save error:', error.message);
  }, 600);
}

function subscribeRealtime() {
  const channel = supabase
    .channel(`catan_shared_${ROOM}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'catan_shared', filter: `id=eq.${ROOM}` },
      (payload) => {
        const row = payload.new;
        if (!row?.state) return;
        if (row.updated_at && row.updated_at === lastSavedUpdatedAt) return;
        try {
          applyingRemote = true;
          Y.applyUpdate(doc, decodeState(row.state), 'supabase');
        } finally {
          applyingRemote = false;
        }
        lastSavedUpdatedAt = row.updated_at;
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        supabaseReady = true;
        emit();
      }
    });
  return channel;
}

export async function initSupabaseSync() {
  await loadFromSupabase();
  subscribeRealtime();
  doc.on('update', (_update, origin) => {
    if (origin === 'supabase') return;
    scheduleSave();
  });
}
