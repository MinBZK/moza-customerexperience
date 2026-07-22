---
name: personas
description: Maak of wijzig een MOZa-persona (overzichtstegel, detailpagina, avatar) volgens de vaste conventies van deze repo. Gebruik bij het toevoegen van persona's, het bijwerken van persona-inhoud, avatar-wijzigingen of vragen over de draft-status van een persona.
---

# MOZa persona's

Referentie-implementatie: de vier oorspronkelijke persona's (`personas/persona-yassin.html`, `persona-karin.html`, `persona-bilal.html`, `persona-sherida.html`) en het overzicht `personas/index.html`. Alle persona-pagina's delen exact dezelfde CSS en scripts; alleen de inhoud verschilt.

## Bestanden en head

- Overzicht: `personas/index.html` · detail: `personas/persona-<voornaam>.html` · avatar: `personas/images/<id>.svg`.
- Persona-pagina's laden de **lokale vendor-bundel** (`vendor/nldd/css/*.css` + `vendor/nldd/design-system.js`), niet de CDN. Daardoor werken nldd-componenten hier wel betrouwbaar (anders dan op de klantreis-pagina's) en is de pagina offline/preview-proof. `:root` heeft `color-scheme: light dark`: de pagina volgt de OS-voorkeur en de NLDD-tokens leveren de dark-variant; eigen CSS gebruikt `light-dark()` of tokens, en de printweergave forceert licht.

## Detailpagina: vaste anatomie

1. Sticky terug-balk (`.sticky-bar`, krimpt bij scrollen via het module-script).
2. Print-banner (Rijksoverheid-logo, alleen zichtbaar op de afdruk) + print-CSS die de NLDD-shell platslaat via shadow-injectie.
3. Profielkaart: avatar (`nldd-image` 176px, `shape="circle"`), `nldd-title` met overline **"Persona N · context · rol"** (2 of 3 delen, doorlopende nummering over alle persona's), `<h1>` naam, ondertitel, en een tag-row. De tag-row opent met de doelgroep-tag (`ondernemer` donkergroen / `dienstverlener` hemelblauw), gevolgd door 3-4 tags in de persona-kleur.
4. Drie context-items in een 3-koloms grid, vaste koppen en iconen: **Organisatie & context** (apartment-building), **Ervaring & vaardigheid** (star), **Frequentie van gebruik** (clock). Inhoud als korte fragmenten gescheiden door " · ".
5. Zes kaarten in een 2-koloms grid, vaste volgorde, koppen en iconen: **Doelen** (flag), **Taken & verantwoordelijkheden** (check-list), **Benodigde rechten & autorisatie** (key), **Machtigingen & mandaten** (handshake), **Authenticatie-context** (shield-check-mark), **Frustraties & pijnpunten** (face-frowning). Inhoud: `<ul>` met 2-3 beknopte punten.

**Nieuwe detailpagina maken: nooit handmatig kopiëren.** Genereer hem uit `persona-karin.html` als template met exacte string-ankers (title, avatar, overline, h1, subtitle, tag-row, 3 ctx-teksten, 6 kaart-lijsten) - zo blijven CSS, print-gedrag en scripts gegarandeerd identiek. Zo zijn de vijf dienstverlener-persona's ook gemaakt.

## Overzichtstegel

`nldd-card` in de `nldd-collection` (item-width 250px) met: avatar, naam (`nldd-title size="4"` met `<h2>`), en een `<div class="tile-tags">` (eigen flex-wrap-div; nldd-container wrapt niet en laat tags buiten de kaart lopen) met de rol-tag (persona-kleur) plus de **doelgroep-tag**: `ondernemer` (donkergroen) of `dienstverlener` (hemelblauw) - dezelfde kleuren als de doelgroep-tags op de klantreizen-index. `accessible-label="Naam - Rol"`. De tegel is een `<a class="tile">` naar de detailpagina, met `display: flex` en `width: 100%` op de kaart zodat alle kaarten in een rij dezelfde hoogte krijgen (de grid-tegel strekt, de kaart vult hem).

## Kleur per persona

Elke persona heeft één vaste Rijkskleur voor alle tags (tegel én detailpagina): yassin hemelblauw, karin donkergroen, bilal paars, sherida oranje, annemieke donkergeel, ruben lintblauw, femke mintgroen, deniz robijnrood, marije violet, pieter bruin. Kies voor een nieuwe persona een nog ongebruikte kleur uit de nldd-tag Rijkskleuren.

## Draft-status

Een persona kan concept zijn ("draft") totdat hij is vastgesteld:

- **Overzicht**: `<nldd-badge class="draft-badge" color="warning" text="Draft">` als eerste kind van de `nldd-card`, absoluut gepositioneerd rechtsboven (CSS `.tile .draft-badge` staat al in de pagina). Geen aparte banner of aparte collectie; draft-tegels staan gewoon tussen de rest. Zet "(draft)" achteraan het `accessible-label`.
- **Detailpagina**: direct onder `<div id="main">` een `<nldd-banner variant="warning" text="Draft" supporting-text="Deze persona is een concept en nog niet vastgesteld.">` + `nldd-spacer`.
- **Vaststellen** = badge, accessible-label-suffix en banner verwijderen; verder verandert er niets.

## Avatars

Avatars komen uit de generator in `tools/avatars/` (avataaars; niet van library wisselen - zie de toelichting daar). Werkwijze:

1. Voeg in `tools/avatars/personas.js` een regel toe: `id` (bestandsnaam), `name` (seed - stabiel houden, bepaalt ogen/mond/kleding/baard/bril), `gender`, `skinColor`, `hairColor`, `top` en `nldd` (de Rijkskleur van de persona: cirkel wordt tint 150, kleding 600). Let op: `Tanned` rendert oranje; leeftijd suggereer je alleen via grijs haar.
2. `npm install && npm run generate` in `tools/avatars/`.
3. Kopieer `avatars/<id>.svg` naar `personas/images/<id>.svg`; pagina's verwijzen naar `images/<id>.svg`.
   De SVG is **transparant** (geen achtergrond): de cirkel komt van de pagina zelf via `style="background: var(--primitives-color-<kleur>-150); border-radius: 50%; overflow: hidden;"` op de `nldd-image` **zonder** `shape="circle"` (de interne circle-clip van het component geeft anders een 1px-rand van de hostachtergrond rond de figuur; eén clip op de host is naadloos) (en in klantreizen via `.lane--<naam> .lane-avatar { background: ... }`). Zo volgt de cirkel automatisch light/dark mode.
4. Houd de set divers (huidskleur, gender, leeftijd, hoofdbedekking) over het geheel.

## Verder

- **Namen**: geen voor- of achternamen die al voorkomen bij bestaande persona's of klantreis-alter-ego's (o.a. Sander, Wei, Ahmed, Lotte).
- **Tellers**: werk bij een nieuwe persona de tag op de startpagina bij ("N persona's").
- **Klantreizen** linken vanuit hun zwembaan-labels naar de persona-pagina's ("Bekijk persona ↗" of "Alter-ego van persona X ↗"); controleer die links bij hernoemen.
- **Afkortingen** in lopende tekst krijgen automatisch een uitleg-tooltip met link via het gedeelde `/afkortingen.js` (elke pagina laadt het onderaan met `<script defer>`). Gebruik je een nieuwe afkorting, voeg hem dan toe aan het AFKORTINGEN-woordenboek in dat bestand; het script wrapt alle voorkomens zelf (niet in tags, links of knoppen).
- **Site-brede consistentie is verplicht.** Een persona leeft op meer plekken dan zijn eigen pagina: index-tag en accessible-label, kaart-inhoud van ándere persona's die naar zijn rol verwijzen, klantreis-zwembanen, legenda's, zijpaneel-teksten en HTML-comments. Bij elke hernoeming of inhoudswijziging: grep op de oude term over de hele repo (personas/ én klantreizen/) en werk álle vindplaatsen bij voordat je afrondt. Rond nooit af met een restant van de oude term (uitgezonderd het bevroren archief).
- Wijzigingen via een PR naar `main`; merge deployt automatisch. Schrijfstijl: Nederlands, geen em-dash, beknopt.
