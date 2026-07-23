// ============================================================
//  Afkortingen-tooltips voor de MOZa CX-site
//  Conventie: elke afkorting in lopende tekst krijgt automatisch
//  een uitleg-tooltip met link. Nieuwe afkorting? Voeg hem toe aan
//  het AFKORTINGEN-woordenboek hieronder; elke pagina laadt dit
//  script onderaan met <script defer src=".../afkortingen.js">.
//  Werkt op hover, toetsenbord-focus en klik/tik; Esc sluit.
// ============================================================
(function () {
  'use strict';

  var AFKORTINGEN = {
    'MOZa':        { u: 'MijnOverheid Zakelijk: de plek waar ondernemers en organisaties hun zaken met de overheid regelen (prototype-omgeving).', l: '/index.html', lt: 'Naar de startpagina' },
    'KvK':         { u: 'Kamer van Koophandel: registreert bedrijven in het Handelsregister en ondersteunt ondernemers.', l: 'https://www.kvk.nl/' },
    'RVO':         { u: 'Rijksdienst voor Ondernemend Nederland: voert subsidieregelingen voor ondernemers uit.', l: 'https://www.rvo.nl/' },
    'MKB':         { u: 'Midden- en kleinbedrijf.', l: 'https://nl.wikipedia.org/wiki/Midden-_en_kleinbedrijf' },
    'ZZP':         { u: 'Zelfstandige zonder personeel.', l: 'https://nl.wikipedia.org/wiki/Zelfstandige_zonder_personeel' },
    'BV':          { u: 'Besloten vennootschap.', l: 'https://nl.wikipedia.org/wiki/Besloten_vennootschap' },
    'DevOps':      { u: 'Werkwijze die softwareontwikkeling (development) en technisch beheer (operations) combineert in eén team.', l: 'https://nl.wikipedia.org/wiki/DevOps' },
    'ICT':         { u: 'Informatie- en communicatietechnologie.', l: 'https://nl.wikipedia.org/wiki/Informatie-_en_communicatietechnologie' },
    'SSO':         { u: 'Single sign-on: eén keer inloggen geeft toegang tot meerdere systemen.', l: 'https://nl.wikipedia.org/wiki/Single_sign-on' },
    'API':         { u: 'Application programming interface: koppelvlak waarmee systemen met elkaar praten.', l: 'https://developer.overheid.nl/' },
    'mTLS':        { u: 'Mutual TLS: beveiligde verbinding waarbij beide kanten zich met een certificaat identificeren.', l: 'https://nl.wikipedia.org/wiki/Transport_Layer_Security' },
    'SLA':         { u: 'Service level agreement: afspraken over de kwaliteit, beschikbaarheid en ondersteuning van een dienst.', l: 'https://nl.wikipedia.org/wiki/Service_level_agreement' },
    'SNO':         { u: 'Serviceniveau-overeenkomst: de Logius-overeenkomst waarin de serviceafspraken over een dienst zijn vastgelegd (de Logius-variant van een SLA).', l: 'https://www.logius.nl/' },
    'CSR':         { u: 'Certificate signing request: aanvraagbestand voor een certificaat; de private key blijft bij de aanvrager.', l: 'https://nl.wikipedia.org/wiki/Certificate_signing_request' },
    'PKIoverheid': { u: 'Het Nederlandse stelsel voor digitale certificaten (public key infrastructure), beheerd door Logius.', l: 'https://www.logius.nl/domeinen/toegang/pkioverheid' },
    'PKI':         { u: 'Public key infrastructure: stelsel voor de uitgifte en het beheer van digitale certificaten.', l: 'https://www.logius.nl/domeinen/toegang/pkioverheid' },
    'DigiD':       { u: 'Inlogmiddel van de Nederlandse overheid voor burgers.', l: 'https://www.digid.nl/' },
    'eHerkenning': { u: 'Inlogmiddel waarmee ondernemers en organisaties zich online identificeren bij de overheid.', l: 'https://www.eherkenning.nl/' },
    'EH3':         { u: 'eHerkenning betrouwbaarheidsniveau 3 (substantieel).', l: 'https://www.eherkenning.nl/' },
    'EH4':         { u: 'eHerkenning betrouwbaarheidsniveau 4 (hoog).', l: 'https://www.eherkenning.nl/' },
    'EUDI':        { u: 'European Digital Identity: de Europese digitale identiteit (wallet) voor burgers en bedrijven.', l: 'https://en.wikipedia.org/wiki/European_Digital_Identity' },
    'EUBW':        { u: 'EU Business Wallet: de Europese bedrijvenwallet voor bevoegdheden en attestaties van organisaties.', l: 'https://en.wikipedia.org/wiki/European_Digital_Identity' },
    'DEI+':        { u: 'Demonstratie Energie- en Klimaatinnovatie: subsidieregeling van RVO.', l: 'https://www.rvo.nl/subsidies-financiering' },
    'CX':          { u: 'Customer experience: klantbeleving.', l: 'https://en.wikipedia.org/wiki/Customer_experience' },
  };

  // Langste eerst, zodat bijv. PKIoverheid vóór PKI matcht.
  var KEYS = Object.keys(AFKORTINGEN).sort(function (a, b) { return b.length - a.length; });
  var RE = new RegExp('(?<![A-Za-z0-9])(' + KEYS.map(function (k) { return k.replace(/\+/g, '\\+'); }).join('|') + ')(?![A-Za-z0-9])');

  // In deze context geen tooltips: interactieve elementen, tags/badges,
  // de print-banner, de minimap-kloon en al gewrapte afkortingen.
  var SKIP = 'a, button, script, style, kbd, .afk, .print-banner, .minimap, nldd-tag, nldd-badge';

  function wrap(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !RE.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        var el = n.parentElement;
        if (!el || el.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      var rest = node.nodeValue;
      var m;
      while ((m = RE.exec(rest))) {
        if (m.index > 0) frag.appendChild(document.createTextNode(rest.slice(0, m.index)));
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'afk';
        b.dataset.afk = m[1];
        b.setAttribute('aria-expanded', 'false');
        b.textContent = m[1];
        frag.appendChild(b);
        rest = rest.slice(m.index + m[1].length);
      }
      if (rest) frag.appendChild(document.createTextNode(rest));
      node.parentNode.replaceChild(frag, node);
    });
  }

  // Stijl (themabewust via light-dark; pagina's zetten color-scheme).
  var st = document.createElement('style');
  st.textContent =
    '.afk{font:inherit;color:inherit;background:none;border:none;padding:0;margin:0;' +
    'border-bottom:1px dotted currentColor;cursor:help;border-radius:2px;}' +
    '.afk:focus-visible{outline:2px solid #ffbf00;outline-offset:1px;}' +
    '.afk-tip{position:fixed;z-index:2000;max-width:320px;padding:10px 12px;border-radius:8px;' +
    'font-family:inherit;font-size:13px;line-height:1.5;font-weight:400;text-align:left;' +
    'background:light-dark(#1a1a2e,#f2f3f7);color:light-dark(#fff,#1a1a2e);' +
    'box-shadow:0 6px 24px rgba(0,0,0,.28);}' +
    '.afk-tip strong{font-weight:700;}' +
    '.afk-tip a{color:inherit;font-weight:600;display:inline-block;margin-top:4px;}' +
    '@media print{.afk{border-bottom:none;}.afk-tip{display:none !important;}}';
  document.head.appendChild(st);

  // Eén gedeelde tooltip; events gedelegeerd zodat ook gekloonde of uit
  // templates gekopieerde afkortingen (zijpaneel) gewoon werken.
  var tip = document.createElement('div');
  tip.className = 'afk-tip';
  tip.id = 'afk-tip';
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  document.body.appendChild(tip);

  var huidige = null;
  var verbergTimer = null;

  function toon(btn) {
    var d = AFKORTINGEN[btn.dataset.afk];
    if (!d) return;
    window.clearTimeout(verbergTimer);
    if (huidige && huidige !== btn) huidige.setAttribute('aria-expanded', 'false');
    huidige = btn;
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-describedby', 'afk-tip');
    tip.innerHTML = '<strong>' + btn.dataset.afk + '</strong> · ' + d.u +
      '<br><a href="' + d.l + '" target="_blank" rel="noopener">' + (d.lt || 'Meer informatie') + ' ↗</a>';
    tip.hidden = false;
    var r = btn.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = Math.max(8, Math.min(r.left + r.width / 2 - tw / 2, window.innerWidth - tw - 8));
    var y = r.bottom + 8 + th > window.innerHeight ? r.top - th - 8 : r.bottom + 8;
    tip.style.left = x + 'px';
    tip.style.top = Math.max(8, y) + 'px';
  }
  function verberg() {
    if (huidige) { huidige.setAttribute('aria-expanded', 'false'); huidige.removeAttribute('aria-describedby'); }
    huidige = null;
    tip.hidden = true;
  }
  function verbergStraks() {
    window.clearTimeout(verbergTimer);
    verbergTimer = window.setTimeout(verberg, 200);
  }

  document.addEventListener('mouseover', function (e) {
    var b = e.target.closest ? e.target.closest('.afk') : null;
    if (b) { toon(b); return; }
    if (e.target.closest && e.target.closest('.afk-tip')) { window.clearTimeout(verbergTimer); return; }
    if (huidige) verbergStraks();
  });
  document.addEventListener('focusin', function (e) {
    var b = e.target.closest ? e.target.closest('.afk') : null;
    if (b) toon(b); else if (huidige && !e.target.closest('.afk-tip')) verberg();
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.afk') : null;
    if (b) {
      e.preventDefault(); e.stopPropagation();
      if (huidige === b && !tip.hidden) verberg(); else toon(b);
      return;
    }
    if (!e.target.closest('.afk-tip')) verberg();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') verberg(); });
  window.addEventListener('scroll', verberg, true);
  window.addEventListener('resize', verberg);

  // Lopende tekst op de pagina + inhoud van templates (zijpanelen).
  wrap(document.body);
  document.querySelectorAll('template').forEach(function (t) { wrap(t.content); });
})();
