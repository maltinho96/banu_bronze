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
import { findSpeciesPhotos } from '../src/lib/photo-search.js';
import { BUILTIN } from '../src/data/species-builtin.js';

const args = process.argv.slice(2);
const force = args.includes('--force');
const nIdx = args.indexOf('--n');
const N = nIdx >= 0 ? Number(args[nIdx + 1]) || 5 : 5;
const only = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--n');

const listFile = path.resolve('src/data/species.json');
const species = fs.existsSync(listFile) ? JSON.parse(fs.readFileSync(listFile, 'utf8')).species : BUILTIN;
const outFile = path.resolve('src/data/photos.json');
const out = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};

// Wikimedia verlangt einen aussagekräftigen User-Agent für Skripte
const UA = 'banu-feldornithologie-trainer/1.0 (Lern-App; github.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const politeFetch = async url => { await sleep(250); return fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } }); };

const todo = species.filter(sp => (only ? sp.sci === only || sp.de === only : true));
if (!todo.length) { console.error(`Art „${only}“ nicht in der Liste.`); process.exit(1); }

let added = 0, kept = 0, empty = [];
for (const [i, sp] of todo.entries()) {
  const key = `art:${sp.sci}`;
  const has = Array.isArray(out[key]) ? out[key].length : out[key] ? 1 : 0;
  if (has && !force && !only) { kept++; continue; }
  process.stdout.write(`[${i + 1}/${todo.length}] ${sp.de} … `);
  let list = [];
  try { list = await findSpeciesPhotos(sp, { fetch: politeFetch, n: N }); }
  catch (e) { console.log(`Fehler: ${e.message}`); continue; }
  if (!list.length) { console.log('keine Fotos gefunden'); empty.push(sp.de); continue; }
  out[key] = list;
  added++;
  const q = list.filter(x => x.q === 2).length;
  console.log(`${list.length} Fotos (${q} Featured/Quality)`);
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1)); // Zwischenstand sichern
}
fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
console.log(`\nFertig: ${added} Arten neu, ${kept} unverändert → ${path.relative(process.cwd(), outFile)}`);
if (empty.length) console.log(`Ohne Treffer: ${empty.join(', ')} – im Bild-Kurator von Hand ergänzen.`);
console.log('Stichprobe ansehen: App starten → Mehr → Bilder auswählen → Bereich „Arten“.');
