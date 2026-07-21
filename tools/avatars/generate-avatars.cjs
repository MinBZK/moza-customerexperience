// ============================================================
//  generate-avatars.cjs
//  Genereert per persona EEN zelfstandige SVG (avataaars) die je
//  als <img src="..."> in de MOZa persona-pagina's zet.
//
//  Draaien:  npm install   &&   npm run generate
//  Output:   ./avatars/<id>.svg   +   ./preview.html
// ============================================================

const fs = require("fs");
const path = require("path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const Avatar = require("avataaars").default;

const personas = require("./personas.js");

// ---- NLDD-kleurenpalet (light-waarden uit palettes.generated.css) ----
// Per persona (veld "nldd" in personas.js): achtergrondcirkel = tint 150,
// kleding = 600. Zo draagt elke avatar de Rijkskleur die de persona ook op
// tags en in de klantreis-zwembanen heeft.
const NLDD = {
  hemelblauw:  { bg: "#B4D1ED", clothes: "#1065A0" },
  donkergroen: { bg: "#BAD4C0", clothes: "#3A6B48" },
  paars:       { bg: "#E2C1FF", clothes: "#794E9B" },
  oranje:      { bg: "#F6C3A5", clothes: "#9B4A00" },
  donkergeel:  { bg: "#FFC45C", clothes: "#815A00" },
  lintblauw:   { bg: "#B1D1F7", clothes: "#366396" },
  mintgroen:   { bg: "#96DCC5", clothes: "#006E58" },
  robijnrood:  { bg: "#FFBCCA", clothes: "#BE0B58" },
  violet:      { bg: "#FFBBD3", clothes: "#B71B6C" },
};

// ---------------------- CONFIG ------------------------------
const CONFIG = {
  outDir: path.join(__dirname, "avatars"), // waar de SVG's komen
  // "Transparent": geen achtergrond in de SVG. De pagina's geven de cirkel
  // via CSS met de NLDD-token van de persona-kleur (tint 150), zodat de
  // achtergrond automatisch meebeweegt met light/dark mode.
  avatarStyle: "Transparent",
};
// ------------------------------------------------------------

// Deterministische seed uit de naam (fnv1a -> mulberry32),
// zodat dezelfde persona altijd exact hetzelfde blijft.
function rng(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  let a = h >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];

// Onderdelen die per persona automatisch varieren.
// (identiteit - huidskleur/haar/kapsel - staat in personas.js)
const EYES     = ["Default", "Happy", "Squint", "Wink", "Side"];
const BROWS    = ["Default", "DefaultNatural", "FlatNatural", "RaisedExcited", "UpDown"];
const MOUTH    = ["Default", "Smile", "Twinkle", "Serious"];
const CLOTHES  = ["BlazerShirt", "BlazerSweater", "CollarSweater", "ShirtCrewNeck", "Hoodie", "ShirtVNeck"];
const CLOTHE_C = ["Blue02", "Blue03", "Gray01", "Gray02", "Heather", "PastelBlue", "White"];
const BEARD    = ["Blank", "Blank", "Blank", "BeardLight", "BeardMedium"]; // meestal geen
const GLASSES  = ["Blank", "Blank", "Blank", "Blank", "Prescription02"];   // af en toe

fs.mkdirSync(CONFIG.outDir, { recursive: true });
const cards = [];

personas.forEach((p) => {
  const rand = rng(p.name);

  const props = {
    avatarStyle: CONFIG.avatarStyle,
    // ---- gestuurd per persona (uit personas.js) ----
    topType: p.top,
    hairColor: p.hairColor,
    skinColor: p.skinColor,
    // ---- automatisch gevarieerd op basis van de naam ----
    accessoriesType: pick(rand, GLASSES),
    facialHairType: p.gender === "male" ? pick(rand, BEARD) : "Blank",
    facialHairColor: p.hairColor,
    clotheType: pick(rand, CLOTHES),
    // rand-call bewust behouden voor een stabiele seed-volgorde; de waarde
    // zelf wordt hieronder overschreven met een marker en dan NLDD-gekleurd
    clotheColor: pick(rand, CLOTHE_C),
    eyeType: pick(rand, EYES),
    eyebrowType: pick(rand, BROWS),
    mouthType: pick(rand, MOUTH),
  };

  if (NLDD[p.nldd]) props.clotheColor = "Heather"; // marker #3C4F5C
  let svg = renderToStaticMarkup(React.createElement(Avatar, props));
  const pal = NLDD[p.nldd];
  if (pal) {
    svg = svg.replace(/#3C4F5C/gi, pal.clothes); // kleding via marker -> 600
    svg = svg.replace(/#262E33/gi, pal.clothes); // blazer-body (negeert clotheColor) -> 600
  }
  fs.writeFileSync(
    path.join(CONFIG.outDir, `${p.id}.svg`),
    '<?xml version="1.0" encoding="UTF-8"?>\n' + svg + "\n",
    "utf8"
  );

  cards.push(
    `<figure style="margin:0;text-align:center">
       <img src="avatars/${p.id}.svg" width="150" height="150" alt="${p.name}"
            style="border-radius:50%;background:#e8eff3;display:block;margin:0 auto">
       <figcaption style="margin-top:10px;font:500 15px system-ui">${p.name}</figcaption>
       <div style="font:13px system-ui;color:#667">${p.gender} · ${p.skinColor} · ${p.hairColor}</div>
     </figure>`
  );
});

const preview =
`<!doctype html><meta charset="utf-8"><title>MOZa persona-avatars</title>
<body style="font-family:system-ui;background:#fff;color:#1a1a1a;padding:32px">
  <h1 style="font-weight:500">MOZa persona-avatars</h1>
  <p style="color:#556">avataaars, elk als losse SVG via &lt;img&gt;. Gestuurd op huidskleur, haar en kapsel; ogen, mond, kleding en gezichtshaar varieren automatisch per naam.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:28px;margin-top:28px;max-width:900px">
    ${cards.join("\n")}
  </div>
</body>`;
fs.writeFileSync(path.join(__dirname, "preview.html"), preview, "utf8");

console.log(`Klaar: ${personas.length} SVG-avatars in ${path.relative(process.cwd(), CONFIG.outDir)}/  (+ preview.html)`);
