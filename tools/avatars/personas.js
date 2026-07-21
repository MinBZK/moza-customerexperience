// ============================================================
//  MOZa persona-avatars - stuurlijst (avataaars)
//  Enige bestand dat je aanpast. Daarna:  npm run generate
//  Kopieer daarna avatars/*.svg naar personas/images/.
// ============================================================
//
//  Per persona stuur je alleen de identiteitsvelden; de rest
//  (ogen, wenkbrauwen, mond, kleding, kledingkleur, gezichtshaar,
//  bril) volgt reproduceerbaar uit "name" als seed en varieert
//  dus vanzelf per persona.
//
//  Velden:
//    id        -> bestandsnaam (bv. "yassin" -> yassin.svg)
//    name      -> seed voor de automatische variatie (stabiel houden!)
//    gender    -> "male" | "female"  (bepaalt of gezichtshaar kan)
//    skinColor -> Tanned | Pale | Light | Brown | DarkBrown | Black
//                 (let op: Tanned rendert oranje; liever Light of Brown)
//    hairColor -> Auburn | Black | Blonde | BlondeGolden | Brown |
//                 BrownDark | Platinum | Red | SilverGray
//    nldd      -> Rijkskleur van de persona (NLDD-palet): cirkel = tint 150,
//                 kleding = 600. Zelfde kleur als de tags van de persona.
//    top       -> kapsel/hoofd:
//         mannen : ShortHairShortFlat, ShortHairShortCurly,
//                  ShortHairSides, ShortHairTheCaesar,
//                  ShortHairDreads01, ShortHairFrizzle
//         vrouwen: LongHairStraight, LongHairCurly, LongHairBob,
//                  LongHairBun, LongHairFro, LongHairMiaWallace
//         overig : Hijab, Turban, Hat, NoHair
// ============================================================

module.exports = [
  // ---- Ondernemers en intermediair ----
  { id: "yassin",  name: "Yassin Amrani", gender: "male",   skinColor: "Brown",     hairColor: "BrownDark", top: "ShortHairShortFlat" , nldd: "hemelblauw" },
  { id: "karin",   name: "Karin Jansen",  gender: "female", skinColor: "Light",     hairColor: "Brown",     top: "LongHairStraight"   , nldd: "donkergroen" },
  { id: "bilal",   name: "Bilal Yilmaz",  gender: "male",   skinColor: "Brown",     hairColor: "Black",     top: "ShortHairShortCurly", nldd: "paars" },
  { id: "sherida", name: "Sherida Pinas", gender: "female", skinColor: "DarkBrown", hairColor: "Black",     top: "LongHairCurly"      , nldd: "oranje" },

  // ---- Dienstverlener-persona's (draft): KvK en Logius ----
  // profiel: inkoopambtenaar, leest wat ouder, bruin haar
  { id: "annemieke", name: "Annemieke Verhoef",  gender: "female", skinColor: "Light", hairColor: "Brown",      top: "LongHairBob"       , nldd: "donkergeel" },
  // profiel: organisatiebeheerder, kalend met donkere baard
  { id: "ruben",     name: "Ruben van Leeuwen",  gender: "male",   skinColor: "Light", hairColor: "BrownDark",  top: "ShortHairSides"    , nldd: "lintblauw" },
  // profiel: dienstbeheerder, rossig opgestoken haar
  { id: "femke",     name: "Femke Bosch",        gender: "female", skinColor: "Pale",  hairColor: "Auburn",     top: "LongHairBun"       , nldd: "mintgroen" },
  // profiel: DevOps-engineer, donker haar (baard volgt evt. uit seed)
  { id: "deniz",     name: "Deniz Kaya",         gender: "male",   skinColor: "Brown", hairColor: "Black",      top: "ShortHairTheCaesar", nldd: "robijnrood" },
  // profiel: Logius-beheerder, leest ouder (grijze bob)
  { id: "marije",    name: "Marije de Wit",      gender: "female", skinColor: "Pale",  hairColor: "SilverGray", top: "LongHairBob"       , nldd: "violet" },
  // profiel: productmanager notificatiedienst (Logius), blond, jonger
  { id: "pieter",    name: "Pieter de Vries",    gender: "male",   skinColor: "Light", hairColor: "Blonde",     top: "ShortHairFrizzle", nldd: "bruin" },
];
