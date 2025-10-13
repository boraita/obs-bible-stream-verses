// Bible configuration with lazy loading
// Files are loaded dynamically when needed, not bundled upfront
const BIBLE_CONFIG = {
  kdsh: {
    name: "Kadosh Israelita",
    displayName: "Kadosh Israelita",
    fullName: "Kadosh Israelita Mesiánica",
    requiresTagCleaning: false,
    loader: () => import("../db/KDSH.sqlite")
  },
  lbla: {
    name: "lbla",
    displayName: "Americas",
    fullName: "La Biblia de las Américas",
    requiresTagCleaning: true,
    loader: () => import("../db/LBLA.sqlite")
  },
  nvi: {
    name: "nvi",
    displayName: "Nueva V. Inter",
    fullName: "Nueva Versión Internacional",
    requiresTagCleaning: false,
    loader: () => import("../db/NVI.sqlite")
  },
  ntv: {
    name: "ntv",
    displayName: "Nueva Trad. Viv.",
    fullName: "Nueva Traducción Viviente",
    requiresTagCleaning: false,
    loader: () => import("../db/NTV.sqlite")
  },
  btx: {
    name: "btx",
    displayName: "Textual",
    fullName: "Biblia Textual",
    requiresTagCleaning: false,
    loader: () => import("../db/BTX.sqlite")
  },
  rvr60: {
    name: "rvr60",
    displayName: "Reina Valera 60",
    fullName: "Reina Valera 1960",
    requiresTagCleaning: false,
    loader: () => import("../db/RVR60.sqlite")
  }
};

export function getBibleList() {
  return Object.keys(BIBLE_CONFIG);
}

export function getBibleDisplayName(code) {
  return BIBLE_CONFIG[code]?.displayName || code.toUpperCase();
}

export function getBibleFullName(code) {
  return BIBLE_CONFIG[code]?.fullName || code.toUpperCase();
}

export function requiresTagCleaning(code) {
  return BIBLE_CONFIG[code]?.requiresTagCleaning || false;
}

export async function getBibleFile(code) {
  const config = BIBLE_CONFIG[code];
  if (!config?.loader) return null;
  
  const module = await config.loader();
  return module.default;
}

export function getBibleLoader(code) {
  return BIBLE_CONFIG[code]?.loader;
}

export function getBibleOptions() {
  return Object.entries(BIBLE_CONFIG).map(([code, config]) => ({
    value: code,
    label: config.displayName
  }));
}

// Generate BIBLE_MAP dynamically from configuration
// Note: file is loaded lazily via loader function
export function getBibleMap() {
  return Object.keys(BIBLE_CONFIG).reduce((map, key) => {
    map[key] = { 
      loader: BIBLE_CONFIG[key].loader, 
      name: BIBLE_CONFIG[key].name 
    };
    return map;
  }, {});
}

export { BIBLE_CONFIG };
