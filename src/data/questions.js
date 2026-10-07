/* Fragen nach dem Muster der „Exemplarischen Prüfungsfragen Feldornithologie“ (BANU, V3 2025).
 * lv: in welchen Stufen die Frage laut Katalog vorkommt (b = Bronze, s = Silber, g = Gold)
 * type: single | multi | open (Karteikarte, Selbstbewertung)
 * Antworten sind Lernhilfen, keine Rechtsberatung – im Zweifel Originalquellen prüfen.
 */
import { HAB_LABEL } from './species-builtin.js';
import { CODES, CODE_MAP, SCENARIOS } from './brutzeit.js';
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

/* ---------- Rote Liste ---------- */
export const RL = [
  ['0', 'Ausgestorben oder verschollen'],
  ['1', 'Vom Aussterben bedroht'],
  ['2', 'Stark gefährdet'],
  ['3', 'Gefährdet'],
  ['R', 'Extrem selten'],
  ['V', 'Vorwarnliste'],
  ['G', 'Gefährdung unbekannten Ausmaßes'],
  ['D', 'Daten unzureichend'],
  ['*', 'Ungefährdet'],
  ['♦', 'Nicht bewertet'],
];

/* ---------- Statische Fragen ---------- */
const BASE = [
  // 1. Systematik & Morphologie
  { id: 'sys-lappentaucher', lv: 'bsg', cat: 'sys', type: 'open', q: 'Nennen Sie eine Lappentaucherart.',
    a: 'Haubentaucher, Zwergtaucher (außerdem Rothals-, Schwarzhals- und Ohrentaucher).' },
  { id: 'sys-lappentaucher-mc', lv: 'bsg', cat: 'sys', type: 'multi', q: 'Welche dieser Arten sind Lappentaucher?',
    opts: ['Haubentaucher', 'Zwergtaucher', 'Kormoran', 'Blässhuhn', 'Teichhuhn'], ok: [0, 1],
    a: 'Lappentaucher (Podicipedidae): u. a. Hauben- und Zwergtaucher. Kormoran = Kormorane, Bläss- und Teichhuhn = Rallen.' },
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
  { id: 'sys-schwingen', lv: 'bsg', cat: 'sys', type: 'single', q: 'Welche Schwungfedern sitzen am Handteil des Flügels?',
    opts: ['Handschwingen', 'Armschwingen', 'Schirmfedern', 'Große Armdecken'], ok: [0],
    a: 'Handschwingen sitzen an der „Hand“ (außen), Armschwingen am Unterarm (innen).' },
  { id: 'sys-scheitel', lv: 'bsg', cat: 'sys', type: 'single', q: 'Wie heißt der Streif über dem Auge?',
    opts: ['Überaugenstreif', 'Augenstreif', 'Bartstreif', 'Scheitelstreif'], ok: [0],
    a: 'Überaugenstreif (liegt über dem Auge). Der Augenstreif verläuft durch bzw. hinter dem Auge.' },
  { id: 'sys-hsprojektion', lv: 'sg', cat: 'sys', type: 'open', q: 'Was ist die Handschwingenprojektion? (Skizze gedanklich)',
    a: 'Der Überstand der Handschwingenspitzen über die längste Schirmfeder beim sitzenden Vogel, oft im Verhältnis zur Länge der Schirmfedern angegeben. Bestimmungsmerkmal z. B. Fitis (lang) vs. Zilpzalp (kurz).' },
  { id: 'sys-spiegel', lv: 'sg', cat: 'sys', type: 'single', q: 'Zu welcher Gefiederpartie gehört der Flügelspiegel der Gründelenten?',
    opts: ['Armschwingen', 'Handschwingen', 'Große Handdecken', 'Schulterfedern'], ok: [0],
    a: 'Armschwingen – der farbige Spiegel ist ein „helles Armfeld“.' },
  { id: 'sys-hals', lv: 'sg', cat: 'sys', type: 'multi', q: 'Welche fliegen mit gestrecktem Hals?',
    opts: ['Kormorane', 'Störche', 'Kranich', 'Reiher'], ok: [0, 1, 2],
    a: 'Kormorane, Störche und Kraniche fliegen mit gestrecktem Hals, Reiher mit eingezogenem (S-förmigem) Hals.' },
  { id: 'sys-baumlaeufer', lv: 'sg', cat: 'sys', type: 'single', q: 'Woran unterscheidet man Garten- und Waldbaumläufer im Feld am sichersten?',
    opts: ['Am Gesang', 'An der Schnabellänge', 'Am Lebensraum', 'An der Flügelzeichnung'], ok: [0],
    a: 'Am Gesang (auch Rufe). Optische Merkmale überlappen stark; beide Arten kommen auch in denselben Lebensräumen vor.' },
  { id: 'sys-enten', lv: 'sg', cat: 'sys', type: 'open', q: 'Wie unterscheiden sich Tauchenten von Gründelenten bei a) Haltung an Land, b) Lage im Wasser, c) Start aus dem Wasser?',
    a: 'a) Tauchenten: Beine weit hinten → aufrechte, unbeholfene Haltung; Gründelenten laufen gut, eher waagerecht. b) Tauchenten liegen tiefer im Wasser, Schwanz oft flach auf dem Wasser; Gründelenten liegen höher, Schwanz angehoben. c) Tauchenten laufen zum Start über die Wasseroberfläche an; Gründelenten starten fast senkrecht direkt aus dem Wasser.' },
  { id: 'sys-nummer', lv: 'sg', cat: 'sys', type: 'single', q: 'Wie werden die Handschwingen bei Singvögeln nummeriert?',
    opts: ['Von innen (HS 1) nach außen', 'Von außen (HS 1) nach innen', 'Von der längsten zur kürzesten', 'Gar nicht, nur die Armschwingen'], ok: [0],
    a: 'Handschwingen von innen nach außen (HS 1 grenzt an die Armschwingen), Armschwingen von außen nach innen (AS 1 grenzt an die Hand).' },

  // 2. Biologie & Ökologie
  { id: 'oek-polygam', lv: 'sg', cat: 'oek', type: 'open', q: 'Zählen Sie zwei polygame Arten auf.',
    a: 'z. B. Zaunkönig, Fasan, Auerhuhn, Birkhuhn, Kampfläufer, Rohrweihe (teilweise), Kuckuck.' },
  { id: 'oek-kolonie', lv: 'sg', cat: 'oek', type: 'open', q: 'Nennen Sie zwei Vogelarten, die in Kolonien brüten.',
    a: 'z. B. Graureiher, Saatkrähe, Uferschwalbe, Lachmöwe, Kormoran, Mehlschwalbe, Dohle.' },
  { id: 'oek-schwarzspecht', lv: 'sg', cat: 'oek', type: 'open', q: 'Welche heimischen Vogelarten brüten in alten Schwarzspechthöhlen?',
    a: 'z. B. Hohltaube, Dohle, Raufußkauz, Schellente, Gänsesäger (Nachnutzer).' },
  { id: 'oek-hohltaube', lv: 'g', cat: 'oek', type: 'single', q: 'Welche Taubenart brütet in alten Schwarzspechthöhlen?',
    opts: ['Hohltaube', 'Ringeltaube', 'Türkentaube', 'Turteltaube'], ok: [0], a: 'Die Hohltaube – daher der Name.' },
  { id: 'oek-halbhoehle', lv: 'sg', cat: 'oek', type: 'open', q: 'Nennen Sie zwei typische Halbhöhlenbrüter aus unterschiedlichen Familien.',
    a: 'z. B. Hausrotschwanz oder Grauschnäpper (Fliegenschnäpper) und Bachstelze (Stelzen und Pieper).' },
  { id: 'oek-kraehe', lv: 'g', cat: 'oek', type: 'single', q: 'Welche Art aus der Familie der Rabenvögel ist ein Höhlenbrüter?',
    opts: ['Dohle', 'Elster', 'Eichelhäher', 'Rabenkrähe'], ok: [0], a: 'Die Dohle brütet in Baum-, Fels- und Gebäudehöhlen (auch Schornsteinen).' },
  { id: 'oek-hoehle', lv: 'sg', cat: 'oek', type: 'multi', q: 'Welche dieser Arten sind Höhlenbrüter?',
    opts: ['Kohlmeise', 'Star', 'Kleiber', 'Amsel', 'Buchfink'], ok: [0, 1, 2],
    a: 'Kohlmeise, Star und Kleiber brüten in Höhlen. Amsel und Buchfink bauen offene Napfnester.' },
  { id: 'oek-keinnest', lv: 'sg', cat: 'oek', type: 'open', q: 'Nennen Sie zwei Arten, die keine eigenen Nester bauen.',
    a: 'z. B. Kuckuck (Brutparasit), Turmfalke, Baumfalke und Waldohreule (nutzen fremde Nester), Ziegenmelker (legt auf den Boden).' },
  { id: 'oek-nesthocker', lv: 'sg', cat: 'oek', type: 'open', q: 'Je zwei Beispiele für ausgeprägte Nesthocker und Nestflüchter?',
    a: 'Nesthocker: z. B. Amsel, Kohlmeise, Buntspecht, Mauersegler. Nestflüchter: z. B. Stockente, Kiebitz, Fasan, Haubentaucher.' },
  { id: 'oek-greif-lang', lv: 'sg', cat: 'oek', type: 'open', q: 'Nennen Sie zwei in Deutschland brütende Greifvogelarten (inkl. Falken), die Langstreckenzieher sind.',
    a: 'z. B. Wespenbussard, Baumfalke, Schwarzmilan, Fischadler.' },
  { id: 'oek-nahrung', lv: 'g', cat: 'oek', type: 'open', q: 'Ordnen Sie zu – Reiherente, Kolbenente, Zwergtaucher, Eisvogel / Armleuchteralgen, Fische, Wandermuscheln, Wasserinsekten.',
    a: 'Reiherente → Wandermuscheln, Kolbenente → Armleuchteralgen, Zwergtaucher → Wasserinsekten, Eisvogel → Fische.' },
  { id: 'oek-zieher', lv: 'g', cat: 'oek', type: 'open', q: 'Teilzieher oder Zugvogel? Mauersegler, Mönchsgrasmücke, Star, Sumpfrohrsänger.',
    a: 'Zugvögel: Mauersegler, Sumpfrohrsänger. Teilzieher: Star, Mönchsgrasmücke (zunehmend Überwinterer in West-/Mitteleuropa).' },
  { id: 'oek-teilzieher', lv: 'sg', cat: 'oek', type: 'multi', q: 'Welche dieser Arten sind in Deutschland Teilzieher?',
    opts: ['Star', 'Rotkehlchen', 'Amsel', 'Mauersegler', 'Kuckuck'], ok: [0, 1, 2],
    a: 'Star, Rotkehlchen und Amsel: ein Teil der Population zieht, ein Teil bleibt. Mauersegler und Kuckuck sind Langstreckenzieher.' },
  { id: 'oek-richtung', lv: 'sg', cat: 'oek', type: 'single', q: 'Was ist die Hauptabzugsrichtung der in Deutschland brütenden Langstreckenzieher?',
    opts: ['Südwest', 'Nordost', 'Nordwest', 'Genau Süd über die Alpen'], ok: [0],
    a: 'Überwiegend Südwest (über Frankreich/Iberien nach Afrika). Einige Arten bzw. Populationen ziehen nach Südost (z. B. „Ostzieher“ beim Weißstorch, Neuntöter).' },

  // 3. Lebensraum
  { id: 'leb-drossel', lv: 'bsg', cat: 'leb', type: 'open', q: 'Nennen Sie zwei Drosselarten, die Sie zur Brutzeit in Wäldern erwarten würden.',
    a: 'Singdrossel, Misteldrossel, Amsel (im Bergwald auch Ringdrossel).' },
  { id: 'leb-siedlung-agrar', lv: 'bsg', cat: 'leb', type: 'open', q: 'Nennen Sie je zwei Arten, die vorwiegend in Siedlungen bzw. im Agrarland brüten.',
    a: 'Siedlung: z. B. Haussperling, Mehlschwalbe, Mauersegler, Hausrotschwanz, Türkentaube. Agrarland: z. B. Feldlerche, Goldammer, Kiebitz, Wiesenschafstelze, Rebhuhn.' },
  { id: 'leb-typisch', lv: 'bsg', cat: 'leb', type: 'open', q: 'Nennen Sie je eine typische Art für: Binnengewässer & Feuchtgebiete, Wälder & Heiden, Agrarlandschaft, Siedlungen.',
    a: 'z. B. Haubentaucher / Teichrohrsänger – Buntspecht / Heidelerche – Feldlerche / Goldammer – Haussperling / Mehlschwalbe.' },
  { id: 'leb-sandregenpfeifer', lv: 'g', cat: 'leb', type: 'single', q: 'Brüten Sandregenpfeifer im Binnenland?',
    opts: ['Ja, aber nur vereinzelt – Schwerpunkt ist die Küste', 'Nein, nie', 'Ja, überwiegend im Binnenland', 'Nur in den Alpen'], ok: [0],
    a: 'Brutschwerpunkt ist die Küste; im Binnenland nur sehr lokal (z. B. Sand- und Kiesflächen). Typischer Binnenland-Regenpfeifer ist der Flussregenpfeifer. (Bitte mit aktueller Literatur/ADEBAR abgleichen.)' },

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
  { id: 'sach-rl-stern', lv: 'bsg', cat: 'sach', type: 'single', q: 'Was bedeutet die Bezeichnung „*“ in der Roten Liste?',
    opts: ['Ungefährdet', 'Vorwarnliste', 'Daten unzureichend', 'Nicht bewertet'], ok: [0],
    a: '* = ungefährdet. V = Vorwarnliste, D = Daten unzureichend, ♦ = nicht bewertet.' },
  { id: 'sach-fotofalle', lv: 'bsg', cat: 'sach', type: 'open', q: 'Sie möchten Waldschnepfen mit Fotofallen und Audiorekorder dokumentieren. Was ist beim Anbringen im Gelände zu beachten?',
    a: 'Erlaubnis von Grundeigentümer/Jagdausübungsberechtigten; in Schutzgebieten Genehmigung der Naturschutzbehörde; Störungen vermeiden (Abstand zu Brutplätzen, keine häufigen Kontrollen zur Brutzeit); Datenschutz (Kameras nicht auf Wege richten, Personenaufnahmen vermeiden, ggf. Hinweisschild); baumschonend befestigen (Gurte statt Nägel); Diebstahlschutz; Geräte nach Abschluss entfernen.' },
  { id: 'sach-koedern', lv: 'sg', cat: 'sach', type: 'open', q: 'In welchen Fällen ist das Ködern und Anlocken von Vögeln erlaubt?',
    a: 'Faustregel: nur wenn keine erhebliche Störung entsteht (z. B. übliche Fütterung im Garten) oder im Rahmen genehmigter Vorhaben (wissenschaftliche Erfassung, Beringung, Artenschutzmaßnahmen). In Schutzgebieten und an Brutplätzen geschützter Arten grundsätzlich nicht ohne Genehmigung.' },
  { id: 'sach-eu', lv: 'bsg', cat: 'sach', type: 'multi', q: 'Welche sind für Vogelbeobachter*innen relevante europäische Rechtsvorschriften?',
    opts: ['Vogelschutzrichtlinie', 'FFH-Richtlinie', 'Bundesnaturschutzgesetz', 'Bundesartenschutzverordnung'], ok: [0, 1],
    a: 'Europäisch: EU-Vogelschutzrichtlinie (2009/147/EG), FFH-Richtlinie (92/43/EWG), außerdem die EU-Artenschutzverordnung (EG Nr. 338/97). BNatSchG und BArtSchV sind nationales Recht.' },

  // 5. Methoden
  { id: 'meth-ring', lv: 'sg', cat: 'meth', type: 'open', q: 'Wie melden Sie einen Ringfund an einem verendet vorgefundenen Vogel?',
    a: 'Ringinschrift (Beringungszentrale + Nummer) vollständig notieren, Fundort (Koordinaten), Datum, Fundumstände und Zustand festhalten, ggf. Foto. Meldung an die auf dem Ring genannte Beringungszentrale (z. B. Vogelwarte Helgoland, Radolfzell, Beringungszentrale Hiddensee) – meist per Online-Formular. Der Ring kann ggf. eingeschickt werden.' },
];

export const STATIC = [...BASE, ...EXTRA, ...BRONZE];

/* ---------- Generierte Fragen ---------- */
function mc(id, lv, cat, q, correct, distractors, a) {
  const opts = shuffle([correct, ...distractors]);
  return { id, lv, cat, type: 'single', q, opts, ok: [opts.indexOf(correct)], a, generated: true };
}
const uniq = a => [...new Set(a.filter(Boolean))];

export function generateQuestions(species) {
  const out = [];
  const fams = uniq(species.map(s => s.fam));
  const ords = uniq(species.map(s => s.ord));
  const habs = Object.keys(HAB_LABEL);

  // Brutzeitcodes – eine Auswahl; den vollen Drill gibt es im Tab „Brutzeit“
  shuffle(SCENARIOS.slice()).slice(0, 12).forEach((sc, i) => {
    const wrong = shuffle(CODES.map(c => c.c).filter(c => c !== sc.c)).slice(0, 3);
    out.push(mc(`bzc-${i}`, 'bsg', 'meth', `Welchen Brutzeitcode vergeben Sie? ${sc.s}`, sc.c, wrong,
      `${sc.c}: ${CODE_MAP[sc.c].t}. ${sc.x}`));
  });

  // Rote-Liste-Kategorien
  RL.forEach(([k, txt]) => {
    const wrong = shuffle(RL.filter(r => r[0] !== k).map(r => r[1])).slice(0, 3);
    out.push(mc(`rl-${k}`, 'bsg', 'sach', `Was bedeutet die Kategorie „${k}“ in der Roten Liste?`, txt, wrong, `${k} = ${txt}.`));
  });

  if (species.length < 8) return out;

  species.forEach(sp => {
    // Familie
    if (sp.fam && fams.length >= 4) {
      const wrong = shuffle(fams.filter(f => f !== sp.fam)).slice(0, 3);
      out.push(mc(`fam-${sp.sci}`, 'bsg', 'sys', `Zu welcher Familie gehört: ${sp.de}?`, sp.fam, wrong,
        `${sp.de} (${sp.sci}) gehört zur Familie ${sp.fam}${sp.ord ? ', Ordnung ' + sp.ord : ''}.`));
    }
    // Ordnung (nur Nicht-Sperlingsvögel, sonst zu leicht)
    if (sp.ord && sp.ord !== 'Sperlingsvögel' && ords.length >= 4) {
      const wrong = shuffle(ords.filter(o => o !== sp.ord)).slice(0, 3);
      out.push(mc(`ord-${sp.sci}`, 'bsg', 'sys', `Zu welcher Ordnung gehört: ${sp.de}?`, sp.ord, wrong,
        `${sp.de}: Ordnung ${sp.ord}, Familie ${sp.fam}.`));
    }
    // Lebensraum der Art
    if (sp.hab?.length) {
      const wrong = shuffle(habs.filter(h => !sp.hab.includes(h))).slice(0, 3).map(h => HAB_LABEL[h]);
      out.push(mc(`hab-${sp.sci}`, 'bsg', 'leb', `In welchem Lebensraum brütet ${sp.de} typischerweise?`, HAB_LABEL[sp.hab[0]], wrong,
        `${sp.de}: ${sp.hab.map(h => HAB_LABEL[h]).join(', ')} (laut Artenliste).`));
    }
  });

  // Welche Art gehört zur Familie X?
  fams.forEach(fam => {
    const members = species.filter(s => s.fam === fam);
    const others = species.filter(s => s.fam !== fam);
    if (!members.length || others.length < 3) return;
    const c = pick(members);
    out.push(mc(`fammem-${fam}`, 'bsg', 'sys', `Welche dieser Arten gehört zur Familie ${fam}?`, c.de,
      shuffle(others).slice(0, 3).map(s => s.de),
      `${fam}: ${members.map(m => m.de).join(', ')}.`));
  });

  // Welche Art erwarten Sie im Lebensraum X?
  habs.forEach(hk => {
    const inH = species.filter(s => s.hab?.[0] === hk);
    const notH = species.filter(s => !s.hab?.includes(hk));
    if (inH.length < 1 || notH.length < 3) return;
    const c = pick(inH);
    out.push(mc(`habmem-${hk}`, 'bsg', 'leb', `Welche Art erwarten Sie zur Brutzeit typischerweise im Lebensraum „${HAB_LABEL[hk]}“?`, c.de,
      shuffle(notH).slice(0, 3).map(s => s.de),
      `Typisch für ${HAB_LABEL[hk]} (Hauptlebensraum laut Artenliste): ${inH.map(s => s.de).join(', ')}.`));
  });

  return out;
}
