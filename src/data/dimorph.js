/* Geschlechtsdimorphismus: Arten, bei denen Männchen und Weibchen (im Prachtkleid)
 * gut unterscheidbar sind – mit den entscheidenden Merkmalen.
 * Schlüssel = deutscher Artname. m = Männchen, f = Weibchen. */

export const DIMORPH = {
  // ----- Bronze -----
  Amsel: { m: 'Ganz schwarz, gelber Schnabel und Augenring', f: 'Dunkelbraun, Kehle und Brust leicht gefleckt, Schnabel bräunlich' },
  Buchfink: { m: 'Blaugrauer Scheitel und Nacken, rosabraune Brust', f: 'Graubraun-oliv, ohne Rosa und Blau – nur die weißen Flügelbinden' },
  Buntspecht: { m: 'Roter Fleck im Nacken', f: 'Nacken ganz schwarz, kein Rot am Kopf' },
  Grünspecht: { m: 'Bartstreif mit roter Mitte', f: 'Bartstreif ganz schwarz' },
  Gimpel: { m: 'Leuchtend rosarote Brust und Wangen', f: 'Brust graubraun-rosa, insgesamt matt' },
  Haussperling: { m: 'Grauer Scheitel, kastanienbraune Kopfseiten, schwarzer Latz', f: 'Schlicht graubraun, heller beiger Überaugenstreif, kein Latz' },
  Hausrotschwanz: { m: 'Rußschwarz mit weißem Flügelfeld', f: 'Einfarbig graubraun, nur der rostrote Schwanz' },
  Mönchsgrasmücke: { m: 'Schwarze Kappe', f: 'Rotbraune Kappe' },
  Kohlmeise: { m: 'Breiter schwarzer Bauchstreif bis zwischen die Beine', f: 'Schmaler, oft unterbrochener Bauchstreif' },
  Wintergoldhähnchen: { m: 'Orange Mitte im gelben Scheitelstreif', f: 'Scheitelstreif nur gelb' },
  Goldammer: { m: 'Kopf und Brust leuchtend gelb', f: 'Blasser gelb, Kopf und Brust stärker gestrichelt' },
  Grünfink: { m: 'Kräftig olivgrün mit leuchtend gelben Flügelrändern', f: 'Graugrün, matter, Rücken leicht gestreift' },
  Neuntöter: { m: 'Grauer Kopf, schwarze Maske, rotbrauner Rücken', f: 'Braun, ohne schwarze Maske, Brust fein quergewellt („geschuppt“)' },
  Turmfalke: { m: 'Grauer Kopf und grauer Schwanz, Rücken mit wenigen Flecken', f: 'Kopf braun, Schwanz braun und quergebändert, Rücken stärker gebändert' },
  Sperber: { m: 'Klein, Oberseite blaugrau, Wangen und Brust rostrot gebändert', f: 'Deutlich größer, Oberseite graubraun, Brust grau gebändert, weißer Überaugenstreif' },
  Stockente: { m: 'Grüner Kopf, weißer Halsring, gelber Schnabel', f: 'Braun gesprenkelt, Schnabel orange mit dunkler Mitte' },
  Krickente: { m: 'Kastanienbrauner Kopf mit grünem Band, gelbes Heckdreieck', f: 'Braun gesprenkelt, klein, grüner Spiegel' },
  Reiherente: { m: 'Schwarz mit weißen Flanken, langer Schopf', f: 'Dunkelbraun, kurzer Schopf, oft weiß an der Schnabelbasis' },
  Tafelente: { m: 'Rotbrauner Kopf, schwarze Brust, hellgraue Flanken', f: 'Graubraun mit hellem Ring ums Auge und Streif dahinter' },
  Rebhuhn: { m: 'Großer, dunkel kastanienbrauner Hufeisenfleck am Bauch', f: 'Hufeisenfleck klein oder fehlend' },
  Höckerschwan: { m: 'Großer schwarzer Höcker an der Schnabelwurzel', f: 'Kleinerer Höcker' },
  // ----- Silber -----
  Jagdfasan: { m: 'Bunt, roter Gesichtslappen, grün schillernder Kopf, sehr langer Schwanz', f: 'Unscheinbar braun gefleckt, kürzerer Schwanz' },
  Bergfink: { m: 'Im Prachtkleid schwarzer Kopf und Rücken', f: 'Graubrauner Kopf mit dunklen Seitenstreifen' },
  Bluthänfling: { m: 'Rote Stirn und rote Brustseiten', f: 'Ohne Rot, stärker gestrichelt' },
  Braunkehlchen: { m: 'Schwarzbraune Wangen, weißer Überaugenstreif sehr kontrastreich', f: 'Blasser, Wangen braun, Überaugenstreif beige' },
  Erlenzeisig: { m: 'Schwarze Kappe und schwarzes Kinn', f: 'Ohne Schwarz, stärker gestreift' },
  Fichtenkreuzschnabel: { m: 'Ziegelrot', f: 'Graugrün mit gelblichem Bürzel' },
  Gartenrotschwanz: { m: 'Weiße Stirn, schwarze Kehle, orangerote Brust, grauer Rücken', f: 'Graubraun, Brust beige-orange getönt, nur der Schwanz rostrot' },
  Girlitz: { m: 'Kopf und Brust leuchtend gelb', f: 'Blasser, stärker gestreift' },
  Kleinspecht: { m: 'Rote Kappe', f: 'Kappe weißlich bis bräunlich, kein Rot' },
  Schwarzspecht: { m: 'Ganzer Scheitel von der Stirn bis zum Nacken rot', f: 'Nur ein roter Fleck am Hinterkopf' },
  Grauspecht: { m: 'Kleiner roter Stirnfleck', f: 'Kein Rot am Kopf' },
  Rohrammer: { m: 'Im Prachtkleid schwarzer Kopf und Kehle, weißer Bartstreif und Halsring', f: 'Brauner Kopf mit hellem Überaugen- und Bartstreif' },
  Rohrweihe: { m: 'Dreifarbig: brauner Körper, graue Armschwingen und Schwanz, schwarze Flügelspitzen', f: 'Dunkelbraun mit cremefarbenem Kopf und Schultern' },
  Wiesenweihe: { m: 'Grau mit schwarzer Binde auf dem Flügel, schwarze Spitzen', f: 'Braun, Unterseite gestreift, weißes Bürzelband' },
  Steinschmätzer: { m: 'Grauer Rücken, schwarze Maske, schwarze Flügel', f: 'Graubraun, ohne Maske, Flügel braun' },
  Trauerschnäpper: { m: 'Schwarz-weiß mit weißem Stirnfleck', f: 'Graubraun mit weißem Flügelfeld' },
  Pirol: { m: 'Goldgelb mit schwarzen Flügeln', f: 'Grünlich-gelb, Unterseite fein gestreift' },
  Wiesenschafstelze: { m: 'Blaugrauer Kopf, leuchtend gelbe Unterseite', f: 'Bräunlich-grauer Kopf, Unterseite blasser gelb' },
  Löffelente: { m: 'Grüner Kopf, weiße Brust, rotbraune Flanken', f: 'Braun gesprenkelt – nur der große Löffelschnabel' },
  Schellente: { m: 'Schwarz-weiß, runder weißer Wangenfleck, grünlich-schwarzer Kopf', f: 'Schokobrauner Kopf, grauer Körper, weißes Halsband' },
  Gänsesäger: { m: 'Grüner Kopf, lachsweißer Körper', f: 'Rotbrauner Kopf mit Schopf, grauer Körper, weiße Kehle' },
  Eiderente: { m: 'Schwarz-weiß mit grünem Nacken und rosa Brust', f: 'Braun mit dunkler Querbänderung' },
  Halsbandsittich: { m: 'Schwarz-rosafarbener Halsring', f: 'Ohne Halsring' },
};

export const SEX_LABEL = { m: 'Männchen ♂', f: 'Weibchen ♀' };
