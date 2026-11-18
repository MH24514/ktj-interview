/* ==========================================================
   arena.js - Lern-Arena
   Wird von index.html geladen und meldet sich dort als Erweiterung an.
   Logik und Gestaltung der Arena stehen beide hier, die Spielinhalte in game-modules.js.
   Hier darf frei gearbeitet werden, ohne index.html anzufassen.
   ========================================================== */
window.KTJ_PLUGINS = window.KTJ_PLUGINS || [];
window.KTJ_PLUGINS.push(function(K){
'use strict';
// Werkzeuge aus index.html. S ist immer der aktuelle Stand der App.
/* ---------- Gestaltung der Arena (CSS) ---------- */
var ARENA_CSS = `
/* Lern-Arena */
.tabs{grid-template-columns:repeat(6,minmax(0,1fr));padding-inline:2px}.tabs button{font-size:9.5px}
.lvl{display:flex;align-items:center;gap:12px}.grow{flex:1;min-width:0}.tc{text-align:center}.jc{justify-content:center}
.gic{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex:none;color:#fff}
.xpbar{height:8px;border-radius:4px;background:var(--surface-2);overflow:hidden}.xpbar i{display:block;height:100%;background:var(--brand)}
.prog{display:flex;gap:4px}.prog i{flex:1;height:5px;border-radius:3px;background:var(--line)}.prog i.on{background:var(--brand)}
.opt{display:block;width:100%;text-align:left;margin-top:8px;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);font-weight:600}
button.opt:hover:not(:disabled){border-color:var(--muted)}.opt:disabled{cursor:default}
.opt.right{background:var(--ok-bg);border-color:var(--ok);color:var(--ok)}.opt.wrong{background:var(--warn-bg);border-color:var(--warn);color:var(--warn)}
.big{font:700 36px/1.1 var(--font-display);color:var(--ink)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.opt.sel{border-color:var(--navy-ink)}.opt:disabled:not(.right):not(.wrong):not(.sel){opacity:.55}
.slots{display:flex;gap:8px}.slots span{width:52px;height:56px;border:2px dashed var(--line);border-radius:10px;display:grid;place-items:center;font:700 26px var(--font-display);color:var(--ink)}
.digs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin-top:12px}.digs button{height:44px;border:1px solid var(--line);border-radius:8px;background:var(--surface);font-weight:700;color:var(--ink)}.digs button:disabled,.btn:disabled{opacity:.35;cursor:default}
.wbox{position:relative;height:430px;background:#cfe3f2;overflow:hidden}
.wph{position:absolute;inset:0;display:grid;place-items:center;color:#15191E;font-size:13px;padding:20px;text-align:center}
.wcv{width:100%;height:100%}.wgo{position:absolute;top:8px;right:8px;z-index:2}.wcv canvas{display:block;touch-action:none}
.wdlg{position:absolute;left:8px;right:8px;bottom:8px;max-height:calc(100% - 16px);overflow:auto;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px;box-shadow:0 8px 24px -10px var(--shadow)}
.whint{position:absolute;left:8px;right:8px;bottom:8px;background:var(--scrim);color:#fff;border-radius:10px;padding:8px 10px;font-size:12.5px;pointer-events:none}
.th summary{cursor:pointer}.th p{margin-top:6px}.whud{position:absolute;top:8px;left:8px;z-index:2;max-width:55%;background:var(--scrim);color:#fff;border-radius:8px;padding:4px 8px;font-size:11.5px;font-weight:700;pointer-events:none}
.xpop{display:inline-block;margin-top:10px;padding:4px 12px;border-radius:99px;background:var(--brand);color:#fff;font-weight:700;animation:pop .5s ease-out}
@keyframes pop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@media (prefers-reduced-motion:reduce){.xpop{animation:none}}
`;
var arenaStyle = document.createElement('style');
arenaStyle.textContent = ARENA_CSS;
document.head.appendChild(arenaStyle);

var S = K.S();
var esc = K.esc, ic = K.ic, pill = K.pill, top = K.top, sec = K.sec, row = K.row, lead = K.lead, who = K.who,
    find = K.find, toast = K.toast, feed = K.feed, idOf = K.idOf, render = K.render, VERSION = K.VERSION;

/* ---------- SIXplorer: Lern-Arena ---------- */
var LEVELS = ['Rookie','Explorer','Navigator','Pilot','Captain'], FA = ['Fakt','Annahme'];
var GAMES = ALL_GAME_MODULES;
var BK = [
  ['Tim','Retail Banking','Kap. 1: Was ist Organizational Behavior?','Evidenzbasiertes Management','Verhalten in Organisationen systematisch mit Daten statt nur nach Bauchgefühl untersuchen','OB untersucht, wie Einzelne, Gruppen und Strukturen Verhalten und Leistung in Organisationen beeinflussen. Intuition täuscht oft, darum ergänzt man sie durch Studien und Daten.','Tim will ein neues Arbeitszeitmodell einführen, weil er spürt, dass es alle motiviert.','Wie gehst du nach OB vor?',['Auf Tims Bauchgefühl vertrauen','Erst Studien und eigene Daten prüfen, dann in einem Piloten testen','Nichts messen und alle gleich behandeln'],1,'Systematisches Prüfen ergänzt die Intuition und senkt das Risiko teurer Fehlentscheide.'],
  ['Dana','HR','Kap. 2: Diversität in Organisationen','Stereotype und Diskriminierung','Pauschale Annahmen über Gruppen führen zu ungleicher Behandlung und müssen hinterfragt werden','Diversität umfasst sichtbare Merkmale wie Alter oder Geschlecht und tiefe Merkmale wie Werte. Stereotype sind vereinfachte Annahmen über Gruppen. Sie werden zu Diskriminierung, wenn sie Entscheidungen steuern.','Im Recruiting fällt auf, dass Bewerbende mit Lücke im Lebenslauf automatisch aussortiert werden.','Was tust du?',['Das Kriterium auf Stereotype prüfen und nach den Anforderungen der Stelle entscheiden','Nichts, das ist bewährt','Nur noch Bewerbende ohne Lücken einladen'],0,'Entscheide anhand von Fähigkeiten und Aufgabe. Pauschale Kriterien verstecken oft Stereotype.'],
  ['Ana','Support','Kap. 3: Einstellungen und Arbeitszufriedenheit','Reaktionen auf Unzufriedenheit','Kündigen, ansprechen, loyal abwarten oder vernachlässigen: vier Antworten auf Unzufriedenheit','Zufriedenheit und Engagement beeinflussen Leistung, Fehlzeiten und Kündigungen. Unzufriedene reagieren mit Exit (kündigen), Voice (ansprechen), Loyalty (abwarten) oder Neglect (nachlässig werden).','Seit der Umstrukturierung macht Ana nur noch Dienst nach Vorschrift und kommt öfter zu spät.','Welche Reaktion zeigt Ana, und was hilft?',['Voice: Sie redet viel und ist zufrieden','Neglect: Sie zieht sich zurück. Ein offenes Gespräch lädt zu Voice ein','Exit: Sie hat bereits gekündigt'],1,'Neglect ist passiv und schädlich. Zuhören und Probleme ansprechen verschiebt es Richtung Voice.'],
  ['Lea','Kundenservice','Kap. 4: Emotionen und Stimmungen','Emotionsarbeit','Gefühle zeigen, die die Rolle verlangt, entweder gespielt (Surface) oder tief erlebt (Deep)','Beim Surface Acting spielt man Gefühle nur, beim Deep Acting verändert man das eigene Empfinden. Dauerhaftes Surface Acting erschöpft. Emotionale Intelligenz hilft, Gefühle bei sich und anderen zu erkennen und zu steuern.','Lea lächelt am Telefon, obwohl sie innerlich genervt ist, weil die Rolle es verlangt.','Was beschreibt das, und was ist das Risiko?',['Deep Acting: gar kein Risiko','Emotionale Intelligenz: senkt Stress automatisch','Surface Acting: auf Dauer kann es erschöpfen'],2,'Gespielte Gefühle kosten Energie. Pausen, Austausch und ein Perspektivwechsel (Deep Acting) entlasten.'],
  ['Sven','Risk','Kap. 5: Persönlichkeit und Werte','Big Five','Fünf Persönlichkeitsdimensionen, von denen Gewissenhaftigkeit die Leistung am besten vorhersagt','Die Big Five sind Extraversion, Verträglichkeit, Gewissenhaftigkeit, emotionale Stabilität und Offenheit. Gewissenhaftigkeit hängt über viele Berufe hinweg am stärksten mit guter Leistung zusammen. Wichtig ist auch der Fit zu Job und Organisation.','Du besetzt eine Stelle, die viel Selbstorganisation und Genauigkeit verlangt.','Welches Merkmal gewichtest du besonders?',['Extraversion','Offenheit für Erfahrungen','Gewissenhaftigkeit'],2,'Gewissenhaftigkeit steht für Organisation, Zuverlässigkeit und Genauigkeit und passt hier am besten.'],
  ['Raj','Product','Kap. 6: Wahrnehmung und Entscheiden','Entscheidungsfehler','Typische Denkfehler wie Bestätigungs- und Überschätzungsfehler verzerren Entscheidungen','Wahrnehmung ist subjektiv, etwa durch Stereotype und Attributionsfehler. Entscheidungen verzerren Überschätzung, Bestätigungsfehler, Verfügbarkeitsfehler und Rückschaufehler. Gegenmittel: Annahmen prüfen und Gegenargumente suchen.','Nach der Entscheidung sucht Raj nur noch Argumente, die seine Idee stützen.','Welcher Denkfehler liegt vor?',['Rückschaufehler','Bestätigungsfehler','Verfügbarkeitsfehler'],1,'Beim Bestätigungsfehler beachtet man nur, was die eigene Sicht stützt. Suche gezielt nach Gegenbelegen.'],
  ['Eva','Marketing','Kap. 7: Motivationskonzepte','Zielsetzungstheorie','Konkrete, herausfordernde Ziele mit Feedback steigern die Leistung','Motivation erklärt Richtung, Intensität und Ausdauer von Anstrengung. Nach der Zielsetzungstheorie wirken konkrete, akzeptierte Ziele besser als «gib dein Bestes», besonders mit Feedback. Andere Theorien betonen Bedürfnisse, Fairness und Erwartungen.','Eva hat nur das Ziel «Gib dein Bestes» bekommen und arbeitet unruhig.','Wie formulierst du das Ziel besser?',['Bis Freitag 20 Anfragen bearbeiten, am Mittwoch besprechen wir den Zwischenstand','Dabei bleiben, sie schafft das schon','Das Ziel offen lassen, damit sie frei ist'],0,'Konkret, herausfordernd und mit Rückmeldung: Das ist, was die Zielsetzungstheorie als wirksam beschreibt.'],
  ['Ben','Operations','Kap. 8: Motivation in der Praxis','Job Characteristics Model','Fünf Kernmerkmale machen Arbeit motivierend: Vielfalt, Ganzheit, Bedeutung, Autonomie, Feedback','Das Modell nennt Anforderungsvielfalt, Ganzheitlichkeit, Bedeutsamkeit, Autonomie und Rückmeldung. Mehr davon führt zu sinnvoll erlebter Arbeit und höherer Motivation. Job Enrichment und Mitbestimmung setzen genau dort an.','Ben erledigt täglich nur einen Teilschritt und sieht nie, was daraus wird.','Wie gestaltest du die Stelle um?',['Mehr Kontrolle einführen','Ganze Aufgabenpakete mit Autonomie und Rückmeldung zur Wirkung geben','Das Tempo erhöhen'],1,'Ganzheit, Bedeutung und Feedback fehlen hier. Sie lassen sich durch Job Enrichment ergänzen.'],
  ['Mara','Platform','Kap. 9: Gruppenverhalten','Gruppenentwicklung','Forming, Storming, Norming, Performing, Adjourning: Gruppen durchlaufen typische Phasen','Gruppen entwickeln sich über Forming (Kennenlernen), Storming (Konflikte um Rollen), Norming (Zusammenhalt), Performing (Leistung) und Adjourning (Abschluss). Rollen und Normen steuern Verhalten, Gruppendruck kann zu Groupthink führen.','Ein neues Projektteam streitet in Woche eins über Rollen und Zuständigkeiten.','In welcher Phase ist das Team?',['Norming','Performing','Storming'],2,'Streit um Rollen und Führung ist typisch für Storming. Klare Rollen helfen, die Phase zu überwinden.'],
  ['Oli','Data','Kap. 10: Arbeitsteams','Team-Effektivität','Kontext, Zusammensetzung und Prozesse entscheiden, ob Teams erfolgreich sind','Teams haben gemeinsame Verantwortung und sich ergänzende Fähigkeiten. Wirksam sind sie mit passendem Kontext (Ressourcen, Führung), passender Zusammensetzung (Fähigkeiten, Grösse) und guten Prozessen (gemeinsamer Plan, Vertrauen). In zu grossen Teams entsteht soziales Faulenzen.','Dein Team hat 15 Personen, die Abstimmung ist schwach und manche tragen kaum bei.','Was tust du?',['In kleinere Teams mit klarer Verantwortung aufteilen','Einen weiteren Meetingtag einführen','Nichts, Teams regeln das selbst'],0,'Mit wachsender Grösse sinkt der Einzelbeitrag (soziales Faulenzen). Kleinere Teams stärken Verantwortung.'],
  ['Nora','Legal','Kap. 11: Kommunikation','Kommunikationsprozess','Sender kodiert, Empfänger dekodiert, und Feedback prüft, ob die Botschaft ankam','Kommunikation besteht aus Sender, Botschaft, Kanal, Empfänger und Feedback. Filtern, Emotionen oder Sprache verzerren Botschaften. Reiche Kanäle wie das persönliche Gespräch eignen sich für komplexe Themen.','Du erklärst Nora per Mail eine komplexe Aufgabe. Sie antwortet nur mit «ok».','Wie stellst du das Verständnis sicher?',['Nichts, ok heisst verstanden','Nora in eigenen Worten zusammenfassen lassen, am besten im kurzen Gespräch','Dieselbe Mail nochmal schicken'],1,'Feedback schliesst den Kreis der Kommunikation. Zusammenfassen zeigt, was wirklich angekommen ist.'],
  ['Pia','IT','Kap. 12: Führung','Transformationale Führung','Inspiriert durch Vision und individuelle Förderung über Eigeninteressen hinaus','Transaktionale Führung tauscht Leistung gegen Belohnung, transformationale motiviert durch Vision, Vorbild und individuelle Förderung. Situative Theorien betonen, dass der Stil zur Lage passen muss. Vertrauen ist die Grundlage.','Dein Team steht vor einem grossen Wandel und braucht Orientierung und Energie.','Welcher Ansatz passt am besten?',['Nur Belohnung für erledigte Aufgaben','Jede Aufgabe eng kontrollieren','Eine Vision vermitteln, Einzelne fördern und selbst Vorbild sein'],2,'Im Wandel braucht ein Team Sinn und Förderung. Genau das leistet transformationale Führung.'],
  ['Luca','Compliance','Kap. 13: Macht und Politik','Machtgrundlagen','Formale Macht (Zwang, Belohnung, Legitimation) und persönliche Macht (Expertise, Ausstrahlung)','Macht ist die Fähigkeit, das Verhalten anderer zu beeinflussen. Persönliche Macht durch Expertise und Ausstrahlung wirkt meist stärker als formale. Einfluss entsteht auch durch Taktiken wie rationale Argumente und Koalitionen.','Du führst ein Projekt mit Leuten aus anderen Abteilungen, ohne Weisungsbefugnis.','Worauf stützt du deinen Einfluss?',['Auf Expertise und Vertrauen, dazu klare Argumente','Auf Drohungen mit Konsequenzen','Auf eine Position, die du nicht hast'],0,'Ohne formale Macht tragen Expertise, Vertrauen und überzeugende Argumente.'],
  ['Yara','Sales','Kap. 14: Konflikt und Verhandlung','Integratives Verhandeln','Interessen klären und Win-win-Lösungen suchen, statt um einen festen Kuchen zu feilschen','Konflikte können Aufgaben, Beziehungen oder Prozesse betreffen. Aufgabenkonflikte können nützlich sein, Beziehungskonflikte meist nicht. Distributives Verhandeln teilt einen festen Kuchen, integratives sucht Lösungen für beide Seiten.','Zwei Abteilungen streiten um dasselbe Budget und fordern je den ganzen Betrag.','Was ist der integrative Weg?',['Beide fordern das Maximum und feilschen hart','Ein Teil gibt nach, damit Ruhe herrscht','Interessen klären und Lösungen suchen, bei denen beide etwas gewinnen'],2,'Hinter Forderungen stehen Interessen. Wer sie kennt, findet oft Lösungen jenseits des festen Kuchens.'],
  ['Finn','Strategy','Kap. 15: Organisationsstruktur','Mechanistisch und organisch','Starre, zentrale Strukturen für Stabilität, flexible, dezentrale für unsichere Umfelder','Struktur wird beschrieben durch Spezialisierung, Abteilungsbildung, Weisungskette, Kontrollspanne, Zentralisierung und Formalisierung. Mechanistische Strukturen sind streng und zentral, organische flexibel und dezentral. Die beste Form hängt vom Umfeld ab.','Dein Bereich arbeitet in einem schnell wechselnden Markt, doch jede Entscheidung braucht fünf Freigaben.','Wie passt du die Struktur an?',['Mehr Regeln und Freigaben einführen','Entscheidungen dezentralisieren und die Formalisierung senken','Die Spezialisierung weiter erhöhen'],1,'Unsichere Umfelder verlangen schnelle Entscheide: eher organisch, dezentral und weniger formalisiert.'],
  ['Sofia','People & Culture','Kap. 16: Organisationskultur','Organisationskultur','Gemeinsame Werte und Annahmen, die durch Auswahl, Vorbilder und Einarbeitung weiterleben','Kultur ist das gemeinsame Verständnis davon, was hier gilt. Sie wird durch Auswahl, das Vorbild der Führung und Sozialisation aufrechterhalten. Starke Kulturen stärken Zusammenhalt, können aber Vielfalt und Wandel bremsen.','Neue Mitarbeitende verletzen ungeschriebene Regeln im Team.','Was hilft am meisten?',['Werte und Normen vorleben und in der Einarbeitung erklären','Sie bei Verstössen bestrafen','Die Regeln ändern, ohne darüber zu sprechen'],0,'Kultur wird durch Vorbild und Sozialisation weitergegeben. Erkläre und lebe, was gilt.'],
  ['Nils','Transformation','Kap. 17: Wandel und Stressmanagement','Lewins Drei-Phasen-Modell','Auftauen, verändern, einfrieren: Wandel braucht Vorbereitung und Verankerung','Nach Lewin taut man den Status quo auf (Dringlichkeit schaffen), führt die Veränderung durch und verankert den neuen Zustand. Widerstand ist normal und sinkt durch Kommunikation und Beteiligung. Wandel erzeugt auch Stress, der Gegenmassnahmen braucht.','Du führst ein neues Tool ein. Das Team wehrt sich und fällt in alte Gewohnheiten zurück.','Wo hat es am ehesten gehakt?',['Beim Tool, es war einfach schlecht','Beim Auftauen und Verankern: Dringlichkeit und neue Routinen fehlten','Beim Team, es ist halt veränderungsresistent'],1,'Ohne Auftauen fehlt die Dringlichkeit, ohne Einfrieren bleiben neue Routinen nicht bestehen.']
];
var WM = [], TH = [];
BK.forEach(function(b, i){
  var a = i < 6 ? i / 6 * 6.2832 : (i - 6) / 11 * 6.2832 + .3, r = i < 6 ? 5 : 9.5;
  WM.push({n:b[0], ro:b[1], ico:b[2], sit:b[6], q:b[7], o:b[8], a:b[9], e:b[10], lead:'', th:'k' + i, x:Math.sin(a) * r, z:-8 + Math.cos(a) * r, col:[0xde3919, 0x002c5f, 0x1d4676, 0xa39c93][i % 4]});
  TH.push({id:'k' + i, t:b[3], d:b[4], txt:b[5]});
});
TH.forEach(function(c, i){ var o = [TH[(i + 1) % 17].d, TH[(i + 6) % 17].d], k = i % 3; o.splice(k, 0, c.d); c.rq = {q:'Was beschreibt «' + c.t + '»?', o:o, a:k}; });
GAMES.trainer = {t:'Theorie-Trainer', s:'Wiederhole die Karten aus allen 17 Kapiteln', ic:'lernen', col:'var(--brand-strong)', items:TH.map(function(c){ return {q:c.rq.q, o:c.rq.o, a:c.rq.a, e:c.txt}; })};
GAMES = Object.assign({sim:{kind:'world', t:'SIX Young Leaders Welt', s:'Lerne alle 17 OB-Kapitel in der Welt: erst Erklärung, dann Anwendung, später Wiederholung', ic:'person', col:'var(--navy)'}}, GAMES);
function newGame(id){ return {id:id, i:0, sel:null, ok:0, xp:0, fin:false, nx:0, err:0, m:null, hid:false, ph:'th', rsel:null, lv:0, wr:false, cb:0, last:0, ev:'Dein Auftrag: Hilf 17 Kolleginnen und Kollegen und baue dir ein Werkzeugset für den Führungsalltag auf. Jede Karte ist ein Werkzeug, das du sofort einsetzen kannst.', done:WM.map(function(){ return false; })}; }
function resMsg(G, g){
  if (G.kind === 'world') return 'Team aufgebaut: ' + WM.length + ' Personen. ' + (g.err ? g.err + (g.err === 1 ? ' Fehlversuch' : ' Fehlversuche') + ' unterwegs, aus denen du gelernt hast.' : 'Ohne Fehlversuch, stark!');
  return G.items ? g.ok + ' von ' + G.items.length + ' richtig' : (g.err ? g.err + (g.err === 1 ? ' Fehlversuch' : ' Fehlversuche') : 'Fehlerfrei!');
}
var W = {k:{f:0, r:0}, yaw:0, pitch:-.05, tg:null, run:false};
function worldInit(){
  var T = window.THREE, el, r, sc, i, a, hh, dl, fl, gr;
  if (W.el || !T) return;
  try { r = new T.WebGLRenderer({antialias:true}); } catch (x) { return; }
  el = document.createElement('div'); el.className = 'wcv';
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); el.appendChild(r.domElement);
  sc = new T.Scene(); sc.background = new T.Color(0xcfe3f2); sc.fog = new T.Fog(0xcfe3f2, 16, 50);
  sc.add(new T.HemisphereLight(0xffffff, 0x8a97a6, 1.05));
  dl = new T.DirectionalLight(0xffffff, .5); dl.position.set(6, 12, 8); sc.add(dl);
  fl = new T.Mesh(new T.PlaneGeometry(70, 70), new T.MeshLambertMaterial({color:0xe8e9eb})); fl.rotation.x = -Math.PI / 2; sc.add(fl);
  gr = new T.GridHelper(70, 35, 0xc3c8ce, 0xd6d9dd); gr.position.y = .01; sc.add(gr);
  function box(w, h, d, c, x, y, z){ var m = new T.Mesh(new T.BoxGeometry(w, h, d), new T.MeshLambertMaterial({color:c})); m.position.set(x, y, z); sc.add(m); }
  function lab(txt, bg, fg, x, y, z, w){ var cv = document.createElement('canvas'), cx = cv.getContext('2d'), sp; cv.width = 256; cv.height = 64; cx.fillStyle = bg; cx.fillRect(0, 0, 256, 64); cx.fillStyle = fg; cx.font = 'bold 22px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(txt, 128, 33); sp = new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv)})); sp.scale.set(w, w / 4, 1); sp.position.set(x, y, z); sc.add(sp); return sp; }
  box(2, 6, 2, 0xde3919, 0, 3, -8); lab('SIX', '#de3919', '#ffffff', 0, 6.7, -8, 3);
  for (i = 0; i < 16; i++){ a = i / 16 * Math.PI * 2; hh = 5 + (i * 7 % 6); box(4, hh, 4, i % 4 ? 0x1d4676 : 0x002c5f, Math.sin(a) * 24, hh / 2, -8 + Math.cos(a) * 24); }
  W.hit = []; W.mk = []; W.grp = [];
  WM.forEach(function(m, k){
    var pl = new T.Mesh(new T.CylinderGeometry(1.4, 1.4, .15, 24), new T.MeshLambertMaterial({color:m.col})), b = new T.Mesh(new T.CylinderGeometry(.35, .45, 1.3, 16), new T.MeshLambertMaterial({color:m.col})), h = new T.Mesh(new T.SphereGeometry(.28, 16, 12), new T.MeshLambertMaterial({color:0xf1c9a5})), d = new T.Mesh(new T.OctahedronGeometry(.22), new T.MeshLambertMaterial({color:0xde3919}));
    pl.position.set(m.x, .08, m.z); b.position.set(m.x, .8, m.z); h.position.set(m.x, 1.7, m.z); d.position.set(m.x, 2.7, m.z);
    b.userData.i = h.userData.i = d.userData.i = k; sc.add(pl, b, h, d); W.hit.push(b, h, d); W.mk.push(d);
    W.grp.push([pl, b, h, d, lab(m.n + ', ' + m.ro, '#ffffff', '#15191e', m.x, 2.25, m.z, 2.4)]);
  });
  W.cam = new T.PerspectiveCamera(68, 1, .1, 80); W.cam.rotation.order = 'YXZ'; W.cam.position.set(0, 1.6, 6);
  W.sc = sc; W.r = r; W.floor = fl; W.el = el;
  var d0 = null;
  el.addEventListener('pointerdown', function(e){ d0 = {x:e.clientX, y:e.clientY, yaw:W.yaw, pitch:W.pitch}; });
  el.addEventListener('pointermove', function(e){ if (!d0) return; W.yaw = d0.yaw + (e.clientX - d0.x) * .006; W.pitch = Math.max(-.5, Math.min(.5, d0.pitch + (e.clientY - d0.y) * .004)); });
  el.addEventListener('pointerup', function(e){ var mv; if (!d0) return; mv = Math.hypot(e.clientX - d0.x, e.clientY - d0.y); d0 = null; if (mv < 6 && S.g && S.g.m === null) worldTap(e); });
  el.addEventListener('pointercancel', function(){ d0 = null; });
  function kk(e, v){ var k = e.key; if (!W.el.isConnected || (S.g && S.g.m !== null)) return; if (k === 'ArrowUp' || k === 'w') W.k.f = v; else if (k === 'ArrowDown' || k === 's') W.k.f = -v; else if (k === 'ArrowLeft' || k === 'a') W.k.r = -v; else if (k === 'ArrowRight' || k === 'd') W.k.r = v; else return; e.preventDefault(); }
  document.addEventListener('keydown', function(e){ kk(e, 1); }); document.addEventListener('keyup', function(e){ kk(e, 0); });
}
function worldTap(e){
  var T = window.THREE, rc = W.r.domElement.getBoundingClientRect(), rq = new T.Raycaster(), h, m, i;
  rq.setFromCamera(new T.Vector2((e.clientX - rc.left) / rc.width * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1), W.cam);
  h = rq.intersectObjects(W.hit.filter(function(o){ return o.visible; }))[0];
  if (h){
    i = h.object.userData.i; m = WM[i];
    if (S.g.done[i]){ toast('Diese Station ist erledigt.'); return; }
    W.tg = null; W.yaw = Math.atan2(-(m.x - W.cam.position.x), -(m.z - W.cam.position.z)); W.pitch = 0;
    S.g.m = i; S.g.sel = null; S.g.hid = false; S.g.ph = 'th'; S.g.rsel = null; render(); return;
  }
  h = rq.intersectObject(W.floor)[0];
  if (h) W.tg = {x:h.point.x, z:h.point.z};
}
function worldTick(){
  var c = W.cam, g = S.g, t = Date.now() / 600, dx, dz, d;
  if (!W.el.isConnected){ W.run = false; return; }
  requestAnimationFrame(worldTick);
  W.yaw -= .03 * W.k.r;
  if (W.k.f){ c.position.x -= Math.sin(W.yaw) * .08 * W.k.f; c.position.z -= Math.cos(W.yaw) * .08 * W.k.f; W.tg = null; }
  if (W.tg){ dx = W.tg.x - c.position.x; dz = W.tg.z - c.position.z; d = Math.hypot(dx, dz); if (d < .1) W.tg = null; else { c.position.x += dx / d * .08; c.position.z += dz / d * .08; } }
  c.position.x = Math.max(-17, Math.min(17, c.position.x)); c.position.z = Math.max(-22, Math.min(17, c.position.z));
  c.rotation.set(W.pitch, W.yaw, 0);
  W.mk.forEach(function(m, i){ m.rotation.y = t; m.position.y = 2.7 + Math.sin(t + i) * .12; m.material.color.setHex(g && g.done && g.done[i] ? 0x1f7a4d : 0xde3919); m.scale.setScalar(g && i === g.lv && !g.done[i] ? 2 + Math.sin(t * 2) * .3 : 1); });
  W.grp.forEach(function(a, i){ a.forEach(function(o){ o.visible = !g || i <= (g.lv || 0); }); if (g && g.done && g.done[i]){ a[0].material.color.setHex(0x1f7a4d); a[1].position.y = .8 + Math.abs(Math.sin(t * 2 + i)) * .2; a[2].position.y = 1.7 + Math.abs(Math.sin(t * 2 + i)) * .2; } });
  W.r.render(W.sc, c);
}
function worldAttach(){
  var ph = document.getElementById('wph'), w, h;
  if (!ph) return;
  worldInit();
  if (!W.el){ ph.textContent = 'Die 3D-Welt konnte nicht geladen werden. Bitte lade die Seite neu oder öffne sie in einem anderen Browser.'; return; }
  if (W.el.parentNode !== ph){ ph.textContent = ''; ph.appendChild(W.el); w = ph.clientWidth || 360; h = ph.clientHeight || 430; W.r.setSize(w, h); W.cam.aspect = w / h; W.cam.updateProjectionMatrix(); }
  if (!W.run){ W.run = true; worldTick(); }
}
var PARTS = [[0,4,'Dich und andere verstehen'],[5,7,'Entscheiden und motivieren'],[8,10,'Gruppen und Teams'],[11,13,'Macht, Führung, Konflikte'],[14,16,'Organisation und Wandel']];
var CH = ['Treffer!','Sauber gelöst!','Das sass!','Starke Führung!'];
var NU = ['Du triffst bessere Entscheidungen, weil du Behauptungen prüfst, statt Meinungen zu glauben.','Du erkennst, wann Vorurteile Personalentscheide beeinflussen, und holst bessere Talente ins Team.','Du merkst früh, wenn jemand innerlich abschaltet, und steuerst gegen, bevor gekündigt wird.','Du verstehst, warum Kundenkontakt müde macht, und schützt dein Team vor Erschöpfung.','Du setzt Leute dort ein, wo ihre Stärken liegen, und führst jede Person passender.','Du erwischst typische Denkfehler bei dir und anderen und triffst robustere Entscheide.','Du formulierst Ziele, die wirklich motivieren, statt nur Druck aufzubauen.','Du gestaltest Stellen so, dass Arbeit sinnvoll wirkt und dein Team engagiert bleibt.','Du ordnest Streit in neuen Teams ein und führst gezielt zum nächsten Schritt.','Du baust Teams, die mehr leisten als die Summe ihrer Mitglieder.','Du stellst sicher, dass deine Botschaft ankommt, und sparst Missverständnisse und Nacharbeit.','Du wählst den Führungsstil, der zur Situation passt, und gewinnst Vertrauen und Energie.','Du bewegst Menschen auch ohne Chefrolle, durch Expertise, Vertrauen und gute Argumente.','Du löst Streit so, dass beide Seiten gewinnen und Beziehungen halten.','Du erkennst, wenn Strukturen Tempo bremsen, und schlägst passende Änderungen vor.','Du verstehst ungeschriebene Regeln, bringst Neue schneller an Bord und prägst Kultur bewusst.','Du führst Veränderungen so, dass sie bleiben, und gehst klug mit Widerstand und Stress um.'];
function zone(i){ for (var k = 0; k < PARTS.length; k++) if (i <= PARTS[k][1]) return 'Zone ' + (k + 1) + ': ' + PARTS[k][2]; return ''; }
function award(id, name){ S.lern.bd = S.lern.bd || {}; if (!S.lern.bd[id]){ S.lern.bd[id] = name; toast('Abzeichen: ' + name); } }
function recallCard(m){ var q = S.lern.seq || [], i; for (i = q.length - 1; i >= 0; i--) if (q[i] !== m.th) return find(TH, 'id', q[i]); return null; }
function worldView(G, g){
  var m = g.m === null ? null : WM[g.m], o, n = g.done.filter(Boolean).length, last = n === WM.length - 1, c, rc;
  if (!m) o = '<div class="whint">' + (g.ev ? '<b>' + esc(g.ev) + '</b><br>' : '') + '<b>Level ' + (g.lv + 1) + ' von ' + WM.length + ': Du betreust ' + (g.lv + 1) + (g.lv ? ' Personen' : ' Person') + '.</b> Nächste Person: ' + WM[g.lv].n + ' (' + WM[g.lv].ro + '). Ziehen zum Umschauen, tippen zum Gehen. Am PC: Pfeiltasten.</div>';
  else {
    c = find(TH, 'id', m.th); rc = recallCard(m);
    o = '<div class="wdlg">' + who(esc(m.n.charAt(0)), esc(m.n), esc(m.ro)) + '<p class="inline mt6">' + pill('info', m.ico) + (g.ph === 'tk' ? pill('neutral', 'Wende an: ' + c.t) : '') + '</p>';
    if (g.ph === 'th') o += '<p class="hint">Mission ' + (g.m + 1) + ' von ' + WM.length + '</p><p class="quote mt6">' + esc(m.sit) + '</p><div class="note mt10">' + ic('info') + '<span><b>Dein neues Werkzeug: ' + esc(c.t) + '</b><br>' + esc(c.txt) + '<br><b>Darum nützlich:</b> ' + esc(NU[g.m]) + '</span></div><button class="btn primary block mt14" data-a="g-thok">Werkzeug einpacken</button>';
    else if (g.ph === 'rc') o += '<p class="hint">Blitz-Wiederholung: ' + esc(rc.t) + '</p><p class="t mt6">' + esc(rc.rq.q) + '</p>'
      + rc.rq.o.map(function(x, k){ var cl = g.rsel === null ? '' : k === rc.rq.a ? ' right' : k === g.rsel ? ' wrong' : ''; return '<button class="opt' + cl + '" data-a="g-rpick" data-v="' + k + '"' + (g.rsel !== null ? ' disabled' : '') + '>' + esc(x) + '</button>'; }).join('')
      + (g.rsel !== null ? '<div class="note mt14">' + ic('info') + '<span><b>' + (g.rsel === rc.rq.a ? 'Richtig. ' : 'Nicht ganz. ') + '</b>' + esc(rc.txt) + '</span></div><button class="btn primary block mt14" data-a="g-rok">Weiter zur Aufgabe</button>' : '');
    else if (m.mem && !g.hid) o += '<p class="quote mt10">' + esc(m.sit) + '</p><p class="hint">Merke dir die Wünsche gut.</p><button class="btn primary block mt10" data-a="g-hide">Gemerkt</button>';
    else {
      o += (m.mem ? '' : '<p class="quote mt10">' + esc(m.sit) + '</p>') + '<p class="t mt10">' + esc(m.q) + '</p>'
        + m.o.map(function(x, k){ var cl = g.sel === null ? '' : k === m.a ? ' right' : k === g.sel ? ' wrong' : ''; return '<button class="opt' + cl + '" data-a="g-wpick" data-v="' + k + '"' + (g.sel !== null ? ' disabled' : '') + '>' + esc(x) + '</button>'; }).join('');
      if (g.sel !== null) o += (g.sel === m.a ? '<p class="xpop">+' + g.last + ' XP' + (g.cb > 1 ? ', Combo ×' + g.cb : '') + '</p><p class="quote mt6">«' + CH[g.ok % 4] + ' ' + esc(m.n) + ': Das hilft mir echt weiter!»</p>' : '<p class="quote mt10">«Hm, so richtig klickt das noch nicht», sagt ' + esc(m.n) + '.</p>') + '<div class="note mt10">' + ic('info') + '<span><b>' + (g.sel === m.a ? 'Richtig. ' : 'Fast. ') + '</b>' + esc(m.e) + '</span></div><button class="btn primary block mt14" data-a="g-wclose">' + (g.sel !== m.a ? 'Nochmal versuchen' : last ? 'Auswertung ansehen' : 'Weiter, dein Team wächst') + '</button>';
    }
    o += '</div>';
  }
  return '<div class="wbox"><div class="wph" id="wph"></div><div class="whud">' + g.xp + ' XP' + (g.cb > 1 ? ' · Combo ×' + g.cb : '') + ' · ' + zone(g.m === null ? g.lv : g.m) + '</div>' + (m ? '' : '<button class="btn primary wgo" data-a="g-goto">Zur nächsten Station</button>') + o + '</div>';
}
function gameDone(){ var g = S.g; if (g.fin) return; g.fin = true; S.lern.xp += g.xp; S.lern.done[g.id] = Math.max(S.lern.done[g.id] || 0, g.xp); feed('Lernspiel gespielt: ' + GAMES[g.id].t); toast('+' + g.xp + ' XP'); }
function scrArena(){
  var x = S.lern.xp, l = Math.min(Math.floor(x / 100), 4), p = l === 4 ? 100 : x % 100;
  var h = top('Lern-Arena', 'Lerne in kurzen Runden, wann du willst. Freiwillig und zum Wiederholen.');
  h += sec('', '<div class="panel in"><div class="lvl"><span class="gic" style="background:var(--navy)">' + ic('star') + '</span><div class="grow"><p class="t">Level ' + (l + 1) + ': ' + LEVELS[l] + '</p><p class="m">' + x + ' XP, ' + S.lern.streak + ' Tage in Folge</p><div class="xpbar mt10" role="img" aria-label="' + p + ' Prozent bis zum nächsten Level"><i style="width:' + p + '%"></i></div></div></div></div>');
  h += sec('Spiele', '<div class="panel rows">' + Object.keys(GAMES).map(function(k){ var g = GAMES[k], d = S.lern.done[k]; return row('spiel', k, k, g.t, g.s, d ? '<span class="blk mt6">' + pill('ok', 'Bestwert ' + d + ' XP', 'check') + '</span>' : '', '<span class="gic" style="background:' + g.col + '">' + ic(g.ic) + '</span>'); }).join('') + '</div>');
  h += sec('Abzeichen', '<div class="panel in">' + (Object.keys(S.lern.bd || {}).length ? Object.keys(S.lern.bd).map(function(k){ return pill('ok', S.lern.bd[k], 'check'); }).join(' ') : '<p class="m">Noch keine. Meistere Missionen, baue Combos auf und schliesse Zonen ab, um Abzeichen zu sammeln.</p>') + '</div>');
  h += sec('Dein Wissensspeicher', '<div class="panel rows">' + TH.map(function(c){ return (S.lern.seq || []).indexOf(c.id) >= 0 ? '<details class="th"><summary class="t">' + esc(c.t) + '</summary><p class="m">' + esc(c.txt) + '</p></details>' : '<div class="m">' + ic('lock') + ' Noch nicht gefunden: Sie wartet in der Welt.</div>'; }).join('') + '</div><p class="hint">Karten aus der Welt kommen dort immer wieder als Blitz-Wiederholung. Im Theorie-Trainer übst du alle auf einmal.</p>');
  h += sec('Warum Spiele?', '<div class="note">' + ic('info') + '<span>Puzzle- und Strategiespiele fördern kognitive Funktionen, logisches Denken, vorausschauende Planung und Problemlösung (Tappe &amp; Gennat, 2023, S. 183–184). Simulationen wie The Lab erlauben es, Berufs- und Alltagssituationen realistisch zu erproben (Tappe &amp; Gennat, 2023, S. 104). Darum verbindet die Welt beides: kognitive Aufgaben zum Knobeln und Situationen zum Führen. Die Inhalte der Welt folgen den 17 Kapiteln von Robbins &amp; Judge (2021), Essentials of Organizational Behavior, in eigenen Worten zusammengefasst.</span></div>');
  return h;
}
function scrSpiel(c){
  var G = GAMES[c.id], g = S.g, h;
  if (!g || g.id !== c.id) {
    g = S.g = newGame(c.id);
    if (G.isStory) { g.scene = 'start'; }
  }
  h = top(G.t, G.s, null, true);

  // WENN ES EIN STORY-SPIEL IST (Verzweigte Entscheidungen):
  if (G.isStory) {
    var scKey = g.scene || 'start';
    var sc = G.scenes[scKey];
    
    if (sc.end) {
      return h + sec(sc.title, '<div class="panel in tc"><p class="t" style="white-space: pre-line; font-size:15px;">' + esc(sc.q) + '</p><div class="actions jc mt14"><button class="btn primary" data-a="g-story-reset">Nochmal spielen</button><button class="btn ghost" data-a="back">Zur Arena</button></div></div>');
    }
    
    return h + sec(sc.title, '<div class="panel in mt14"><p class="t" style="font-size:15px; line-height:1.5;">' + esc(sc.q) + '</p><div class="stack mt14">' + 
      sc.o.map(function(opt, idx){
        return '<button class="opt" data-a="g-story-choice" data-next="' + opt.next + '">' + esc(opt.text) + '</button>';
      }).join('') + 
      '</div></div>');
  }

  // STANDARD-QUIZ LOGIK (für die anderen Spiele)
  if (!g.fin && G.kind === 'world') return h + worldView(G, g);
  if (g.fin){
    return h + sec('', '<div class="panel in tc"><p class="big">+' + g.xp + ' XP</p><p class="m mt6">' + resMsg(G, g) + '</p><div class="actions jc"><button class="btn primary" data-a="g-again">Nochmal</button><button class="btn ghost" data-a="back">Zur Arena</button></div></div>');
  }
  if (G.steps){
    var st = G.steps, P = [2,0,3,1];
    return h + sec('', '<p class="m">Tippe die Schritte in der richtigen Reihenfolge an.</p><div class="mt10">' + st.slice(0, g.nx).map(function(s, k){ return '<div class="opt right">' + (k + 1) + '. ' + esc(s) + '</div>'; }).join('') + P.filter(function(r){ return r >= g.nx; }).map(function(r){ return '<button class="opt" data-a="g-ord" data-v="' + r + '">' + esc(st[r]) + '</button>'; }).join('') + '</div>');
  }
  var n = G.items.length, it = G.items[g.i];
  return h + sec('', '<div class="prog" role="img" aria-label="Frage ' + (g.i + 1) + ' von ' + n + '">' + G.items.map(function(x, k){ return '<i' + (k <= g.i ? ' class="on"' : '') + '></i>'; }).join('') + '</div><div class="panel in mt14"><p class="t">' + esc(it.q) + '</p>'
    + it.o.map(function(o, k){ var cl = g.sel === null ? '' : k === it.a ? ' right' : k === g.sel ? ' wrong' : ''; return '<button class="opt' + cl + '" data-a="g-pick" data-v="' + k + '"' + (g.sel !== null ? ' disabled' : '') + '>' + esc(o) + '</button>'; }).join('')
    + (g.sel !== null ? '<div class="note mt14">' + ic('info') + '<span><b>' + (g.sel === it.a ? 'Richtig. ' : 'Nicht ganz. ') + '</b>' + esc(it.e) + '</span></div><button class="btn primary block mt14" data-a="g-next">' + (g.i + 1 < n ? 'Weiter' : 'Ergebnis ansehen') + '</button>' : '') + '</div>');
}


/* ---------- Aktionen der Arena (Klicks auf data-a="...") ---------- */
var ACTIONS = {
  'g-story-choice': function(v, el) {
    var nextScene = el.getAttribute('data-next');
    if (S.g) { S.g.scene = nextScene; }
  },
  'g-story-reset': function() {
    if (S.g) { S.g.scene = 'start'; }
  },
  'g-thok':function(){ var g = S.g, m = WM[g.m], q = S.lern.seq = S.lern.seq || []; if (q.indexOf(m.th) < 0) q.push(m.th); g.ph = recallCard(m) ? 'rc' : 'tk'; g.rsel = null; },
  'g-rpick':function(v){ var g = S.g, rc = recallCard(WM[g.m]); if (g.rsel !== null) return; g.rsel = +v; if (g.rsel === rc.rq.a){ g.xp += 5; g.cb++; } else g.cb = 0; },
  'g-rok':function(){ S.g.ph = 'tk'; },
  'g-next':function(){ var g = S.g, G = GAMES[g.id]; if (g.i + 1 < G.items.length){ g.i++; g.sel = null; } else gameDone(); },
  'g-wpick':function(v){ var g = S.g, m = WM[g.m], b; if (g.sel !== null) return; g.sel = +v; if (g.sel === m.a){ g.ok++; g.cb++; b = (g.wr ? 8 : 15) + Math.min(g.cb - 1, 5) * 3; g.xp += b; g.last = b; if (g.cb === 5) award('combo', 'Combo-Meister'); } else { g.wr = true; g.err++; g.cb = 0; } },
  'g-hide':function(){ S.g.hid = true; },
  'g-goto':function(){ var g = S.g, m = WM[Math.min(g.lv, WM.length - 1)], c = W.cam, dx = c.position.x - m.x, dz = c.position.z - m.z, d = Math.hypot(dx, dz) || 1; W.tg = {x:m.x + dx / d * 2.6, z:m.z + dz / d * 2.6}; W.yaw = Math.atan2(-(m.x - c.position.x), -(m.z - c.position.z)); W.pitch = 0; },
  'g-wclose':function(){ var g = S.g, i = g.m, ok = g.sel === WM[i].a, k, q; if (ok){ g.done[i] = true; g.wr = false; g.ev = 'Mission geschafft: ' + WM[i].n + ' ist startklar!'; if (i === 0) award('first', 'Erste Mission'); k = PARTS.findIndex(function(x){ return i >= x[0] && i <= x[1]; }); q = PARTS[k]; if (g.done.slice(q[0], q[1] + 1).every(Boolean)){ award('z' + k, 'Zone ' + (k + 1) + ': ' + q[2]); g.ev = 'Zone geschafft: ' + q[2] + '! Neues Abzeichen.'; } if (g.lv < WM.length - 1){ g.lv++; toast('Level-Up! ' + WM[g.lv].n + ' (' + WM[g.lv].ro + ') wartet auf dich.'); } } g.m = null; g.sel = null; g.hid = false; if (g.done.every(Boolean)){ g.xp += 10; if (!g.err) award('perfect', 'Perfektionist'); gameDone(); } },
  spiel:function(v, el){ var id = idOf(el), r = id === 'sim' && S.g && S.g.id === 'sim' && !S.g.fin && typeof S.g.lv === 'number' && S.g.done.length === WM.length; S.stack.push({s:'spiel', id:id}); S.g = r ? S.g : newGame(id); if (r){ S.g.m = null; S.g.sel = null; } },
  'g-pick':function(v){ var g = S.g, it = GAMES[g.id].items[g.i]; if (g.sel !== null) return; g.sel = +v; if (g.sel === it.a){ g.ok++; g.xp += 10; } },
  'g-ord':function(v){ var g = S.g, n = GAMES[g.id].steps.length; if (g.fin) return; if (+v === g.nx){ g.nx++; if (g.nx === n){ g.xp = Math.max(10, 40 - 8 * g.err); gameDone(); } } else { g.err++; toast('Nicht ganz. Was kommt zuerst?'); } },
  'g-again':function(){ S.g = newGame(S.g.id); },
};

/* ---------- Anmeldung bei index.html ---------- */
function live(fn){ return function(){ S = K.S(); return fn.apply(this, arguments); }; }
function liveAll(o){ var r = {}; Object.keys(o).forEach(function(k){ r[k] = live(o[k]); }); return r; }
return {
  icons: {
  lernen:'<path d="M4 5.5C7 4 9.5 4.3 12 6c2.5-1.7 5-2 8-.5V18c-3-1.5-5.5-1.2-8 .5-2.5-1.7-5-2-8-.5z"/><path d="M12 6v12.5"/>',
  bolt:'<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>', star:'<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.800L12 16.800 6.800 19.500l1-5.800L3.600 9.600l5.800-.8z"/>', list:'<path d="M9 6h11M9 12h11M9 18h11M4.500 6h.1M4.500 12h.1M4.500 18h.1"/>'
  },
  tab: ['arena','Arena','lernen'], tabAt: 3,
  screens: liveAll({arena:scrArena, spiel:scrSpiel}),
  actions: liveAll(ACTIONS),
  guide: {arena: ['Lern-Arena', 'Kurze Spiele zum selbstständigen Lernen: Finanzmarkt-Wissen, kritisches Denken, dazu eine begehbare 3D-Welt angelehnt an The Lab. Dort lernst du die 17 Kapitel aus Robbins &amp; Judge (2021): erst eine Erklärung, dann die Anwendung in einer Situation, später die Wiederholung. Dein Fortschritt bleibt auf diesem Gerät gespeichert. Eine Runde dauert zwei bis drei Minuten, bringt XP und lässt sich beliebig wiederholen.', ['Neuer Baustein','Freiwillig','Selbstständig lernen'], ['Starte «Fakt oder Annahme». Das Spiel übt, was in der Business Challenge zählt.', 'Spiele den «Börsen-Blitz» und sammle XP für das nächste Level.', 'Ordne im Puzzle den Weg eines Börsengeschäfts.']]},
  guideMap: {spiel:'arena'},
  seed: function(st){ st.lern = {xp:120, streak:3, done:{}, seq:[]}; },
  homeTasks: function(t){ t.push(['tab','arena','','Tagesrunde in der Lern-Arena','Zwei Minuten, +10 XP pro richtige Antwort']); },
  afterRender: live(function(){
  try { localStorage.setItem('ktj_arena', JSON.stringify({v:VERSION, lern:S.lern, g:S.g && S.g.id === 'sim' ? S.g : null})); } catch (e) {}
  worldAttach();
  }),
  onStart: live(function(){
  try { var sv = JSON.parse(localStorage.getItem('ktj_arena') || 'null'); if (sv && sv.v === VERSION){ S.lern = sv.lern; if (sv.g) S.g = sv.g; } } catch (e) {}
  })
};
});
