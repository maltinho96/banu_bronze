/* Offizielle BANU-Artenliste Feldornithologie Bronze (75 Arten).
 *
 * Artnamen nach der BANU-Artenliste. Wissenschaftliche Namen, Familien und
 * Ordnungen nach der aktuellen deutschen Artenliste (Barthel & Krüger 2019 / IOC).
 * Die Lebensräume (DDA-Haupteinheiten, erster Eintrag = Schwerpunkt) und der
 * Laut-Typ für die Tonsuche sind eigene Zuordnungen – bei Bedarf anpassen.
 *
 * Wer die xlsx der BANU hat, kann sie weiterhin mit
 *   npm run import-list -- pfad/zur/Artenliste.xlsx
 * nach src/data/species.json übernehmen; die hat dann Vorrang.
 *
 * Felder: [deutsch, wissenschaftlich, Familie, Ordnung, Lebensräume, Synonyme, Laut]
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

const P = 'Sperlingsvögel';

const RAW = [
  ['Amsel', 'Turdus merula', 'Drosseln', P, ['siedlung', 'wald'], ['Schwarzdrossel']],
  ['Bachstelze', 'Motacilla alba', 'Stelzen und Pieper', P, ['siedlung', 'gewaesser', 'agrar']],
  ['Blässhuhn', 'Fulica atra', 'Rallen', 'Kranichvögel', ['gewaesser'], ['Blässralle', 'Blesshuhn'], 'call'],
  ['Blaumeise', 'Cyanistes caeruleus', 'Meisen', P, ['wald', 'siedlung']],
  ['Buchfink', 'Fringilla coelebs', 'Finken', P, ['wald', 'siedlung']],
  ['Buntspecht', 'Dendrocopos major', 'Spechte', 'Spechtvögel', ['wald', 'siedlung'], [], 'drumming'],
  ['Dorngrasmücke', 'Curruca communis', 'Grasmücken', P, ['agrar'], ['Sylvia communis']],
  ['Eichelhäher', 'Garrulus glandarius', 'Rabenvögel', P, ['wald', 'siedlung'], ['Häher'], 'call'],
  ['Eisvogel', 'Alcedo atthis', 'Eisvögel', 'Rackenvögel', ['gewaesser'], [], 'call'],
  ['Elster', 'Pica pica', 'Rabenvögel', P, ['siedlung', 'agrar'], [], 'call'],
  ['Feldlerche', 'Alauda arvensis', 'Lerchen', P, ['agrar']],
  ['Feldsperling', 'Passer montanus', 'Sperlinge', P, ['agrar', 'siedlung']],
  ['Flussregenpfeifer', 'Charadrius dubius', 'Regenpfeifer', 'Regenpfeiferartige', ['gewaesser'], [], 'call'],
  ['Flussuferläufer', 'Actitis hypoleucos', 'Schnepfenvögel', 'Regenpfeiferartige', ['gewaesser'], [], 'call'],
  ['Gartenbaumläufer', 'Certhia brachydactyla', 'Baumläufer', P, ['wald', 'siedlung']],
  ['Gebirgsstelze', 'Motacilla cinerea', 'Stelzen und Pieper', P, ['gewaesser', 'siedlung']],
  ['Gimpel', 'Pyrrhula pyrrhula', 'Finken', P, ['wald', 'siedlung'], ['Dompfaff'], 'call'],
  ['Goldammer', 'Emberiza citrinella', 'Ammern', P, ['agrar']],
  ['Graugans', 'Anser anser', 'Entenvögel', 'Gänsevögel', ['gewaesser'], [], 'call'],
  ['Graureiher', 'Ardea cinerea', 'Reiher', 'Pelikanvögel', ['gewaesser', 'agrar'], ['Fischreiher'], 'call'],
  ['Grauschnäpper', 'Muscicapa striata', 'Fliegenschnäpper', P, ['siedlung', 'wald']],
  ['Grünfink', 'Chloris chloris', 'Finken', P, ['siedlung', 'agrar'], ['Grünling']],
  ['Grünspecht', 'Picus viridis', 'Spechte', 'Spechtvögel', ['siedlung', 'wald', 'agrar'], [], 'call'],
  ['Haubenmeise', 'Lophophanes cristatus', 'Meisen', P, ['wald']],
  ['Haubentaucher', 'Podiceps cristatus', 'Lappentaucher', 'Lappentaucher', ['gewaesser'], [], 'call'],
  ['Hausrotschwanz', 'Phoenicurus ochruros', 'Fliegenschnäpper', P, ['siedlung', 'alpin']],
  ['Haussperling', 'Passer domesticus', 'Sperlinge', P, ['siedlung'], ['Spatz']],
  ['Heckenbraunelle', 'Prunella modularis', 'Braunellen', P, ['wald', 'siedlung']],
  ['Höckerschwan', 'Cygnus olor', 'Entenvögel', 'Gänsevögel', ['gewaesser'], [], 'call'],
  ['Kernbeißer', 'Coccothraustes coccothraustes', 'Finken', P, ['wald', 'siedlung'], [], 'call'],
  ['Kiebitz', 'Vanellus vanellus', 'Regenpfeifer', 'Regenpfeiferartige', ['agrar', 'gewaesser'], [], 'call'],
  ['Kleiber', 'Sitta europaea', 'Kleiber', P, ['wald', 'siedlung'], ['Spechtmeise']],
  ['Kohlmeise', 'Parus major', 'Meisen', P, ['wald', 'siedlung']],
  ['Kormoran', 'Phalacrocorax carbo', 'Kormorane', 'Ruderfüßer', ['gewaesser', 'kueste'], [], 'call'],
  ['Krickente', 'Anas crecca', 'Entenvögel', 'Gänsevögel', ['gewaesser'], [], 'call'],
  ['Kuckuck', 'Cuculus canorus', 'Kuckucke', 'Kuckucksvögel', ['wald', 'gewaesser', 'agrar']],
  ['Lachmöwe', 'Chroicocephalus ridibundus', 'Möwen', 'Regenpfeiferartige', ['gewaesser', 'kueste'], [], 'call'],
  ['Mauersegler', 'Apus apus', 'Segler', 'Seglervögel', ['siedlung'], [], 'call'],
  ['Mäusebussard', 'Buteo buteo', 'Habichtartige', 'Greifvögel', ['agrar', 'wald'], [], 'call'],
  ['Mehlschwalbe', 'Delichon urbicum', 'Schwalben', P, ['siedlung']],
  ['Mittelmeermöwe', 'Larus michahellis', 'Möwen', 'Regenpfeiferartige', ['gewaesser', 'kueste'], [], 'call'],
  ['Mönchsgrasmücke', 'Sylvia atricapilla', 'Grasmücken', P, ['wald', 'siedlung'], ['Schwarzkopf']],
  ['Nachtigall', 'Luscinia megarhynchos', 'Fliegenschnäpper', P, ['wald', 'siedlung']],
  ['Neuntöter', 'Lanius collurio', 'Würger', P, ['agrar'], ['Rotrückenwürger']],
  ['Nilgans', 'Alopochen aegyptiaca', 'Entenvögel', 'Gänsevögel', ['gewaesser', 'agrar', 'siedlung'], [], 'call'],
  ['Rabenkrähe', 'Corvus corone', 'Rabenvögel', P, ['agrar', 'siedlung'], ['Aaskrähe'], 'call'],
  ['Rauchschwalbe', 'Hirundo rustica', 'Schwalben', P, ['agrar', 'siedlung']],
  ['Rebhuhn', 'Perdix perdix', 'Fasanenartige', 'Hühnervögel', ['agrar'], [], 'call'],
  ['Reiherente', 'Aythya fuligula', 'Entenvögel', 'Gänsevögel', ['gewaesser'], [], 'call'],
  ['Ringeltaube', 'Columba palumbus', 'Tauben', 'Taubenvögel', ['wald', 'siedlung', 'agrar']],
  ['Rotkehlchen', 'Erithacus rubecula', 'Fliegenschnäpper', P, ['wald', 'siedlung']],
  ['Rotmilan', 'Milvus milvus', 'Habichtartige', 'Greifvögel', ['agrar'], ['Gabelweihe'], 'call'],
  ['Saatkrähe', 'Corvus frugilegus', 'Rabenvögel', P, ['agrar', 'siedlung'], [], 'call'],
  ['Schwanzmeise', 'Aegithalos caudatus', 'Schwanzmeisen', P, ['wald', 'siedlung'], [], 'call'],
  ['Singdrossel', 'Turdus philomelos', 'Drosseln', P, ['wald', 'siedlung']],
  ['Sperber', 'Accipiter nisus', 'Habichtartige', 'Greifvögel', ['wald', 'siedlung'], [], 'call'],
  ['Star', 'Sturnus vulgaris', 'Stare', P, ['siedlung', 'agrar', 'wald']],
  ['Stieglitz', 'Carduelis carduelis', 'Finken', P, ['siedlung', 'agrar'], ['Distelfink']],
  ['Stockente', 'Anas platyrhynchos', 'Entenvögel', 'Gänsevögel', ['gewaesser', 'siedlung'], [], 'call'],
  ['Straßentaube', 'Columba livia', 'Tauben', 'Taubenvögel', ['siedlung'], ['Stadttaube', 'Haustaube', 'Felsentaube']],
  ['Sumpfmeise', 'Poecile palustris', 'Meisen', P, ['wald']],
  ['Tafelente', 'Aythya ferina', 'Entenvögel', 'Gänsevögel', ['gewaesser'], [], 'call'],
  ['Tannenmeise', 'Periparus ater', 'Meisen', P, ['wald']],
  ['Teichhuhn', 'Gallinula chloropus', 'Rallen', 'Kranichvögel', ['gewaesser'], ['Teichralle'], 'call'],
  ['Teichrohrsänger', 'Acrocephalus scirpaceus', 'Rohrsänger', P, ['gewaesser']],
  ['Türkentaube', 'Streptopelia decaocto', 'Tauben', 'Taubenvögel', ['siedlung']],
  ['Turmfalke', 'Falco tinnunculus', 'Falken', 'Falkenartige', ['agrar', 'siedlung'], [], 'call'],
  ['Wacholderdrossel', 'Turdus pilaris', 'Drosseln', P, ['agrar', 'siedlung', 'wald'], [], 'call'],
  ['Waldkauz', 'Strix aluco', 'Eigentliche Eulen', 'Eulen', ['wald', 'siedlung']],
  ['Weißstorch', 'Ciconia ciconia', 'Störche', 'Storchenvögel', ['agrar', 'gewaesser', 'siedlung'], ['Klapperstorch'], 'call'],
  ['Wiesenpieper', 'Anthus pratensis', 'Stelzen und Pieper', P, ['agrar', 'gewaesser']],
  ['Wintergoldhähnchen', 'Regulus regulus', 'Goldhähnchen', P, ['wald']],
  ['Zaunkönig', 'Troglodytes troglodytes', 'Zaunkönige', P, ['wald', 'siedlung']],
  ['Zilpzalp', 'Phylloscopus collybita', 'Laubsänger', P, ['wald', 'siedlung'], ['Weidenlaubsänger']],
  ['Zwergtaucher', 'Tachybaptus ruficollis', 'Lappentaucher', 'Lappentaucher', ['gewaesser'], [], 'call'],
];

export const BUILTIN = RAW.map(([de, sci, fam, ord, hab, syn = [], snd = 'song']) =>
  ({ de, sci, fam, ord, hab, syn, snd }));

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
