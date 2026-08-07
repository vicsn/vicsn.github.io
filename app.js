(() => {
  const STORAGE_KEY = 'bwkLunchclubMvpV1';
  const SESSION_KEY = 'bwkLunchclubSessionV1';
  const LANG_KEY = 'bwkLunchclubLangV1';

  const seedAccessList = {
    'anna.mueller@bwk-demo.de': { access: 'paid', active: true },
    'lisa.test@bwk-demo.de': { access: 'test', active: true },
    'admin@bwk-demo.de': { access: 'admin', active: true },
    'jan.becker@bwk-demo.de': { access: 'paid', active: true },
    'martina.hoffmann@bwk-demo.de': { access: 'paid', active: true },
    'mehmet.kaya@bwk-demo.de': { access: 'paid', active: true },
    'sabine.wolff@bwk-demo.de': { access: 'paid', active: true }
  };

  const seedMembers = [
    {
      id: 'm_martina', firstName: 'Martina', lastName: 'Hoffmann', email: 'martina.hoffmann@bwk-demo.de', company: 'Wasserverband Mitte', jobTitle: 'Leiterin Hochwasserschutz', access: 'paid', active: true, profileComplete: true,
      profile: { industry: 'Coastal & flood protection', experience: '16+', ageBand: '50plus', language: 'de', bio: 'I lead flood protection programmes and enjoy exchanging practical experience with younger engineers.', social: '', goals: ['Knowledge transfer','Mentoring'], groupSize: '2', frequency: '2', availability: ['Tue afternoon','Thu afternoon'] }
    },
    {
      id: 'm_jan', firstName: 'Jan', lastName: 'Becker', email: 'jan.becker@bwk-demo.de', company: 'Ingenieurbüro Flussraum', jobTitle: 'Projektingenieur', access: 'paid', active: true, profileComplete: true,
      profile: { industry: 'Water management', experience: '4-8', ageBand: '30-39', language: 'de', bio: 'I work on river restoration and want to compare project approaches across organisations.', social: '', goals: ['Industry exchange','Meet members'], groupSize: '2', frequency: '1', availability: ['Wed evening','Thu afternoon'] }
    },
    {
      id: 'm_mehmet', firstName: 'Mehmet', lastName: 'Kaya', email: 'mehmet.kaya@bwk-demo.de', company: 'Stadtwerke Nord', jobTitle: 'Fachbereichsleiter Wasser', access: 'paid', active: true, profileComplete: true,
      profile: { industry: 'Public administration', experience: '16+', ageBand: '50plus', language: 'either', bio: 'My focus is public water infrastructure, teams and long-term asset planning.', social: '', goals: ['Knowledge transfer','Career development'], groupSize: '3', frequency: '1', availability: ['Wed evening','Fri morning'] }
    },
    {
      id: 'm_sabine', firstName: 'Sabine', lastName: 'Wolff', email: 'sabine.wolff@bwk-demo.de', company: 'Umweltlabor Süd', jobTitle: 'Senior Scientist', access: 'paid', active: true, profileComplete: true,
      profile: { industry: 'Research & education', experience: '9-15', ageBand: '40-49', language: 'either', bio: 'I connect research with operational water quality questions and enjoy mentoring.', social: '', goals: ['Mentoring','Industry exchange'], groupSize: '3', frequency: '2', availability: ['Wed evening','Fri morning'] }
    }
  ];

  const i18n = {
    en: {
      'nav.home':'Home','nav.how':'How it works','nav.membership':'Membership','nav.profile':'My profile','nav.match':'My match','nav.admin':'Admin','nav.signin':'Demo sign in','nav.join':'Join Lunchclub',
      'test.banner':'Local demo. Email, calendar, membership and database integrations are simulated.',
      'home.eyebrow':'BWK MEMBER NETWORK','home.title':'Meet the right person for your next professional conversation.','home.lead':'Lunchclub brings new and established BWK members together for focused 1:1 or 3-person conversations based on goals, availability and professional background.','home.cta':'Find my match','home.secondary':'See how it works →','home.trust1':'Verified members','home.trust2':'Smart matching','home.trust3':'Easy scheduling','home.card.you':'YOUR GOAL','home.card.goal':'Exchange knowledge','home.card.profile':'Water management · Early career','home.card.match':'MATCH','home.card.matchProfile':'Flood protection · 18 years experience','home.card.fit':'match fit','home.whyEyebrow':'DESIGNED FOR USEFUL CONNECTIONS','home.whyTitle':'Less networking friction. More relevant conversations.','home.whyText':'Tell us what you want to learn, share or explore. Lunchclub handles the introduction and gives you immediate date options.','home.feature1.title':'Answer a short questionnaire','home.feature1.text':'Share your background, goals, availability and preferred conversation size.','home.feature2.title':'Get a thoughtful match','home.feature2.text':'We prioritize compatible availability and group size, then balance age, background and goals.','home.feature3.title':'Meet without the admin','home.feature3.text':'Receive an introduction, suggested topics and date options in one simple flow.','home.quote':'A strong professional network should be easy to enter, especially for people who are new to the community.','home.quoteSource':'Lunchclub principle',
      'how.eyebrow':'HOW IT WORKS','how.title':'From sign-up to conversation in seven simple steps.','how.lead':'The demo shows the complete member journey. Production integrations are represented by test-mode adapters.','how.s1t':'Sign up','how.s1d':'Confirm your email and membership eligibility.','how.s2t':'Complete questionnaire','how.s2d':'Tell us about your background, goals and preferences.','how.s3t':'Get matched','how.s3d':'The system checks exact constraints first, then calculates fit.','how.s4t':'Receive introduction','how.s4d':'Your match email includes participant profiles and suggested topics.','how.s5t':'Choose a date','how.s5d':'Pick one of the proposed dates. The demo creates a mock calendar invite.','how.s6t':'Meet','how.s6d':'Have a focused conversation online or in person.','how.s7t':'Share feedback','how.s7d':'Confirm that the meeting happened and tell us if the connection was useful.','how.ctaTitle':'Ready to see your match?','how.ctaText':'The local demo takes about two minutes to complete.',
      'membership.eyebrow':'MEMBERSHIP','membership.title':'A member benefit with a simple test path.','membership.lead':'Regular matching is for verified paying members. Selected test members can experience one match before deciding whether to continue.','membership.test':'TEST MEMBER','membership.oneMatch':'One match','membership.testText':'A controlled way to experience Lunchclub once.','membership.test1':'One questionnaire','membership.test2':'One professional match','membership.test3':'Scheduling and follow-up','membership.test4':'Automatic deactivation after the match','membership.try':'Try test access','membership.recommended':'FOR BWK MEMBERS','membership.paid':'VERIFIED MEMBER','membership.ongoing':'Ongoing matching','membership.paidText':'Use Lunchclub at the frequency that works for you.','membership.paid1':'Verified access','membership.paid2':'Up to your selected matches per quarter','membership.paid3':'Editable preferences','membership.paid4':'Pause or leave at any time','membership.note':'In this MVP, verification uses a local test list. Production must connect to the official BWK member source.',
      'signup.progress1':'Account','signup.progress2':'Questionnaire','signup.progress3':'Match','signup.eyebrow':'GET STARTED','signup.title':'First, confirm your access.','signup.lead':'Use one of the demo emails shown below. In production, this check will use the verified BWK member list.','signup.demoTitle':'Demo accounts','signup.demoPaid':'verified paying member','signup.demoTest':'approved test member','signup.demoAdmin':'administrator','field.first':'First name','field.last':'Last name','field.email':'Email address','field.company':'Organisation','field.role':'Job title','signup.emailHelp':'We use this to confirm access and send service emails.','signup.codeLabel':'Email confirmation code','signup.codeHelp':'Test mode: use code 246810. A production system would send this by email.','signup.consentTitle':'I agree to the test terms and privacy notice.','signup.consentText':'This demo stores data only in this browser.','signup.continue':'Confirm access and continue',
      'question.eyebrow':'YOUR PROFILE','question.sideTitle':'A better profile makes a better match.','question.sideText':'Exact constraints are handled first. The remaining answers improve relevance.','question.background':'Professional background','field.industry':'Field / industry','field.choose':'Choose one','field.experience':'Years of experience','field.age':'Age range','field.language':'Conversation language','field.bio':'Short introduction','field.social':'LinkedIn or professional profile (optional)','field.photo':'Profile image (optional in demo)','field.photoHelp':'The demo stores only the filename, not the image.','question.goals':'What do you want from Lunchclub?','question.goalsHint':'Choose one or more.','goal.job':'Job search','goal.career':'Career development','goal.knowledge':'Knowledge transfer','goal.mentor':'Mentoring','goal.industry':'Industry exchange','goal.people':'Meet BWK members','question.preferences':'Conversation preferences','field.group':'Group size','field.frequency':'Matches per quarter','field.availability':'Most likely Availability','field.availabilityHelp':'Toggle morning, afternoon and evening separately for each day. Matches require at least one exact shared slot.','day.mon':'Monday','day.tue':'Tuesday','day.wed':'Wednesday','day.thu':'Thursday','day.fri':'Friday','day.sat':'Saturday','day.sun':'Sunday','period.morning':'Morning','period.afternoon':'Afternoon','period.evening':'Evening','question.save':'Save profile and find a match',
      'match.emptyTitle':'No active match yet.','match.emptyText':'Complete your profile or ask an administrator to run matching.','match.profile':'Complete profile','match.eyebrow':'YOUR CURRENT MATCH','match.title':'You have a conversation to look forward to.','match.choose':'Choose a meeting time','match.chooseText':'These options are generated from the shared availability in test mode.','match.topicsLabel':'SUGGESTED CONVERSATION STARTERS','match.topicsTitle':'Start with what you already have in common.','match.feedbackTitle':'After the conversation','match.feedbackText':'Use this demo form to simulate the follow-up email.','match.notHeld':'Meeting did not happen','match.useful':'Meeting happened & was useful',
      'profile.eyebrow':'MY PROFILE','profile.title':'Manage your Lunchclub participation.','profile.lead':'Update your matching profile, pause matching or delete your local demo account.','profile.editTitle':'Questionnaire','profile.editText':'Background, goals, availability and group size.','profile.edit':'Edit profile','profile.statusTitle':'Matching status','profile.deleteTitle':'Delete account','profile.deleteText':'Remove this demo account and its locally stored data.','profile.delete':'Delete',
      'admin.manual':'Create manual match','admin.manualEyebrow':'MANUAL MATCH','admin.manualTitle':'Create or edit a match','admin.manualText':'Choose two or three active members. Exact group size, language and shared availability rules still apply.','admin.person1':'Participant 1','admin.person2':'Participant 2','admin.person3':'Participant 3 (optional)','admin.saveMatch':'Save match','admin.accessLabel':'ACCESS LIST','admin.accessTitle':'Demo verification list','admin.addAccess':'Add / update','admin.approve':'Approve','admin.edit':'Edit','admin.cancel':'Cancel','admin.toggle':'Toggle active',
      'admin.eyebrow':'ADMINISTRATION','admin.title':'Lunchclub test control room.','admin.lead':'Review member state, run the local matching engine and inspect outcomes.','admin.reset':'Reset demo data','admin.run':'Run matching','admin.membersLabel':'MEMBERS','admin.members':'Member pool','admin.export':'Export CSV','admin.name':'Name','admin.type':'Type','admin.status':'Status','admin.profile':'Profile','admin.matchesLabel':'MATCHES','admin.matches':'Recent matches','admin.integrationLabel':'PRODUCTION READINESS','admin.integrationTitle':'External integrations still required','admin.integrationText':'Membership, hosted database, transactional email and calendar delivery are simulated in this MVP.','admin.integrationOpen':'Open integration checklist',
      'privacy.title':'Privacy notice — demo placeholder','privacy.p1':'This local MVP is not a production privacy policy. Demo data is stored in your browser using localStorage and is not transmitted by this website.','privacy.p2':'Before production launch, BWK must define the controller, legal basis, processors, retention periods, data subject rights, security measures and the exact data shared between matched participants.','terms.title':'Terms of use — demo placeholder','terms.p1':'This page is a placeholder for demonstration only. Production terms must define eligibility, acceptable use, matching limitations, member responsibilities, suspension, termination and liability.','terms.p2':'Participation in the demo does not create a real BWK membership, meeting, email or calendar event.','footer.tagline':'Making professional connections easy and effective.','footer.privacy':'Privacy','footer.terms':'Terms','signin.eyebrow':'DEMO SIGN IN','signin.title':'Continue as an existing demo user','signin.text':'Enter a seeded demo email. No password is used in this local MVP.','signin.button':'Sign in'
    },
    de: {
      'nav.home':'Start','nav.how':'So funktioniert’s','nav.membership':'Mitgliedschaft','nav.profile':'Mein Profil','nav.match':'Mein Match','nav.admin':'Admin','nav.signin':'Demo-Anmeldung','nav.join':'Lunchclub beitreten',
      'test.banner':'Lokale Demo. E-Mail-, Kalender-, Mitgliedschafts- und Datenbank-Integrationen werden simuliert.',
      'home.eyebrow':'BWK MITGLIEDERNETZWERK','home.title':'Treffen Sie die richtige Person für Ihr nächstes Fachgespräch.','home.lead':'Lunchclub bringt neue und etablierte BWK-Mitglieder für fokussierte Gespräche zu zweit oder zu dritt zusammen – passend zu Zielen, Verfügbarkeit und beruflichem Hintergrund.','home.cta':'Mein Match finden','home.secondary':'So funktioniert’s →','home.trust1':'Verifizierte Mitglieder','home.trust2':'Intelligentes Matching','home.trust3':'Einfache Terminfindung','home.card.you':'IHR ZIEL','home.card.goal':'Wissen austauschen','home.card.profile':'Wasserwirtschaft · Berufseinstieg','home.card.match':'MATCH','home.card.matchProfile':'Hochwasserschutz · 18 Jahre Erfahrung','home.card.fit':'Match-Qualität','home.whyEyebrow':'FÜR NÜTZLICHE KONTAKTE','home.whyTitle':'Weniger Hürden beim Netzwerken. Mehr relevante Gespräche.','home.whyText':'Sagen Sie uns, was Sie lernen, weitergeben oder erkunden möchten. Lunchclub übernimmt die Vorstellung und bietet direkt passende Termine an.','home.feature1.title':'Kurzen Fragebogen ausfüllen','home.feature1.text':'Hintergrund, Ziele, Verfügbarkeit und bevorzugte Gesprächsgröße angeben.','home.feature2.title':'Passendes Match erhalten','home.feature2.text':'Zuerst prüfen wir Verfügbarkeit und Gruppengröße, danach Alter, Hintergrund und Ziele.','home.feature3.title':'Treffen ohne Organisationsaufwand','home.feature3.text':'Vorstellung, Gesprächsthemen und Terminoptionen kommen in einem einfachen Ablauf.','home.quote':'Ein starkes berufliches Netzwerk sollte leicht zugänglich sein – besonders für Menschen, die neu in der Gemeinschaft sind.','home.quoteSource':'Lunchclub-Prinzip',
      'how.eyebrow':'SO FUNKTIONIERT’S','how.title':'Von der Anmeldung zum Gespräch in sieben einfachen Schritten.','how.lead':'Die Demo zeigt den gesamten Mitgliederweg. Produktionsintegrationen werden im Testmodus simuliert.','how.s1t':'Anmelden','how.s1d':'E-Mail und Teilnahmeberechtigung bestätigen.','how.s2t':'Fragebogen ausfüllen','how.s2d':'Hintergrund, Ziele und Präferenzen angeben.','how.s3t':'Match erhalten','how.s3d':'Das System prüft zuerst feste Bedingungen und bewertet danach die Passung.','how.s4t':'Vorstellung erhalten','how.s4d':'Die Match-E-Mail enthält Profile und vorgeschlagene Gesprächsthemen.','how.s5t':'Termin auswählen','how.s5d':'Einen vorgeschlagenen Termin wählen. Die Demo erstellt eine simulierte Kalendereinladung.','how.s6t':'Treffen','how.s6d':'Ein fokussiertes Gespräch online oder vor Ort führen.','how.s7t':'Feedback geben','how.s7d':'Bestätigen, ob das Treffen stattgefunden hat und nützlich war.','how.ctaTitle':'Bereit für Ihr Match?','how.ctaText':'Die lokale Demo dauert ungefähr zwei Minuten.',
      'membership.eyebrow':'MITGLIEDSCHAFT','membership.title':'Ein Mitgliedervorteil mit einfachem Testzugang.','membership.lead':'Regelmäßiges Matching ist für verifizierte zahlende Mitglieder. Ausgewählte Testmitglieder können ein Match erleben.','membership.test':'TESTMITGLIED','membership.oneMatch':'Ein Match','membership.testText':'Lunchclub einmal kontrolliert ausprobieren.','membership.test1':'Ein Fragebogen','membership.test2':'Ein professionelles Match','membership.test3':'Terminfindung und Follow-up','membership.test4':'Automatische Deaktivierung danach','membership.try':'Testzugang ausprobieren','membership.recommended':'FÜR BWK-MITGLIEDER','membership.paid':'VERIFIZIERTES MITGLIED','membership.ongoing':'Fortlaufendes Matching','membership.paidText':'Lunchclub in der passenden Häufigkeit nutzen.','membership.paid1':'Verifizierter Zugang','membership.paid2':'Bis zur gewählten Anzahl Matches pro Quartal','membership.paid3':'Änderbare Präferenzen','membership.paid4':'Jederzeit pausieren oder verlassen','membership.note':'Im MVP erfolgt die Prüfung über eine lokale Testliste. Für die Produktion ist die offizielle BWK-Mitgliedsquelle anzubinden.',
      'signup.progress1':'Konto','signup.progress2':'Fragebogen','signup.progress3':'Match','signup.eyebrow':'LOS GEHT’S','signup.title':'Zuerst bestätigen wir Ihren Zugang.','signup.lead':'Nutzen Sie eine der unten gezeigten Demo-Adressen. In Produktion wird gegen die verifizierte BWK-Mitgliederliste geprüft.','signup.demoTitle':'Demo-Konten','signup.demoPaid':'verifiziertes zahlendes Mitglied','signup.demoTest':'freigegebenes Testmitglied','signup.demoAdmin':'Administrator','field.first':'Vorname','field.last':'Nachname','field.email':'E-Mail-Adresse','field.company':'Organisation','field.role':'Position','signup.emailHelp':'Wir nutzen diese Adresse zur Zugangsprüfung und für Service-E-Mails.','signup.codeLabel':'E-Mail-Bestätigungscode','signup.codeHelp':'Testmodus: Code 246810 verwenden. In Produktion wird dieser per E-Mail gesendet.','signup.consentTitle':'Ich stimme den Testbedingungen und dem Datenschutzhinweis zu.','signup.consentText':'Diese Demo speichert Daten nur in diesem Browser.','signup.continue':'Zugang bestätigen und weiter',
      'question.eyebrow':'IHR PROFIL','question.sideTitle':'Ein besseres Profil führt zu einem besseren Match.','question.sideText':'Feste Bedingungen werden zuerst geprüft. Die übrigen Antworten erhöhen die Relevanz.','question.background':'Beruflicher Hintergrund','field.industry':'Fachgebiet / Branche','field.choose':'Bitte wählen','field.experience':'Berufserfahrung in Jahren','field.age':'Altersgruppe','field.language':'Gesprächssprache','field.bio':'Kurze Vorstellung','field.social':'LinkedIn oder Fachprofil (optional)','field.photo':'Profilbild (optional in der Demo)','field.photoHelp':'Die Demo speichert nur den Dateinamen, nicht das Bild.','question.goals':'Was möchten Sie vom Lunchclub?','question.goalsHint':'Eine oder mehrere Optionen wählen.','goal.job':'Jobsuche','goal.career':'Karriereentwicklung','goal.knowledge':'Wissenstransfer','goal.mentor':'Mentoring','goal.industry':'Fachaustausch','goal.people':'BWK-Mitglieder kennenlernen','question.preferences':'Gesprächspräferenzen','field.group':'Gruppengröße','field.frequency':'Matches pro Quartal','field.availability':'Wahrscheinlichste Verfügbarkeit','field.availabilityHelp':'Vormittag, Nachmittag und Abend pro Wochentag einzeln wählen. Ein Match braucht mindestens ein exakt gemeinsames Zeitfenster.','day.mon':'Montag','day.tue':'Dienstag','day.wed':'Mittwoch','day.thu':'Donnerstag','day.fri':'Freitag','day.sat':'Samstag','day.sun':'Sonntag','period.morning':'Vormittag','period.afternoon':'Nachmittag','period.evening':'Abend','question.save':'Profil speichern und Match finden',
      'match.emptyTitle':'Noch kein aktives Match.','match.emptyText':'Vervollständigen Sie Ihr Profil oder lassen Sie das Matching durch einen Admin starten.','match.profile':'Profil vervollständigen','match.eyebrow':'IHR AKTUELLES MATCH','match.title':'Ein interessantes Gespräch wartet auf Sie.','match.choose':'Termin auswählen','match.chooseText':'Diese Optionen werden im Testmodus aus der gemeinsamen Verfügbarkeit erzeugt.','match.topicsLabel':'VORGESCHLAGENE GESPRÄCHSSTARTER','match.topicsTitle':'Beginnen Sie mit Ihren gemeinsamen Themen.','match.feedbackTitle':'Nach dem Gespräch','match.feedbackText':'Mit diesem Demo-Formular wird die Follow-up-E-Mail simuliert.','match.notHeld':'Treffen fand nicht statt','match.useful':'Treffen fand statt & war nützlich',
      'profile.eyebrow':'MEIN PROFIL','profile.title':'Lunchclub-Teilnahme verwalten.','profile.lead':'Matching-Profil aktualisieren, Matching pausieren oder das lokale Demo-Konto löschen.','profile.editTitle':'Fragebogen','profile.editText':'Hintergrund, Ziele, Verfügbarkeit und Gruppengröße.','profile.edit':'Profil bearbeiten','profile.statusTitle':'Matching-Status','profile.deleteTitle':'Konto löschen','profile.deleteText':'Dieses Demo-Konto und lokal gespeicherte Daten entfernen.','profile.delete':'Löschen',
      'admin.manual':'Match manuell erstellen','admin.manualEyebrow':'MANUELLES MATCH','admin.manualTitle':'Match erstellen oder bearbeiten','admin.manualText':'Wählen Sie zwei oder drei aktive Mitglieder. Gruppengröße, Sprache und gemeinsame Verfügbarkeit bleiben feste Bedingungen.','admin.person1':'Teilnehmer 1','admin.person2':'Teilnehmer 2','admin.person3':'Teilnehmer 3 (optional)','admin.saveMatch':'Match speichern','admin.accessLabel':'ZUGANGSLISTE','admin.accessTitle':'Demo-Verifizierungsliste','admin.addAccess':'Hinzufügen / aktualisieren','admin.approve':'Freigeben','admin.edit':'Bearbeiten','admin.cancel':'Abbrechen','admin.toggle':'Aktiv umschalten',
      'admin.eyebrow':'ADMINISTRATION','admin.title':'Lunchclub Test-Steuerung.','admin.lead':'Mitgliederstatus prüfen, lokale Matching-Logik ausführen und Ergebnisse ansehen.','admin.reset':'Demo-Daten zurücksetzen','admin.run':'Matching starten','admin.membersLabel':'MITGLIEDER','admin.members':'Mitgliederpool','admin.export':'CSV exportieren','admin.name':'Name','admin.type':'Typ','admin.status':'Status','admin.profile':'Profil','admin.matchesLabel':'MATCHES','admin.matches':'Letzte Matches','admin.integrationLabel':'PRODUKTIONSREIFE','admin.integrationTitle':'Externe Integrationen noch erforderlich','admin.integrationText':'Mitgliedschaft, gehostete Datenbank, E-Mail und Kalender werden in diesem MVP simuliert.','admin.integrationOpen':'Integrationsliste öffnen',
      'privacy.title':'Datenschutzhinweis — Demo-Platzhalter','privacy.p1':'Dieses lokale MVP ist keine produktive Datenschutzerklärung. Demo-Daten werden per localStorage im Browser gespeichert und von dieser Website nicht übertragen.','privacy.p2':'Vor dem Produktionsstart muss BWK Verantwortliche, Rechtsgrundlage, Auftragsverarbeiter, Speicherfristen, Betroffenenrechte, Sicherheitsmaßnahmen und die zwischen Matches geteilten Daten festlegen.','terms.title':'Nutzungsbedingungen — Demo-Platzhalter','terms.p1':'Diese Seite ist nur ein Demo-Platzhalter. Produktive Bedingungen müssen Berechtigung, zulässige Nutzung, Matching-Grenzen, Pflichten, Sperrung, Beendigung und Haftung regeln.','terms.p2':'Die Teilnahme an der Demo erzeugt keine echte BWK-Mitgliedschaft, kein echtes Treffen, keine E-Mail und keinen Kalendereintrag.','footer.tagline':'Professionelle Kontakte einfach und effektiv machen.','footer.privacy':'Datenschutz','footer.terms':'Nutzungsbedingungen','signin.eyebrow':'DEMO-ANMELDUNG','signin.title':'Als bestehender Demo-Nutzer fortfahren','signin.text':'Geben Sie eine vorbereitete Demo-Adresse ein. In diesem lokalen MVP gibt es kein Passwort.','signin.button':'Anmelden'
    }
  };

  const LEGACY_AVAILABILITY = {
    'Tue 12:00':'Tue afternoon','Wed 17:30':'Wed evening','Thu 12:00':'Thu afternoon','Fri 08:30':'Fri morning'
  };
  function normalizeAvailability(slots=[]) {
    return slots.map(slot => LEGACY_AVAILABILITY[slot] || slot);
  }
  function migrateStateAvailability() {
    state.members.forEach(m => {
      if (m.profile?.availability) m.profile.availability = normalizeAvailability(m.profile.availability);
    });
    state.matches.forEach(m => {
      if (m.sharedSlots) m.sharedSlots = normalizeAvailability(m.sharedSlots);
    });
  }

  function defaultState() {
    return { members: structuredClone(seedMembers), matches: [], feedback: [], accessList: structuredClone(seedAccessList), testUsedEmails: [], currentQuarter: 'demo-q1' };
  }
  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState(); } catch { return defaultState(); }
  }
  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  let state = loadState();
  state.accessList ||= structuredClone(seedAccessList);
  state.testUsedEmails ||= [];
  migrateStateAvailability();
  let currentUserId = sessionStorage.getItem(SESSION_KEY) || null;
  let lang = localStorage.getItem(LANG_KEY) || 'en';

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const toast = (message) => { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),2800); };
  const initials = (m) => `${m.firstName?.[0]||''}${m.lastName?.[0]||''}`.toUpperCase();
  const currentUser = () => state.members.find(m => m.id === currentUserId);

  function route(name) {
    const user = currentUser();
    if (['preferences','match','questionnaire'].includes(name) && !user) { name = 'signup'; }
    if (name === 'admin' && user?.access !== 'admin') { name = 'home'; toast(lang==='de'?'Admin-Zugang erforderlich.':'Admin access required.'); }
    $$('.view').forEach(v => { const active = v.dataset.view === name; v.hidden = !active; v.classList.toggle('is-active', active); });
    window.scrollTo({top:0,behavior:'smooth'});
    if (name === 'questionnaire') renderQuestionnaire();
    if (name === 'match') renderMatch();
    if (name === 'preferences') renderPreferences();
    if (name === 'admin') renderAdmin();
  }

  function applyLanguage() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (i18n[lang][key]) el.textContent = i18n[lang][key];
    });
    $('#languageToggle').textContent = lang === 'en' ? 'DE' : 'EN';
    renderAuth();
    const visible = $('.view:not([hidden])')?.dataset.view;
    if (visible === 'match') renderMatch();
    if (visible === 'preferences') renderPreferences();
    if (visible === 'admin') renderAdmin();
  }

  function renderAuth() {
    const user = currentUser();
    $$('[data-auth-only]').forEach(el => el.hidden = !user);
    $$('[data-admin-only]').forEach(el => el.hidden = user?.access !== 'admin');
    const btn = $('#authButton');
    const join = $('#joinButton');
    if (user) {
      btn.textContent = `${user.firstName} · ${lang==='de'?'Abmelden':'Sign out'}`;
      join.hidden = true;
    } else {
      btn.textContent = i18n[lang]['nav.signin'];
      join.hidden = false;
    }
  }

  function signOut() {
    currentUserId = null; sessionStorage.removeItem(SESSION_KEY); renderAuth(); route('home'); toast(lang==='de'?'Abgemeldet.':'Signed out.');
  }

  function makeUserFromSignup(fd, access) {
    const email = fd.get('email').trim().toLowerCase();
    let member = state.members.find(m => m.email.toLowerCase() === email);
    if (member) {
      member.firstName = fd.get('firstName').trim() || member.firstName;
      member.lastName = fd.get('lastName').trim() || member.lastName;
      member.company = fd.get('company').trim() || member.company;
      member.jobTitle = fd.get('jobTitle').trim() || member.jobTitle;
      return member;
    }
    member = { id: `m_${Date.now()}`, firstName: fd.get('firstName').trim(), lastName: fd.get('lastName').trim(), email, company: fd.get('company').trim(), jobTitle: fd.get('jobTitle').trim(), access, active: true, profileComplete: false, matchesUsed: 0, profile: null };
    state.members.push(member); return member;
  }

  $('#signupForm').addEventListener('submit', e => {
    e.preventDefault(); const form=e.currentTarget; const msg=$('#signupMessage'); msg.textContent='';
    const codeBox=$('#emailConfirmation'); const codeInput=form.elements.confirmationCode;
    if (!codeBox.hidden && form.dataset.pendingEmail !== form.elements.email.value.trim().toLowerCase()) { codeBox.hidden=true; codeInput.disabled=true; codeInput.required=false; form.dataset.pendingEmail=''; }
    if (!form.reportValidity()) return;
    const fd=new FormData(form); const email=fd.get('email').trim().toLowerCase(); const access=state.accessList[email]?.active ? state.accessList[email].access : null;
    if (!access) { msg.textContent = lang==='de'?'Diese E-Mail steht nicht auf der verifizierten Demo-Liste.':'This email is not on the verified demo list.'; return; }
    if (access==='test' && state.testUsedEmails.includes(email)) { msg.textContent=lang==='de'?'Dieser Testzugang wurde bereits verwendet.':'This test access has already been used.'; return; }
    if (codeBox.hidden) { codeBox.hidden=false; codeInput.disabled=false; codeInput.required=true; form.dataset.pendingEmail=email; msg.classList.add('success'); msg.textContent=lang==='de'?'Bestätigungs-E-Mail simuliert. Bitte Testcode 246810 eingeben.':'Confirmation email simulated. Enter test code 246810.'; codeInput.focus(); return; }
    msg.classList.remove('success');
    if (fd.get('confirmationCode') !== '246810') { msg.textContent=lang==='de'?'Der Bestätigungscode ist nicht korrekt.':'The confirmation code is incorrect.'; return; }
    if (access==='admin') { const admin = makeUserFromSignup(fd,'admin'); admin.profileComplete=true; saveState(); login(admin.id); route('admin'); return; }
    const member=makeUserFromSignup(fd, access); member.access=access; member.active=true; saveState(); login(member.id); route(member.profileComplete?'match':'questionnaire');
  });

  function login(id) { currentUserId=id; sessionStorage.setItem(SESSION_KEY,id); renderAuth(); }

  $('#authButton').addEventListener('click', () => {
    if (currentUser()) signOut(); else $('#signinDialog').showModal();
  });
  $('#signinForm').addEventListener('submit', e => {
    const submitter=e.submitter;
    if (submitter?.value==='cancel') return;
    e.preventDefault(); const email=new FormData(e.currentTarget).get('signinEmail').trim().toLowerCase(); const msg=$('#signinMessage');
    if (email==='admin@bwk-demo.de' && state.accessList[email]?.active && !state.members.some(m=>m.email===email)) state.members.push({id:'m_admin',firstName:'Demo',lastName:'Admin',email,company:'BWK',jobTitle:'Administrator',access:'admin',active:true,profileComplete:true,profile:null});
    const user=state.members.find(m=>m.email.toLowerCase()===email);
    if (!user) { msg.textContent=lang==='de'?'Demo-Nutzer nicht gefunden. Registrieren Sie ihn zuerst.':'Demo user not found. Register it first.'; return; }
    login(user.id); saveState(); $('#signinDialog').close(); msg.textContent=''; route(user.access==='admin'?'admin':user.profileComplete?'match':'questionnaire');
  });

  function renderQuestionnaire() {
    const user=currentUser(); if (!user) return;
    $('#questionName').textContent=`${user.firstName} ${user.lastName}`; $('#questionEmail').textContent=user.email; $('#questionAvatar').textContent=initials(user);
    const form=$('#questionnaireForm'); if (!user.profile) { form.reset(); return; }
    Object.entries(user.profile).forEach(([key,val])=>{
      if (key === 'goals' || key === 'availability') {
        const values = key === 'availability' ? normalizeAvailability(val) : val;
        $$(`input[name="${key}"]`,form).forEach(el=>el.checked=values.includes(el.value));
      }
      else if (key==='photoName') return;
      else { const el=form.elements[key]; if (el && el.type!=='file') el.value=val ?? ''; }
    });
  }

  $('#questionnaireForm').addEventListener('submit', e => {
    e.preventDefault(); const form=e.currentTarget; const msg=$('#questionMessage'); msg.textContent='';
    if (!form.reportValidity()) return;
    const fd=new FormData(form); const goals=fd.getAll('goals'); const availability=normalizeAvailability(fd.getAll('availability'));
    if (!goals.length || !availability.length) { msg.textContent=lang==='de'?'Bitte mindestens ein Ziel und ein Verfügbarkeitsfenster wählen.':'Choose at least one goal and one availability slot.'; return; }
    const user=currentUser();
    user.profile={industry:fd.get('industry'),experience:fd.get('experience'),ageBand:fd.get('ageBand'),language:fd.get('language'),bio:fd.get('bio').trim(),social:fd.get('social').trim(),photoName:fd.get('photo')?.name||user.profile?.photoName||'',goals,groupSize:fd.get('groupSize'),frequency:fd.get('frequency'),availability};
    user.profileComplete=true; user.active=!(user.access==='test' && state.testUsedEmails.includes(user.email)); saveState();
    findOrCreateMatchFor(user.id); saveState(); toast(lang==='de'?'Profil gespeichert. Matching wurde ausgeführt.':'Profile saved. Matching has run.'); route('match');
  });

  const young = a => ['under30','30-39'].includes(a);
  const old = a => ['40-49','50plus'].includes(a);
  const languageCompatible = (a,b) => a==='either'||b==='either'||a===b;
  const intersect = (a=[],b=[]) => a.filter(x=>b.includes(x));
  function alreadyMatched(a,b) { return state.matches.some(m=>m.memberIds.includes(a)&&m.memberIds.includes(b)); }
  function matchesThisQuarter(m) {
    const now=new Date(); const q=Math.floor(now.getMonth()/3); const start=new Date(now.getFullYear(),q*3,1); const end=new Date(now.getFullYear(),q*3+3,1);
    return state.matches.filter(x=>x.memberIds.includes(m.id) && new Date(x.createdAt)>=start && new Date(x.createdAt)<end && x.status!=='canceled').length;
  }
  function eligible(m) {
    if (!(m.active && m.profileComplete && ['paid','test'].includes(m.access))) return false;
    if (m.access==='test') return !state.testUsedEmails.includes(m.email);
    if (m.profile?.frequency==='once') return (m.matchesUsed||0) < 1;
    const limit=Number(m.profile?.frequency||1); return matchesThisQuarter(m) < limit;
  }
  function pairScore(a,b) {
    if (!eligible(a)||!eligible(b)||a.id===b.id) return -Infinity;
    if (a.profile.groupSize!==b.profile.groupSize) return -Infinity;
    const sharedSlots=intersect(a.profile.availability,b.profile.availability); if (!sharedSlots.length) return -Infinity;
    if (!languageCompatible(a.profile.language,b.profile.language)) return -Infinity;
    if (alreadyMatched(a.id,b.id)) return -Infinity;
    let score=50;
    const ageContrast=(young(a.profile.ageBand)&&old(b.profile.ageBand))||(old(a.profile.ageBand)&&young(b.profile.ageBand)); if (ageContrast) score+=20;
    const sharedGoals=intersect(a.profile.goals,b.profile.goals); score += Math.min(sharedGoals.length*8,16);
    if (a.profile.industry===b.profile.industry) score+=8;
    if (a.profile.experience!==b.profile.experience) score+=4;
    return {score,sharedSlots,sharedGoals,ageContrast};
  }

  function findOrCreateMatchFor(userId) {
    const user=state.members.find(m=>m.id===userId); if (!eligible(user)) return null;
    const activeMatch=state.matches.find(m=>m.memberIds.includes(userId)&&!['completed','failed','canceled'].includes(m.status)); if (activeMatch) return activeMatch;
    if (user.profile.groupSize==='2') {
      const candidates=state.members.map(m=>({m,result:pairScore(user,m)})).filter(x=>x.result!==-Infinity).sort((a,b)=>b.result.score-a.result.score);
      if (!candidates.length) return null;
      return createMatch([user,candidates[0].m],candidates[0].result);
    }
    const candidates=state.members.map(m=>({m,result:pairScore(user,m)})).filter(x=>x.result!==-Infinity&&x.m.profile.groupSize==='3').sort((a,b)=>b.result.score-a.result.score);
    for (let i=0;i<candidates.length;i++) for (let j=i+1;j<candidates.length;j++) {
      const thirdFit=pairScore(candidates[i].m,candidates[j].m); if (thirdFit!==-Infinity) {
        const shared=intersect(intersect(user.profile.availability,candidates[i].m.profile.availability),candidates[j].m.profile.availability);
        if (shared.length) return createMatch([user,candidates[i].m,candidates[j].m],{score:Math.round((candidates[i].result.score+candidates[j].result.score+thirdFit.score)/3),sharedSlots:shared,sharedGoals:[...new Set([...candidates[i].result.sharedGoals,...candidates[j].result.sharedGoals])],ageContrast:candidates[i].result.ageContrast||candidates[j].result.ageContrast});
      }
    }
    return null;
  }

  function createMatch(members, result) {
    const match={ id:`match_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, memberIds:members.map(m=>m.id), score:result.score, sharedSlots:result.sharedSlots, sharedGoals:result.sharedGoals||[], ageContrast:!!result.ageContrast, status:'proposed', createdAt:new Date().toISOString(), selectedDate:null };
    state.matches.unshift(match); members.forEach(m=>{m.matchesUsed=(m.matchesUsed||0)+1;if(m.access==='test'){if(!state.testUsedEmails.includes(m.email))state.testUsedEmails.push(m.email);m.active=false;}});
    return match;
  }

  function runMatching() {
    const before=state.matches.length;
    state.members.filter(eligible).forEach(m=>findOrCreateMatchFor(m.id)); saveState(); renderAdmin(); toast(`${state.matches.length-before} ${lang==='de'?'neue Matches erstellt.':'new matches created.'}`);
  }

  function currentMatchFor(user) { return state.matches.find(m=>m.memberIds.includes(user.id)&&!['completed','failed','canceled'].includes(m.status)); }
  function dateLabel(slot,index) {
    const dayMap = { Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6, Sun:0 };
    const timeMap = { morning:'09:00', afternoon:'13:00', evening:'18:00' };
    const [dayAbbr, period] = slot.split(' ');
    const targetDay = dayMap[dayAbbr] ?? 2;
    const time = timeMap[period] ?? '12:00';
    const now=new Date(); let d=new Date(now); d.setDate(d.getDate()+1);
    while(d.getDay()!==targetDay) d.setDate(d.getDate()+1); d.setDate(d.getDate()+index*7);
    return {iso:`${d.toISOString().slice(0,10)}T${time}`,date:d.toLocaleDateString(lang==='de'?'de-DE':'en-GB',{weekday:'short',day:'2-digit',month:'short'}),time};
  }
  function renderMatch() {
    const user=currentUser(); if (!user) return;
    const match=currentMatchFor(user); $('#matchEmpty').hidden=!!match; $('#matchContent').hidden=!match; if (!match) return;
    const people=match.memberIds.map(id=>state.members.find(m=>m.id===id)).filter(Boolean);
    const others=people.filter(m=>m.id!==user.id);
    const reasons=[]; if (match.ageContrast) reasons.push(lang==='de'?'Erfahrung über Generationen hinweg':'cross-generation experience'); if (match.sharedGoals.length) reasons.push(`${lang==='de'?'gemeinsame Ziele':'shared goals'}: ${match.sharedGoals.join(', ')}`); reasons.push(`${lang==='de'?'gemeinsame Verfügbarkeit':'shared availability'}: ${match.sharedSlots.join(', ')}`);
    $('#matchReason').textContent=`${match.score}% fit · ${reasons.join(' · ')}`;
    $('#matchPeople').innerHTML=people.map(m=>`<div class="person-row"><div class="avatar">${initials(m)}</div><div><span class="mini-label">${m.id===user.id?(lang==='de'?'SIE':'YOU'):(lang==='de'?'IHR MATCH':'YOUR MATCH')}</span><h3>${escapeHtml(m.firstName)} ${escapeHtml(m.lastName)}</h3><p><strong>${escapeHtml(m.jobTitle)}</strong> · ${escapeHtml(m.company)}</p><p>${escapeHtml(m.profile?.bio||'')}</p></div></div>`).join('');
    $('#matchTopics').innerHTML=[...(match.sharedGoals.length?match.sharedGoals:['Professional exchange']),`What is changing in ${user.profile?.industry || 'your field'}?`,lang==='de'?'Welche Erfahrung würden Sie einem neuen BWK-Mitglied mitgeben?':'What experience would you pass on to a newer BWK member?'].slice(0,4).map(t=>`<li>${escapeHtml(t)}</li>`).join('');
    const status=$('#matchStatus'); status.textContent=match.selectedDate?(lang==='de'?'Termin bestätigt':'Date confirmed'):(lang==='de'?'Termin offen':'Awaiting date'); status.classList.toggle('confirmed',!!match.selectedDate);
    const options=[]; (match.sharedSlots.length?match.sharedSlots:['Tue afternoon']).forEach((slot,si)=>{ for(let i=0;i<Math.min(2,3-options.length);i++) options.push(dateLabel(slot,i+si)); });
    while(options.length<3) options.push(dateLabel(match.sharedSlots[0]||'Tue afternoon',options.length+1));
    $('#dateOptions').innerHTML=options.slice(0,3).map(o=>`<button class="date-option" data-date="${o.iso}"><strong>${o.date}</strong><span>${o.time}</span></button>`).join('');
    $('#calendarResult').textContent=match.selectedDate?(lang==='de'?`Kalendereinladung simuliert für ${new Date(match.selectedDate).toLocaleString('de-DE')}.`:`Mock calendar invite created for ${new Date(match.selectedDate).toLocaleString('en-GB')}.`):'';
    $$('.date-option').forEach(btn=>btn.addEventListener('click',()=>{match.selectedDate=btn.dataset.date;match.status='scheduled';saveState();renderMatch();toast(lang==='de'?'Termin bestätigt. Kalender- und E-Mail-Versand simuliert.':'Date confirmed. Calendar and email delivery simulated.');}));
    if (others.length===0) $('#matchPeople').innerHTML='';
  }

  $$('[data-feedback]').forEach(btn=>btn.addEventListener('click',()=>{
    const user=currentUser(); const match=currentMatchFor(user); if(!match)return;
    const useful=btn.dataset.feedback==='useful'; match.status=useful?'completed':'failed'; state.feedback.push({matchId:match.id,userId:user.id,useful,createdAt:new Date().toISOString()});
    if (user.access==='test') user.active=false;
    if (user.profile?.frequency==='once') user.active=false;
    saveState(); toast(useful?(lang==='de'?'Danke. Feedback gespeichert.':'Thanks. Feedback saved.'):(lang==='de'?'Danke. Das Match wurde als nicht stattgefunden markiert.':'Thanks. The match was marked as not held.')); renderMatch(); renderAuth();
  }));

  function renderPreferences() {
    const user=currentUser(); if(!user)return; const text=$('#profileStatusText'); const btn=$('#pauseToggle');
    text.textContent=user.active?(lang==='de'?'Aktiv – Sie können in neue Matches aufgenommen werden.':'Active — you can be included in new matches.'):(lang==='de'?'Pausiert / inaktiv – keine neuen Matches.':'Paused / inactive — no new matches.');
    btn.textContent=user.active?(lang==='de'?'Matching pausieren':'Pause matching'):(lang==='de'?'Matching aktivieren':'Enable matching');
  }
  $('#pauseToggle').addEventListener('click',()=>{const u=currentUser();if(!u)return;if(u.access==='test'&&(u.matchesUsed||0)>=1&&!u.active){toast(lang==='de'?'Testzugang wurde bereits verwendet.':'Test access has already been used.');return;}u.active=!u.active;saveState();renderPreferences();});
  $('#deleteAccount').addEventListener('click',()=>{const u=currentUser();if(!u)return;if(!confirm(lang==='de'?'Demo-Konto wirklich löschen?':'Delete this demo account?'))return;state.members=state.members.filter(m=>m.id!==u.id);state.matches=state.matches.filter(m=>!m.memberIds.includes(u.id));saveState();signOut();});

  function renderAdmin() {
    const active=state.members.filter(m=>m.active&&['paid','test'].includes(m.access)).length; const complete=state.members.filter(m=>m.profileComplete).length; const held=state.matches.filter(m=>m.status==='completed').length; const avg=state.matches.length?Math.round(state.matches.reduce((a,m)=>a+m.score,0)/state.matches.length):0;
    $('#statsGrid').innerHTML=[['Active members',active],['Complete profiles',complete],['Matches',state.matches.length],['Average fit',`${avg}%`]].map(([label,n])=>`<div class="stat-card"><strong>${n}</strong><span>${label}</span></div>`).join('');
    $('#membersTable').innerHTML=state.members.map(m=>`<tr><td class="member-name"><strong>${escapeHtml(m.firstName)} ${escapeHtml(m.lastName)}</strong><span>${escapeHtml(m.email)}</span></td><td><span class="tag">${m.access}</span></td><td><span class="tag ${m.active?'active':'inactive'}">${m.active?(lang==='de'?'aktiv':'active'):(lang==='de'?'inaktiv':'inactive')}</span></td><td>${m.profileComplete?'✓':'—'} <button class="button button-small button-outline member-toggle" data-member-id="${m.id}">${i18n[lang]['admin.toggle']}</button></td></tr>`).join('');
    $('#adminMatches').innerHTML=state.matches.length?state.matches.slice(0,8).map(m=>{const names=m.memberIds.map(id=>state.members.find(x=>x.id===id)).filter(Boolean).map(x=>x.firstName).join(' + ');return `<div class="admin-match"><strong>${escapeHtml(names)}</strong><span>${m.score}% fit · ${m.status} · ${m.sharedSlots.join(', ')}</span><div class="admin-match-actions"><button class="button button-small button-outline match-approve" data-match-id="${m.id}">${i18n[lang]['admin.approve']}</button><button class="button button-small button-outline match-edit" data-match-id="${m.id}">${i18n[lang]['admin.edit']}</button><button class="button button-small button-danger match-cancel" data-match-id="${m.id}">${i18n[lang]['admin.cancel']}</button></div></div>`;}).join(''):`<p>${lang==='de'?'Noch keine Matches.':'No matches yet.'}</p>`;
    $('#accessList').innerHTML=Object.entries(state.accessList).map(([email,entry])=>`<span class="access-chip">${escapeHtml(email)} <b>${entry.access}</b></span>`).join('');
    $$('.member-toggle').forEach(btn=>btn.addEventListener('click',()=>{const m=state.members.find(x=>x.id===btn.dataset.memberId);if(!m)return;m.active=!m.active;saveState();renderAdmin();}));
    $$('.match-approve').forEach(btn=>btn.addEventListener('click',()=>{const m=state.matches.find(x=>x.id===btn.dataset.matchId);if(!m)return;m.status='approved';saveState();renderAdmin();toast(lang==='de'?'Match freigegeben.':'Match approved.');}));
    $$('.match-cancel').forEach(btn=>btn.addEventListener('click',()=>{const m=state.matches.find(x=>x.id===btn.dataset.matchId);if(!m)return;m.status='canceled';saveState();renderAdmin();toast(lang==='de'?'Match abgebrochen.':'Match canceled.');}));
    $$('.match-edit').forEach(btn=>btn.addEventListener('click',()=>openManualMatch(btn.dataset.matchId)));
  }
  function commonAvailability(members) {
    return members.reduce((slots,m)=>slots===null?[...(m.profile?.availability||[])]:intersect(slots,m.profile?.availability||[]),null)||[];
  }
  function manualFit(members) {
    const size=String(members.length);
    if (members.some(m=>!eligible(m))) return {error:lang==='de'?'Alle Teilnehmer müssen aktiv, berechtigt und vollständig profiliert sein.':'All participants must be active, eligible and have complete profiles.'};
    if (members.some(m=>m.profile.groupSize!==size)) return {error:lang==='de'?'Die gewählte Gruppengröße passt nicht zu den Profilen.':'Selected group size does not match participant profiles.'};
    const slots=commonAvailability(members); if(!slots.length) return {error:lang==='de'?'Keine exakt gemeinsame Verfügbarkeit.':'No exact shared availability.'};
    for(let i=0;i<members.length;i++) for(let j=i+1;j<members.length;j++) if(!languageCompatible(members[i].profile.language,members[j].profile.language)) return {error:lang==='de'?'Gesprächssprachen sind nicht kompatibel.':'Conversation languages are not compatible.'};
    let scores=[],goals=[],ageContrast=false;
    for(let i=0;i<members.length;i++) for(let j=i+1;j<members.length;j++) { const a=members[i],b=members[j]; let score=50; const contrast=(young(a.profile.ageBand)&&old(b.profile.ageBand))||(old(a.profile.ageBand)&&young(b.profile.ageBand)); if(contrast){score+=20;ageContrast=true;} const shared=intersect(a.profile.goals,b.profile.goals); goals.push(...shared); score+=Math.min(shared.length*8,16); if(a.profile.industry===b.profile.industry)score+=8; if(a.profile.experience!==b.profile.experience)score+=4; scores.push(score); }
    return {score:Math.round(scores.reduce((a,b)=>a+b,0)/scores.length),sharedSlots:slots,sharedGoals:[...new Set(goals)],ageContrast};
  }
  function fillManualSelects(selected=[]) {
    const options='<option value=""></option>'+state.members.filter(eligible).map(m=>`<option value="${m.id}">${escapeHtml(m.firstName)} ${escapeHtml(m.lastName)} — ${escapeHtml(m.email)}</option>`).join('');
    ['p1','p2','p3'].forEach((name,i)=>{const el=$('#manualMatchForm').elements[name];el.innerHTML=options;el.value=selected[i]||'';});
  }
  function openManualMatch(matchId=null) {
    const dlg=$('#manualMatchDialog'); const form=$('#manualMatchForm'); form.dataset.editId=matchId||''; const existing=matchId?state.matches.find(m=>m.id===matchId):null; fillManualSelects(existing?.memberIds||[]); $('#manualMatchMessage').textContent=''; dlg.showModal();
  }
  $('#manualMatch').addEventListener('click',()=>openManualMatch());
  $('#manualMatchForm').addEventListener('submit',e=>{
    if(e.submitter?.value==='cancel')return;
    e.preventDefault(); const form=e.currentTarget; const ids=[form.elements.p1.value,form.elements.p2.value,form.elements.p3.value].filter(Boolean); const msg=$('#manualMatchMessage');
    if(ids.length<2||new Set(ids).size!==ids.length){msg.textContent=lang==='de'?'Bitte zwei oder drei verschiedene Teilnehmer wählen.':'Choose two or three different participants.';return;}
    const members=ids.map(id=>state.members.find(m=>m.id===id)).filter(Boolean); const fit=manualFit(members); if(fit.error){msg.textContent=fit.error;return;}
    const editId=form.dataset.editId; if(editId){const match=state.matches.find(m=>m.id===editId);if(match){match.memberIds=ids;match.score=fit.score;match.sharedSlots=fit.sharedSlots;match.sharedGoals=fit.sharedGoals;match.ageContrast=fit.ageContrast;match.status='proposed';match.selectedDate=null;}}
    else createMatch(members,fit);
    saveState(); $('#manualMatchDialog').close(); renderAdmin(); toast(lang==='de'?'Match gespeichert.':'Match saved.');
  });
  $('#accessForm').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const email=String(fd.get('accessEmail')).trim().toLowerCase();if(!email)return;state.accessList[email]={access:fd.get('accessType'),active:true};saveState();e.currentTarget.reset();renderAdmin();toast(lang==='de'?'Zugangsliste aktualisiert.':'Access list updated.');});
  $('#runMatching').addEventListener('click',runMatching);
  $('#resetDemo').addEventListener('click',()=>{if(!confirm(lang==='de'?'Alle lokalen Demo-Daten zurücksetzen?':'Reset all local demo data?'))return;state=defaultState();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));sessionStorage.removeItem(SESSION_KEY);currentUserId=null;renderAuth();renderAdmin();toast(lang==='de'?'Demo zurückgesetzt.':'Demo reset.');});
  $('#exportMembers').addEventListener('click',()=>{
    const rows=[['name','email','access','active','profile_complete','matches_used'],...state.members.map(m=>[`${m.firstName} ${m.lastName}`,m.email,m.access,m.active,m.profileComplete,m.matchesUsed||0])];
    const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='bwk-lunchclub-members.csv';a.click();URL.revokeObjectURL(a.href);
  });

  function escapeHtml(s='') { return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }
  $$('[data-route]').forEach(el=>el.addEventListener('click',()=>route(el.dataset.route)));
  $('#languageToggle').addEventListener('click',()=>{lang=lang==='en'?'de':'en';localStorage.setItem(LANG_KEY,lang);applyLanguage();});

  applyLanguage(); renderAuth();
})();
