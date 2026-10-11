/* Artenliste: die eingebaute BANU-Artenliste Bronze (75 Arten). */
import { BUILTIN } from './species-builtin.js';

export function getSpeciesList() {
  return { name: `BANU-Artenliste Bronze (${BUILTIN.length} Arten)`, species: BUILTIN, source: 'builtin' };
}
