/* Artenliste je Stufe: Bronze (75 Arten) oder Silber (150 Arten). */
import { BUILTIN, SILBER } from './species-builtin.js';
import { load } from '../lib/store.js';

export const LEVELS = { b: 'Bronze', s: 'Silber' };
export function currentLevel() { const l = load('level', 'b'); return l === 's' ? 's' : 'b'; }

export function getSpeciesList(level = currentLevel()) {
  const species = level === 's' ? SILBER : BUILTIN;
  return { name: `BANU-Artenliste ${LEVELS[level]} (${species.length} Arten)`, species, source: 'builtin', level };
}
