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
- **Tijdmarkers**: bredere connector `.step-connector--gap` met `data-gap-label="na X"` op dezelfde kolom in elke rij die die kolom haalt; JS tekent één verticale band met klok per unieke x-positie.

## JS-blokken: wat is generiek, wat vul je in

Kopieer de drie scriptblokken uit de referentie integraal en pas alleen dit aan:

1. `MILESTONES` - nummer, fase, tekst per mijlpaal.
2. `EDGES` - baan-overstijgende flow: `[bron-aria-label, kolom, doel-aria-label, kolom]`. Binnen-baan pijlen (zichtbare connectors) tekent JS zelf. **De flow loopt altijd ononderbroken door langs de hoofdstappen, óók over de fasegrenzen heen.** Verbind daarom de laatste stap van elke fase met de eerste stap van de volgende fase met een expliciete `EDGES`-entry (de fasekolommen staan naast elkaar, dus dat is een gewone voorwaartse pijl van rechts naar links binnen). Zonder die entry ontstaat er een "dood eind" tussen bijvoorbeeld de laatste Uitvoeren-stap en de eerste Opvolgen-stap. Elke hoofdstap heeft dus een inkomende én uitgaande verbinding, behalve de allereerste en de allerlaatste van de hele reis.
3. Reis-specifieke blokken uit de subsidieaanvraag NIET meenemen naar andere reizen: gedeelde Wei & Ahmed-cellen (`alignAhmedSolo`, wa-chips), de clippy-easter-egg, de kolom-injectie ("Nieuwe tijd-kolom"), en de Systeem-sublanen/uitklapper - tenzij de nieuwe reis zoiets nodig heeft.

Generiek en ongemoeid laten: minimap + sleep-pan, zoomniveaus (1 mijlpalen / 2 hoofdlijnen / 3 alle details), details-knoppen + tag-overerving, tag-kleuring, flow-tekenen, tijdmarkers, fasekop-navigatie, volledig scherm, toetsenbord (pijltjes, +/−, i, f, Esc), zijpaneel met doorbladeren.

## Werkwijze

- Wijzigingen via een PR naar `main`; merge deployt automatisch (ZAD) naar cx-moza.rijksapp.dev. Vóór een deploy eerst `gh pr list` (open PR's mergen).
- Lokaal verifiëren: statische server op de repo-root. De Claude-preview-sandbox mag niet in `~/Documents` lezen; rsync de working tree naar de scratchpad en serveer die kopie.
- Schrijfstijl: Nederlands, geen em-dash (altijd een gewoon streepje), beknopt.
- **Afkortingen** in lopende tekst krijgen automatisch een uitleg-tooltip met link via het gedeelde `/afkortingen.js` (elke pagina laadt het onderaan met `<script defer>`). Gebruik je een nieuwe afkorting, voeg hem dan toe aan het AFKORTINGEN-woordenboek in dat bestand; het script wrapt alle voorkomens zelf (niet in tags, links of knoppen).
- **Consistent met de rest van de CX-site**: rolnamen en terminologie in zwembaan-labels, legenda en zijpaneel-teksten moeten overeenkomen met de actuele persona-pagina's. Verandert een persona van titel, grep dan ook hier op de oude term.
- Controleer na het bouwen minimaal: mijlpaal-volgorde leest chronologisch over de banen heen (x-posities oplopend), de strip op zoomniveau 1 klopt met de badges, elke `step-tag--info` opent het juiste paneel, en de flow-pijlen sluiten aan (geen zwevende EDGES door verkeerde kolom-indexen of aria-labels). **Loop de flow van begin tot eind na: er mag nergens een onderbreking zitten tussen twee opeenvolgende hoofdstappen, ook niet op de overgang tussen twee fasen.**
