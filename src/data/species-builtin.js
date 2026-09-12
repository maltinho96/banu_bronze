/* Eingebaute Übungsliste (kuratiert, NICHT die offizielle BANU-Liste).
 * Für die prüfungsverbindlichen 75 Arten: offizielle xlsx mit
 *   npm run import-list -- pfad/zur/Artenliste.xlsx
 * nach src/data/species.json konvertieren (siehe README).
 *
 * Felder: [deutsch, wissenschaftlich, Familie, Ordnung, Lebensräume, Synonyme, Laut]
 * Lebensraum-Schlüssel (DDA-Haupteinheiten): kueste, gewaesser, wald, agrar, siedlung, alpin
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
  ['Haussperling', 'Passer domesticus', 'Sperlinge', P, ['siedlung'], ['Spatz']],
  ['Feldsperling', 'Passer montanus', 'Sperlinge', P, ['agrar', 'siedlung']],
  ['Hausrotschwanz', 'Phoenicurus ochruros', 'Fliegenschnäpper', P, ['siedlung', 'alpin']],
  ['Gartenrotschwanz', 'Phoenicurus phoenicurus', 'Fliegenschnäpper', P, ['wald', 'siedlung']],
  ['Amsel', 'Turdus merula', 'Drosseln', P, ['siedlung', 'wald'], ['Schwarzdrossel']],
  ['Singdrossel', 'Turdus philomelos', 'Drosseln', P, ['wald']],
  ['Misteldrossel', 'Turdus viscivorus', 'Drosseln', P, ['wald']],
  ['Wacholderdrossel', 'Turdus pilaris', 'Drosseln', P, ['agrar', 'siedlung']],
  ['Ringdrossel', 'Turdus torquatus', 'Drosseln', P, ['alpin']],
  ['Kohlmeise', 'Parus major', 'Meisen', P, ['wald', 'siedlung']],
  ['Blaumeise', 'Cyanistes caeruleus', 'Meisen', P, ['wald', 'siedlung']],
  ['Tannenmeise', 'Periparus ater', 'Meisen', P, ['wald']],
  ['Sumpfmeise', 'Poecile palustris', 'Meisen', P, ['wald']],
  ['Haubenmeise', 'Lophophanes cristatus', 'Meisen', P, ['wald']],
  ['Schwanzmeise', 'Aegithalos caudatus', 'Schwanzmeisen', P, ['wald']],
  ['Star', 'Sturnus vulgaris', 'Stare', P, ['siedlung', 'agrar']],
  ['Mauersegler', 'Apus apus', 'Segler', 'Seglervögel', ['siedlung'], [], 'call'],
  ['Mehlschwalbe', 'Delichon urbicum', 'Schwalben', P, ['siedlung']],
  ['Rauchschwalbe', 'Hirundo rustica', 'Schwalben', P, ['agrar', 'siedlung']],
  ['Grünfink', 'Chloris chloris', 'Finken', P, ['siedlung', 'agrar'], ['Grünling']],
  ['Stieglitz', 'Carduelis carduelis', 'Finken', P, ['siedlung', 'agrar'], ['Distelfink']],
  ['Girlitz', 'Serinus serinus', 'Finken', P, ['siedlung']],
  ['Buchfink', 'Fringilla coelebs', 'Finken', P, ['wald', 'siedlung']],
  ['Gimpel', 'Pyrrhula pyrrhula', 'Finken', P, ['wald'], ['Dompfaff']],
  ['Kernbeißer', 'Coccothraustes coccothraustes', 'Finken', P, ['wald']],
  ['Erlenzeisig', 'Spinus spinus', 'Finken', P, ['wald'], ['Zeisig']],
  ['Türkentaube', 'Streptopelia decaocto', 'Tauben', 'Taubenvögel', ['siedlung']],
  ['Ringeltaube', 'Columba palumbus', 'Tauben', 'Taubenvögel', ['wald', 'siedlung']],
  ['Elster', 'Pica pica', 'Rabenvögel', P, ['siedlung', 'agrar'], [], 'call'],
  ['Eichelhäher', 'Garrulus glandarius', 'Rabenvögel', P, ['wald'], ['Häher'], 'call'],
  ['Dohle', 'Coloeus monedula', 'Rabenvögel', P, ['siedlung', 'agrar'], [], 'call'],
  ['Rabenkrähe', 'Corvus corone', 'Rabenvögel', P, ['agrar', 'siedlung'], ['Aaskrähe'], 'call'],
  ['Alpendohle', 'Pyrrhocorax graculus', 'Rabenvögel', P, ['alpin'], [], 'call'],
  ['Bachstelze', 'Motacilla alba', 'Stelzen und Pieper', P, ['siedlung', 'gewaesser']],
  ['Wiesenschafstelze', 'Motacilla flava', 'Stelzen und Pieper', P, ['agrar'], ['Schafstelze']],
  ['Baumpieper', 'Anthus trivialis', 'Stelzen und Pieper', P, ['wald']],
  ['Bergpieper', 'Anthus spinoletta', 'Stelzen und Pieper', P, ['alpin']],
  ['Rotkehlchen', 'Erithacus rubecula', 'Fliegenschnäpper', P, ['wald', 'siedlung']],
  ['Zaunkönig', 'Troglodytes troglodytes', 'Zaunkönige', P, ['wald', 'siedlung']],
  ['Heckenbraunelle', 'Prunella modularis', 'Braunellen', P, ['wald', 'siedlung']],
  ['Zilpzalp', 'Phylloscopus collybita', 'Laubsänger', P, ['wald'], ['Weidenlaubsänger']],
  ['Fitis', 'Phylloscopus trochilus', 'Laubsänger', P, ['wald']],
  ['Waldlaubsänger', 'Phylloscopus sibilatrix', 'Laubsänger', P, ['wald']],
  ['Mönchsgrasmücke', 'Sylvia atricapilla', 'Grasmücken', P, ['wald', 'siedlung'], ['Schwarzkopf']],
  ['Gartengrasmücke', 'Sylvia borin', 'Grasmücken', P, ['wald']],
  ['Dorngrasmücke', 'Curruca communis', 'Grasmücken', P, ['agrar'], ['Sylvia communis']],
  ['Klappergrasmücke', 'Curruca curruca', 'Grasmücken', P, ['siedlung', 'agrar'], ['Sylvia curruca']],
  ['Kleiber', 'Sitta europaea', 'Kleiber', P, ['wald'], ['Spechtmeise']],
  ['Gartenbaumläufer', 'Certhia brachydactyla', 'Baumläufer', P, ['wald', 'siedlung']],
  ['Wintergoldhähnchen', 'Regulus regulus', 'Goldhähnchen', P, ['wald']],
  ['Sommergoldhähnchen', 'Regulus ignicapilla', 'Goldhähnchen', P, ['wald']],
  ['Trauerschnäpper', 'Ficedula hypoleuca', 'Fliegenschnäpper', P, ['wald']],
  ['Braunkehlchen', 'Saxicola rubetra', 'Fliegenschnäpper', P, ['agrar']],
  ['Wasseramsel', 'Cinclus cinclus', 'Wasseramseln', P, ['gewaesser', 'alpin']],
  ['Buntspecht', 'Dendrocopos major', 'Spechte', 'Spechtvögel', ['wald', 'siedlung'], [], 'drumming'],
  ['Grünspecht', 'Picus viridis', 'Spechte', 'Spechtvögel', ['wald', 'agrar'], []],
  ['Schwarzspecht', 'Dryocopus martius', 'Spechte', 'Spechtvögel', ['wald'], [], 'call'],
  ['Waldkauz', 'Strix aluco', 'Eigentliche Eulen', 'Eulen', ['wald', 'siedlung']],
  ['Kuckuck', 'Cuculus canorus', 'Kuckucke', 'Kuckucksvögel', ['wald', 'gewaesser']],
  ['Pirol', 'Oriolus oriolus', 'Pirole', P, ['wald']],
  ['Neuntöter', 'Lanius collurio', 'Würger', P, ['agrar'], ['Rotrückenwürger']],
  ['Goldammer', 'Emberiza citrinella', 'Ammern', P, ['agrar']],
  ['Rohrammer', 'Emberiza schoeniclus', 'Ammern', P, ['gewaesser'], ['Rohrspatz']],
  ['Feldlerche', 'Alauda arvensis', 'Lerchen', P, ['agrar']],
  ['Heidelerche', 'Lullula arborea', 'Lerchen', P, ['wald']],
  ['Teichrohrsänger', 'Acrocephalus scirpaceus', 'Rohrsänger', P, ['gewaesser']],
  ['Sumpfrohrsänger', 'Acrocephalus palustris', 'Rohrsänger', P, ['gewaesser', 'agrar']],
  ['Mäusebussard', 'Buteo buteo', 'Habichtartige', 'Greifvögel', ['agrar', 'wald'], [], 'call'],
  ['Rotmilan', 'Milvus milvus', 'Habichtartige', 'Greifvögel', ['agrar'], ['Gabelweihe'], 'call'],
  ['Turmfalke', 'Falco tinnunculus', 'Falken', 'Falkenartige', ['agrar', 'siedlung'], [], 'call'],
  ['Kiebitz', 'Vanellus vanellus', 'Regenpfeifer', 'Regenpfeiferartige', ['agrar', 'gewaesser'], [], 'call'],
  ['Fasan', 'Phasianus colchicus', 'Fasanenartige', 'Hühnervögel', ['agrar'], ['Jagdfasan'], 'call'],
  ['Stockente', 'Anas platyrhynchos', 'Entenvögel', 'Gänsevögel', ['gewaesser'], [], 'call'],
  ['Reiherente', 'Aythya fuligula', 'Entenvögel', 'Gänsevögel', ['gewaesser'], [], 'call'],
  ['Höckerschwan', 'Cygnus olor', 'Entenvögel', 'Gänsevögel', ['gewaesser'], [], 'call'],
  ['Graugans', 'Anser anser', 'Entenvögel', 'Gänsevögel', ['gewaesser'], [], 'call'],
  ['Brandgans', 'Tadorna tadorna', 'Entenvögel', 'Gänsevögel', ['kueste'], ['Brandente'], 'call'],
  ['Blässhuhn', 'Fulica atra', 'Rallen', 'Kranichvögel', ['gewaesser'], ['Blässralle', 'Blesshuhn'], 'call'],
  ['Teichhuhn', 'Gallinula chloropus', 'Rallen', 'Kranichvögel', ['gewaesser'], ['Teichralle'], 'call'],
  ['Haubentaucher', 'Podiceps cristatus', 'Lappentaucher', 'Lappentaucher', ['gewaesser'], [], 'call'],
  ['Zwergtaucher', 'Tachybaptus ruficollis', 'Lappentaucher', 'Lappentaucher', ['gewaesser']],
  ['Graureiher', 'Ardea cinerea', 'Reiher', 'Pelikanvögel', ['gewaesser'], ['Fischreiher'], 'call'],
  ['Weißstorch', 'Ciconia ciconia', 'Störche', 'Storchenvögel', ['gewaesser', 'agrar'], ['Klapperstorch'], 'call'],
  ['Kranich', 'Grus grus', 'Kraniche', 'Kranichvögel', ['gewaesser'], ['Grauer Kranich'], 'call'],
  ['Eisvogel', 'Alcedo atthis', 'Eisvögel', 'Rackenvögel', ['gewaesser'], [], 'call'],
  ['Lachmöwe', 'Chroicocephalus ridibundus', 'Möwen', 'Regenpfeiferartige', ['gewaesser', 'kueste'], [], 'call'],
  ['Silbermöwe', 'Larus argentatus', 'Möwen', 'Regenpfeiferartige', ['kueste'], [], 'call'],
  ['Austernfischer', 'Haematopus ostralegus', 'Austernfischer', 'Regenpfeiferartige', ['kueste'], [], 'call'],
  ['Rotschenkel', 'Tringa totanus', 'Schnepfenvögel', 'Regenpfeiferartige', ['kueste'], [], 'call'],
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
