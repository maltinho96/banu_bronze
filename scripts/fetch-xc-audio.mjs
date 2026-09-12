#!/usr/bin/env node
/* Kuratierte Tonaufnahmen von xeno-canto → src/data/audio.json
 *
 * Voraussetzung: kostenloser xeno-canto-Account → API-Key (Profil/Account-Seite).
 *   In Codespaces:  XC_KEY=dein_key npm run fetch-audio
 *   (oder als Codespaces-Secret „XC_KEY“ hinterlegen)
 *
 * Pro Art werden bis zu 4 Aufnahmen gewählt:
 *   - exakt die Art (gen + sp), Qualität A (sonst B)
 *   - passender Lauttyp (Gesang / Ruf / Trommeln, Feld "snd")
 *   - bevorzugt aus Deutschland, sonst Europa-Nachbarländer, sonst beliebig
 *   - keine Jungvogel-/Bettelrufe, keine Aufnahmen mit Klangattrappe, 8 s – 2 min
 * Die Audiodateien selbst werden NICHT kopiert, nur verlinkt (Lizenz/Urheber bleiben sichtbar).
 * API-Doku: https://xeno-canto.org/explore/api
 */
import fs from 'node:fs';
import path from 'node:path';
import { BUILTIN } from '../src/data/species-builtin.js';

const KEY = process.env.XC_KEY;
if (!KEY) {
  console.error('Kein API-Key. Aufruf: XC_KEY=dein_key npm run fetch-audio');
  process.exit(1);
}
const PER_SPECIES = 4;
const only = process.argv[2]; // optional: nur eine Art, z. B. "Parus major"

const listFile = path.resolve('src/data/species.json');
const species = fs.existsSync(listFile) ? JSON.parse(fs.readFileSync(listFile, 'utf8')).species : BUILTIN;
const outFile = path.resolve('src/data/audio.json');
const out = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};

const sleep = ms => new Promise(r => setTimeout(r, ms));
const TYPE_Q = { song: 'song', call: 'call', drumming: 'drumming' };
const BAD = /(juvenile|nestling|begging|subsong|imitation)/i;
const secs = len => { const [m, s] = String(len || '0:0').split(':').map(Number); return m * 60 + (s || 0); };

async function query(q) {
  const url = `https://xeno-canto.org/api/3/recordings?query=${encodeURIComponent(q)}&key=${KEY}&per_page=100`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).recordings || [];
}

async function forSpecies(sp) {
  const [gen, epi] = sp.sci.split(' ');
  const type = TYPE_Q[sp.snd] || 'song';
  const base = `gen:${gen} sp:${epi}`;
  const attempts = [
    `${base} type:${type} q:A cnt:germany`,
    `${base} type:${type} q:A area:europe`,
    `${base} type:${type} q:B area:europe`,
    `${base} q:A area:europe`,
  ];
  const picked = [];
  for (const q of attempts) {
    let recs = [];
    try { recs = await query(q); } catch (e) {
      console.warn(`  ! ${q}: ${e.message}`);
      if (/HTTP 4/.test(e.message)) console.warn('    → Suchsyntax/Key prüfen: https://xeno-canto.org/explore/api');
    }
    await sleep(1100); // höflich zur API
    recs = recs.filter(r =>
      r.gen?.toLowerCase() === gen.toLowerCase() && r.sp?.toLowerCase() === epi.toLowerCase() &&
      !BAD.test(r.type || '') && !/yes/i.test(r['playback-used'] || '') &&
      secs(r.length) >= 8 && secs(r.length) <= 120 &&
      !(r.also || []).filter(Boolean).length); // keine hörbaren Begleitarten
    recs.sort((a, b) => Math.abs(secs(a.length) - 35) - Math.abs(secs(b.length) - 35));
    for (const r of recs) {
      if (picked.length >= PER_SPECIES) break;
      if (picked.some(p => p.id === r.id)) continue;
      picked.push({
        id: r.id, src: r.file, by: r.rec, cnt: r.cnt, type: r.type,
        len: r.length, q: r.q, lic: (r.lic || '').replace(/^\/\//, 'https://'),
      });
    }
    if (picked.length >= PER_SPECIES) break;
  }
  return picked;
}

const todo = species.filter(s => !only || s.sci === only);
for (const [i, sp] of todo.entries()) {
  process.stdout.write(`[${i + 1}/${todo.length}] ${sp.de} (${sp.sci}) … `);
  const recs = await forSpecies(sp);
  if (recs.length) out[sp.sci] = recs;
  console.log(recs.length ? `${recs.length} Aufnahmen` : 'KEINE – bleibt bei Commons');
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1)); // Zwischenstand sichern
}
console.log(`\nFertig → ${path.relative(process.cwd(), outFile)} (${Object.keys(out).length} Arten)`);
