/* Artenliste laden: 1) im Browser importierte xlsx (localStorage)
 *                   2) src/data/species.json (per npm run import-list erzeugt)
 *                   3) eingebaute Übungsliste */
import { BUILTIN, guessSound } from './species-builtin.js';
import { load } from '../lib/store.js';

const fileJson = import.meta.glob('./species.json', { eager: true, import: 'default' });
const REPO_LIST = Object.values(fileJson)[0] || null;

function normalize(list) {
  return list.map(s => ({
    de: s.de, sci: s.sci, fam: s.fam || '', ord: s.ord || '',
    hab: s.hab || [], syn: s.syn || [], snd: s.snd || guessSound(s),
  }));
}

export function getSpeciesList() {
  const uploaded = load('uploadedList', null);
  if (uploaded?.species?.length) return { name: `importiert (${uploaded.species.length} Arten)`, species: normalize(uploaded.species), source: 'upload' };
  if (REPO_LIST?.species?.length) return { name: REPO_LIST.name || `offiziell (${REPO_LIST.species.length} Arten)`, species: normalize(REPO_LIST.species), source: 'repo' };
  return { name: `Übungsliste (${BUILTIN.length} Arten, inoffiziell)`, species: BUILTIN, source: 'builtin' };
}
