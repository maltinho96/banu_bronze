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
  if (!t) return (sp.hab || []).map(k => HAB_LABEL[k] || k).join(' · ');
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


/* Zusätzliche Arten der Silber-Liste (150 Arten = Bronze + diese 75).
 * Lebensraum-Kreuze nach der BANU-Tabelle; einen Hauptlebensraum-Text gibt es dort nicht. */
const RAW_S = [
  ['Austernfischer', 'Haematopus ostralegus', 'Austernfischer', 'Regenpfeiferartige', ['kueste', 'gewaesser'], '', [], 'call'],
  ['Basstölpel', 'Morus bassanus', 'Tölpel', 'Ruderfüßer', ['kueste'], '', [], 'call'],
  ['Baumfalke', 'Falco subbuteo', 'Falken', 'Falkenartige', ['wald', 'agrar'], '', [], 'call'],
  ['Baumpieper', 'Anthus trivialis', 'Stelzen und Pieper', P, ['wald', 'agrar'], '', [], 'song'],
  ['Bekassine', 'Gallinago gallinago', 'Schnepfenvögel', 'Regenpfeiferartige', ['kueste', 'gewaesser', 'agrar'], '', ['Himmelsziege'], 'call'],
  ['Bergfink', 'Fringilla montifringilla', 'Finken', P, ['wald', 'siedlung'], '', [], 'call'],
  ['Bienenfresser', 'Merops apiaster', 'Bienenfresser', 'Rackenvögel', ['gewaesser'], '', [], 'call'],
  ['Bluthänfling', 'Linaria cannabina', 'Finken', P, ['kueste', 'agrar', 'siedlung'], '', ['Hänfling'], 'song'],
  ['Braunkehlchen', 'Saxicola rubetra', 'Fliegenschnäpper', P, ['kueste', 'gewaesser', 'agrar'], '', [], 'song'],
  ['Dohle', 'Coloeus monedula', 'Rabenvögel', P, ['wald', 'agrar', 'siedlung'], '', [], 'call'],
  ['Eiderente', 'Somateria mollissima', 'Entenvögel', 'Gänsevögel', ['kueste'], '', [], 'call'],
  ['Erlenzeisig', 'Spinus spinus', 'Finken', P, ['wald', 'siedlung'], '', ['Zeisig'], 'song'],
  ['Jagdfasan', 'Phasianus colchicus', 'Fasanenartige', 'Hühnervögel', ['agrar'], '', ['Fasan'], 'call'],
  ['Feldschwirl', 'Locustella naevia', 'Schwirle', P, ['gewaesser', 'agrar'], '', [], 'song'],
  ['Fichtenkreuzschnabel', 'Loxia curvirostra', 'Finken', P, ['wald', 'alpin'], '', ['Kreuzschnabel'], 'call'],
  ['Fischadler', 'Pandion haliaetus', 'Fischadler', 'Greifvögel', ['gewaesser', 'wald'], '', [], 'call'],
  ['Fitis', 'Phylloscopus trochilus', 'Laubsänger', P, ['wald'], '', ['Fitislaubsänger'], 'song'],
  ['Flussseeschwalbe', 'Sterna hirundo', 'Möwen', 'Regenpfeiferartige', ['kueste', 'gewaesser'], '', [], 'call'],
  ['Gänsesäger', 'Mergus merganser', 'Entenvögel', 'Gänsevögel', ['kueste', 'gewaesser'], '', [], 'call'],
  ['Gartengrasmücke', 'Sylvia borin', 'Grasmücken', P, ['wald', 'siedlung'], '', [], 'song'],
  ['Gartenrotschwanz', 'Phoenicurus phoenicurus', 'Fliegenschnäpper', P, ['wald', 'siedlung'], '', [], 'song'],
  ['Girlitz', 'Serinus serinus', 'Finken', P, ['agrar', 'siedlung'], '', [], 'song'],
  ['Goldregenpfeifer', 'Pluvialis apricaria', 'Regenpfeifer', 'Regenpfeiferartige', ['kueste', 'agrar'], '', [], 'call'],
  ['Grauspecht', 'Picus canus', 'Spechte', 'Spechtvögel', ['wald'], '', [], 'call'],
  ['Brachvogel', 'Numenius arquata', 'Schnepfenvögel', 'Regenpfeiferartige', ['kueste', 'gewaesser', 'agrar'], '', ['Großer Brachvogel'], 'call'],
  ['Grünschenkel', 'Tringa nebularia', 'Schnepfenvögel', 'Regenpfeiferartige', ['gewaesser'], '', [], 'call'],
  ['Habicht', 'Accipiter gentilis', 'Habichtartige', 'Greifvögel', ['wald'], '', [], 'call'],
  ['Halsbandsittich', 'Psittacula krameri', 'Altweltpapageien', 'Papageien', ['siedlung'], '', [], 'call'],
  ['Heidelerche', 'Lullula arborea', 'Lerchen', P, ['wald', 'agrar'], '', [], 'song'],
  ['Hohltaube', 'Columba oenas', 'Tauben', 'Taubenvögel', ['wald'], '', [], 'song'],
  ['Kanadagans', 'Branta canadensis', 'Entenvögel', 'Gänsevögel', ['gewaesser'], '', [], 'call'],
  ['Klappergrasmücke', 'Sylvia curruca', 'Grasmücken', P, ['wald', 'agrar', 'siedlung'], '', ['Zaungrasmücke'], 'song'],
  ['Kleinspecht', 'Dryobates minor', 'Spechte', 'Spechtvögel', ['wald', 'siedlung'], '', [], 'call'],
  ['Kolkrabe', 'Corvus corax', 'Rabenvögel', P, ['wald', 'alpin'], '', ['Rabe'], 'call'],
  ['Kranich', 'Grus grus', 'Kraniche', 'Kranichvögel', ['gewaesser', 'wald', 'agrar'], '', [], 'call'],
  ['Löffelente', 'Spatula clypeata', 'Entenvögel', 'Gänsevögel', ['kueste', 'gewaesser'], '', [], 'call'],
  ['Löffler', 'Platalea leucorodia', 'Ibisse und Löffler', 'Pelikanvögel', ['kueste'], '', [], 'call'],
  ['Mauerläufer', 'Tichodroma muraria', 'Mauerläufer', P, ['alpin'], '', [], 'song'],
  ['Misteldrossel', 'Turdus viscivorus', 'Drosseln', P, ['wald', 'agrar', 'siedlung'], '', [], 'song'],
  ['Mittelspecht', 'Dendrocoptes medius', 'Spechte', 'Spechtvögel', ['wald'], '', [], 'call'],
  ['Pirol', 'Oriolus oriolus', 'Pirole', P, ['wald'], '', [], 'song'],
  ['Raubwürger', 'Lanius excubitor', 'Würger', P, ['wald', 'agrar'], '', [], 'call'],
  ['Ringdrossel', 'Turdus torquatus', 'Drosseln', P, ['wald', 'alpin'], '', [], 'song'],
  ['Rohrammer', 'Emberiza schoeniclus', 'Ammern', P, ['kueste', 'gewaesser', 'agrar'], '', [], 'song'],
  ['Rohrweihe', 'Circus aeruginosus', 'Habichtartige', 'Greifvögel', ['kueste', 'gewaesser', 'agrar'], '', [], 'call'],
  ['Rotdrossel', 'Turdus iliacus', 'Drosseln', P, ['wald', 'agrar'], '', [], 'call'],
  ['Rotschenkel', 'Tringa totanus', 'Schnepfenvögel', 'Regenpfeiferartige', ['kueste', 'gewaesser'], '', [], 'call'],
  ['Schellente', 'Bucephala clangula', 'Entenvögel', 'Gänsevögel', ['gewaesser'], '', [], 'call'],
  ['Schwarzspecht', 'Dryocopus martius', 'Spechte', 'Spechtvögel', ['wald'], '', [], 'call'],
  ['Seeadler', 'Haliaeetus albicilla', 'Habichtartige', 'Greifvögel', ['kueste', 'gewaesser', 'wald'], '', [], 'call'],
  ['Silbermöwe', 'Larus argentatus', 'Möwen', 'Regenpfeiferartige', ['kueste', 'gewaesser'], '', [], 'call'],
  ['Silberreiher', 'Ardea alba', 'Reiher', 'Pelikanvögel', ['gewaesser'], '', [], 'call'],
  ['Sommergoldhähnchen', 'Regulus ignicapilla', 'Goldhähnchen', P, ['wald', 'siedlung'], '', [], 'song'],
  ['Steinadler', 'Aquila chrysaetos', 'Habichtartige', 'Greifvögel', ['alpin'], '', [], 'call'],
  ['Steinkauz', 'Athene noctua', 'Eigentliche Eulen', 'Eulen', ['agrar', 'siedlung'], '', [], 'call'],
  ['Steinschmätzer', 'Oenanthe oenanthe', 'Fliegenschnäpper', P, ['kueste', 'agrar', 'alpin'], '', [], 'song'],
  ['Sturmmöwe', 'Larus canus', 'Möwen', 'Regenpfeiferartige', ['kueste', 'gewaesser'], '', [], 'call'],
  ['Sumpfrohrsänger', 'Acrocephalus palustris', 'Rohrsänger', P, ['gewaesser', 'wald', 'agrar'], '', [], 'song'],
  ['Tannenhäher', 'Nucifraga caryocatactes', 'Rabenvögel', P, ['wald', 'alpin'], '', [], 'call'],
  ['Trauerschnäpper', 'Ficedula hypoleuca', 'Fliegenschnäpper', P, ['wald', 'siedlung'], '', [], 'song'],
  ['Turteltaube', 'Streptopelia turtur', 'Tauben', 'Taubenvögel', ['wald', 'agrar'], '', [], 'song'],
  ['Uferschnepfe', 'Limosa limosa', 'Schnepfenvögel', 'Regenpfeiferartige', ['kueste', 'gewaesser', 'agrar'], '', [], 'call'],
  ['Uferschwalbe', 'Riparia riparia', 'Schwalben', P, ['kueste', 'gewaesser'], '', [], 'call'],
  ['Uhu', 'Bubo bubo', 'Eigentliche Eulen', 'Eulen', ['wald'], '', [], 'song'],
  ['Waldbaumläufer', 'Certhia familiaris', 'Baumläufer', P, ['wald', 'alpin'], '', [], 'song'],
  ['Waldlaubsänger', 'Phylloscopus sibilatrix', 'Laubsänger', P, ['wald'], '', [], 'song'],
  ['Waldohreule', 'Asio otus', 'Eigentliche Eulen', 'Eulen', ['agrar', 'siedlung'], '', [], 'song'],
  ['Waldschnepfe', 'Scolopax rusticola', 'Schnepfenvögel', 'Regenpfeiferartige', ['wald'], '', [], 'call'],
  ['Waldwasserläufer', 'Tringa ochropus', 'Schnepfenvögel', 'Regenpfeiferartige', ['gewaesser', 'wald'], '', [], 'call'],
  ['Wanderfalke', 'Falco peregrinus', 'Falken', 'Falkenartige', ['siedlung', 'alpin'], '', [], 'call'],
  ['Wasseramsel', 'Cinclus cinclus', 'Wasseramseln', P, ['gewaesser', 'alpin'], '', [], 'song'],
  ['Wendehals', 'Jynx torquilla', 'Spechte', 'Spechtvögel', ['wald', 'agrar'], '', [], 'call'],
  ['Wiedehopf', 'Upupa epops', 'Wiedehopfe', 'Hornvögel und Hopfe', ['wald', 'agrar'], '', [], 'song'],
  ['Wiesenschafstelze', 'Motacilla flava', 'Stelzen und Pieper', P, ['kueste', 'gewaesser', 'agrar'], '', ['Schafstelze'], 'call'],
  ['Wiesenweihe', 'Circus pygargus', 'Habichtartige', 'Greifvögel', ['kueste', 'gewaesser', 'agrar'], '', [], 'call'],
];
const toSp = lv => ([de, sci, fam, ord, hab, hl, syn = [], snd = 'song']) => ({ de, sci, fam, ord, hab, hl, syn, snd, lv });
/** Bronze-Liste (75 Arten) */
export const BUILTIN = RAW.map(toSp('b'));
/** Nur die zusätzlichen Silber-Arten */
export const SILBER_EXTRA = RAW_S.map(toSp('s'));
/** Silber-Liste (150 Arten) */
export const SILBER = [...BUILTIN, ...SILBER_EXTRA].sort((a, b) => a.de.localeCompare(b.de, 'de'));
/** Alle Arten (für Skripte) */
export const ALL_SPECIES = SILBER;

/* Grobe Laut-Voreinstellung für importierte Listen ohne Laut-Spalte */
const CALL_FAMILIES = new Set([
  'Entenvögel', 'Rallen', 'Reiher', 'Störche', 'Kraniche', 'Möwen', 'Habichtartige', 'Falken',
  'Rabenvögel', 'Segler', 'Eisvögel', 'Regenpfeifer', 'Schnepfenvögel', 'Austernfischer',
  'Fasanenartige', 'Kormorane', 'Seeschwalben',
]);
export function guessSound(sp) {
  const known = ALL_SPECIES.find(b => b.sci === sp.sci);
  if (known) return known.snd;
  if (sp.fam && CALL_FAMILIES.has(sp.fam)) return 'call';
  return 'song';
}
