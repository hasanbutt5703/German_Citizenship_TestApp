// DTZ language bank: stores listening, reading, grammar, and vocabulary questions.
export type Difficulty = 'easy' | 'medium' | 'hard';

export type LanguageQuestion = {
  id: string;
  question: string;
  context?: string;
  options: string[];
  correctAnswer: string;
  inputType?: 'choice' | 'text';
  difficulty: Difficulty;
  topic: 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'writing';
  transcriptDE?: string; // real official German audio script, for TTS playback
};

const readingContexts = {
  catalogue:
    'Suche & Finde - Alle Angebote\nAudio: Lautsprecher, MP3-Player, CDs\nBücher: Belletristik, Kinder- und Jugendliteratur, Sachbücher, Hörbücher, Zeitschriften\nBüro: Schreibwaren, Bürotechnik, Büromöbel, Computer-Zubehör, Drucker, Festplatten, Lernsoftware\nFahrzeuge: PKW, Reisemobile, Nutzfahrzeuge, Motorräder\nFeinschmecker: Weine, Getränke, Süßes und Salziges, Kaffee, Tee, Obst und Gemüse\nFilme & DVDs: TV-Serien, Musik und Konzerte\nFoto & Camcorder: Digitalkameras, Speicherkarten, Filme, Zubehör\nHaushaltsgeräte: Kaffeemaschinen, Backöfen, Staubsauger und weitere Küchengeräte\nHeimwerker: Bad und Küche, Elektrowerkzeuge, Umzugsmaterial, Farben\nMöbel & Wohnen: Regale, Betten, Lampen, Sofas, Stühle, Tische, Küche\nReise: Kurzreisen, Urlaubsreisen, Bahntickets, Flugtickets.',
  jobAds:
    'Anzeigen:\nA Hotel Sonnenhof: Ausbildungsplatz als Koch/Köchin, Beginn am 01.07. oder später, Unterkunft möglich.\nB Restaurant Düsseldorfer Medienhafen: Koch zum nächstmöglichen Termin gesucht.\nC Haarstudio Krause in Berlin: Teilzeitstelle im Friseursalon, Arbeitszeit nachmittags oder nach Absprache.\nD Haarscharf in Großostheim: Minijob im Friseursalon, nachmittags 13:00-19:00 Uhr.\nE Ferien und Arbeit: Ferienjob im Juli und August, 400 Euro und mehr, keine Vorkenntnisse nötig.\nF Kfz-Servicetechniker: Auto-Mechaniker oder Auto-Elektriker gesucht; außerdem Unterstützung bei der Ausbildung von Lehrlingen.\nG Autoshow Maler AG: Autoverkäufer gesucht.\nH Umzugsunternehmen: Umzugshelfer, Möbelmonteure und Tischler gesucht.',
  integrationNotice:
    'Hilfe für Zuwanderer\nDie Regierung des Landes Hessen möchte, dass die vielen Projekte für die Integration besser zusammenarbeiten. Mehr als 800 Helfer unterstützen Zuwanderer bisher ohne Bezahlung. Ab Januar fördert das Land Hessen die Arbeit mit 500.000 Euro. Dafür wird eine Geschäftsstelle eröffnet. Die Arbeit wird dadurch nicht vollständig bezahlt, aber die Zusammenarbeit soll besser werden.',
  kindergartenNotice:
    'Liebe Eltern,\nam Samstag, den 18. Juli, findet in der Villa Kunterbunt das Kindergartensommerfest statt. Die Kinder zeigen ein Programm zum Thema Sommerblumen. Danach gibt es Kaffee und Kuchen. Wir bitten die Eltern, zum Kuchenbuffet etwas beizutragen oder uns mit einer kleinen Geldspende zu unterstützen. Bitte teilen Sie uns mit, mit wie vielen Personen Sie kommen und was Sie mitbringen.',
  utilityNotice:
    'Sehr geehrte Familie Müller,\nwir haben die Nebenkosten für das vergangene Jahr abgerechnet. Die Abrechnung schließt mit einem Guthaben von 150 Euro ab. Deshalb reduziert sich Ihre monatliche Nebenkostenvorauszahlung um 12 Euro. Die Gesamtmiete beträgt ab 1. Februar nur noch 612,50 Euro.',
  medicationLeaflet:
    'Migränin 400 mg Ibuprofen Dragees\nDie Tabletten sollten mit ausreichend Flüssigkeit während oder nach den Mahlzeiten eingenommen werden. Die Teilnahme am Straßenverkehr und die Bedienung von Maschinen ist uneingeschränkt möglich. Während der Frühschwangerschaft und Stillzeit soll das Mittel nur unter ärztlicher Aufsicht angewendet werden. Im letzten Drittel der Schwangerschaft darf Migränin nicht angewendet werden.',
  cancellationLetter:
    'Norddeutsche Zeitung (NZ), Leseservice\nKündigung des Probeabonnements\nSehr geehrte Damen und Herren,\ndie zwei Wochen Probelesen Ihrer Tageszeitung enden für mich am 17.5.2008. Hiermit möchte ich mein Probeabonnement fristgerecht kündigen. Leider musste ich feststellen, dass ich nicht genug Zeit für regelmäßiges Zeitungslesen habe. Deshalb möchte ich die Norddeutsche Zeitung nicht weiter abonnieren.\nMit freundlichen Grüßen\nNorbert Schultze',
} as const;

export const languageQuestions: LanguageQuestion[] = [
  // ==================== HÖREN (LISTENING) ====================
  // --- EASY (Hören Teil 1 & 2) ---
  {
    id: 'h1',
    question: 'What should Ms. Aslan do? (Was soll Frau Aslan machen?)',
    options: ['Come to the clinic', 'Get examined', 'Call the clinic'],
    correctAnswer: 'Call the clinic',
    difficulty: 'easy',
    topic: 'listening',
    transcriptDE:
      'Guten Tag, Praxis Dr. Engerer hier, Gudrun Persen am Apparat. Frau Aslan, Sie waren vor zwei Tagen zur Blutabnahme bei uns. Die Ergebnisse sind jetzt da, und der Doktor würde gern noch mal kurz mit Ihnen sprechen. Bitte rufen Sie uns zurück. Die Nummer ist 46 88 92 03. Das wäre nett. Auf Wiederhören.',
  },
  {
    id: 'h2',
    question: 'What should Ms. Yang do? (Was soll Frau Yang tun?)',
    options: ['Pay a fee', 'Fill out a new application', 'Go to the housing benefit office'],
    correctAnswer: 'Go to the housing benefit office',
    difficulty: 'easy',
    topic: 'listening',
    transcriptDE:
      'Guten Tag, Schröder von der Wohngeldstelle. Es geht um Ihren Antrag auf Wohngeld. Ich habe auch noch eine Frage zur Verdienstbescheinigung von Ihrem Mann. Außerdem fehlt noch eine Mietbescheinigung über Ihre neue Wohnung. Ohne die können wir den Antrag nicht weiter bearbeiten. Die Formulare bekommen Sie bei uns unten beim Empfang. Kommen Sie doch bitte zu unseren Sprechzeiten und bringen Sie die Unterlagen mit. Vielen Dank und auf Wiederhören!',
  },
  {
    id: 'h3',
    question: 'How can you travel to Lübeck by train today? (Wie können Sie heute nach Lübeck fahren?)',
    options: ['With the train at 20:05', 'Not at all', 'Travel to Bad Oldesloe and change trains'],
    correctAnswer: 'Travel to Bad Oldesloe and change trains',
    difficulty: 'easy',
    topic: 'listening',
    transcriptDE:
      'Meine Damen und Herren am Gleis 5. Bitte beachten Sie: Wegen dringender Bauarbeiten fährt der Regional Express 777 von Hamburg nach Lübeck, Abfahrt 20 Uhr 05, heute nicht. Ihre nächste Reisemöglichkeit nach Lübeck: Regional-Express bis Bad Oldesloe, Abfahrt 20 Uhr 13 von Gleis 18. In Bad Oldesloe besteht Anschluss nach Lübeck. Wir bitten um Entschuldigung.',
  },
  {
    id: 'h4',
    question: 'You need an urgent appointment. What should you do? (Sie brauchen schnell einen Termin.)',
    options: ['Call another doctor', 'Wait until April 15th', 'Call again today'],
    correctAnswer: 'Call another doctor',
    difficulty: 'easy',
    topic: 'listening',
    transcriptDE:
      'Guten Tag, dies ist der automatische Anrufbeantworter der Praxis Dr. Antonia Renk, Fachärztin für Sportmedizin und Chirotherapie. Die Praxis ist wegen Urlaub bis zum 15. 4. geschlossen. In dringenden Fällen wenden Sie sich bitte an unsere Vertretung, Dr. Paul, Rosengasse 4, Telefon 57 94 02. Vielen Dank und auf Wiederhören.',
  },
  {
    id: 'h5',
    question: 'What type of broadcast are you listening to? (Was hören Sie?)',
    options: ['The weather report', 'The news', 'A traffic announcement'],
    correctAnswer: 'The news',
    difficulty: 'easy',
    topic: 'listening',
    transcriptDE:
      '11 Uhr. Das Neueste vom Tage mit Martin Peters. Die Übersicht: Berlin: Afghanischer Staatspräsident zu Besuch im Kanzleramt. Wien: Schneechaos. Immer noch Zehntausende ohne Strom. Neapel: Italienische Polizei nimmt weltweit gesuchten Mafiaboss fest. Berlin: Filmfestspiele eröffnet. Und nun die Meldungen im Einzelnen.',
  },
  {
    id: 'h6',
    question: 'How will the weather be in northern Germany? (Wie wird das Wetter in Norddeutschland?)',
    options: ['The sun is shining', 'There will be rain', 'It will be warm'],
    correctAnswer: 'There will be rain',
    difficulty: 'easy',
    topic: 'listening',
    transcriptDE:
      'Und jetzt folgt das Wetter. Am Samstag kommt es im Norden Deutschlands wiederholt zu Regenfällen. Im Süden beginnt der Tag noch freundlich, bevor sich auch dort immer mehr Wolken vor die Sonne schieben. Regen fällt im Süden jedoch zunächst nur selten. Mit Höchstwerten von 7 bis 12 Grad ist es für die Jahreszeit zu kühl.',
  },
  {
    id: 'h7',
    question: 'Where are pedestrians walking on the highway? (Wo laufen Leute auf der Straße?)',
    options: ['On the A6', 'On the A8', 'On the A92'],
    correctAnswer: 'On the A92',
    difficulty: 'easy',
    topic: 'listening',
    transcriptDE:
      'Und jetzt die Verkehrsnachrichten mit Frank Taubner. Vorsicht auf der A6 Nürnberg Richtung Heilbronn: In Höhe Lichtenau befinden sich Reifenteile auf der Fahrbahn. A8 München Richtung Stuttgart: zwischen Merklingen und Mühlhausen 5 km Stau. Vorsicht auf der A92 München Richtung Deggendorf: Nach einem Unfall laufen Personen auf der Fahrbahn.',
  },
  {
    id: 'h8',
    question: 'How do you claim two free tickets? (Wie bekommt man zwei Gratiskarten?)',
    options: ['Write a letter by May 28th', 'Check the website', 'Call a phone number'],
    correctAnswer: 'Call a phone number',
    difficulty: 'easy',
    topic: 'listening',
    transcriptDE:
      "Der Ticket-Countdown für das Afrika-Afrika-Festival vom 28. bis 30. Mai in Würzburg läuft! Radio Ethno hat für seine Hörer zwei Gratiskarten für die Show! Nähere Informationen zum Programm gibt's unter www.afrikafestival.de. Exklusiv für seine Hörer verlost Radio Ethno zwei Eintrittskarten! Wählen Sie jetzt die 0180 33 77 22 und gewinnen Sie mit ein bisschen Glück zwei Tickets für das Afrika-Festival.",
  },
  {
    id: 'h9',
    question: 'What instruction is given in the announcement? (Was sollen Sie tun?)',
    options: [
      'Go outside',
      'Close windows and doors and stay inside',
      'Close windows and doors and leave the house',
    ],
    correctAnswer: 'Close windows and doors and stay inside',
    difficulty: 'easy',
    topic: 'listening',
    transcriptDE:
      'Wir unterbrechen das Programm für eine Sturmwarnung! In den nächsten Stunden kann es in ganz Schleswig-Holstein und an der gesamten Nordseeküste zu schweren Orkanböen der Stärke 11 bis 12 aus Südwest kommen. Es wird geraten, Fenster und Türen geschlossen zu halten und das Haus möglichst nicht zu verlassen.',
  },

  // --- MEDIUM (Hören Teil 3) ---
  {
    id: 'h10',
    question: 'Conversation 1: Ms. Hansen and the man are colleagues. (Frau Hansen und der Mann sind Kollegen.)',
    options: ['True (Richtig)', 'False (Falsch)'],
    correctAnswer: 'False (Falsch)',
    difficulty: 'medium',
    topic: 'listening',
    transcriptDE:
      "Hallo Frau Hansen, lange nicht gesehen! Wie geht's denn so? Ach, nicht so gut! Ich habe immer diese Kopfschmerzen. Ach, das tut mir aber leid. Hm, gut, dass wir gerade darüber sprechen. Ich hab da eine ganz große Bitte. Ja? Gestern Abend da war die Musik wieder so laut. Tatsächlich? Da war ich gar nicht zu Hause. Ja, dann muss es Ihr Sohn gewesen sein. Es waren auch ein paar Freunde dabei. Ach so, ja, das kann sein. Wissen Sie, wenn ich diese Kopfschmerzen habe, ich wollte Sie bitten. Das ist doch vollkommen klar. Ich spreche gleich mal mit Christoph.",
  },
  {
    id: 'h11',
    question: 'Conversation 1: What does Ms. Hansen ask for? (Worum bittet Frau Hansen?)',
    options: ['To turn down the music', 'To fetch painkillers', 'To send guests away'],
    correctAnswer: 'To turn down the music',
    difficulty: 'medium',
    topic: 'listening',
    transcriptDE:
      "Hallo Frau Hansen, lange nicht gesehen! Wie geht's denn so? Ach, nicht so gut! Ich habe immer diese Kopfschmerzen. Ach, das tut mir aber leid. Hm, gut, dass wir gerade darüber sprechen. Ich hab da eine ganz große Bitte. Ja? Gestern Abend da war die Musik wieder so laut. Tatsächlich? Da war ich gar nicht zu Hause. Ja, dann muss es Ihr Sohn gewesen sein. Es waren auch ein paar Freunde dabei. Ach so, ja, das kann sein. Wissen Sie, wenn ich diese Kopfschmerzen habe, ich wollte Sie bitten. Das ist doch vollkommen klar. Ich spreche gleich mal mit Christoph.",
  },
  {
    id: 'h12',
    question: 'Conversation 2: Markus and Tina want to get married. (Markus und Tina wollen heiraten.)',
    options: ['True (Richtig)', 'False (Falsch)'],
    correctAnswer: 'False (Falsch)',
    difficulty: 'medium',
    topic: 'listening',
    transcriptDE:
      "Wagner? Hallo Tina, hier ist Markus. Hi Markus, wie geht's dir? Ach, ganz gut. Du Tina, ich ruf an wegen der Hochzeit von Monika und Klaus. Hast du eine Idee, was wir den beiden schenken könnten? Das ist ganz einfach. Die haben doch einen Hochzeitstisch im Kaufhof. Hochzeitstisch? Was ist denn das? Ja, also das Hochzeitspaar hat sich schon alles, was sie sich wünschen, ausgesucht. Das liegt auf einem Tisch in der Geschenkabteilung im Kaufhof. Die Hochzeitsgäste gehen vorher dahin und kaufen eins von den Sachen auf dem Tisch. Und dann kannst du das gleich sehr schön als Geschenk einpacken lassen. Ach, so einfach ist das. Hast du denn schon etwas ausgesucht? Nein, noch nicht, ich wollte morgen mal hingehen.",
  },
  {
    id: 'h13',
    question: 'Conversation 2: What are Markus and Tina discussing? (Worüber sprechen Markus und Tina?)',
    options: ['A gift registry table', 'A table meant as a gift', 'Event furniture for a wedding'],
    correctAnswer: 'A gift registry table',
    difficulty: 'medium',
    topic: 'listening',
    transcriptDE:
      "Wagner? Hallo Tina, hier ist Markus. Hi Markus, wie geht's dir? Ach, ganz gut. Du Tina, ich ruf an wegen der Hochzeit von Monika und Klaus. Hast du eine Idee, was wir den beiden schenken könnten? Das ist ganz einfach. Die haben doch einen Hochzeitstisch im Kaufhof. Hochzeitstisch? Was ist denn das? Ja, also das Hochzeitspaar hat sich schon alles, was sie sich wünschen, ausgesucht. Das liegt auf einem Tisch in der Geschenkabteilung im Kaufhof. Die Hochzeitsgäste gehen vorher dahin und kaufen eins von den Sachen auf dem Tisch. Und dann kannst du das gleich sehr schön als Geschenk einpacken lassen. Ach, so einfach ist das. Hast du denn schon etwas ausgesucht? Nein, noch nicht, ich wollte morgen mal hingehen.",
  },
  {
    id: 'h14',
    question: 'Conversation 3: The man helps Ms. Bergmann with her job search. (Der Mann hilft bei der Arbeitssuche.)',
    options: ['True (Richtig)', 'False (Falsch)'],
    correctAnswer: 'True (Richtig)',
    difficulty: 'medium',
    topic: 'listening',
    transcriptDE:
      'Frau Bergmann, nehmen Sie doch bitte Platz. Sie suchen eine Stelle als Arzthelferin. Haben Sie denn in diesem Beruf schon gearbeitet? Ja, ich war vor der Familienpause 12 Jahre bei einem Zahnarzt angestellt. Ah ja, dann haben Sie in dem Beruf also viel Erfahrung. Ja, schon. Und suchen Sie eine Vollzeitstelle? Ja, ich möchte ganztags arbeiten. Meine Kinder sind ja jetzt groß genug. Mal sehen, da ist gestern eine Anfrage reingekommen. Ja, hier: eine Praxisgemeinschaft in der Innenstadt. 39 Stunden pro Woche, Bezahlung, Urlaub und so weiter nach Tarif. Aha, und wo ist diese Praxis? In der Dienerstraße, das ist, glaube ich, ziemlich im Zentrum.',
  },
  {
    id: 'h15',
    question: 'Conversation 3: What does the advisor ask Ms. Bergmann? (Was fragt er Frau Bergmann?)',
    options: ['If she has professional experience', 'If she can work part-time', 'Her previous salary'],
    correctAnswer: 'If she has professional experience',
    difficulty: 'medium',
    topic: 'listening',
    transcriptDE:
      'Frau Bergmann, nehmen Sie doch bitte Platz. Sie suchen eine Stelle als Arzthelferin. Haben Sie denn in diesem Beruf schon gearbeitet? Ja, ich war vor der Familienpause 12 Jahre bei einem Zahnarzt angestellt. Ah ja, dann haben Sie in dem Beruf also viel Erfahrung. Ja, schon. Und suchen Sie eine Vollzeitstelle? Ja, ich möchte ganztags arbeiten. Meine Kinder sind ja jetzt groß genug. Mal sehen, da ist gestern eine Anfrage reingekommen. Ja, hier: eine Praxisgemeinschaft in der Innenstadt. 39 Stunden pro Woche, Bezahlung, Urlaub und so weiter nach Tarif. Aha, und wo ist diese Praxis? In der Dienerstraße, das ist, glaube ich, ziemlich im Zentrum.',
  },
  {
    id: 'h16',
    question: 'Conversation 4: The teacher is speaking on the phone with Igor. (Die Lehrerin telefoniert mit Igor.)',
    options: ['True (Richtig)', 'False (Falsch)'],
    correctAnswer: 'False (Falsch)',
    difficulty: 'medium',
    topic: 'listening',
    transcriptDE:
      "Sidorov. Guten Tag, Herr Sidorov, Bergner am Apparat. Ich bin die Klassenlehrerin Ihres Sohnes, Igor. Ah, Frau Bergner, ja natürlich, guten Tag. Ich wollte Sie oder Ihre Frau bitten, mal zu mir in die Sprechstunde zu kommen. Igor kommt im Moment überhaupt nicht mehr mit. Besonders in Deutsch und in Heimat- und Sachkunde. Davon weiß ich ja gar nichts. Das dachte ich mir fast. Wenn das so weitergeht, muss Igor die Klasse wiederholen. Wirklich! Ja, was können wir denn da tun? Das besprechen wir am besten in meiner Sprechstunde. Am Donnerstag um 12 Uhr 15, geht das bei Ihnen? Bei mir nicht, aber meine Frau hat da sicher Zeit. Schön, sie soll bitte zum Lehrerzimmer kommen. Ja, ich sag's ihr. Dann, bis Donnerstag. Auf Wiederhören.",
  },
  {
    id: 'h17',
    question: 'Conversation 4: What does teacher Ms. Bergner want? (Was möchte Frau Bergner?)',
    options: [
      'Igor to repeat the school year',
      'Igor to come to school with his mother',
      'To speak with Igors parents at school',
    ],
    correctAnswer: 'To speak with Igors parents at school',
    difficulty: 'medium',
    topic: 'listening',
    transcriptDE:
      "Sidorov. Guten Tag, Herr Sidorov, Bergner am Apparat. Ich bin die Klassenlehrerin Ihres Sohnes, Igor. Ah, Frau Bergner, ja natürlich, guten Tag. Ich wollte Sie oder Ihre Frau bitten, mal zu mir in die Sprechstunde zu kommen. Igor kommt im Moment überhaupt nicht mehr mit. Besonders in Deutsch und in Heimat- und Sachkunde. Davon weiß ich ja gar nichts. Das dachte ich mir fast. Wenn das so weitergeht, muss Igor die Klasse wiederholen. Wirklich! Ja, was können wir denn da tun? Das besprechen wir am besten in meiner Sprechstunde. Am Donnerstag um 12 Uhr 15, geht das bei Ihnen? Bei mir nicht, aber meine Frau hat da sicher Zeit. Schön, sie soll bitte zum Lehrerzimmer kommen. Ja, ich sag's ihr. Dann, bis Donnerstag. Auf Wiederhören.",
  },

  // --- HARD (Hören Teil 4) ---
  {
    id: 'h18',
    question: 'Speaker 1 Opinion: Which statement reflects Speaker 1? (Aussage 1)',
    options: [
      'Children should spend a lot of time with adults',
      'It is important to dedicate exclusive time to children',
      'Children should stay home with mothers until school age',
      'Children should attend kindergarten at an early age',
      'Kindergarten is especially useful for foreign children',
      'Home childcare is a financial choice',
    ],
    correctAnswer: 'Children should attend kindergarten at an early age',
    difficulty: 'hard',
    topic: 'listening',
    transcriptDE:
      'Unsere Tochter war ab dem dritten Lebensjahr im Kindergarten. Ich finde, Kinder brauchen ab einem bestimmten Alter Kontakt zu anderen Kindern. Sonst sind sie zu viel mit Erwachsenen zusammen. Im Kindergarten bekommen die Kinder doch viel mehr geboten als zu Hause. Da gibt es gute Spielsachen, einen Garten mit Spielplatz und alles, was sie brauchen.',
  },
  {
    id: 'h19',
    question: 'Speaker 2 Opinion: Which statement reflects Speaker 2? (Aussage 2)',
    options: [
      'Children should spend a lot of time with adults',
      'It is important to dedicate exclusive time to children',
      'Children should stay home with mothers until school age',
      'Children should attend kindergarten at an early age',
      'Kindergarten is especially useful for foreign children',
      'Home childcare is a financial choice',
    ],
    correctAnswer: 'Home childcare is a financial choice',
    difficulty: 'hard',
    topic: 'listening',
    transcriptDE:
      'Bei mir war es so, dass ich sehr gerne zu Hause mit meinen Söhnen geblieben wäre, aber leider verdient mein Mann nicht genug. Heute ist alles so teuer. Da unsere Eltern nicht in der Nähe wohnen, konnten sie nicht auf die Kinder aufpassen, also mussten wir Daniel und Stephan in den Kindergarten geben. Sie waren den ganzen Tag dort, und ich habe gearbeitet. Aber es war gar nicht so leicht, einen Ganztagsplatz zu bekommen.',
  },
  {
    id: 'h20',
    question: 'Speaker 3 Opinion: Which statement reflects Speaker 3? (Aussage 3)',
    options: [
      'Children should spend a lot of time with adults',
      'It is important to dedicate exclusive time to children',
      'Children should stay home with mothers until school age',
      'Children should attend kindergarten at an early age',
      'Kindergarten is especially useful for foreign children',
      'Home childcare is a financial choice',
    ],
    correctAnswer: 'Kindergarten is especially useful for foreign children',
    difficulty: 'hard',
    topic: 'listening',
    transcriptDE:
      'Wir kommen aus der Türkei. Mein Sohn ist fünf und meine Tochter drei. Für uns ist es sehr wichtig, dass beide in den Kindergarten gehen, allein schon wegen der Sprache. Wenn sie später in die Schule kommen, sollen sie deswegen keine Schwierigkeiten haben. Mein Mann und ich wollen, dass unsere Kinder sich in beiden Kulturen wohl fühlen. Das können sie nur lernen, wenn sie von klein auf auch deutsche Freunde finden.',
  },

  // ==================== LESEN (READING & LANGUAGE) ====================
  // --- EASY (Lesen Teil 1 - Web Services) ---
  {
    id: 'l1',
    question: 'You want to buy a used car ("gebrauchtes Auto"). Which website directory section fits?',
    context: readingContexts.catalogue,
    options: ['Audio', 'Reise (Travel)', 'Andere Seite (Other page)'],
    correctAnswer: 'Andere Seite (Other page)',
    difficulty: 'easy',
    topic: 'reading',
  },
  {
    id: 'l2',
    question: 'An acquaintance likes audiobooks ("Geschichten hören"). Where do you find a gift?',
    context: readingContexts.catalogue,
    options: ['Filme & DVDs', 'Bücher (Books)', 'Andere Seite (Other page)'],
    correctAnswer: 'Bücher (Books)',
    difficulty: 'easy',
    topic: 'reading',
  },
  {
    id: 'l3',
    question: 'You are moving in two weeks and need moving boxes ("Kartons"). Where should you search?',
    context: readingContexts.catalogue,
    options: ['Möbel & Wohnen', 'Heimwerker (DIY/Hardware)', 'Andere Seite (Other page)'],
    correctAnswer: 'Heimwerker (DIY/Hardware)',
    difficulty: 'easy',
    topic: 'reading',
  },
  {
    id: 'l4',
    question: 'You need a coffee machine ("Kaffeemaschine") for your workplace. Which category fits?',
    context: readingContexts.catalogue,
    options: ['Feinschmecker (Gourmet)', 'Heimwerker', 'Andere Seite (Other page)'],
    correctAnswer: 'Andere Seite (Other page)',
    difficulty: 'easy',
    topic: 'reading',
  },
  {
    id: 'l5',
    question: 'You work evenings at home and need a desk lamp ("Schreibtischlampe"). Where do you look?',
    context: readingContexts.catalogue,
    options: ['Büro (Office)', 'Möbel & Wohnen (Furniture & Living)', 'Andere Seite (Other page)'],
    correctAnswer: 'Möbel & Wohnen (Furniture & Living)',
    difficulty: 'easy',
    topic: 'reading',
  },

  // --- MEDIUM (Lesen Teil 2 & 3 - Job Matching & Text Notices) ---
  {
    id: 'l6',
    question: 'Ms. Seifert is a hairdresser seeking hourly work in Berlin. Which classified ad fits?',
    context: readingContexts.jobAds,
    options: [
      'Ad A (Hotel Sonnenhof)',
      'Ad C (Haarstudio Krause - Berlin)',
      'Ad D (Haarscharf - Großostheim)',
      'Ad X (No matching advertisement)',
    ],
    correctAnswer: 'Ad C (Haarstudio Krause - Berlin)',
    difficulty: 'medium',
    topic: 'reading',
  },
  {
    id: 'l7',
    question: 'Ms. Richter seeks a cook apprenticeship starting in September. Which classified ad fits?',
    context: readingContexts.jobAds,
    options: [
      'Ad A (Hotel Sonnenhof)',
      'Ad B (Restaurant Düsseldorfer Medienhafen)',
      'Ad E (Ferien und Arbeit)',
      'Ad X (No matching advertisement)',
    ],
    correctAnswer: 'Ad A (Hotel Sonnenhof)',
    difficulty: 'medium',
    topic: 'reading',
  },
  {
    id: 'l8',
    question: 'Mr. Seibold seeks a job as a painter and paperhanger. Which classified ad fits?',
    context: readingContexts.jobAds,
    options: [
      'Ad F (Kfz-Servicetechniker)',
      'Ad G (Autoshow Maler AG)',
      'Ad H (Umzugsunternehmen)',
      'Ad X (No matching advertisement)',
    ],
    correctAnswer: 'Ad X (No matching advertisement)',
    difficulty: 'medium',
    topic: 'reading',
  },
  {
    id: 'l9',
    question: 'Mr. Kindler seeks work in an auto repair shop and wants to train apprentices. Which ad fits?',
    context: readingContexts.jobAds,
    options: [
      'Ad F (Kfz-Servicetechniker)',
      'Ad G (Autoshow Maler AG)',
      'Ad H (Umzugsunternehmen)',
      'Ad X (No matching advertisement)',
    ],
    correctAnswer: 'Ad F (Kfz-Servicetechniker)',
    difficulty: 'medium',
    topic: 'reading',
  },
  {
    id: 'l10',
    question: 'Ms. Kerschel wants to buy a car and needs extra summer income. Which ad fits?',
    context: readingContexts.jobAds,
    options: [
      'Ad E (Ferien und Arbeit)',
      'Ad F (Kfz-Servicetechniker)',
      'Ad G (Autoshow Maler AG)',
      'Ad X (No matching advertisement)',
    ],
    correctAnswer: 'Ad E (Ferien und Arbeit)',
    difficulty: 'medium',
    topic: 'reading',
  },
  {
    id: 'l11',
    question: 'Notice "Hilfe für Zuwanderer": Hesse is spending €500,000 on integration helpers.',
    context: readingContexts.integrationNotice,
    options: ['True (Richtig)', 'False (Falsch)'],
    correctAnswer: 'True (Richtig)',
    difficulty: 'medium',
    topic: 'reading',
  },
  {
    id: 'l12',
    question: 'Notice "Hilfe für Zuwanderer": The ministry intends to:',
    context: readingContexts.integrationNotice,
    options: [
      'Hire 800 additional helpers',
      'Make integration helper work more effective',
      'Increase helper salaries',
    ],
    correctAnswer: 'Make integration helper work more effective',
    difficulty: 'medium',
    topic: 'reading',
  },
  {
    id: 'l13',
    question: 'Notice "Kindergarten Villa Kunterbunt": Parents are required to clean the daycare.',
    context: readingContexts.kindergartenNotice,
    options: ['True (Richtig)', 'False (Falsch)'],
    correctAnswer: 'False (Falsch)',
    difficulty: 'medium',
    topic: 'reading',
  },
  {
    id: 'l14',
    question: 'Notice "Kindergarten Villa Kunterbunt": Staff requests that parents:',
    context: readingContexts.kindergartenNotice,
    options: [
      'Plan and organize the event',
      'Bring food items or make a financial contribution',
      'Sing songs or make paper flowers',
    ],
    correctAnswer: 'Bring food items or make a financial contribution',
    difficulty: 'medium',
    topic: 'reading',
  },
  {
    id: 'l15',
    question: 'Utility statement: Starting Feb 1st, the Müller family must pay higher total rent.',
    context: readingContexts.utilityNotice,
    options: ['True (Richtig)', 'False (Falsch)'],
    correctAnswer: 'False (Falsch)',
    difficulty: 'medium',
    topic: 'reading',
  },
  {
    id: 'l16',
    question: 'Utility statement: The Müller family...',
    context: readingContexts.utilityNotice,
    options: [
      'Does not have to pay utility costs starting February',
      'Overpaid their utility expenses',
      'Must pay €150 in utility fees next year',
    ],
    correctAnswer: 'Overpaid their utility expenses',
    difficulty: 'medium',
    topic: 'reading',
  },

  // --- HARD (Lesen Teil 4 & 5 - Medication Leaflet & Cloze Test) ---
  {
    id: 'l17',
    question: 'Medication Leaflet: You should not take Migränin tablets prior to meals.',
    context: readingContexts.medicationLeaflet,
    options: ['True (Richtig)', 'False (Falsch)'],
    correctAnswer: 'True (Richtig)',
    difficulty: 'hard',
    topic: 'reading',
  },
  {
    id: 'l18',
    question: 'Medication Leaflet: Driving a car is strictly prohibited after taking Migränin.',
    context: readingContexts.medicationLeaflet,
    options: ['True (Richtig)', 'False (Falsch)'],
    correctAnswer: 'False (Falsch)',
    difficulty: 'hard',
    topic: 'reading',
  },
  {
    id: 'l19',
    question: 'Medication Leaflet: This medicine is banned during the entire pregnancy.',
    context: readingContexts.medicationLeaflet,
    options: ['True (Richtig)', 'False (Falsch)'],
    correctAnswer: 'False (Falsch)',
    difficulty: 'hard',
    topic: 'reading',
  },
  {
    id: 'l20',
    question: '"Sehr ___ Damen und Herren," (Select correct formal salutation adjective)',
    context: readingContexts.cancellationLetter,
    options: ['geehrte', 'geehrten', 'viel geehrte'],
    correctAnswer: 'geehrten',
    difficulty: 'hard',
    topic: 'grammar',
  },
  {
    id: 'l21',
    question: '"...die zwei Wochen Probelesen enden für ___ am 17.5." (Select pronoun for "für")',
    context: readingContexts.cancellationLetter,
    options: ['mein', 'mich', 'mir'],
    correctAnswer: 'mich',
    difficulty: 'hard',
    topic: 'grammar',
  },
  {
    id: 'l22',
    question: '"Hiermit ___ ich mein Probeabonnement kündigen." (Select modal verb)',
    context: readingContexts.cancellationLetter,
    options: ['kann', 'möchte', 'soll'],
    correctAnswer: 'möchte',
    difficulty: 'hard',
    topic: 'grammar',
  },
  {
    id: 'l23',
    question: '"Leider ___ ich feststellen, dass ich nicht genug Zeit habe." (Select modal verb past)',
    context: readingContexts.cancellationLetter,
    options: ['konnte', 'musste', 'sollte'],
    correctAnswer: 'musste',
    difficulty: 'hard',
    topic: 'grammar',
  },
  {
    id: 'l24',
    question: '"___ möchte ich die Zeitung nicht weiter abonnieren." (Select connective item)',
    context: readingContexts.cancellationLetter,
    options: ['Denn', 'Deshalb', 'Weil'],
    correctAnswer: 'Deshalb',
    difficulty: 'hard',
    topic: 'grammar',
  },
  {
    id: 'l25',
    question: '"Mit ___ Grüßen, Norbert Schultze" (Select complimentary closing word)',
    context: readingContexts.cancellationLetter,
    options: ['freundlichen', 'lieben', 'vielen'],
    correctAnswer: 'freundlichen',
    difficulty: 'hard',
    topic: 'vocabulary',
  },

  // ==================== SCHREIBEN (WRITING) ====================
  {
    id: 'w1',
    question:
      'Write a short message to your doctor: you cannot come to today\'s appointment and want a new appointment.',
    options: [
      'Sehr geehrte Frau Doktor, leider kann ich heute nicht kommen. Können wir einen neuen Termin vereinbaren?',
      'Hallo Doktor, Termin schlecht. Machen neu.',
      'Ich komme nicht. Sagen Sie mir irgendwann Bescheid.',
    ],
    correctAnswer:
      'Sehr geehrte Frau Doktor, leider kann ich heute nicht kommen. Können wir einen neuen Termin vereinbaren?',
    difficulty: 'easy',
    topic: 'writing',
  },
  {
    id: 'w2',
    question: 'Write the opening of a formal email to your landlord.',
    options: ['Sehr geehrte Damen und Herren,', 'Hallo mein Vermieter,', 'Hey, ich brauche etwas.'],
    correctAnswer: 'Sehr geehrte Damen und Herren,',
    difficulty: 'easy',
    topic: 'writing',
  },
  {
    id: 'w3',
    question: 'Write a polite sentence asking your employer for one day off on Friday.',
    options: [
      'Ich möchte am Freitag einen Urlaubstag nehmen.',
      'Ich will Freitag frei sein, okay?',
      'Am Freitag ich Urlaub nehmen möchte.',
    ],
    correctAnswer: 'Ich möchte am Freitag einen Urlaubstag nehmen.',
    difficulty: 'easy',
    topic: 'writing',
  },
  {
    id: 'w4',
    question: 'Write a polite request for information about a German course.',
    options: [
      'Könnten Sie mir bitte Informationen zum Deutschkurs schicken?',
      'Schicken Sie Kursinfo sofort.',
      'Ich will wissen Kurs.',
    ],
    correctAnswer: 'Könnten Sie mir bitte Informationen zum Deutschkurs schicken?',
    difficulty: 'easy',
    topic: 'writing',
  },
  {
    id: 'w5',
    question: 'Write a suitable formal closing for a letter.',
    options: ['Mit freundlichen Grüßen', 'Tschüss, bis später', 'Dein Freund'],
    correctAnswer: 'Mit freundlichen Grüßen',
    difficulty: 'easy',
    topic: 'writing',
  },
  {
    id: 'w6',
    question: 'Write a complaint: your delivery arrived damaged and you want a replacement.',
    options: [
      'Die Lieferung ist beschädigt angekommen. Ich bitte um Ersatz.',
      'Das Paket war irgendwie nicht gut.',
      'Produkt kaputt, machen Sie schnell.',
    ],
    correctAnswer: 'Die Lieferung ist beschädigt angekommen. Ich bitte um Ersatz.',
    difficulty: 'medium',
    topic: 'writing',
  },
  {
    id: 'w7',
    question: 'Write a sentence explaining that you are late because your train is delayed.',
    options: [
      'Ich komme später, weil mein Zug Verspätung hat.',
      'Ich komme später, weil hat mein Zug Verspätung.',
      'Ich später komme, mein Zug Verspätung.',
    ],
    correctAnswer: 'Ich komme später, weil mein Zug Verspätung hat.',
    difficulty: 'medium',
    topic: 'writing',
  },
  {
    id: 'w8',
    question: "Write a clear request asking a school when the parents' evening takes place.",
    options: [
      'Bitte teilen Sie mir mit, wann der Elternabend stattfindet.',
      'Sagen Elternabend wann.',
      'Wann Elternabend? Ich brauche Antwort.',
    ],
    correctAnswer: 'Bitte teilen Sie mir mit, wann der Elternabend stattfindet.',
    difficulty: 'medium',
    topic: 'writing',
  },
  {
    id: 'w9',
    question: 'Write a formal sentence cancelling a reservation.',
    options: [
      'Hiermit möchte ich meine Reservierung stornieren.',
      'Hiermit ich meine Reservierung stornieren möchte.',
      'Reservierung weg, bitte.',
    ],
    correctAnswer: 'Hiermit möchte ich meine Reservierung stornieren.',
    difficulty: 'hard',
    topic: 'writing',
  },
  {
    id: 'w10',
    question: 'Write a polite final request asking for a quick reply in a formal email.',
    options: [
      'Für eine schnelle Antwort wäre ich Ihnen sehr dankbar.',
      'Antworten Sie schnell, ich habe keine Zeit.',
      'Ich warte jetzt auf Ihre Antwort, klar?',
    ],
    correctAnswer: 'Für eine schnelle Antwort wäre ich Ihnen sehr dankbar.',
    difficulty: 'hard',
    topic: 'writing',
  },
];