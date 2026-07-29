---
name: klantreis-canvas
description: Bouw of wijzig een MOZa-klantreis (zwembanen-canvas) volgens de vaste conventies van deze repo. Gebruik bij het aanmaken van een nieuwe klantreis, het toevoegen van stappen/mijlpalen/tags aan een bestaande klantreis, of vragen over het canvas (zoom, minimap, flow-pijlen, verdiepingen, zijpaneel).
---

# MOZa klantreis-canvas

Referentie-implementatie: `klantreizen/gezamenlijke-subsidieaanvraag/index.html`. Een nieuwe klantreis bouw je door die pagina als basis te nemen, de reis-specifieke onderdelen te vervangen en de generieke machinerie intact te laten. Lees de referentie er altijd bij; dit document beschrijft wat vast ligt en wat je per reis invult.

## Bestandsstructuur en vindbaarheid

- Elke klantreis: `klantreizen/<slug>/index.html` (slug in kebab-case, Nederlands).
- Tegel toevoegen in `klantreizen/index.html` met een doelgroep-tag: `ondernemer` (groen) of `dienstverlener` (donkerblauw); die kleuren zijn gereserveerd voor de doelgroep-tags en worden door geen enkele persona gebruikt. Concept-reizen krijgen daarnaast een `draft`-tag (warning) en een draft-banner op de pagina zelf.
- Teller op de startpagina (`index.html`) telt alleen actieve klantreizen, niet het archief.
- Persona-namen mogen niet botsen met bestaande persona's of alter-ego's (zie personas/). Zwembaan-labels linken naar de persona-pagina ("Bekijk persona ↗" of "Alter-ego van persona X ↗").
- **Zwembaan-avatars gebruiken altijd exact dezelfde avatar als de persona-pagina waar de baan aan gekoppeld is**: `../../personas/images/<id>.svg` (de avataaars-svg's, transparant met cirkel via `background: var(--primitives-color-<kleur>-150)` op de baan). Nooit oude `avatar-*.png`'s of afwijkende afbeeldingen gebruiken; wijzigt een persona-avatar, dan volgen alle klantreizen automatisch mee via het gedeelde bestand.

## Head en stijl-laag

- Alleen design-tokens + fonts: `settings.css` en het design-system-module via esm.sh, plus Inter en IBM Plex Mono via Google Fonts. **Geen nldd-componenten in de body** - het canvas is eigen CSS bovenop de tokens. `nldd-banner` e.d. renderen niet betrouwbaar via de CDN; gebruik voor de draft-banner de eigen `.draft-banner`-opmaak (zie afnemen-notificatiedienst).
- Vaste kleurtokens in `:root`: `--ink/--paper/--white/--border` etc. en per zwembaan `--<naam>` + `--<naam>-tint`. **Alle kleuren verwijzen naar NLDD-primitives** (die zelf `light-dark()` zijn), zodat het canvas automatisch dark mode volgt: neutralen op `--primitives-color-neutral-*` (ink=900, soft=700, mute=600, paper=50, white=0, border=300), zwembanen op de Rijkskleur van de persona (`-600` voor tekst/ring, `-150` voor vlakvulling), autorisatie `rood-600/100`, authenticatie `donkerblauw-600`, alternatieve route `oranje-600/100`. Waar `#fff` op een `--ink`-vlak stond: `var(--white)` gebruiken (flipt mee). Geen `data-scheme="light"` op `<html>` en `color-scheme: light dark` op `:root`. Het vaste donkerblauwe zijpaneel (#154273) blijft bewust vast in beide thema's.

## Canvas-anatomie (vaste opbouw)

```
section.journey
├── .journey-toolbar        titel · sneltoetsen · zoom (− label +) · volledig scherm
├── .milestone-strip        zoomniveau 1 (wordt door JS gevuld uit MILESTONES)
├── .journey-viewport       pannable viewport (sleep, scroll, toetsenbord)
│   └── .journey-grid       grid: 240px labelkolom + 3 fasekolommen
│       ├── .phase-head     Oriënteren / Uitvoeren / Opvolgen (sticky, klikbaar)
│       ├── .lane-label     per persona: avatar, naam, rol, persona-link (sticky links)
│       └── .phase-cell     per baan × fase, aria-label="<Naam> - <Fase>" (uniek!)
│           └── .step-row   stappen links→rechts op globale tijd-kolommen
└── .minimap                2D-overzicht rechtsonder
```

- **Tijd-kolommen**: elke `.step-row` bestaat uit afwisselend `.step-wrap` en `.step-connector`; slot-index van kolom *c* is `2*c`. Banen zonder stap op een kolom vullen met `--spacer`-varianten, zodat alles verticaal uitlijnt. Een rij mag eerder eindigen dan de laatste kolom.
- **Connectors**: binnen een baan een zichtbare `.step-connector` alleen tussen twee direct opeenvolgende stappen; de pijl zelf wordt door JS als SVG getekend (de → glyph is transparant). Kruist de flow van baan, dan spacers gebruiken en de sprong opnemen in `EDGES`.
- **Mijlpalen**: `data-milestone="n"` op de `.step` geeft de genummerde badge. Zelfde nummers + teksten in het JS-array `MILESTONES` (voedt de strip op zoomniveau 1). Geen zwevende "waar ben ik"-indicator over het canvas; de sticky fasekoppen en badges zijn de oriëntatie.
- **Verdiepingen**: onder een stap `.step-verdieping-connector` + `.step-verdieping` (herhalend). Verborgen op niveau 2, zichtbaar op niveau 3; JS voegt automatisch een "n details"-knop toe en erft tags van verdiepingen naar de parent-stap (kloon met doorklik naar het origineel).
- **Tags**: `.step-tag` met slot-icoon (lock-SVG) + label. Kleurklasse wordt door JS toegekend op labeltekst: "Inloggen" (blauw), "Goedkeuren" (teal), "Wie mag wat" (paars), "Autorisatie" (rood). Klikbare uitleg: `<button class="step-tag step-tag--info">` met `data-persona`, `data-phase`, `data-step`, `data-panel-title` en `data-panel-body` (platte tekst) of `data-panel-body-ref` (id van een `<template>` voor rijke inhoud) en optioneel `data-vraagstukken-ref`.
- **Zijpaneel**: vaste markup (`#sidePanel` + `#sideScrim` + templates onderaan). Rijke panelen gebruiken `.wmw-item`-regels met gekleurde dots (`var(--<naam>)`) en `strong.p-<naam>` (kleur = tint-variabele); timeline-panelen gebruiken `.tl`-opmaak (Nu/Binnenkort/Toekomst). De generieke "Vraagstukken"-lijst in de footer per reis aanpassen aan de actoren.
- **Zijpaneel-footer sticky**: de sectie met de vorige/volgende-navigatie en het Vraagstukken-blok staat áltijd sticky aan de onderkant van de blauwe overlay. Het paneel is een flex-kolom (`display: flex; flex-direction: column`), alleen `.side-panel-scroll` scrollt (`flex: 1 1 auto; overflow-y: auto; min-height: 0`), de footer heeft `flex-shrink: 0`. Geen min-height-hacks op de scroll-sectie - die conflicteren met de flex-scroll.
- **Vraagstukken visueel sterk**: het Vraagstukken-blok moet de aandacht trekken op het donkerblauwe paneel - amberkleurige accentbalk links (`border-left: 4px solid #ffbf00`), amberkleurige titel, lichte vlakvulling (`rgba(255,255,255,.1)`) en een subtiele schaduw. Niet terugbrengen naar een onopvallend randje.
- **Tijdmarkers**: bredere connector `.step-connector--gap` met `data-gap-label="na X"` op dezelfde kolom in elke rij die die kolom haalt; JS tekent één verticale band met klok per unieke x-positie.
- **Systeem-sublanen (uitklapbaar)**: onder de Systeem-baan kunnen per dienst sub-rijen staan (`.lane-label.lane--sub` + lege `.phase-cell.lane--sub`-rijen; de laatste rij krijgt `lane--sub-end`). Houd de lijst met diensten initieel leeg (lege rijen, geen stappen) en toon op het Systeem-label alleen een knop met de naam **"Details"** die de sectie in- en uitklapt (`.journey-grid.systeem-open`; na togglen `layout()` + `buildClone()` aanroepen).
- **Rijen vanaf Systeem visueel gedempt**: de Systeem-rij (en alles eronder) krijgt een duidelijke scheidslijn met de persona-rijen erboven (`border-top: 2px solid var(--ink-mute)`) en een afwijkende, opake achtergrond (`var(--primitives-color-neutral-100)`, themabewust); stappen en label licht gedempt via opacity. Geen transparante achtergronden op sticky labels (die laten scrollende content doorschijnen).
- **Vraagstukken-rij**: onder de Systeem-rij(en) staat een rij "Vraagstukken" die per fase automatisch de vraagstukken verzamelt uit de zijpaneel-templates (knoppen met `data-vraagstukken-ref` per `data-phase`, gededupliceerd per fase) - zelfde bron als de blauwe overlay, dus altijd synchroon. Amber accent zoals het blok in het zijpaneel (in licht thema een donkerder amber voor contrast).

## JS-blokken: wat is generiek, wat vul je in

Kopieer de drie scriptblokken uit de referentie integraal en pas alleen dit aan:

1. `MILESTONES` - nummer, fase, tekst per mijlpaal.
2. `EDGES` - baan-overstijgende flow: `[bron-aria-label, kolom, doel-aria-label, kolom]`. Binnen-baan pijlen (zichtbare connectors) tekent JS zelf. **De flow loopt altijd ononderbroken door langs de hoofdstappen, óók over de fasegrenzen heen.** Verbind daarom de laatste stap van elke fase met de eerste stap van de volgende fase met een expliciete `EDGES`-entry (de fasekolommen staan naast elkaar, dus dat is een gewone voorwaartse pijl van rechts naar links binnen). Zonder die entry ontstaat er een "dood eind" tussen bijvoorbeeld de laatste Uitvoeren-stap en de eerste Opvolgen-stap. Elke hoofdstap heeft dus een inkomende én uitgaande verbinding, behalve de allereerste en de allerlaatste van de hele reis.
3. Reis-specifieke blokken uit de subsidieaanvraag NIET meenemen naar andere reizen: gedeelde Wei & Ahmed-cellen (`alignAhmedSolo`, wa-chips), de clippy-easter-egg en de kolom-injectie ("Nieuwe tijd-kolom") - tenzij de nieuwe reis zoiets nodig heeft. De Systeem-sublanen/uitklapper en de Vraagstukken-rij zijn wél generieke patronen (zie Canvas-anatomie).

Generiek en ongemoeid laten: minimap + sleep-pan, zoomniveaus (1 mijlpalen / 2 hoofdlijnen / 3 alle details), details-knoppen + tag-overerving, tag-kleuring, flow-tekenen, tijdmarkers, fasekop-navigatie, volledig scherm, toetsenbord (pijltjes, +/−, i, f, Esc), zijpaneel met doorbladeren.

## Werkwijze

- Wijzigingen via een PR naar `main`; merge deployt automatisch (ZAD) naar cx-moza.rijksapp.dev. Vóór een deploy eerst `gh pr list` (open PR's mergen).
- Lokaal verifiëren: statische server op de repo-root. De Claude-preview-sandbox mag niet in `~/Documents` lezen; rsync de working tree naar de scratchpad en serveer die kopie.
- Schrijfstijl: Nederlands, geen em-dash (altijd een gewoon streepje), beknopt.
- **Afkortingen** in lopende tekst krijgen automatisch een uitleg-tooltip met link via het gedeelde `/afkortingen.js` (elke pagina laadt het onderaan met `<script defer>`). Gebruik je een nieuwe afkorting, voeg hem dan toe aan het AFKORTINGEN-woordenboek in dat bestand; het script wrapt alle voorkomens zelf (niet in tags, links of knoppen).
- **Consistent met de rest van de CX-site**: rolnamen en terminologie in zwembaan-labels, legenda en zijpaneel-teksten moeten overeenkomen met de actuele persona-pagina's. Verandert een persona van titel, grep dan ook hier op de oude term.
- **Alle teksten moeten altijd goed leesbaar zijn (voldoende contrast), in beide thema's.** Let vooral op het vaste donkerblauwe zijpaneel: dat verandert niet mee met dark mode, maar themabewuste `light-dark()`-tokens (zoals de persona-tinten) wél - in dark mode resolven die naar donkere waarden en worden namen donker-op-donker onleesbaar. Fix: `.side-panel-body.is-rich strong { color-scheme: light; }` zodat tint-vars daar altijd hun lichte variant gebruiken. Controleer panelen (en andere vaste vlakken) in licht én donker thema.
- **Teksten passen altijd binnen de boxen, maar knip woorden alleen op als het echt niet anders kan.** Zet `overflow-wrap: break-word;` op `.step` en `.step-verdieping`: een woord breekt dan alleen af als het breder is dan de box zelf (bv. "gebruikersacceptatietest" in een 168px-box); normale woorden worden nooit opgeknipt. Geen `hyphens: auto` (dat knipt ook woorden op die op de volgende regel passen). Controleer na tekstwijzigingen op overflow: `el.scrollWidth > el.clientWidth` mag nergens waar zijn.
- Controleer na het bouwen minimaal: mijlpaal-volgorde leest chronologisch over de banen heen (x-posities oplopend), de strip op zoomniveau 1 klopt met de badges, elke `step-tag--info` opent het juiste paneel, en de flow-pijlen sluiten aan (geen zwevende EDGES door verkeerde kolom-indexen of aria-labels). **Loop de flow van begin tot eind na: er mag nergens een onderbreking zitten tussen twee opeenvolgende hoofdstappen, ook niet op de overgang tussen twee fasen.**
