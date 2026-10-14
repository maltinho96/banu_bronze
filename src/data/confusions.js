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
      Uferschwalbe: ['Erdbraune Oberseite', 'Braunes Brustband auf weißer Unterseite', 'Klein, kurzer Schwanz; brütet in Steilwänden'],
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
      Wiesenschafstelze: ['Gelbe Unterseite, aber olivgrüner Rücken', 'Blaugrauer Kopf mit weißem Überaugenstreif', 'Kürzerer Schwanz, auf Wiesen und Äckern'],
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
      Kanadagans: ['Schwarzer Hals und Kopf mit weißem Kinnband', 'Groß, braungrauer Körper', 'Schwarzer Schnabel und schwarze Beine'],
    },
  },
  {
    id: 'stelzvoegel', title: 'Graureiher oder Weißstorch',
    tip: 'Rot-weiß-schwarz = Storch. Grau mit Federhaube = Reiher.',
    sp: {
      Graureiher: ['Grau, schwarzer Überaugenstreif bis in den Schopf', 'Gelber Dolchschnabel', 'Fliegt mit eingezogenem S-Hals'],
      Weißstorch: ['Weiß mit schwarzen Schwungfedern', 'Roter Schnabel und rote Beine', 'Fliegt mit gestrecktem Hals'],
      Kranich: ['Grau mit schwarz-weißem Hals und roter Kopfplatte', 'Buschige „Schleppe“ über dem Schwanz', 'Fliegt mit gestrecktem Hals, trompetende Rufe'],
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
  /* ---------- zusätzliche Gruppen für Silber ---------- */
  { id: 's-laubsaenger', title: 'Laubsänger', tip: 'Nur sicher am Gesang – optisch: gelbe Kehle und weißer Bauch = Waldlaubsänger.',
    sp: {
      Zilpzalp: ['Dunkle Beine', 'Kurze Handschwingenprojektion', 'Wippt ständig mit dem Schwanz'],
      Fitis: ['Meist helle, fleischfarbene Beine', 'Lange Handschwingenprojektion', 'Oft gelblicher, deutlicherer Überaugenstreif'],
      Waldlaubsänger: ['Leuchtend gelbe Kehle und Brust', 'Reinweißer Bauch', 'Langflügelig, gelber Überaugenstreif'],
    } },
  { id: 's-goldhaehnchen', title: 'Goldhähnchen', tip: 'Weißer Überaugenstreif = Sommergoldhähnchen.',
    sp: {
      Wintergoldhähnchen: ['Gesicht „leer“, großes dunkles Auge', 'Kein weißer Überaugenstreif', 'Grünliche Halsseiten'],
      Sommergoldhähnchen: ['Weißer Überaugenstreif, schwarzer Augenstreif', 'Bronzefarbene Halsseiten', 'Kontrastreicheres Gesicht'],
    } },
  { id: 's-baumlaeufer', title: 'Baumläufer', tip: 'Optisch kaum zu trennen – Gesang und Ruf entscheiden.',
    sp: {
      Gartenbaumläufer: ['Flanken eher bräunlich-grau', 'Kürzere Kralle, etwas längerer Schnabel', 'Kurzer Vers „ti-ti-te-roi-tit“'],
      Waldbaumläufer: ['Unterseite reiner weiß', 'Deutlicherer weißer Überaugenstreif', 'Lange, abfallende Strophe mit Schnörkel'],
    } },
  { id: 's-grasmuecken', title: 'Grasmücken', tip: 'Ohne auffällige Merkmale = Gartengrasmücke. Dunkle „Maske“ = Klappergrasmücke.',
    sp: {
      Gartengrasmücke: ['Völlig schlicht graubraun', 'Rundlicher Kopf, kurzer dicker Schnabel', 'Keine Kopfzeichnung'],
      Klappergrasmücke: ['Grauer Kopf mit dunkler Ohrmaske', 'Weiße Kehle', 'Graubraune Flügel – nicht rotbraun'],
      Mönchsgrasmücke: ['♂ schwarze Kappe, ♀ rotbraune Kappe', 'Graue Unterseite', 'Kappe endet über dem Auge'],
    } },
  { id: 's-rohrsaenger', title: 'Teich- oder Sumpfrohrsänger', tip: 'Optisch sehr schwer – Gesang: Imitationen = Sumpfrohrsänger.',
    sp: {
      Teichrohrsänger: ['Warmbraun, rostiger Bürzel', 'Meist im Schilf', 'Gleichmäßig schwätzender Gesang'],
      Sumpfrohrsänger: ['Eher olivbraun, kalter', 'Meist in Hochstauden und Brennnesseln', 'Gesang voller Nachahmungen'],
    } },
  { id: 's-lerchen-pieper', title: 'Lerchen und Pieper', tip: 'Kurzer Schwanz und weiß-schwarz-weißer Flügelfleck = Heidelerche.',
    sp: {
      Heidelerche: ['Kurzer Schwanz, kleine Haube', 'Weißer Überaugenstreif bis in den Nacken', 'Schwarz-weißer Fleck am Flügelbug'],
      Baumpieper: ['Kräftige Striche auf gelblicher Brust, feine an den Flanken', 'Kurze, gebogene Hinterkralle', 'Singt von Baumspitzen'],
      Wiesenpieper: ['Gleichmäßig gestrichelte Brust und Flanken', 'Lange Hinterkralle', 'Offenes, baumloses Grünland'],
    } },
  { id: 's-schmaetzer', title: 'Rotschwänze und Schmätzer', tip: 'Weißer Bürzel mit schwarzem „T“ = Steinschmätzer.',
    sp: {
      Gartenrotschwanz: ['♂ weiße Stirn, schwarze Kehle, orangerote Brust', 'Grauer Rücken, rostroter Schwanz', 'Brütet in Höhlen in Gärten und Wäldern'],
      Braunkehlchen: ['Breiter weißer Überaugenstreif', 'Orange Kehle und Brust', 'Weiße Schwanzwurzel-Seiten, sitzt auf Halmen'],
      Steinschmätzer: ['Weißer Bürzel, schwarzes „T“ am Schwanz', '♂ schwarze Maske, grauer Rücken', 'Offene, steinige Flächen'],
    } },
  { id: 's-drosseln', title: 'Drosseln (Silber)', tip: 'Roter Flankenfleck = Rotdrossel. Groß und grau mit runden Flecken = Misteldrossel.',
    sp: {
      Misteldrossel: ['Größer und grauer als die Singdrossel', 'Runde, große Flecken', 'Weiße Unterflügel, weiße Schwanzecken'],
      Rotdrossel: ['Rostroter Flankenfleck', 'Breiter weißer Überaugenstreif', 'Rote Unterflügel'],
      Ringdrossel: ['Wie eine Amsel mit weißem Brustband („Halbmond“)', 'Helle Säume am Flügel', 'Brütet im Bergwald'],
    } },
  { id: 's-spechte-bunt', title: 'Schwarz-weiße Spechte', tip: 'Ganze rote Kappe ohne schwarzen Bart = Mittelspecht. Spatzengroß = Kleinspecht.',
    sp: {
      Buntspecht: ['Rote Unterschwanzdecken, kräftig', 'Schwarzer Bartstreif bis zum Nacken', 'Große weiße Schulterflecken'],
      Mittelspecht: ['Ganze Kappe rot, kein schwarzer Scheitelrand', 'Unterschwanz nur rosa, Flanken gestrichelt', 'Schwacher Bartstreif, „freundliches“ Gesicht'],
      Kleinspecht: ['Nur spatzengroß', 'Rücken quergebändert, keine Schulterflecken', '♂ rote Kappe, kein Rot am Steiß'],
    } },
  { id: 's-spechte-gruen', title: 'Grünspecht oder Grauspecht', tip: 'Graues Gesicht und wenig Rot = Grauspecht.',
    sp: {
      Grünspecht: ['Rote Kappe bis in den Nacken', 'Breite schwarze Maske', 'Kräftiger, langer Schnabel'],
      Grauspecht: ['Grauer Kopf, ♂ nur rote Stirn, ♀ ohne Rot', 'Schmaler schwarzer Bartstreif', 'Kleiner, kürzerer Schnabel'],
    } },
  { id: 's-moewen', title: 'Große und mittlere Möwen', tip: 'Gelbe Beine = Mittelmeermöwe, rosa Beine = Silbermöwe, klein mit dünnem Schnabel = Sturmmöwe.',
    sp: {
      Silbermöwe: ['Rosa Beine', 'Hellgrauer Rücken', 'Gelber Schnabel mit rotem Fleck'],
      Mittelmeermöwe: ['Gelbe Beine', 'Etwas dunklerer grauer Rücken', 'Gelber Schnabel mit rotem Fleck'],
      Sturmmöwe: ['Deutlich kleiner, rundlicher Kopf', 'Dünner gelbgrünlicher Schnabel ohne roten Fleck', 'Gelbgrünliche Beine, dunkles Auge'],
    } },
  { id: 's-seeschwalbe', title: 'Lachmöwe oder Flussseeschwalbe', tip: 'Schwarze Kappe und tief gegabelter Schwanz = Flussseeschwalbe.',
    sp: {
      Lachmöwe: ['Schokobraune Kapuze (nicht schwarz)', 'Gerader Schwanz', 'Weißer Keil am Flügelvorderrand'],
      Flussseeschwalbe: ['Schwarze Kappe', 'Roter Schnabel mit schwarzer Spitze', 'Tief gegabelter Schwanz, stoßtaucht'],
    } },
  { id: 's-sperber-habicht', title: 'Sperber oder Habicht', tip: 'Größe und Wucht: Habicht ♀ fast bussardgroß.',
    sp: {
      Sperber: ['Klein, schlank, langer dünner Schwanz', 'Eckiges Schwanzende', '♂ rostrote Wangen und Brust'],
      Habicht: ['Groß und kräftig, tiefe Brust', 'Gerundetes Schwanzende, weiße Unterschwanzdecken', 'Weißer Überaugenstreif, Gesicht „grimmig“'],
    } },
  { id: 's-falken', title: 'Falken', tip: 'Rote „Hosen“ = Baumfalke. Breiter schwarzer Bart und kräftig = Wanderfalke.',
    sp: {
      Turmfalke: ['Rotbrauner Rücken, langer Schwanz', 'Rüttelt', 'Schmaler Bartstreif'],
      Baumfalke: ['Rotbraune „Hosen“ und Unterschwanz', 'Stark längsgestreifte Brust', 'Lange, sichelförmige Flügel – wie ein großer Segler'],
      Wanderfalke: ['Breiter schwarzer Bartstreif, kräftig', 'Schiefergrauer Rücken', 'Quergebänderte Unterseite'],
    } },
  { id: 's-weihen', title: 'Weihen und Milan', tip: 'V-förmige Flügelhaltung im Gleitflug = Weihe.',
    sp: {
      Rohrweihe: ['♂ dreifarbig: braun, grau, schwarz', '♀ dunkelbraun mit cremefarbenem Kopf', 'Gaukelt tief übers Schilf, Flügel im V'],
      Wiesenweihe: ['♂ grau mit schwarzer Flügelbinde', 'Sehr schmale, spitze Flügel', '♀ braun mit weißem Bürzelband'],
      Rotmilan: ['Tief gegabelter, rostroter Schwanz', 'Helle Flügelfenster', 'Kreist hoch, dreht den Schwanz'],
    } },
  { id: 's-adler', title: 'Große Greifvögel', tip: 'Weißer, keilförmiger Schwanz = Seeadler. Weiße Unterseite mit Augenstreif = Fischadler.',
    sp: {
      Seeadler: ['Riesig, „fliegende Tür“ – brettartige Flügel', 'Adult weißer Keilschwanz', 'Gewaltiger gelber Schnabel'],
      Fischadler: ['Weiße Unterseite, dunkler Augenstreif', 'Lange, geknickte Flügel', 'Stößt mit den Füßen voran ins Wasser'],
      Mäusebussard: ['Breite Flügel, kurzer Schwanz', 'Sehr variabel, oft helles Brustband', 'Kreist mit leichtem V'],
    } },
  { id: 's-eulen', title: 'Eulen', tip: 'Federohren + orange Augen = Waldohreule; riesig mit Ohren = Uhu; rund ohne Ohren, dunkle Augen = Waldkauz.',
    sp: {
      Waldkauz: ['Runder Kopf ohne Federohren', 'Dunkle Augen', 'Graubraun oder rotbraun'],
      Waldohreule: ['Lange Federohren', 'Orange Augen', 'Schlank, etwa taubengroß'],
      Uhu: ['Riesig, mit Federohren', 'Orange-gelbe Augen', 'Kräftig, größte Eule Europas'],
    } },
  { id: 's-tauben', title: 'Ringeltaube oder Hohltaube', tip: 'Kein weißer Fleck, schwarze Flügelbinden-Ansätze, blaugrau = Hohltaube.',
    sp: {
      Ringeltaube: ['Weißer Halsfleck', 'Weiße Flügelbinde im Flug', 'Groß, lange Schwanz'],
      Hohltaube: ['Kein Weiß am Hals und Flügel', 'Kurze schwarze Flügelbinden, dunkle Flügelränder', 'Kleiner, blaugrau, dunkles Auge'],
      Straßentaube: ['Weißer oder heller Bürzel', 'Zwei lange schwarze Flügelbinden', 'Sehr variabel'],
    } },
  { id: 's-turteltaube', title: 'Türkentaube oder Turteltaube', tip: 'Schuppig rotbraune Flügel und schwarz-weiß gestreifter Halsfleck = Turteltaube.',
    sp: {
      Türkentaube: ['Einfarbig sandbeige', 'Schwarzes Nackenband', 'Lebt in Siedlungen'],
      Turteltaube: ['Rotbraune, schwarz gemusterte („geschuppte“) Flügel', 'Schwarz-weiß gestreifter Fleck an der Halsseite', 'Kleiner, lebt in Feldgehölzen'],
    } },
  { id: 's-rabenvoegel', title: 'Schwarze Rabenvögel', tip: 'Graue Nackenkappe und helles Auge = Dohle. Riesig mit Keilschwanz = Kolkrabe.',
    sp: {
      Dohle: ['Klein, grauer Nacken', 'Hellgraue Augen', 'Kurzer Schnabel'],
      Kolkrabe: ['Bussardgroß, keilförmiger Schwanz', 'Wuchtiger Schnabel, zottelige Kehle', 'Tiefes „kronk“'],
      Rabenkrähe: ['Mittelgroß, gerader Schwanz', 'Schnabelwurzel befiedert', 'Raues „kräh“'],
    } },
  { id: 's-limikolen-rot', title: 'Wasserläufer', tip: 'Rote Beine = Rotschenkel, grüne Beine = Grünschenkel, dunkel mit weißem Bürzel = Waldwasserläufer.',
    sp: {
      Rotschenkel: ['Orangerote Beine und Schnabelbasis', 'Breiter weißer Flügelhinterrand im Flug', 'Bräunlich gefleckt'],
      Grünschenkel: ['Grünliche Beine', 'Leicht aufgebogener Schnabel', 'Weißer Keil den Rücken hinauf im Flug'],
      Waldwasserläufer: ['Sehr dunkle Oberseite mit feinen hellen Punkten', 'Leuchtend weißer Bürzel', 'Dunkle Unterflügel'],
    } },
  { id: 's-schnepfen', title: 'Bekassine oder Waldschnepfe', tip: 'Quergebänderter Scheitel = Waldschnepfe, Längsstreifen am Kopf = Bekassine.',
    sp: {
      Bekassine: ['Längsstreifen über den Scheitel', 'Sehr langer Schnabel, schlank', 'Feuchtwiesen und Moore, Zickzack-Flug'],
      Waldschnepfe: ['Querbänder am Hinterkopf', 'Rundlich, rotbraun wie Laub', 'Im Wald, Balzflug in der Dämmerung'],
    } },
  { id: 's-grosse-limikolen', title: 'Brachvogel oder Uferschnepfe', tip: 'Abwärts gebogener Schnabel = Brachvogel, gerader = Uferschnepfe.',
    sp: {
      Brachvogel: ['Langer, abwärts gebogener Schnabel', 'Gleichmäßig braun gestreift', 'Weißer Keil am Rücken im Flug'],
      Uferschnepfe: ['Langer, gerader Schnabel', 'Brutkleid: rostrote Brust', 'Breite weiße Flügelbinde, schwarze Schwanzbinde'],
    } },
  { id: 's-weisse', title: 'Große weiße Vögel', tip: 'Löffelschnabel = Löffler, gelber Dolch = Silberreiher, rot = Storch.',
    sp: {
      Silberreiher: ['Ganz weiß, gelber Dolchschnabel', 'Schwarze Beine', 'Fliegt mit eingezogenem Hals'],
      Löffler: ['Ganz weiß, schwarzer Löffelschnabel', 'Seiht im Flachwasser', 'Fliegt mit gestrecktem Hals'],
      Weißstorch: ['Schwarze Schwungfedern', 'Roter Schnabel und rote Beine', 'Fliegt mit gestrecktem Hals'],
    } },
  { id: 's-enten', title: 'Silber-Enten', tip: 'Riesiger Schnabel = Löffelente. Weißer Wangenfleck = Schellente.',
    sp: {
      Löffelente: ['Großer, breiter Löffelschnabel', '♂ grüner Kopf, weiße Brust, rotbraune Flanken', 'Liegt vorne tief im Wasser'],
      Schellente: ['♂ weißer, runder Fleck vor dem Auge', 'Dreieckiger Kopf, gelbes Auge', 'Schwarz-weiß, taucht'],
      Gänsesäger: ['Schmaler, roter Hakenschnabel', '♂ grüner Kopf, lachsweißer Körper', '♀ rotbrauner Kopf mit Schopf'],
    } },
  { id: 's-finken', title: 'Kleine gelbgrüne Finken', tip: 'Schwarze Kappe = Erlenzeisig ♂. Winzig mit Stummelschnabel und gelbem Bürzel = Girlitz.',
    sp: {
      Girlitz: ['Sehr klein, Stummelschnabel', 'Leuchtend gelber Bürzel', 'Gestreifte Flanken'],
      Erlenzeisig: ['♂ schwarze Kappe und Kinn', 'Gelbe Flügelbinden', 'Spitzer Schnabel'],
      Grünfink: ['Groß und kräftig, Kegelschnabel', 'Gelbe Flügel- und Schwanzränder', 'Kaum Streifen'],
    } },
  { id: 's-bergfink', title: 'Buchfink oder Bergfink', tip: 'Orange Brust und weißer Bürzel = Bergfink.',
    sp: {
      Buchfink: ['Blaugrauer Scheitel (♂)', 'Grünlicher Bürzel', 'Zwei weiße Flügelbinden'],
      Bergfink: ['Orange Brust und Schultern', 'Weißer Bürzel', '♂ im Prachtkleid schwarzer Kopf'],
    } },
  { id: 's-wuerger', title: 'Würger', tip: 'Grau-schwarz-weiß und groß = Raubwürger.',
    sp: {
      Neuntöter: ['♂ rotbrauner Rücken', 'Grauer Kopf mit schwarzer Maske', 'Kleiner'],
      Raubwürger: ['Grau-schwarz-weiß, kein Rotbraun', 'Schwarze Maske, weiße Flügelflecken', 'Groß, langer Schwanz'],
    } },

];

/** Gruppen auf die vorhandene Artenliste abbilden (nur Arten, die es gibt) */
export function buildConfusions(species) {
  const byDe = new Map(species.map(s => [s.de, s]));
  return CONFUSIONS.map(g => ({
    ...g,
    members: Object.entries(g.sp).filter(([de]) => byDe.has(de)).map(([de, marks]) => ({ sp: byDe.get(de), marks })),
  })).filter(g => g.members.length >= 2
    // Silber-Gruppen nur zeigen, wenn eine Silber-Art dabei ist
    && (!g.id.startsWith('s-') || g.members.some(m => m.sp.lv === 's')));
}
