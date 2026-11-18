// ==========================================
// GAME-MODULES.JS - Alle Lernspiele & Storys
// ==========================================
var ALL_GAME_MODULES = {
  
  // Thema 1: Das neue verzweigte Story-Spiel ("The Cultural Guide")
  culture: {
    t: 'The Cultural Guide',
    s: 'Interaktive Story: Die internationale Krisen-Verhandlung',
    ic: 'person',
    col: 'var(--brand-strong)',
    isStory: true, // Markierung für das Verzweigungs-Spiel
    scenes: {
      start: {
        title: 'Akt 1: Das explosive Kick-off',
        q: 'Du leitest ein neues Projekt-Team mit Kollegen aus Zürich, Madrid und Warschau. Im ersten Videocall herrscht eisiges Schweigen. Ein polnischer Kollege schreibt im Chat: „Ich sehe keinen Sinn in diesem Treffen.“ Wie reagierst du?',
        o: [
          { text: '„Alle mal herhören! Wir haben einen engen Zeitplan, reißen wir uns zusammen.“', next: 'fail1' },
          { text: 'Du ignorierst den Chat, hältst starr deine Standard-Präsentation durch.', next: 'fail2' },
          { text: 'Du greifst den Chat offen auf, machst keine Vorwürfe und fragst nach Erwartungen und Sorgen.', next: 'act2' }
        ]
      },
      fail1: {
        title: 'Der Holzhammer-Effekt',
        q: 'Dein autoritärer Auftritt sorgt dafür, dass sich alle noch weiter zurückziehen. Wie korrigierst du den Kurs?',
        o: [
          { text: 'Du gibst auf und sagst das Projekt ab.', next: 'end_bad' },
          { text: 'Du entschuldigst dich für den Druck und bietest 1-on-1s an.', next: 'act2' }
        ]
      },
      fail2: {
        title: 'Die PowerPoint-Wand',
        q: 'Niemand hat ein Wort gesagt. Wie rettest du die Lage?',
        o: [
          { text: 'Du beendest die Folien, trennst Annahmen von Fakten und fragst nach dem Kernproblem.', next: 'act2' }
        ]
      },
      act2: {
        title: 'Akt 2: Die „Third Culture“ aufbauen',
        q: 'Nach Fred Casmirs Konzept der „Third Culture“: Wie legt ihr gemeinsame Kommunikationsregeln fest?',
        o: [
          { text: 'Die Zentrale in Zürich bestimmt die Richtlinien für alle.', next: 'end_bad' },
          { text: 'Jeder macht weiter wie bisher, man arrangiert sich.', next: 'end_bad' },
          { text: 'Ihr sammelt offen Präferenzen und baut ad hoc teamübergreifende Spielregeln.', next: 'end_win' }
        ]
      },
      end_bad: {
        title: 'Game Over: Kulturelles Missverständnis',
        q: 'Das Team ist auseinandergefallen.\n\n💡 Theorie-Check: Nach Casmir scheitern Teams, wenn man von der eigenen Kultur auf andere schließt, statt gemeinsame Ziele zu suchen.',
        o: [], end: true
      },
      end_win: {
        title: '🎉 Mission Erfolgreich: Third Culture etabliert!',
        q: 'Glückwunsch! Durch deinen Perspektivwechsel blüht das Team auf.\n\n💡 Theorie-Check: Fred Casmir zeigt, dass ad-hoc „Third Cultures“ die Basis für produktive multinationale Teams sind!',
        o: [], end: true
      }
    }
  },

  // Die bestehenden klassischen Quiz-Spiele bleiben hier erhalten:
  fakt: {
    t: 'Fakt oder Annahme', 
    s: 'Was ist belegt, was nur vermutet? Training fürs kritische Denken.', 
    ic: 'info', 
    col: 'var(--brand-strong)', 
    items: [
      {q:'«Unsere Kunden wollen vor allem schnellere Zahlungen.»', o:['Fakt', 'Annahme'], a:1, e:'Ohne Gespräche mit Kunden ist das eine Vermutung.'},
      {q:'«In drei von fünf Interviews wurde Betrug als Hauptsorge genannt.»', o:['Fakt', 'Annahme'], a:0, e:'Das ist gezählt und lässt sich belegen.'}
    ]
  },
  quiz: {
    t: 'Börsen-Blitz', 
    s: 'Finanzmarkt-Basics in sechs Fragen', 
    ic: 'bolt', 
    col: 'var(--navy)', 
    items: [
      {q:'Was ist die Kernaufgabe einer Börse?', o:['Unternehmen Geld leihen','Aktienkurse festlegen','Käufer und Verkäufer zusammenbringen','Anleger beraten'], a:2, e:'Die Börse bietet den Marktplatz.'}
    ]
  }
};
