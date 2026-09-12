#!/usr/bin/env node
/* Offizielle BANU-Artenliste (xlsx) → src/data/species.json
 *
 *   npm run import-list -- BANU_Feldornithologie_Begleitmaterial_Artenliste_2026.xlsx
 *   npm run import-list -- datei.xlsx silber      (andere Stufe, falls die Datei eine Stufenspalte/-blatt hat)
 *
 * Danach die Ausgabe prüfen: Anzahl Arten (Bronze = 75), Familien, Lebensräume.
 */
import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';
import { parseRows, pickSheet } from '../src/lib/parse-list.js';
import { guessSound } from '../src/data/species-builtin.js';

const [file, level = 'bronze'] = process.argv.slice(2);
if (!file) {
  console.error('Aufruf: npm run import-list -- pfad/zur/Artenliste.xlsx [bronze|silber|gold]');
  process.exit(1);
}

const wb = XLSX.read(fs.readFileSync(file), { type: 'buffer' });
const sheet = pickSheet(wb.SheetNames, level);
console.log(`Blätter: ${wb.SheetNames.join(', ')}  →  verwende „${sheet}“`);
const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, blankrows: false });
console.log('Kopfzeilen-Vorschau:', rows.slice(0, 3).map(r => r.slice(0, 8).join(' | ')).join('\n  '));

const species = parseRows(rows, level).map(s => ({ ...s, snd: guessSound(s) }));
const out = { name: `offiziell ${level} (${species.length} Arten)`, source: path.basename(file), species };
const target = path.resolve('src/data/species.json');
fs.writeFileSync(target, JSON.stringify(out, null, 2));

console.log(`\n${species.length} Arten → ${path.relative(process.cwd(), target)}`);
const noFam = species.filter(s => !s.fam).length, noHab = species.filter(s => !s.hab.length).length;
if (noFam) console.log(`Hinweis: ${noFam} Arten ohne Familie (Spalte „Familie“ nicht gefunden?)`);
if (noHab) console.log(`Hinweis: ${noHab} Arten ohne Lebensraum – Lebensraumfragen/-filter nutzen dann nur die übrigen.`);
if (level === 'bronze' && species.length !== 75) console.log('Achtung: Bronze sollte 75 Arten haben – bitte Blatt/Spalten prüfen.');
console.log('Laut-Typ (Gesang/Ruf) wurde geschätzt – bei Bedarf in species.json das Feld "snd" anpassen.');
