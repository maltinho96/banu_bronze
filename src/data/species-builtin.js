/* Offizielle BANU-Artenliste Feldornithologie Bronze (75 Arten).
 *
 * Artnamen nach der BANU-Artenliste. Wissenschaftliche Namen, Familien und
 * Ordnungen nach der aktuellen deutschen Artenliste (Barthel & Krüger 2019 / IOC).
 * Brut-Lebensräume nach der BANU-Tabelle (Spalten K B W A S H, erster Eintrag =
 * Hauptlebensraum) und der Hauptlebensraum-Text (hl) aus derselben Tabelle.
 * Der Laut-Typ für die Tonsuche ist eine eigene Zuordnung.
 *
 * Felder: [deutsch, wissenschaftlich, Familie, Ordnung, Lebensräume, Hauptlebensraum, Synonyme, Laut]
 * Lebensraum-Schlüssel: kueste, gewaesser, wald, agrar, siedlung, alpin
 * Laut: 'song' (Gesang), 'call' (Ruf), 'drumming' (Trommeln) – steuert die Tonsuche.
 */

export const HAB_LABEL = {
  kueste: 'Küste',
  gewaesser: 'Gewässer & Feuchtgebiete',
  wald: 'Wald & Heide',
  agrar: 'Agrarlandschaft',
  siedlung: 'Siedlung',
  alpin: 'Alpine Hochlagen',
};

/** Kurzer Bruthabitat-Text für die Anzeige (aus hl, sonst Haupt-Lebensraum) */
export function habMain(sp) {
  const t = sp.hl || '';
  if (!t) return HAB_LABEL[sp.hab?.[0]] || '';
  if (/^mehrere Lebensräume \(indifferent\)/.test(t)) return 'mehrere Lebensräume (indifferent)';
  return t.replace(/^mehrere Lebensräume:\s*/, '');
}
/** Alle Brut-Lebensräume als Klartext, z. B. „Wald & Heide · Siedlung“ */
export function habAll(sp) { return (sp.hab || []).map(k => HAB_LABEL[k] || k).join(' · '); }
/** Wissenschaftlicher Name ohne Zusatz (z. B. „f. domestica“) – für Links und Suchen */
export function sciBase(sp) { return String(sp.sci || '').split(' ').slice(0, 2).join(' '); }

const P = 'Sperlingsvögel';

const RAW = [
  ['Amsel', 'Turdus merula', 'Drosseln', P, ['wald', 'agrar', 'siedlung'], 'mehrere Lebensräume (indifferent)', ['Schwarzdrossel'], 'song'],
  ['Bachstelze', 'Motacilla alba', 'Stelzen und Pieper', P, ['siedlung', 'gewaesser', 'agrar'], 'Siedlung (indifferent)', [], 'song'],
  ['Blässhuhn', 'Fulica atra', 'Rallen', 'Kranichvögel', ['gewaesser', 'kueste'], 'Stillgewässer', ['Blässralle', 'Blesshuhn'], 'call'],
  ['Blaumeise', 'Cyanistes caeruleus', 'Meisen', P, ['wald', 'siedlung'], 'mehrere Lebensräume: Wald und waldähnliche Strukturen', [], 'song'],
  ['Buchfink', 'Fringilla coelebs', 'Finken', P, ['wald', 'siedlung'], 'Wald (indifferent)', [], 'song'],
  ['Buntspecht', 'Dendrocopos major', 'Spechte', 'Spechtvögel', ['wald', 'siedlung'], 'Wald (indifferent)', [], 'drumming'],
  ['Dorngrasmücke', 'Sylvia communis', 'Grasmücken', P, ['agrar'], 'landwirtschaftlich genutztes Offenland (indifferent)', ['Curruca communis'], 'song'],
  ['Eichelhäher', 'Garrulus glandarius', 'Rabenvögel', P, ['wald', 'siedlung'], 'Wald (indifferent)', ['Häher'], 'call'],
  ['Eisvogel', 'Alcedo atthis', 'Eisvögel', 'Rackenvögel', ['gewaesser'], 'Fließgewässer', [], 'call'],
  ['Elster', 'Pica pica', 'Rabenvögel', P, ['siedlung', 'agrar'], 'Siedlung (indifferent)', [], 'call'],
  ['Feldlerche', 'Alauda arvensis', 'Lerchen', P, ['agrar', 'kueste'], 'landwirtschaftlich genutztes Offenland (indifferent)', [], 'song'],
  ['Feldsperling', 'Passer montanus', 'Sperlinge', P, ['siedlung', 'agrar'], 'dörfliche Bebauung', [], 'song'],
  ['Flussregenpfeifer', 'Charadrius dubius', 'Regenpfeifer', 'Regenpfeiferartige', ['agrar', 'gewaesser'], 'Sonderstandorte des Offenlandes (indifferent)', [], 'call'],
  ['Flussuferläufer', 'Actitis hypoleucos', 'Schnepfenvögel', 'Regenpfeiferartige', ['gewaesser', 'kueste'], 'Fließgewässer', [], 'call'],
  ['Gartenbaumläufer', 'Certhia brachydactyla', 'Baumläufer', P, ['wald', 'siedlung'], 'mehrere Lebensräume: Wald und waldähnliche Strukturen', [], 'song'],
  ['Gebirgsstelze', 'Motacilla cinerea', 'Stelzen und Pieper', P, ['gewaesser', 'alpin'], 'Fließgewässer', [], 'song'],
  ['Gimpel', 'Pyrrhula pyrrhula', 'Finken', P, ['wald', 'siedlung'], 'Wald (indifferent)', ['Dompfaff'], 'call'],
  ['Goldammer', 'Emberiza citrinella', 'Ammern', P, ['agrar', 'wald'], 'landwirtschaftlich genutztes Offenland (indifferent)', [], 'song'],
  ['Graugans', 'Anser anser', 'Entenvögel', 'Gänsevögel', ['gewaesser'], 'Stillgewässer', [], 'call'],
  ['Graureiher', 'Ardea cinerea', 'Reiher', 'Pelikanvögel', ['wald', 'gewaesser'], 'Wald (indifferent)', ['Fischreiher'], 'call'],
  ['Grauschnäpper', 'Muscicapa striata', 'Fliegenschnäpper', P, ['wald', 'siedlung'], 'mehrere Lebensräume: halboffene Landschaft', [], 'song'],
  ['Grünfink', 'Chloris chloris', 'Finken', P, ['siedlung', 'agrar'], 'Siedlung (indifferent)', ['Grünling'], 'song'],
  ['Grünspecht', 'Picus viridis', 'Spechte', 'Spechtvögel', ['wald', 'siedlung'], 'mehrere Lebensräume: Wald und waldähnliche Strukturen', [], 'call'],
  ['Haubenmeise', 'Lophophanes cristatus', 'Meisen', P, ['wald'], 'Nadelwald', [], 'song'],
  ['Haubentaucher', 'Podiceps cristatus', 'Lappentaucher', 'Lappentaucher', ['gewaesser', 'kueste'], 'Stillgewässer', [], 'call'],
  ['Hausrotschwanz', 'Phoenicurus ochruros', 'Fliegenschnäpper', P, ['siedlung', 'alpin'], 'Siedlung (indifferent)', [], 'song'],
  ['Haussperling', 'Passer domesticus', 'Sperlinge', P, ['siedlung', 'agrar'], 'Siedlung (indifferent)', ['Spatz'], 'song'],
  ['Heckenbraunelle', 'Prunella modularis', 'Braunellen', P, ['wald', 'agrar', 'siedlung'], 'mehrere Lebensräume (indifferent)', [], 'song'],
  ['Höckerschwan', 'Cygnus olor', 'Entenvögel', 'Gänsevögel', ['gewaesser', 'kueste'], 'Stillgewässer', [], 'call'],
  ['Kernbeißer', 'Coccothraustes coccothraustes', 'Finken', P, ['wald'], 'Laubwald', [], 'call'],
  ['Kiebitz', 'Vanellus vanellus', 'Regenpfeifer', 'Regenpfeiferartige', ['agrar', 'kueste', 'gewaesser'], 'landwirtschaftlich genutztes Offenland (indifferent)', [], 'call'],
  ['Kleiber', 'Sitta europaea', 'Kleiber', P, ['wald', 'siedlung'], 'Laubwald', ['Spechtmeise'], 'song'],
  ['Kohlmeise', 'Parus major', 'Meisen', P, ['wald', 'siedlung'], 'mehrere Lebensräume: Wald und waldähnliche Strukturen', [], 'song'],
  ['Kormoran', 'Phalacrocorax carbo', 'Kormorane', 'Ruderfüßer', ['gewaesser', 'kueste'], 'mehrere Lebensräume: Feuchtgebiete des Binnenlandes und der Küste', [], 'call'],
  ['Krickente', 'Anas crecca', 'Entenvögel', 'Gänsevögel', ['gewaesser', 'kueste'], 'Stillgewässer', [], 'call'],
  ['Kuckuck', 'Cuculus canorus', 'Kuckucke', 'Kuckucksvögel', ['agrar', 'kueste', 'gewaesser', 'wald'], 'mehrere Lebensräume: halboffene Landschaft', [], 'song'],
  ['Lachmöwe', 'Chroicocephalus ridibundus', 'Möwen', 'Regenpfeiferartige', ['gewaesser', 'kueste'], 'mehrere Lebensräume: Feuchtgebiete des Binnenlandes und der Küste', [], 'call'],
  ['Mauersegler', 'Apus apus', 'Segler', 'Seglervögel', ['siedlung'], 'dichte städtische Bebauung', [], 'call'],
  ['Mäusebussard', 'Buteo buteo', 'Habichtartige', 'Greifvögel', ['agrar', 'wald'], 'mehrere Lebensräume: halboffene Landschaft', [], 'call'],
  ['Mehlschwalbe', 'Delichon urbicum', 'Schwalben', P, ['siedlung'], 'Siedlung (indifferent)', [], 'song'],
  ['Mittelmeermöwe', 'Larus michahellis', 'Möwen', 'Regenpfeiferartige', ['gewaesser', 'kueste'], 'Binnengewässer (indifferent)', [], 'call'],
  ['Mönchsgrasmücke', 'Sylvia atricapilla', 'Grasmücken', P, ['wald', 'siedlung'], 'mehrere Lebensräume: Wald und waldähnliche Strukturen', ['Schwarzkopf'], 'song'],
  ['Nachtigall', 'Luscinia megarhynchos', 'Fliegenschnäpper', P, ['gewaesser', 'wald', 'agrar'], 'mehrere Lebensräume (indifferent)', [], 'song'],
  ['Neuntöter', 'Lanius collurio', 'Würger', P, ['agrar', 'wald'], 'landwirtschaftlich genutztes Offenland (indifferent)', ['Rotrückenwürger'], 'song'],
  ['Nilgans', 'Alopochen aegyptiaca', 'Entenvögel', 'Gänsevögel', ['gewaesser', 'kueste'], 'Stillgewässer', [], 'call'],
  ['Rabenkrähe', 'Corvus corone', 'Rabenvögel', P, ['wald', 'agrar', 'siedlung'], 'mehrere Lebensräume (indifferent)', ['Aaskrähe'], 'call'],
  ['Rauchschwalbe', 'Hirundo rustica', 'Schwalben', P, ['siedlung', 'agrar'], 'dörfliche Bebauung', [], 'song'],
  ['Rebhuhn', 'Perdix perdix', 'Fasanenartige', 'Hühnervögel', ['agrar'], 'Acker und Acker-geprägtes Offenland', [], 'call'],
  ['Reiherente', 'Aythya fuligula', 'Entenvögel', 'Gänsevögel', ['gewaesser', 'kueste'], 'Stillgewässer', [], 'call'],
  ['Ringeltaube', 'Columba palumbus', 'Tauben', 'Taubenvögel', ['wald', 'agrar', 'siedlung'], 'mehrere Lebensräume (indifferent)', [], 'song'],
  ['Rotkehlchen', 'Erithacus rubecula', 'Fliegenschnäpper', P, ['wald', 'agrar', 'siedlung'], 'Wald (indifferent)', [], 'song'],
  ['Rotmilan', 'Milvus milvus', 'Habichtartige', 'Greifvögel', ['wald', 'agrar'], 'Wald (indifferent)', ['Gabelweihe'], 'call'],
  ['Saatkrähe', 'Corvus frugilegus', 'Rabenvögel', P, ['siedlung', 'agrar'], 'Siedlung (indifferent)', [], 'call'],
  ['Schwanzmeise', 'Aegithalos caudatus', 'Schwanzmeisen', P, ['wald', 'siedlung'], 'Wald (indifferent)', [], 'call'],
  ['Singdrossel', 'Turdus philomelos', 'Drosseln', P, ['wald', 'siedlung'], 'Wald (indifferent)', [], 'song'],
  ['Sperber', 'Accipiter nisus', 'Habichtartige', 'Greifvögel', ['wald'], 'Nadelwald', [], 'call'],
  ['Star', 'Sturnus vulgaris', 'Stare', P, ['agrar', 'wald', 'siedlung'], 'mehrere Lebensräume: halboffene Landschaft', [], 'song'],
  ['Stieglitz', 'Carduelis carduelis', 'Finken', P, ['agrar', 'siedlung'], 'mehrere Lebensräume: halboffene Landschaft', ['Distelfink'], 'song'],
  ['Stockente', 'Anas platyrhynchos', 'Entenvögel', 'Gänsevögel', ['gewaesser', 'kueste', 'agrar'], 'Binnengewässer (indifferent)', [], 'call'],
  ['Straßentaube', 'Columba livia f. domestica', 'Tauben', 'Taubenvögel', ['siedlung'], 'dichte städtische Bebauung', ['Columba livia', 'Stadttaube', 'Haustaube', 'Felsentaube'], 'song'],
  ['Sumpfmeise', 'Poecile palustris', 'Meisen', P, ['wald'], 'Laubwald', [], 'song'],
  ['Tafelente', 'Aythya ferina', 'Entenvögel', 'Gänsevögel', ['gewaesser', 'kueste'], 'Stillgewässer', [], 'call'],
  ['Tannenmeise', 'Periparus ater', 'Meisen', P, ['wald', 'alpin'], 'Nadelwald', [], 'song'],
  ['Teichhuhn', 'Gallinula chloropus', 'Rallen', 'Kranichvögel', ['gewaesser', 'agrar'], 'Binnengewässer (indifferent)', ['Teichralle'], 'call'],
  ['Teichrohrsänger', 'Acrocephalus scirpaceus', 'Rohrsänger', P, ['gewaesser', 'kueste', 'agrar'], 'Röhrichte und Verlandungszonen', [], 'song'],
  ['Türkentaube', 'Streptopelia decaocto', 'Tauben', 'Taubenvögel', ['siedlung', 'agrar'], 'Siedlung (indifferent)', [], 'song'],
  ['Turmfalke', 'Falco tinnunculus', 'Falken', 'Falkenartige', ['siedlung', 'agrar', 'alpin'], 'Siedlung (indifferent)', [], 'call'],
  ['Wacholderdrossel', 'Turdus pilaris', 'Drosseln', P, ['agrar', 'wald'], 'mehrere Lebensräume: halboffene Landschaft', [], 'call'],
  ['Waldkauz', 'Strix aluco', 'Eigentliche Eulen', 'Eulen', ['wald', 'siedlung'], 'Laubwald', [], 'song'],
  ['Weißstorch', 'Ciconia ciconia', 'Störche', 'Storchenvögel', ['siedlung', 'gewaesser', 'agrar'], 'dörfliche Bebauung', ['Klapperstorch'], 'call'],
  ['Wiesenpieper', 'Anthus pratensis', 'Stelzen und Pieper', P, ['agrar', 'kueste', 'gewaesser'], 'mehrere Lebensräume: offene Landschaft', [], 'song'],
  ['Wintergoldhähnchen', 'Regulus regulus', 'Goldhähnchen', P, ['wald', 'alpin'], 'Nadelwald', [], 'song'],
  ['Zaunkönig', 'Troglodytes troglodytes', 'Zaunkönige', P, ['wald', 'siedlung'], 'mehrere Lebensräume: Wald und waldähnliche Strukturen', [], 'song'],
  ['Zilpzalp', 'Phylloscopus collybita', 'Laubsänger', P, ['wald', 'agrar', 'siedlung'], 'Wald (indifferent)', ['Weidenlaubsänger'], 'song'],
  ['Zwergtaucher', 'Tachybaptus ruficollis', 'Lappentaucher', 'Lappentaucher', ['gewaesser', 'kueste'], 'Stillgewässer', [], 'call'],
];

export const BUILTIN = RAW.map(([de, sci, fam, ord, hab, hl, syn = [], snd = 'song']) =>
  ({ de, sci, fam, ord, hab, hl, syn, snd }));

/* Grobe Laut-Voreinstellung für importierte Listen ohne Laut-Spalte */
const CALL_FAMILIES = new Set([
  'Entenvögel', 'Rallen', 'Reiher', 'Störche', 'Kraniche', 'Möwen', 'Habichtartige', 'Falken',
  'Rabenvögel', 'Segler', 'Eisvögel', 'Regenpfeifer', 'Schnepfenvögel', 'Austernfischer',
  'Fasanenartige', 'Kormorane', 'Seeschwalben',
]);
export function guessSound(sp) {
  const known = BUILTIN.find(b => b.sci === sp.sci);
  if (known) return known.snd;
  if (sp.fam && CALL_FAMILIES.has(sp.fam)) return 'call';
  return 'song';
}
