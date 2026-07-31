export type SimulatorStep = 0 | 1 | 2;

export type VehicleTypeId =
  | "sedan"
  | "suv"
  | "mini-suv"
  | "pickup"
  | "coupe"
  | "hatchback";

export type WrapFinishId = "gloss" | "satin" | "matte" | "carbon";

export type WrapCategoryId = "all" | "solid" | "shift" | "pearl" | "ppf" | "carbon";

export interface VehicleType {
  id: VehicleTypeId;
  name: string;
  description: string;
  features: string[];
  vehicleId: string;
  modelPath: string;
  modelScale?: number;
}

export interface WrapOption {
  id: string;
  name: string;
  category: Exclude<WrapCategoryId, "all">;
  colors: string[];
  brand?: string;
  series?: string;
  ppfType?: "none" | "clear" | "tint";
}

export interface WindowFilm {
  id: string;
  name: string;
  /** UI swatch darkness (0 clear → 1 near-black) */
  overlayOpacity: number;
  /** UI swatch + glass base color (Phantom-style light tints, not pure black) */
  overlayColor: string;
  roughness: number;
  transmission: number;
  thickness: number;
  attenuationDistance: number;
}

export const vehicleTypes: VehicleType[] = [
  {
    id: "sedan",
    name: "Sedan",
    description: "Luxury sedan with elegant design",
    features: ["Premium comfort", "Executive styling", "Advanced technology"],
    vehicleId: "bmw-m4",
    modelPath: "/models/86ql3dghcf0.glb",
  },
  {
    id: "suv",
    name: "SUV",
    description: "Commanding presence with versatile capability",
    features: ["Elevated position", "Spacious interior", "All-terrain ready"],
    vehicleId: "mercedes-g-wagon",
    modelPath: "/models/cs6hv1t8ckpbo.glb",
    modelScale: 1.15,
  },
  {
    id: "mini-suv",
    name: "Mini SUV",
    description: "Compact SUV with urban agility",
    features: ["City-friendly size", "Efficient performance", "Modern design"],
    vehicleId: "toyota-prado",
    modelPath: "/models/cs6hv1t8ckpbo.glb",
    modelScale: 0.95,
  },
  {
    id: "pickup",
    name: "Pickup",
    description: "Powerful double cabin utility truck",
    features: ["Double cabin", "Cargo capacity", "Off-road capability"],
    vehicleId: "toyota-prado",
    modelPath: "/models/gqbnkbwsmehl.glb",
    modelScale: 1.05,
  },
  {
    id: "coupe",
    name: "Coupe",
    description: "Athletic performance with striking design",
    features: ["Sport-tuned", "Aerodynamic", "Driver-focused"],
    vehicleId: "bmw-m4",
    modelPath: "/models/86ql3dghcf0.glb",
    modelScale: 0.92,
  },
  {
    id: "hatchback",
    name: "Hatchback",
    description: "Versatile compact with modern appeal",
    features: ["Flexible cargo space", "Urban agility", "Efficient design"],
    vehicleId: "toyota-prado",
    modelPath: "/models/gqbnkbwsmehl.glb",
    modelScale: 0.88,
  },
];

export const wrapFinishes: { id: WrapFinishId; label: string }[] = [
  { id: "gloss", label: "Gloss" },
  { id: "satin", label: "Satin" },
  { id: "matte", label: "Matte" },
  { id: "carbon", label: "Carbon" },
];

export const wrapCategories: { id: WrapCategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "solid", label: "Solid" },
  { id: "shift", label: "Shift" },
  { id: "pearl", label: "Pearl" },
  { id: "carbon", label: "Carbon" },
  { id: "ppf", label: "PPF" },
];

/** Synced from Phantom Wrap simulator palette + KYRA carbon wraps */
export const wrapCatalog: WrapOption[] = [
  { id: "midnight-blue", name: "Midnight Blue Metallic", category: "solid", colors: ["#0F2C59"], brand: "KYRA", series: "Premium" },
  { id: "gunmetal-grey", name: "Gunmetal Grey", category: "solid", colors: ["#3A4655"], brand: "KYRA", series: "Premium" },
  { id: "steel-blue", name: "Steel Blue", category: "solid", colors: ["#5C7FAE"], brand: "KYRA", series: "Premium" },
  { id: "cobalt-blue", name: "Cobalt Blue", category: "solid", colors: ["#4A74C9"], brand: "KYRA", series: "Premium" },
  { id: "emerald-teal", name: "Emerald Teal", category: "solid", colors: ["#0E876A"], brand: "KYRA", series: "Premium" },
  { id: "blaze-orange", name: "Blaze Orange", category: "solid", colors: ["#D96419"], brand: "KYRA", series: "Premium" },
  { id: "copper-orange", name: "Copper Orange", category: "solid", colors: ["#B8541D"], brand: "KYRA", series: "Premium" },
  { id: "vivid-sky-blue", name: "Vivid Sky Blue", category: "solid", colors: ["#44A9E5"], brand: "KYRA", series: "Premium" },
  { id: "race-yellow", name: "Race Yellow", category: "solid", colors: ["#D7A816"], brand: "KYRA", series: "Premium" },
  { id: "desert-champagne", name: "Desert Champagne", category: "solid", colors: ["#B9A170"], brand: "KYRA", series: "Premium" },
  { id: "candy-red", name: "Candy Red", category: "solid", colors: ["#A9132F"], brand: "KYRA", series: "Premium" },
  { id: "electric-blue", name: "Electric Blue", category: "solid", colors: ["#0C3C86"], brand: "KYRA", series: "Premium" },
  { id: "night-navy", name: "Night Navy", category: "solid", colors: ["#1B2A45"], brand: "KYRA", series: "Premium" },
  { id: "sand-beige", name: "Sand Beige", category: "solid", colors: ["#B49C72"], brand: "KYRA", series: "Premium" },
  { id: "olive-bronze", name: "Olive Bronze", category: "solid", colors: ["#5F5D4A"], brand: "KYRA", series: "Premium" },
  { id: "metal-silver", name: "Metal Silver", category: "solid", colors: ["#9FA1A0"], brand: "KYRA", series: "Premium" },
  { id: "glacier-white", name: "Glacier White", category: "solid", colors: ["#F3F4F6"], brand: "KYRA", series: "Premium" },
  { id: "pearl-white", name: "Pearl White", category: "pearl", colors: ["#F6F7F2"], brand: "KYRA", series: "Pearl" },
  { id: "ivory-cream", name: "Ivory Cream", category: "solid", colors: ["#E8E2D0"], brand: "KYRA", series: "Premium" },
  { id: "neon-yellow", name: "Neon Yellow", category: "solid", colors: ["#CBE03A"], brand: "KYRA", series: "Premium" },
  { id: "piano-black", name: "Piano Black", category: "solid", colors: ["#0B0E12"], brand: "KYRA", series: "Premium" },
  { id: "smoke-grey", name: "Smoke Grey", category: "solid", colors: ["#596370"], brand: "KYRA", series: "Premium" },
  { id: "british-racing-green", name: "British Racing Green", category: "solid", colors: ["#1D4A3A"], brand: "KYRA", series: "Premium" },
  { id: "graphite-olive", name: "Graphite Olive", category: "solid", colors: ["#4A554A"], brand: "KYRA", series: "Premium" },
  { id: "charcoal-metallic", name: "Charcoal Metallic", category: "solid", colors: ["#2D333A"], brand: "KYRA", series: "Premium" },
  { id: "midnight-indigo", name: "Midnight Indigo", category: "solid", colors: ["#1A2958"], brand: "KYRA", series: "Premium" },
  { id: "burgundy-candy", name: "Burgundy Candy", category: "solid", colors: ["#4B1A2D"], brand: "KYRA", series: "Premium" },
  { id: "tangerine", name: "Tangerine", category: "solid", colors: ["#D9772E"], brand: "KYRA", series: "Premium" },
  { id: "rich-gold", name: "Rich Gold", category: "solid", colors: ["#BF973D"], brand: "KYRA", series: "Premium" },
  { id: "cement-grey", name: "Cement Grey", category: "solid", colors: ["#727982"], brand: "KYRA", series: "Premium" },
  { id: "nardo-style-grey", name: "Nardo Style Grey", category: "solid", colors: ["#8A8D90"], brand: "KYRA", series: "Premium" },
  { id: "cool-grey", name: "Cool Grey", category: "solid", colors: ["#6F7378"], brand: "KYRA", series: "Premium" },
  { id: "prism-oilslick", name: "Prism Oilslick", category: "shift", colors: ["#262F3A", "#554536"], brand: "KYRA", series: "Color Shift" },
  { id: "black-gold-flip", name: "Black Gold Flip", category: "shift", colors: ["#201F1B", "#9B8142"], brand: "KYRA", series: "Color Shift" },
  { id: "violet-blue-shift", name: "Violet Blue Shift", category: "shift", colors: ["#5C3BA9", "#1F62D6"], brand: "KYRA", series: "Color Shift" },
  { id: "white-opal-shift", name: "White Opal Shift", category: "shift", colors: ["#F4F8FF", "#BFD5EE"], brand: "KYRA", series: "Color Shift" },
  { id: "black-violet-shift", name: "Black Violet Shift", category: "shift", colors: ["#120E1B", "#5A3E80"], brand: "KYRA", series: "Color Shift" },
  { id: "black-emerald-shift", name: "Black Emerald Shift", category: "shift", colors: ["#131A17", "#2C775E"], brand: "KYRA", series: "Color Shift" },
  { id: "black-teal-shift", name: "Black Teal Shift", category: "shift", colors: ["#111A1F", "#1E6370"], brand: "KYRA", series: "Color Shift" },
  { id: "blue-cyan-shift", name: "Blue Cyan Shift", category: "shift", colors: ["#234F9A", "#42B5E6"], brand: "KYRA", series: "Color Shift" },
  { id: "red-black-shift", name: "Red Black Shift", category: "shift", colors: ["#8E2035", "#1E1215"], brand: "KYRA", series: "Color Shift" },
  { id: "midnight-purple-shift", name: "Midnight Purple Shift", category: "shift", colors: ["#20265C", "#7036A4"], brand: "KYRA", series: "Color Shift" },
  { id: "alpine-white-pearl", name: "Alpine White Pearl", category: "pearl", colors: ["#F5F6F2"], brand: "KYRA", series: "Pearl" },
  { id: "satin-black-metallic", name: "Satin Black Metallic", category: "solid", colors: ["#101217"], brand: "KYRA", series: "Premium" },
  { id: "starry-black-pearl", name: "Starry Black Pearl", category: "pearl", colors: ["#15171C"], brand: "KYRA", series: "Pearl" },
  { id: "deep-midnight-blue", name: "Deep Midnight Blue", category: "solid", colors: ["#162A4F"], brand: "KYRA", series: "Premium" },
  { id: "military-olive", name: "Military Olive", category: "solid", colors: ["#4F5B39"], brand: "KYRA", series: "Premium" },
  { id: "forest-green-pearl", name: "Forest Green Pearl", category: "pearl", colors: ["#3D6B52"], brand: "KYRA", series: "Pearl" },
  { id: "teal-green-pearl", name: "Teal Green Pearl", category: "pearl", colors: ["#206B65"], brand: "KYRA", series: "Pearl" },
  { id: "black-teal-pearl", name: "Black Teal Pearl", category: "pearl", colors: ["#1A2D2F"], brand: "KYRA", series: "Pearl" },
  { id: "ruby-red", name: "Ruby Red", category: "solid", colors: ["#BF2731"], brand: "KYRA", series: "Premium" },
  { id: "rose-red", name: "Rose Red", category: "solid", colors: ["#C9485E"], brand: "KYRA", series: "Premium" },
  { id: "champagne-beige", name: "Champagne Beige", category: "solid", colors: ["#A5927B"], brand: "KYRA", series: "Premium" },
  { id: "candy-crimson", name: "Candy Crimson", category: "solid", colors: ["#A1162E"], brand: "KYRA", series: "Premium" },
  { id: "deep-wine-red", name: "Deep Wine Red", category: "solid", colors: ["#551D2D"], brand: "KYRA", series: "Premium" },
  { id: "plum-wine", name: "Plum Wine", category: "solid", colors: ["#47202D"], brand: "KYRA", series: "Premium" },
  { id: "mint-white-pearl", name: "Mint White Pearl", category: "pearl", colors: ["#D7E7E2"], brand: "KYRA", series: "Pearl" },
  { id: "ice-cyan", name: "Ice Cyan", category: "solid", colors: ["#89D2E3"], brand: "KYRA", series: "Premium" },
  { id: "dark-chocolate", name: "Dark Chocolate", category: "solid", colors: ["#332521"], brand: "KYRA", series: "Premium" },
  { id: "3m-gloss-black", name: "Gloss Black", category: "solid", colors: ["#0A0A0D"], brand: "3M", series: "2080" },
  { id: "3m-gloss-white", name: "Gloss White", category: "solid", colors: ["#F3F5F8"], brand: "3M", series: "2080" },
  { id: "3m-hot-rod-red", name: "Hot Rod Red", category: "solid", colors: ["#C9252B"], brand: "3M", series: "2080" },
  { id: "3m-bright-yellow", name: "Bright Yellow", category: "solid", colors: ["#F4C61E"], brand: "3M", series: "2080" },
  { id: "avery-carmine-red", name: "Carmine Red", category: "solid", colors: ["#A51B2E"], brand: "Avery", series: "SW900" },
  { id: "avery-midnight-blue", name: "Midnight Blue", category: "solid", colors: ["#102B5C"], brand: "Avery", series: "SW900" },
  { id: "oracal-nardo-grey", name: "Nardo Grey", category: "solid", colors: ["#58626D"], brand: "Oracal", series: "970" },
  { id: "kpmf-wine-red", name: "Wine Red", category: "solid", colors: ["#6E1E32"], brand: "KPMF", series: "Matte" },
  { id: "teckwrap-miami-blue", name: "Miami Blue", category: "solid", colors: ["#16B0C8"], brand: "TeckWrap", series: "Gloss" },
  { id: "teckwrap-violet", name: "Violet", category: "solid", colors: ["#7C1FA6"], brand: "TeckWrap", series: "Gloss" },
  { id: "3m-gloss-blue-metallic", name: "Blue Metallic", category: "solid", colors: ["#1A4FA3"], brand: "3M", series: "2080" },
  { id: "3m-gloss-atomic-teal", name: "Atomic Teal", category: "solid", colors: ["#00A5AA"], brand: "3M", series: "2080" },
  { id: "avery-gloss-orange", name: "Gloss Orange", category: "solid", colors: ["#EF5A1A"], brand: "Avery", series: "SW900" },
  { id: "avery-gloss-grass-green", name: "Grass Green", category: "solid", colors: ["#2EA857"], brand: "Avery", series: "SW900" },
  { id: "oracal-lava-orange", name: "Lava Orange", category: "solid", colors: ["#E95A12"], brand: "Oracal", series: "970" },
  { id: "oracal-riviera-blue", name: "Riviera Blue", category: "solid", colors: ["#069ED1"], brand: "Oracal", series: "970" },
  { id: "kpmf-matte-black-rose", name: "Black Rose", category: "solid", colors: ["#3A1020"], brand: "KPMF", series: "Matte" },
  { id: "kpmf-imperial-orchid", name: "Imperial Orchid", category: "solid", colors: ["#6B3E8D"], brand: "KPMF", series: "Matte" },
  { id: "teckwrap-sky-blue", name: "Sky Blue", category: "solid", colors: ["#5BA8E8"], brand: "TeckWrap", series: "Gloss" },
  { id: "teckwrap-sakura-pink", name: "Sakura Pink", category: "solid", colors: ["#E86A95"], brand: "TeckWrap", series: "Gloss" },
  { id: "avery-rushing-riptide", name: "Rushing Riptide", category: "shift", colors: ["#11D0D3", "#0B5ED7"], brand: "Avery", series: "Color Shift" },
  { id: "avery-roaring-thunder", name: "Roaring Thunder", category: "shift", colors: ["#22B573", "#6B2EB6"], brand: "Avery", series: "Color Shift" },
  { id: "3m-flip-deep-space", name: "Flip Deep Space", category: "shift", colors: ["#0B1020", "#1E4467"], brand: "3M", series: "2080" },
  { id: "3m-flip-psychedelic", name: "Flip Psychedelic", category: "shift", colors: ["#7A00C2", "#1EC8FF"], brand: "3M", series: "2080" },
  { id: "3m-midnight-blue-fade", name: "Midnight Blue Fade", category: "shift", colors: ["#0A1931", "#185ADB"], brand: "3M", series: "2080" },
  { id: "3m-wine-red-fade", name: "Wine Red Fade", category: "shift", colors: ["#2A0E16", "#8C1C3C"], brand: "3M", series: "2080" },
  { id: "teckwrap-ruby-noir", name: "Ruby Noir", category: "shift", colors: ["#25090D", "#C1121F"], brand: "TeckWrap", series: "Color Shift" },
  { id: "teckwrap-nebula", name: "Nebula", category: "shift", colors: ["#5433FF", "#20BDFF"], brand: "TeckWrap", series: "Color Shift" },
  { id: "teckwrap-emerald-shift", name: "Emerald Shift", category: "shift", colors: ["#0F725C", "#2CB67D"], brand: "TeckWrap", series: "Color Shift" },
  { id: "kpmf-indigo-to-purple", name: "Indigo To Purple", category: "shift", colors: ["#273D9A", "#7A2DA5"], brand: "KPMF", series: "Color Shift" },
  { id: "kpmf-red-to-black", name: "Red To Black", category: "shift", colors: ["#8B1226", "#130C10"], brand: "KPMF", series: "Color Shift" },
  { id: "oracal-green-gold-shift", name: "Green Gold Shift", category: "shift", colors: ["#3A8D2E", "#B9A12D"], brand: "Oracal", series: "Color Shift" },
  { id: "3m-satin-white-pearl", name: "Satin White Pearl", category: "pearl", colors: ["#EEF0F4"], brand: "3M", series: "2080" },
  { id: "avery-white-pearl", name: "White Pearl", category: "pearl", colors: ["#F2F3F6"], brand: "Avery", series: "SW900" },
  { id: "kpmf-frozen-berry", name: "Frozen Berry", category: "pearl", colors: ["#7A3E5C"], brand: "KPMF", series: "Pearl" },
  { id: "teckwrap-emerald-pearl", name: "Emerald Pearl", category: "pearl", colors: ["#1F8E6A"], brand: "TeckWrap", series: "Pearl" },
  { id: "3m-black-rose-pearl", name: "Black Rose Pearl", category: "pearl", colors: ["#4C3642"], brand: "3M", series: "2080" },
  { id: "avery-mystic-gold-pearl", name: "Mystic Gold Pearl", category: "pearl", colors: ["#B69A4E"], brand: "Avery", series: "SW900" },
  { id: "kpmf-lunar-cyan-pearl", name: "Lunar Cyan Pearl", category: "pearl", colors: ["#4E8FA8"], brand: "KPMF", series: "Pearl" },
  { id: "stek-clear-ppf", name: "Clear PPF", category: "ppf", colors: ["#DDE3EA"], brand: "STEK", series: "DYNOshield", ppfType: "clear" },
  { id: "xpel-smoke-ppf", name: "Smoke PPF", category: "ppf", colors: ["#2B3541"], brand: "XPEL", series: "ULTIMATE PLUS", ppfType: "tint" },
  { id: "ultrafit-blue-ppf", name: "Blue PPF", category: "ppf", colors: ["#4A90E2"], brand: "UltraFit", series: "Color PPF", ppfType: "tint" },
  { id: "ultrafit-green-ppf", name: "Green PPF", category: "ppf", colors: ["#34D399"], brand: "UltraFit", series: "Color PPF", ppfType: "tint" },
  { id: "ultrafit-rose-ppf", name: "Rose PPF", category: "ppf", colors: ["#FB7185"], brand: "UltraFit", series: "Color PPF", ppfType: "tint" },
  { id: "ultrafit-violet-ppf", name: "Violet PPF", category: "ppf", colors: ["#8A6CE8"], brand: "UltraFit", series: "Color PPF", ppfType: "tint" },
  { id: "stek-cyan-ppf", name: "Cyan PPF", category: "ppf", colors: ["#43C8D8"], brand: "STEK", series: "DYNOshield", ppfType: "tint" },
  { id: "carbon-exposed", name: "Exposed Carbon Fiber", category: "carbon", colors: ["#1A1A1A", "#2A2A2A"], brand: "KYRA", series: "Carbon Weave" },
  { id: "carbon-forged", name: "Forged Carbon", category: "carbon", colors: ["#121212", "#3A3A3A"], brand: "KYRA", series: "Carbon Weave" },
  { id: "carbon-red", name: "Red Tint Carbon", category: "carbon", colors: ["#2A0808", "#1A1A1A"], brand: "TeckWrap", series: "Carbon" },
  { id: "carbon-blue", name: "Blue Tint Carbon", category: "carbon", colors: ["#0A1528", "#1A1A1A"], brand: "TeckWrap", series: "Carbon" },
];

/** Glass film presets aligned with Phantom Wrap's simulator physical glass params */
export const windowFilms: WindowFilm[] = [
  {
    id: "oem-clear",
    name: "OEM Clear",
    overlayOpacity: 0.05,
    overlayColor: "#d5dde8",
    roughness: 0.03,
    transmission: 0.92,
    thickness: 0.004,
    attenuationDistance: 3.2,
  },
  {
    id: "crystalline-70",
    name: "3M Crystalline 70",
    overlayOpacity: 0.12,
    overlayColor: "#b7c2d1",
    roughness: 0.06,
    transmission: 0.78,
    thickness: 0.006,
    attenuationDistance: 1.8,
  },
  {
    id: "ceramic-35",
    name: "3M Ceramic IR 35",
    overlayOpacity: 0.28,
    overlayColor: "#6f7f90",
    roughness: 0.09,
    transmission: 0.45,
    thickness: 0.01,
    attenuationDistance: 0.75,
  },
  {
    id: "obsidian-20",
    name: "3M Obsidian 20",
    overlayOpacity: 0.42,
    overlayColor: "#3b4654",
    roughness: 0.1,
    transmission: 0.2,
    thickness: 0.014,
    attenuationDistance: 0.35,
  },
  {
    id: "obsidian-05",
    name: "3M Obsidian 05",
    overlayOpacity: 0.62,
    overlayColor: "#151a21",
    roughness: 0.12,
    transmission: 0.03,
    thickness: 0.018,
    attenuationDistance: 0.14,
  },
  {
    id: "clear-security",
    name: "3M Clear Security",
    overlayOpacity: 0.08,
    overlayColor: "#dfe5ed",
    roughness: 0.04,
    transmission: 0.88,
    thickness: 0.007,
    attenuationDistance: 2.5,
  },
];

export const defaultWrapId = "midnight-blue";
export const defaultWindowFilmId = "oem-clear";

export function getVehicleType(typeId: VehicleTypeId) {
  return vehicleTypes.find((t) => t.id === typeId) ?? vehicleTypes[0];
}

export function getWrapById(id: string) {
  return wrapCatalog.find((w) => w.id === id) ?? wrapCatalog[0];
}

export function getWindowFilmById(id: string) {
  return windowFilms.find((f) => f.id === id) ?? windowFilms[0];
}

export function filterWraps(category: WrapCategoryId, finish: WrapFinishId) {
  return wrapCatalog.filter((wrap) => {
    if (category !== "all" && wrap.category !== category) return false;
    if (finish === "matte" && wrap.category === "pearl") return false;
    // Carbon finish highlights carbon wraps; other finishes hide dedicated carbon SKUs unless browsing Carbon tab
    if (finish === "carbon" && category === "all") {
      return wrap.category === "carbon" || wrap.category === "solid";
    }
    if (finish !== "carbon" && category === "all" && wrap.category === "carbon") {
      return false;
    }
    return true;
  });
}

export function buildQuoteSummary(
  vehicleType: VehicleType,
  finish: WrapFinishId,
  wrap: WrapOption,
  tint: WindowFilm
) {
  return `${vehicleType.name} · ${finish} · ${wrap.name} · ${tint.name}`;
}
