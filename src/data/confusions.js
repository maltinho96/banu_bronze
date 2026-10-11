/* Optisch verwechselbare Arten der BANU-Liste Bronze.
 * Je Gruppe 2–3 Arten mit den Merkmalen, an denen man sie sicher trennt
 * (Prachtkleid / adulte Vögel, so wie sie in der Prüfung gezeigt werden).
 * Namen müssen exakt den deutschen Namen der Artenliste entsprechen. */

export const CONFUSIONS = [
  {
    id: 'meisen-kappe', title: 'Meisen mit schwarzer Kappe',
    tip: 'Erst auf den Nacken schauen: weißer Fleck = Tannenmeise. Gelber Bauch mit Streif = Kohlmeise.',
    sp: {
      Kohlmeise: ['Gelbe Unterseite mit schwarzem Längsstreif („Krawatte“)', 'Große weiße Wangen, schwarzer Kopf', 'Grünlicher Rücken, eine weiße Flügelbinde'],
      Tannenmeise: ['Weißer Nackenfleck', 'Zwei weiße Flügelbinden', 'Großer schwarzer Kehllatz, Unterseite beige – kein Gelb'],
      Sumpfmeise: ['Glänzend schwarze Kappe, kleines Kinnfleckchen', 'Kein Nackenfleck, keine Flügelbinden', 'Schlicht graubraun'],
    },
  },
  {
    id: 'kraehen', title: 'Rabenkrähe oder Saatkrähe',
    tip: 'Auf die Schnabelwurzel achten: nackt und grauweiß = Saatkrähe.',
    sp: {
      Rabenkrähe: ['Schnabelwurzel befiedert (Nasenborsten)', 'Kräftiger, leicht gebogener Schnabel', 'Flache Stirn, Gefieder matter schwarz'],
      Saatkrähe: ['Nackte, grauweiße Schnabelwurzel und Gesicht (Altvogel)', 'Spitzer, geraderer Schnabel', 'Steile Stirn, lockere „Hosen“, violetter Glanz'],
    },
  },
  {
    id: 'sperlinge', title: 'Haussperling oder Feldsperling',
    tip: 'Schwarzer Fleck auf der weißen Wange = Feldsperling.',
    sp: {
      Haussperling: ['♂ grauer Scheitel, kastanienbraune Kopfseiten', 'Großer schwarzer Kehllatz, graue Wangen', '♀ schlicht graubraun mit hellem Überaugenstreif'],
      Feldsperling: ['Ganz schokobraune Kappe', 'Schwarzer Wangenfleck auf weißer Wange, weißes Halsband', 'Kleiner Kehlfleck; ♂ und ♀ gleich'],
    },
  },
  {
    id: 'schwalben', title: 'Schwalben und Segler',
    tip: 'Weißer Bürzel = Mehlschwalbe. Ganz dunkel mit Sichelflügeln = Mauersegler.',
    sp: {
      Rauchschwalbe: ['Rotbraune Stirn und Kehle, dunkles Brustband', 'Lange Schwanzspieße', 'Oberseite blauschwarz, Unterseite rahmweiß'],
      Mehlschwalbe: ['Leuchtend weißer Bürzel', 'Unterseite rein weiß', 'Kurzer, nur leicht gegabelter Schwanz'],
      Mauersegler: ['Ganz schwarzbraun, nur kleiner heller Kehlfleck', 'Lange, schmale Sichelflügel', 'Kurzer Gabelschwanz; sitzt nie auf Drähten'],
    },
  },
  {
    id: 'tauben', title: 'Tauben',
    tip: 'Weißer Halsfleck = Ringeltaube, schwarzes Nackenband = Türkentaube.',
    sp: {
      Ringeltaube: ['Weißer Halsfleck, grün-violett schillernder Hals', 'Im Flug weiße Querbinde auf dem Flügel', 'Größte Taube, rosa Brust'],
      Türkentaube: ['Schmales schwarzes Nackenband (Halbring)', 'Sandfarben-beige, schlank', 'Langer Schwanz mit weißem Ende von unten'],
      Straßentaube: ['Sehr variabel gefärbt, oft blaugrau', 'Häufig zwei schwarze Flügelbinden', 'Heller Bürzel, schillernder Hals ohne weißen Fleck'],
    },
  },
  {
    id: 'moewen', title: 'Lachmöwe oder Mittelmeermöwe',
    tip: 'Klein mit roten Beinen = Lachmöwe. Groß mit gelben Beinen = Mittelmeermöwe.',
    sp: {
      Lachmöwe: ['Klein, im Brutkleid schokobraune Kapuze', 'Schnabel und Beine dunkelrot', 'Weißer Keil am Flügelvorderrand'],
      Mittelmeermöwe: ['Groß, weißer Kopf auch im Sommer', 'Gelber Schnabel mit rotem Fleck, gelbe Beine', 'Schwarze Flügelspitzen mit weißen Flecken'],
    },
  },
  {
    id: 'tauchenten', title: 'Reiherente oder Tafelente',
    tip: 'Schwarz-weiß mit Schopf = Reiherente. Rotbrauner Kopf = Tafelente.',
    sp: {
      Reiherente: ['♂ schwarz mit leuchtend weißen Flanken', 'Herabhängender Federschopf am Hinterkopf', 'Gelbes Auge'],
      Tafelente: ['♂ rotbrauner Kopf, schwarze Brust und Heck', 'Hellgraue Flanken und Rücken', 'Rotes Auge, keine Haube'],
    },
  },
  {
    id: 'gruendelenten', title: 'Stockente oder Krickente',
    tip: 'Klein mit gelbem Dreieck am Heck = Krickente.',
    sp: {
      Stockente: ['♂ grüner Kopf, weißer Halsring', 'Gelber Schnabel, braune Brust', 'Groß; blauer Flügelspiegel mit weißem Rand'],
      Krickente: ['♂ kastanienbrauner Kopf mit grünem Augenband', 'Gelbes Dreieck am Unterschwanz', 'Sehr klein; weißer Längsstreif an der Seite'],
    },
  },
  {
    id: 'taucher', title: 'Haubentaucher oder Zwergtaucher',
    tip: 'Groß mit Haube und weißem Gesicht = Haubentaucher.',
    sp: {
      Haubentaucher: ['Groß, langer schlanker Hals', 'Schwarze Haube, rotbraun-schwarzer Kragen', 'Weißes Gesicht, rosa Dolchschnabel'],
      Zwergtaucher: ['Klein und rundlich, „Wollknäuel“', 'Kastanienbraune Wangen und Hals', 'Hellgelber Fleck am Schnabelwinkel'],
    },
  },
  {
    id: 'rallen', title: 'Blässhuhn oder Teichhuhn',
    tip: 'Weiße Stirn = Blässhuhn, rote Stirn = Teichhuhn.',
    sp: {
      Blässhuhn: ['Ganz schwarz', 'Weißer Schnabel und weißes Stirnschild', 'Rundlich, taucht oft'],
      Teichhuhn: ['Rotes Stirnschild, Schnabel mit gelber Spitze', 'Weiße Linie an der Flanke', 'Weiße Unterschwanzdecken, wippt mit dem Schwanz'],
    },
  },
  {
    id: 'greife-gross', title: 'Mäusebussard oder Rotmilan',
    tip: 'Tief gegabelter, rostroter Schwanz = Rotmilan.',
    sp: {
      Mäusebussard: ['Kurzer, gerundeter Schwanz', 'Breite Flügel, kreist mit leichtem V', 'Sehr variabel, oft helles Brustband'],
      Rotmilan: ['Tief gegabelter, rostroter Schwanz', 'Lange, schmale, geknickte Flügel mit hellem Fenster', 'Rostrot mit hellgrauem Kopf'],
    },
  },
  {
    id: 'greife-klein', title: 'Turmfalke, Sperber oder Kuckuck',
    tip: 'Spitze Flügel und rüttelt = Turmfalke. Kurze runde Flügel = Sperber. Dünner Schnabel = Kuckuck.',
    sp: {
      Turmfalke: ['Spitze Flügel, rüttelt in der Luft', '♂ rotbrauner Rücken mit Flecken, grauer Kopf und Schwanz', 'Dunkler „Bartstreif“, schwarze Schwanzbinde'],
      Sperber: ['Kurze, runde Flügel, langer Schwanz', 'Unterseite fein quergebändert (♂ rostrot)', 'Gelbes Auge, Hakenschnabel'],
      Kuckuck: ['Dünner, leicht gebogener Schnabel – kein Haken', 'Langer, gestufter Schwanz mit weißen Flecken', 'Grauer Kopf und Brust, gelber Augenring'],
    },
  },
  {
    id: 'drosseln', title: 'Drosseln',
    tip: 'Grauer Kopf und Bürzel = Wacholderdrossel. Kleine Tropfenflecken = Singdrossel.',
    sp: {
      Singdrossel: ['Oberseite einheitlich warmbraun', 'Weiße Unterseite mit kleinen, pfeilförmigen Tropfen', 'Kleiner als die Amsel'],
      Wacholderdrossel: ['Grauer Kopf und grauer Bürzel', 'Kastanienbrauner Rücken', 'Ockergelbe, kräftig gefleckte Brust'],
      Amsel: ['♂ ganz schwarz, gelber Schnabel und Augenring', '♀ dunkelbraun, Brust nur schwach gefleckt', 'Langer Schwanz'],
    },
  },
  {
    id: 'rotschwanz', title: 'Rot an Brust oder Schwanz',
    tip: 'Rostroter Schwanz, der zittert = Hausrotschwanz. Orange Brust = Rotkehlchen.',
    sp: {
      Hausrotschwanz: ['♂ rußschwarz mit weißem Flügelfeld', 'Rostroter Schwanz, zittert', '♀ einfarbig graubraun'],
      Rotkehlchen: ['Orangerotes Gesicht und Brust', 'Graues Band um das Orange', 'Rundlich, olivbraune Oberseite'],
      Nachtigall: ['Einfarbig warmbraun, rotbrauner Schwanz', 'Unterseite schlicht hellgrau-beige', 'Großes dunkles Auge mit hellem Ring'],
    },
  },
  {
    id: 'kleine-braune', title: 'Kleine Grünlich-Braune',
    tip: 'Rotbraune Flügel und weiße Kehle = Dorngrasmücke. Im Schilf, lang gestreckt = Teichrohrsänger.',
    sp: {
      Zilpzalp: ['Olivgrün-bräunlich, kurzer Überaugenstreif', 'Dunkle Beine', 'Wippt ständig mit dem Schwanz'],
      Teichrohrsänger: ['Einfarbig warmbraun, Bürzel rostbraun', 'Flache Stirn, langer spitzer Schnabel', 'Klettert im Schilf'],
      Dorngrasmücke: ['Leuchtend weiße Kehle', 'Rotbraune Flügel', '♂ grauer Kopf, Brust rosa überhaucht'],
    },
  },
  {
    id: 'braun-grau', title: 'Unscheinbar braun-grau',
    tip: 'Feiner Schnabel und grauer Kopf = Heckenbraunelle. Kegelschnabel = Sperling.',
    sp: {
      Heckenbraunelle: ['Bleigrauer Kopf und Brust', 'Feiner, spitzer Insektenfresser-Schnabel', 'Braun gestreifter Rücken, Flanken gestrichelt'],
      Haussperling: ['♀: kräftiger Kegelschnabel', 'Heller, beiger Überaugenstreif', 'Unterseite ungestrichelt graubeige'],
      Grauschnäpper: ['Aufrecht auf Warte, fliegt Insekten an', 'Fein gestrichelte Stirn und Brust', 'Graubraun, schwarzer Schnabel'],
    },
  },
  {
    id: 'offenland', title: 'Feldlerche oder Wiesenpieper',
    tip: 'Kleine Haube und weiße Flügelhinterkante = Feldlerche.',
    sp: {
      Feldlerche: ['Kleine aufstellbare Haube', 'Kräftiger Körper und Schnabel', 'Weißer Flügelhinterrand und weiße Schwanzkanten'],
      Wiesenpieper: ['Keine Haube, zierlich', 'Dünner Schnabel, kräftig gestrichelte Brust', 'Rosa-bräunliche Beine, lange Hinterkralle'],
    },
  },
  {
    id: 'stelzen', title: 'Bachstelze oder Gebirgsstelze',
    tip: 'Gelber Bauch = Gebirgsstelze.',
    sp: {
      Bachstelze: ['Schwarz-weiß-grau, kein Gelb', 'Schwarzer Brustlatz und Kappe', 'Weißes Gesicht'],
      Gebirgsstelze: ['Leuchtend gelbe Unterseite', 'Grauer Rücken, sehr langer Schwanz', '♂ schwarze Kehle, weißer Überaugenstreif'],
    },
  },
  {
    id: 'gelbe', title: 'Gelbe Finken und Ammern',
    tip: 'Gelber Kopf und gestreifter Rücken = Goldammer. Gelbe Flügelkante = Grünfink.',
    sp: {
      Goldammer: ['♂ leuchtend gelber Kopf', 'Braun gestreifter Rücken, rotbrauner Bürzel', 'Weiße Schwanzkanten'],
      Grünfink: ['Olivgrün, kein gestreifter Rücken', 'Gelbe Flügel- und Schwanzränder', 'Kräftiger, heller Kegelschnabel'],
      Stieglitz: ['Rotes Gesicht, schwarz-weißer Kopf', 'Breite gelbe Flügelbinde auf schwarzem Flügel', 'Beige Brust'],
    },
  },
  {
    id: 'finken', title: 'Finken mit rötlicher Brust',
    tip: 'Schwarze Kappe = Gimpel. Zwei weiße Flügelbinden = Buchfink. Riesenschnabel = Kernbeißer.',
    sp: {
      Buchfink: ['♂ blaugrauer Scheitel und Nacken', 'Rosabraune Brust', 'Zwei weiße Flügelbinden, weiße Schwanzkanten'],
      Gimpel: ['Schwarze Kappe', '♂ leuchtend rosarote Unterseite, grauer Rücken', 'Weißer Bürzel, eine weiße Flügelbinde'],
      Kernbeißer: ['Riesiger, kegelförmiger Schnabel', 'Ockerbrauner Kopf, schwarzer Kinnfleck', 'Kurzer Schwanz, breite weiße Flügelbinde'],
    },
  },
  {
    id: 'kletterer', title: 'Am Baumstamm',
    tip: 'Kopfüber abwärts = Kleiber. Spiralig aufwärts mit gebogenem Schnabel = Gartenbaumläufer.',
    sp: {
      Kleiber: ['Blaugraue Oberseite, schwarzer Augenstreif', 'Orange-beige Unterseite', 'Klettert auch kopfunter abwärts'],
      Gartenbaumläufer: ['Rindenbraun gemustert, Unterseite weiß', 'Dünner, gebogener Schnabel', 'Stützschwanz, klettert spiralig aufwärts'],
    },
  },
  {
    id: 'spechte', title: 'Buntspecht oder Grünspecht',
    tip: 'Rot am Hinterkopf und am Bauch, schwarz-weiß = Buntspecht.',
    sp: {
      Buntspecht: ['Schwarz-weiß mit großen weißen Schulterflecken', 'Rote Unterschwanzdecken', '♂ roter Nackenfleck'],
      Grünspecht: ['Grün mit gelbem Bürzel', 'Rote Kappe bis in den Nacken', 'Schwarze „Maske“, oft am Boden (Ameisen)'],
    },
  },
  {
    id: 'gaense', title: 'Graugans oder Nilgans',
    tip: 'Dunkler Fleck ums Auge und auf der Brust = Nilgans.',
    sp: {
      Graugans: ['Graubraun, quer gewellt', 'Kräftiger orangeroter Schnabel', 'Rosa Beine'],
      Nilgans: ['Dunkelbrauner Fleck ums Auge', 'Brauner Fleck mitten auf der Brust', 'Große weiße Flügelfelder, lange rosa Beine'],
    },
  },
  {
    id: 'stelzvoegel', title: 'Graureiher oder Weißstorch',
    tip: 'Rot-weiß-schwarz = Storch. Grau mit Federhaube = Reiher.',
    sp: {
      Graureiher: ['Grau, schwarzer Überaugenstreif bis in den Schopf', 'Gelber Dolchschnabel', 'Fliegt mit eingezogenem S-Hals'],
      Weißstorch: ['Weiß mit schwarzen Schwungfedern', 'Roter Schnabel und rote Beine', 'Fliegt mit gestrecktem Hals'],
    },
  },
  {
    id: 'ufer', title: 'Flussregenpfeifer oder Flussuferläufer',
    tip: 'Schwarzes Brustband und gelber Augenring = Flussregenpfeifer.',
    sp: {
      Flussregenpfeifer: ['Schwarzes Brustband, schwarz-weißer Kopf', 'Gelber Augenring', 'Kurzer Schnabel, rennt-stoppt-rennt'],
      Flussuferläufer: ['Braune Oberseite, weißer Keil vor dem Flügelbug', 'Längerer Schnabel', 'Wippt ständig mit dem Hinterteil'],
    },
  },
  {
    id: 'winzlinge', title: 'Sehr kleine Vögel',
    tip: 'Gelber Scheitelstreif = Wintergoldhähnchen. Hochgestellter Schwanz = Zaunkönig.',
    sp: {
      Wintergoldhähnchen: ['Gelber (♂ orange) Scheitelstreif mit schwarzem Rand', 'Zwei weiße Flügelbinden', 'Grünlich, großes dunkles Auge im hellen Gesicht'],
      Zaunkönig: ['Rotbraun, fein quergebändert', 'Kurzer, oft steil hochgestellter Schwanz', 'Heller Überaugenstreif'],
      Schwanzmeise: ['Sehr langer Schwanz', 'Weißer Kopf (z. T. mit schwarzem Band)', 'Rosa an Schultern und Bauch, winziger Schnabel'],
    },
  },
];

/** Gruppen auf die vorhandene Artenliste abbilden (nur Arten, die es gibt) */
export function buildConfusions(species) {
  const byDe = new Map(species.map(s => [s.de, s]));
  return CONFUSIONS.map(g => ({
    ...g,
    members: Object.entries(g.sp).filter(([de]) => byDe.has(de)).map(([de, marks]) => ({ sp: byDe.get(de), marks })),
  })).filter(g => g.members.length >= 2);
}
