#!/usr/bin/env node
/* Pro Art 5 gute Fotos von Wikimedia Commons → src/data/photos.json
 *
 *   npm run fetch-photos                    nur Arten ohne Bilder ergänzen
 *   npm run fetch-photos -- --force         alle Arten neu suchen
 *   npm run fetch-photos -- "Turdus merula" nur diese Art (neu)
 *   npm run fetch-photos -- --n 4           Anzahl je Art (Standard 5)
 *
 * Bilder, die du im Bild-Kurator ausgesucht und exportiert hast, bleiben
 * erhalten (außer mit --force). Topografie-Bilder (topo:…) werden nie angefasst.
 * Gespeichert werden nur Links, Urheber und Lizenz – keine Bilddateien.
 */
import fs from 'node:fs';
import path from 'node:path';
import { findSpeciesPhotos, findSexPhoto, detectSex, withRetry } from '../src/lib/photo-search.js';
import { DIMORPH } from '../src/data/dimorph.js';
import { ALL_SPECIES } from '../src/data/species-builtin.js';

const args = process.argv.slice(2);
const force = args.includes('--force');
const nIdx = args.indexOf('--n');
const N = nIdx >= 0 ? Number(args[nIdx + 1]) || 5 : 5;
const only = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--n'); // eine oder mehrere Arten

const species = ALL_SPECIES; // Bronze + Silber
const outFile = path.resolve('src/data/photos.json');
const out = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};

// Wikimedia verlangt einen aussagekräftigen User-Agent für Skripte
const UA = 'banu-feldornithologie-trainer/1.0 (Lern-App; github.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Wikimedia drosselt schnelle Anfragen (HTTP 429). Deshalb: Pause zwischen
// den Anfragen und bei Drosselung warten und neu versuchen.
const plainFetch = async url => { await sleep(700); return fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } }); };
const politeFetch = withRetry(plainFetch, { tries: 5, baseDelay: 3000, log: m => process.stdout.write(`(${m}) `) });

const todo = species.filter(sp => (only.length ? only.includes(sp.sci) || only.includes(sp.de) : true));
const missing = only.filter(o => !species.some(sp => sp.sci === o || sp.de === o));
if (missing.length) { console.error(`Nicht in der Liste: ${missing.join(', ')}`); process.exit(1); }

let added = 0, kept = 0, empty = [], failed = [];
for (const [i, sp] of todo.entries()) {
  const key = `art:${sp.sci}`;
  const has = Array.isArray(out[key]) ? out[key].length : out[key] ? 1 : 0;
  const dimorph = !!DIMORPH[sp.de];
  if (has && !force && !only.length) {
    // Arten mit Geschlechtsunterschied: fehlendes ♂- oder ♀-Foto nachholen
    const lst = Array.isArray(out[key]) ? out[key] : [out[key]];
    const miss = dimorph ? ['m', 'f'].filter(s => !lst.some(p => (p.sex || detectSex(p.title)) === s)) : [];
    if (!miss.length) { kept++; continue; }
    process.stdout.write(`[${i + 1}/${todo.length}] ${sp.de} – suche ${miss.map(s => s === 'm' ? '♂' : '♀').join(' und ')} … `);
    const got = [];
    for (const s of miss) {
      try { const p = await findSexPhoto(sp, s, { fetch: politeFetch }); if (p) { lst.push(p); got.push(s === 'm' ? '♂' : '♀'); } } catch { /* weiter */ }
    }
    out[key] = lst;
    console.log(got.length ? `${got.join(' ')} ergänzt` : 'nichts gefunden');
    if (got.length) added++; else kept++;
    fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
    continue;
  }
  process.stdout.write(`[${i + 1}/${todo.length}] ${sp.de} … `);
  let list = [];
  const errors = [];
  try { list = await findSpeciesPhotos(sp, { fetch: politeFetch, n: N, wantSexes: dimorph, onError: m => errors.push(m) }); }
  catch (e) { errors.push(e.message); }
  if (!list.length) {
    if (errors.length) { console.log(`FEHLER – ${errors[0]}`); failed.push(sp.de); }
    else { console.log('keine Fotos gefunden'); empty.push(sp.de); }
    continue;
  }
  out[key] = list;
  added++;
  const q = list.filter(x => x.q === 2).length;
  console.log(`${list.length} Fotos (${q} Featured/Quality)`);
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1)); // Zwischenstand sichern
}
fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
console.log(`\nFertig: ${added} Arten neu, ${kept} unverändert → ${path.relative(process.cwd(), outFile)}`);
if (failed.length) console.log(`Wegen Fehlern übersprungen: ${failed.join(', ')}\n→ Einfach nochmal „npm run fetch-photos“ starten – vorhandene Arten werden übersprungen, nur die Lücken werden gefüllt.`);
if (empty.length) console.log(`Ohne Treffer: ${empty.join(', ')} – im Bild-Kurator von Hand ergänzen.`);
console.log('Stichprobe ansehen: App starten → Mehr → Bilder auswählen → Bereich „Arten“.');
