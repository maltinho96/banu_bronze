/* Fragen nach dem Muster der „Exemplarischen Prüfungsfragen Feldornithologie“ (BANU, V3 2025).
 * lv: in welchen Stufen die Frage laut Katalog vorkommt (b = Bronze, s = Silber, g = Gold)
 * type: single | multi | open (Karteikarte, Selbstbewertung)
 * Antworten sind Lernhilfen, keine Rechtsberatung – im Zweifel Originalquellen prüfen.
 */
import { HAB_LABEL } from './species-builtin.js';
import { CODES } from './brutzeit.js';
import { RL_CATS, RL_SPECIES } from './rote-liste.js';
import { RECHT, LAWS, LAW_BINS } from './questions-recht.js';
import { EXTRA } from './questions-extra.js';
import { BRONZE } from './questions-bronze.js';
import { shuffle, pick } from '../lib/util.js';

export const CATS = {
  sys: 'Systematik & Morphologie',
  oek: 'Biologie & Ökologie',
  leb: 'Lebensraum',
  sach: 'Sachkenntnis & Recht',
  meth: 'Methoden',
};

/* ---------- Brutzeitcodes (Daten in brutzeit.js, eigener Trainer im Tab „Brutzeit“) ---------- */
export const BZC = CODES.map(c => [c.c, c.t]);

/* ---------- Rote Liste (Daten in rote-liste.js) ---------- */
export const RL = RL_CATS.map(c => [c.k, c.t]);

/* ---------- Statische Fragen ---------- */
const BASE = [
  // 1. Systematik & Morphologie
  { id: 'sys-steuerfedern', lv: 'bsg', cat: 'sys', type: 'single', q: 'Wie heißen die großen Schwanzfedern?',
    opts: ['Steuerfedern', 'Schwungfedern', 'Oberschwanzdecken', 'Schirmfedern'], ok: [0],
    a: 'Steuerfedern. Oberschwanzdecken liegen darüber und decken ihre Basis ab.' },
  { id: 'sys-buerzel', lv: 'bsg', cat: 'sys', type: 'single', q: 'Welche Gefiederpartie liegt zwischen Rücken und Oberschwanzdecken?',
    opts: ['Bürzel', 'Steiß', 'Mantel', 'Nacken'], ok: [0],
    a: 'Der Bürzel. Der Steiß liegt auf der Unterseite zwischen Bauch und Unterschwanzdecken.' },
  { id: 'sys-steiss', lv: 'bsg', cat: 'sys', type: 'single', q: 'Wo liegt der Steiß?',
    opts: ['Unterseite zwischen Bauch und Unterschwanzdecken', 'Oberseite zwischen Rücken und Schwanz', 'Hinterseite des Halses', 'Am Flügelbug'], ok: [0],
    a: 'Unterseite, um die Kloake, zwischen Bauch und Unterschwanzdecken.' },
  { id: 'sys-alula', lv: 'bsg', cat: 'sys', type: 'single', q: 'Was ist die Alula?',
    opts: ['Daumenfittich – kleine Federgruppe am Flügelbug', 'Die längste Handschwinge', 'Der helle Fleck an der Basis der Handschwingen', 'Die innerste Armschwinge'], ok: [0],
    a: 'Die Alula (Daumenfittich) sitzt am „Daumen“ und hilft beim Langsamflug und bei der Landung, den Luftstrom anzulegen.' },
  { id: 'sys-scheitel', lv: 'bsg', cat: 'sys', type: 'single', q: 'Wie heißt der Streif über dem Auge?',
    opts: ['Überaugenstreif', 'Augenstreif', 'Bartstreif', 'Scheitelstreif'], ok: [0],
    a: 'Überaugenstreif (liegt über dem Auge). Der Augenstreif verläuft durch bzw. hinter dem Auge.' },

  // 3. Lebensraum
  { id: 'leb-drossel', lv: 'bsg', cat: 'leb', type: 'open', q: 'Nennen Sie zwei Drosselarten, die Sie zur Brutzeit in Wäldern erwarten würden.',
    a: 'Singdrossel und Amsel. An Waldrändern und in Feldgehölzen auch die Wacholderdrossel.' },

  // 4. Sachkenntnis & Recht
  { id: 'sach-auerhahn', lv: 'bsg', cat: 'sach', type: 'single', q: 'Sie finden Federn eines Auerhahns im Schwarzwald. Dürfen Sie diese mitnehmen?',
    opts: ['Nein', 'Ja, Mauserfedern sind frei', 'Ja, wenn man sie nicht verkauft', 'Nur außerhalb von Schutzgebieten'], ok: [0],
    a: 'Nein. Alle europäischen Vogelarten sind besonders geschützt, das Auerhuhn zusätzlich streng geschützt. Das Besitzverbot des BNatSchG (§ 44 Abs. 2) gilt auch für Teile wie Federn; Ausnahmen nur mit Genehmigung der Naturschutzbehörde.' },
  { id: 'sach-drohne', lv: 'bsg', cat: 'sach', type: 'single', q: 'Sind Drohnen zum Fotografieren von Vogelkolonien erlaubt?',
    opts: ['Nein, grundsätzlich nicht', 'Ja, ab 50 m Höhe', 'Ja, außerhalb der Brutzeit immer', 'Ja, mit kleinen Drohnen unter 250 g'], ok: [0],
    a: 'Grundsätzlich nein: Drohnen stören Vögel erheblich (Störungsverbot § 44 Abs. 1 Nr. 2 BNatSchG, besonders zur Brut- und Aufzuchtzeit). Über Naturschutzgebieten, Nationalparks und Natura-2000-Gebieten ist der Betrieb zudem luftrechtlich in der Regel verboten bzw. genehmigungspflichtig.' },
  { id: 'sach-klangattrappe', lv: 'bsg', cat: 'sach', type: 'single', q: 'Ist der Einsatz von Klangattrappen überall erlaubt?',
    opts: ['Nein', 'Ja', 'Ja, außer nachts', 'Ja, wenn die Art häufig ist'], ok: [0],
    a: 'Nein. Klangattrappen können Vögel erheblich stören (Störungsverbot), in Schutzgebieten sind sie meist verboten. Für Erfassungen nur gezielt, sparsam und nach Methodenstandard – bei seltenen Arten nur mit Abstimmung/Genehmigung.' },
  { id: 'sach-fotofalle', lv: 'bsg', cat: 'sach', type: 'open', q: 'Sie möchten Waldschnepfen mit Fotofallen und Audiorekorder dokumentieren. Was ist beim Anbringen im Gelände zu beachten?',
    a: 'Erlaubnis von Grundeigentümer/Jagdausübungsberechtigten; in Schutzgebieten Genehmigung der Naturschutzbehörde; Störungen vermeiden (Abstand zu Brutplätzen, keine häufigen Kontrollen zur Brutzeit); Datenschutz (Kameras nicht auf Wege richten, Personenaufnahmen vermeiden, ggf. Hinweisschild); baumschonend befestigen (Gurte statt Nägel); Diebstahlschutz; Geräte nach Abschluss entfernen.' },

];

export const STATIC = [...BASE, ...EXTRA, ...BRONZE, ...RECHT];

/* ---------- Generierte Fragen ---------- */
function mc(id, lv, cat, q, correct, distractors, a) {
  const opts = shuffle([correct, ...distractors]);
  return { id, lv, cat, type: 'single', q, opts, ok: [opts.indexOf(correct)], a, generated: true };
}
const uniq = a => [...new Set(a.filter(Boolean))];
/* Ordnung der betroffenen Art merken – damit die Fragen-Runde die Ordnungen
 * ausgeglichen ziehen kann, statt zu zwei Dritteln Sperlingsvögel zu bringen. */
const tag = (q, ord) => (ord ? { ...q, ord } : q);

/* Steckt der Familien- oder Ordnungsname schon im Artnamen?
 * (Kohlmeise – Meisen, Turmfalke – Falkenartige, Stockente – Entenvögel …)
 * Solche Fragen sind geschenkt und werden nicht gestellt. */
const fold = t => t.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss');
const EXTRA_STEMS = { Lappentaucher: ['taucher'], Fliegenschnäpper: ['schnapper'], Hühnervögel: ['huhn'] };
function stems(group) {
  const out = new Set(EXTRA_STEMS[group] || []);
  group.split(/\s+und\s+|\s+/).forEach(w => {
    let b = fold(w);
    if (b.length < 4) return;
    out.add(b);
    const core = b.replace(/(vogel|artige)$/, '');
    [b, core].forEach(x => {
      ['', 'en', 'n', 'e', 's'].forEach(suf => {
        const st = suf && x.endsWith(suf) ? x.slice(0, -suf.length) : x;
        if (st.length >= 4) out.add(st);
      });
    });
  });
  return [...out];
}
export const nameHasGroup = (name, group) => !!group && stems(group).some(st => fold(name).includes(st));

/* Zuordnungsaufgabe: Elemente in Fächer sortieren */
function sortQ(id, cat, q, bins, items, a) {
  return { id, lv: 'b', cat, type: 'sort', q, bins, items: shuffle(items.slice()), a, generated: true };
}

export function generateQuestions(species) {
  const out = [];
  const byDe = new Map(species.map(s => [s.de, s]));
  const fams = uniq(species.map(s => s.fam));
  const ords = uniq(species.map(s => s.ord));
  const habs = Object.keys(HAB_LABEL);

  // ---- Rote Liste: Kategorie erklären + Art auswählen ----
  RL_CATS.forEach(c => {
    const wrong = shuffle(RL_CATS.filter(r => r.k !== c.k).map(r => r.t)).slice(0, 3);
    out.push(mc(`rl-${c.k}`, 'b', 'sach', `Was bedeutet die Kategorie „${c.k}“ in der Roten Liste?`, c.t, wrong, `${c.k} = ${c.t}: ${c.x}`));
  });
  const rlKeys = Object.keys(RL_SPECIES);
  rlKeys.forEach(k => {
    const c = RL_CATS.find(x => x.k === k);
    // Bronze-Arten bevorzugt als richtige Antwort, sonst beliebige
    const list = RL_SPECIES[k];
    const bronze = list.filter(d => byDe.has(d));
    for (let n = 0; n < 3; n++) {
      const right = pick(n < 2 && bronze.length ? bronze : list);
      const others = shuffle(rlKeys.filter(x => x !== k)).slice(0, 3).map(x => pick(RL_SPECIES[x]));
      const where = others.map((d, i2) => `${d}: ${rlKeysOf(d)}`).join(', ');
      out.push(mc(`rlart-${k}-${n}`, 'b', 'sach',
        `Kategorie ${k} der Roten Liste heißt „${c.t}“. Welche dieser Arten steht in dieser Kategorie?`,
        right, others,
        `${right} steht in Kategorie ${k} (${c.t}). ${c.x} Die anderen: ${where}.`));
    }
  });
  function rlKeysOf(d) { return rlKeys.find(x => RL_SPECIES[x].includes(d)); }

  // ---- Rechtsnormen: EU oder Deutschland? ----
  for (let n = 0; n < 3; n++) {
    const pickL = shuffle(LAWS.slice()).slice(0, 5);
    out.push(sortQ(`recht-sort-${n}`, 'sach', 'Europäisches oder deutsches Recht? Ordnen Sie zu.', LAW_BINS,
      pickL.map(l => ({ t: l.short, bin: l.eu ? 0 : 1 })),
      'Europäisch: Vogelschutzrichtlinie, FFH-Richtlinie, Natura 2000, EU-Artenschutzverordnung. Deutsch: Bundesnaturschutzgesetz (mit § 39 und § 44), Bundesartenschutzverordnung, Bundesjagdgesetz, Landesnaturschutzgesetze. EU-Richtlinien müssen in deutsches Recht umgesetzt werden, EU-Verordnungen gelten direkt.'));
  }

  if (species.length < 8) return out;

  // ---- Arten in Ordnungen sortieren ----
  const ordOk = species.filter(s => s.ord && !nameHasGroup(s.de, s.ord));
  for (let n = 0; n < 8; n++) {
    const binsO = shuffle(uniq(ordOk.map(s => s.ord))).slice(0, 3);
    const items = binsO.flatMap((o, bi) => shuffle(ordOk.filter(s => s.ord === o)).slice(0, 2).map(s => ({ t: s.de, bin: bi })));
    out.push(sortQ(`sortord-${n}`, 'sys', 'Ordnen Sie die Arten ihrer Ordnung zu.', binsO, items,
      binsO.map((o, bi) => `${o}: ${items.filter(it => it.bin === bi).map(it => it.t).join(', ')}`).join(' · ')));
  }
  // ---- Arten in Familien sortieren (ohne Arten, die den Familiennamen im Namen tragen) ----
  const famOk = species.filter(s => s.fam && !nameHasGroup(s.de, s.fam));
  const famsOk = uniq(famOk.map(s => s.fam));
  for (let n = 0; n < 8; n++) {
    // zwei Familien mit mehreren passenden Arten + eine beliebige weitere
    const multi = shuffle(famsOk.filter(f => famOk.filter(s => s.fam === f).length >= 2)).slice(0, 2);
    const binsF = shuffle([...multi, pick(famsOk.filter(f => !multi.includes(f)))]);
    const items = binsF.flatMap((f, bi) => shuffle(famOk.filter(s => s.fam === f)).slice(0, 2).map(s => ({ t: s.de, bin: bi })));
    out.push(sortQ(`sortfam-${n}`, 'sys', 'Ordnen Sie die Arten ihrer Familie zu.', binsF, items,
      binsF.map((f, bi) => `${f}: ${items.filter(it => it.bin === bi).map(it => it.t).join(', ')}`).join(' · ')));
  }

  species.forEach(sp => {
    // Familie – nicht, wenn der Familienname im Artnamen steckt
    if (sp.fam && fams.length >= 4 && !nameHasGroup(sp.de, sp.fam)) {
      const wrong = shuffle(fams.filter(f => f !== sp.fam)).slice(0, 3);
      out.push(tag(mc(`fam-${sp.sci}`, 'b', 'sys', `Zu welcher Familie gehört: ${sp.de}?`, sp.fam, wrong,
        `${sp.de} (${sp.sci}) gehört zur Familie ${sp.fam}${sp.ord ? ', Ordnung ' + sp.ord : ''}.`), sp.ord));
    }
    // Ordnung (nur Nicht-Sperlingsvögel, und nicht, wenn der Name schon verrät)
    if (sp.ord && sp.ord !== 'Sperlingsvögel' && ords.length >= 4 && !nameHasGroup(sp.de, sp.ord)) {
      const wrong = shuffle(ords.filter(o => o !== sp.ord)).slice(0, 3);
      out.push(tag(mc(`ord-${sp.sci}`, 'b', 'sys', `Zu welcher Ordnung gehört: ${sp.de}?`, sp.ord, wrong,
        `${sp.de}: Ordnung ${sp.ord}, Familie ${sp.fam}.`), sp.ord));
    }
    // Lebensraum der Art – nicht bei „mehrere Lebensräume (indifferent)“
    if (sp.hab?.length && !/^mehrere Lebensräume \(indifferent\)/.test(sp.hl || '')) {
      const wrong = shuffle(habs.filter(h => !sp.hab.includes(h))).slice(0, 3).map(h => HAB_LABEL[h]);
      out.push(tag(mc(`hab-${sp.sci}`, 'b', 'leb', `In welchem Lebensraum brütet ${sp.de} hauptsächlich?`, HAB_LABEL[sp.hab[0]], wrong,
        `${sp.de}: ${sp.hl ? sp.hl + ' – ' : ''}${sp.hab.map(h => HAB_LABEL[h]).join(', ')} (laut BANU-Tabelle).`), sp.ord));
    }
  });

  // Welche Art erwarten Sie im Lebensraum X?
  habs.forEach(hk => {
    const inH = species.filter(s => s.hab?.[0] === hk);
    const notH = species.filter(s => !s.hab?.includes(hk));
    if (inH.length < 1 || notH.length < 3) return;
    const c = pick(inH);
    out.push(mc(`habmem-${hk}`, 'b', 'leb', `Welche Art erwarten Sie zur Brutzeit typischerweise im Lebensraum „${HAB_LABEL[hk]}“?`, c.de,
      shuffle(notH).slice(0, 3).map(s => s.de),
      `Typisch für ${HAB_LABEL[hk]} (Hauptlebensraum laut BANU-Tabelle): ${inH.map(s => s.de).join(', ')}.`));
  });

  return out;
}
