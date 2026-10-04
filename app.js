"use strict";

/* ============================================================
   Tableaux — éditeur de tableaux de données
   ============================================================ */

const STORAGE_KEY = "tableaux.app.v1";

const TYPES = {
  text:     { label: "Texte",     ic: "Aa",  align: "left"  },
  number:   { label: "Nombre",    ic: "#",   align: "right" },
  date:     { label: "Date",      ic: "📅",  align: "left"  },
  select:   { label: "Liste",     ic: "▾",   align: "left"  },
  checkbox: { label: "Coche",     ic: "☑",   align: "center"},
};

const FONTS = {
  inter:     { label: "Inter (moderne)",      stack: '"Inter", system-ui, sans-serif' },
  systeme:   { label: "Système",              stack: 'system-ui, -apple-system, "Segoe UI", sans-serif' },
  georgia:   { label: "Georgia (serif)",      stack: 'Georgia, "Times New Roman", serif' },
  courier:   { label: "Courier (machine)",    stack: '"Courier New", Courier, monospace' },
  consolas:  { label: "Consolas (mono)",      stack: 'Consolas, "Cascadia Mono", monospace' },
  verdana:   { label: "Verdana",              stack: 'Verdana, Geneva, sans-serif' },
  trebuchet: { label: "Trebuchet MS",         stack: '"Trebuchet MS", Tahoma, sans-serif' },
  times:     { label: "Times New Roman",      stack: '"Times New Roman", Times, serif' },
};

const THEMES = {
  sombre: {
    label: "Sombre",
    font: "inter", fontSize: 13, rowHeight: 40, headHeight: 56,
    headWeight: 600, headTransform: "none", headAlign: "left",
    borderWidth: 1, borderStyle: "solid", borderColor: "#2a3241", radius: 12,
    zebra: true, hoverRow: true,
    headBg: "#1f2531", headFg: "#e8ecf3",
    cellBg: "#191e28", cellBgAlt: "#1c2230", cellFg: "#e8ecf3",
    accent: "#5b8cff",
  },
  clair: {
    label: "Clair",
    font: "inter", fontSize: 13, rowHeight: 38, headHeight: 50,
    headWeight: 700, headTransform: "none", headAlign: "left",
    borderWidth: 1, borderStyle: "solid", borderColor: "#d7dce5", radius: 10,
    zebra: true, hoverRow: true,
    headBg: "#eef1f6", headFg: "#1a2230",
    cellBg: "#ffffff", cellBgAlt: "#f6f8fb", cellFg: "#1a2230",
    accent: "#2f6bdd",
  },
  papier: {
    label: "Papier",
    font: "georgia", fontSize: 13.5, rowHeight: 42, headHeight: 52,
    headWeight: 700, headTransform: "none", headAlign: "left",
    borderWidth: 1, borderStyle: "solid", borderColor: "#c9bfa8", radius: 2,
    zebra: true, hoverRow: true,
    headBg: "#e8dfc9", headFg: "#3b3121",
    cellBg: "#faf6ec", cellBgAlt: "#f1ead8", cellFg: "#3b3121",
    accent: "#8a6d2b",
  },
  blueprint: {
    label: "Blueprint",
    font: "consolas", fontSize: 12.5, rowHeight: 36, headHeight: 48,
    headWeight: 600, headTransform: "uppercase", headAlign: "left",
    borderWidth: 1, borderStyle: "solid", borderColor: "#1c4f8c", radius: 0,
    zebra: true, hoverRow: true,
    headBg: "#0e3a6b", headFg: "#cfe6ff",
    cellBg: "#0a2d57", cellBgAlt: "#0c3566", cellFg: "#cfe6ff",
    accent: "#4da3ff",
  },
  solaire: {
    label: "Solaire",
    font: "systeme", fontSize: 13, rowHeight: 40, headHeight: 52,
    headWeight: 600, headTransform: "none", headAlign: "left",
    borderWidth: 1, borderStyle: "solid", borderColor: "#d6c9a8", radius: 8,
    zebra: true, hoverRow: true,
    headBg: "#eee8d5", headFg: "#586e75",
    cellBg: "#fdf6e3", cellBgAlt: "#f4ecd8", cellFg: "#073642",
    accent: "#b58900",
  },
  minimal: {
    label: "Minimal",
    font: "inter", fontSize: 13, rowHeight: 36, headHeight: 44,
    headWeight: 600, headTransform: "uppercase", headAlign: "left",
    borderWidth: 0, borderStyle: "solid", borderColor: "#d0d5dd", radius: 0,
    zebra: true, hoverRow: true,
    headBg: "#f4f6fa", headFg: "#5b6575",
    cellBg: "#ffffff", cellBgAlt: "#f7f9fc", cellFg: "#1c2430",
    accent: "#4b5563",
  },
  contraste: {
    label: "Contraste",
    font: "verdana", fontSize: 12.5, rowHeight: 38, headHeight: 50,
    headWeight: 700, headTransform: "uppercase", headAlign: "left",
    borderWidth: 2, borderStyle: "solid", borderColor: "#000000", radius: 0,
    zebra: false, hoverRow: true,
    headBg: "#000000", headFg: "#ffffff",
    cellBg: "#ffffff", cellBgAlt: "#f0f0f0", cellFg: "#000000",
    accent: "#000000",
  },
  pastel: {
    label: "Pastel",
    font: "trebuchet", fontSize: 13, rowHeight: 42, headHeight: 54,
    headWeight: 700, headTransform: "none", headAlign: "left",
    borderWidth: 1, borderStyle: "solid", borderColor: "#e5d9e8", radius: 14,
    zebra: true, hoverRow: true,
    headBg: "#efe4f2", headFg: "#5c4263",
    cellBg: "#fdfaff", cellBgAlt: "#f7f0fa", cellFg: "#4a3550",
    accent: "#a06bb5",
  },
};

/* ---------- Papier (format Lettre US) ---------- */

const PAPER = {
  letter: {
    label: "Lettre",
    dims: "8,5 × 11 in",
    portrait: "21.59cm 27.94cm",
    landscape: "27.94cm 21.59cm",
    css: "Letter",
    ratioPortrait: 8.5 / 11,
    ratioLandscape: 11 / 8.5,
  },
};

const PRINT_MARGINS = {
  narrow: "10mm 8mm",
  normal: "15mm 13mm",
  wide: "22mm 20mm",
};

const PRINT_MARGINS_DOC = {
  narrow: "0.9cm 0.7cm",
  normal: "1.5cm 1.3cm",
  wide: "2.2cm 2cm",
};

const PRINT_MARGINS_PX = {
  narrow: 18,
  normal: 26,
  wide: 38,
};

const BORDER_PRESETS = {
  grille: {
    label: "Grille",
    sides: { top: true, bottom: true, left: true, right: true, insideH: true, insideV: true },
  },
  encadre: {
    label: "Encadré",
    sides: { top: true, bottom: true, left: true, right: true, insideH: false, insideV: false },
  },
  horizontal: {
    label: "Horizontal",
    sides: { top: true, bottom: true, left: false, right: false, insideH: true, insideV: false },
  },
  hautbas: {
    label: "Haut / Bas",
    sides: { top: true, bottom: true, left: false, right: false, insideH: false, insideV: false },
  },
  aucun: {
    label: "Aucun",
    sides: { top: false, bottom: false, left: false, right: false, insideH: false, insideV: false },
  },
};

const BORDER_WEIGHTS = [
  [0.25, "0,25 pt"],
  [0.5, "0,5 pt"],
  [0.75, "0,75 pt"],
  [1, "1 pt"],
  [1.5, "1,5 pt"],
  [2, "2 pt"],
  [3, "3 pt"],
  [4, "4 pt"],
];

function defaultSides(on = true) {
  return { top: on, bottom: on, left: on, right: on, insideH: on, insideV: on };
}

const PRINT_LOOKS = {
  classique: {
    label: "Classique",
    swatch: ["#e6e6e6", "#ffffff", "#f2f2f2", "#999999"],
    borders: "grille",
    borderWeight: 1,
    borderStyle: "solid",
    headBg: "#e6e6e6", cellBg: "#ffffff", cellBgAlt: "#f2f2f2",
    cellFg: "#000000", borderColor: "#999999",
  },
  theme: {
    label: "Couleurs du thème",
    swatch: null,
    borders: "grille",
    borderWeight: 1,
    borderStyle: "solid",
    headBg: null, cellBg: null, cellBgAlt: null, cellFg: null, borderColor: null,
  },
  sanscontour: {
    label: "Sans contour",
    swatch: ["#ececec", "#ffffff", "#ffffff", "#ffffff"],
    borders: "aucun",
    borderWeight: 1,
    borderStyle: "solid",
    headBg: "#ececec", cellBg: "#ffffff", cellBgAlt: "#ffffff",
    cellFg: "#111111", borderColor: "#ffffff",
  },
  epure: {
    label: "Épuré",
    swatch: ["#ffffff", "#ffffff", "#ffffff", "#cccccc"],
    borders: "hautbas",
    borderWeight: 1.5,
    borderStyle: "solid",
    headBg: "#ffffff", cellBg: "#ffffff", cellBgAlt: "#ffffff",
    cellFg: "#111111", borderColor: "#888888",
  },
  contraste: {
    label: "Fort contraste",
    swatch: ["#000000", "#ffffff", "#f0f0f0", "#000000"],
    borders: "grille",
    borderWeight: 2,
    borderStyle: "solid",
    headBg: "#000000", cellBg: "#ffffff", cellBgAlt: "#f0f0f0",
    cellFg: "#000000", borderColor: "#000000",
  },
  double: {
    label: "Double",
    swatch: ["#f4f4f4", "#ffffff", "#fafafa", "#333333"],
    borders: "grille",
    borderWeight: 1.5,
    borderStyle: "double",
    headBg: "#f4f4f4", cellBg: "#ffffff", cellBgAlt: "#fafafa",
    cellFg: "#111111", borderColor: "#333333",
  },
};

function defaultPrint() {
  return {
    title: "",
    subtitle: "",
    orientation: "portrait",
    margins: "normal",
    rowNumbers: true,
    showDate: true,
    showCount: true,
    showFooter: true,
    look: "classique",
    // typographie — propre à l'impression, indépendante du style écran
    font: "inter",
    fontSize: 9.5,
    headWeight: 700,
    headTransform: "none",
    headAlign: "left",
    rowHeight: 24,
    headHeight: 28,
    zebra: true,
    useColWidths: true,
    headBg: "#e6e6e6",
    cellBg: "#ffffff",
    cellBgAlt: "#f2f2f2",
    cellFg: "#000000",
    borderColor: "#999999",
    borderStyle: "solid",
    borderWeight: 1,
    borderSides: defaultSides(true),
  };
}

function resolvePrintColors(p) {
  if (p.look === "theme") {
    const st = normalizeStyle(state.style);
    return {
      headBg: st.headBg, cellBg: st.cellBg, cellBgAlt: st.cellBgAlt,
      cellFg: st.cellFg, borderColor: st.borderColor,
    };
  }
  return {
    headBg: p.headBg, cellBg: p.cellBg, cellBgAlt: p.cellBgAlt,
    cellFg: p.cellFg, borderColor: p.borderColor,
  };
}

function normalizePrint(p) {
  const base = defaultPrint();
  const out = Object.assign({}, base, p || {});
  out.orientation = out.orientation === "landscape" ? "landscape" : "portrait";
  out.margins = ["narrow", "normal", "wide"].includes(out.margins) ? out.margins : "normal";
  out.look = PRINT_LOOKS[out.look] || out.look === "personnalisé" ? out.look : "classique";
  out.font = out.font === "inherit" ? base.font : (FONTS[out.font] ? out.font : base.font);
  out.fontSize = clampNum(out.fontSize, 6, 20, base.fontSize);
  out.headWeight = clampInt(out.headWeight, 300, 800, base.headWeight);
  out.headTransform = ["none", "uppercase"].includes(out.headTransform) ? out.headTransform : "none";
  out.headAlign = ["left", "center"].includes(out.headAlign) ? out.headAlign : "left";
  out.zebra = out.zebra !== false;
  out.borderStyle = ["solid", "dashed", "dotted", "double"].includes(out.borderStyle) ? out.borderStyle : "solid";
  out.borderWeight = clampNum(out.borderWeight, 0.25, 6, base.borderWeight);
  out.borderSides = Object.assign(defaultSides(true), out.borderSides || {});
  out.useColWidths = out.useColWidths !== false;
  out.rowHeight = clampNum(out.rowHeight === "auto" ? base.rowHeight : out.rowHeight, 8, 80, base.rowHeight);
  out.headHeight = clampNum(out.headHeight, 8, 80, base.headHeight);
  out.rowNumbers = Boolean(out.rowNumbers);
  out.showDate = Boolean(out.showDate);
  out.showCount = Boolean(out.showCount);
  out.showFooter = Boolean(out.showFooter);
  ["headBg", "cellBg", "cellBgAlt", "cellFg", "borderColor"].forEach((k) => {
    if (!/^#[0-9a-f]{6}$/i.test(out[k] || "")) out[k] = base[k];
  });
  return out;
}

function presetKeyFor(sides) {
  for (const [key, preset] of Object.entries(BORDER_PRESETS)) {
    if (Object.keys(preset.sides).every((k) => Boolean(sides[k]) === Boolean(preset.sides[k]))) return key;
  }
  return "personnalisé";
}

function borderSpecs(p) {
  const c = resolvePrintColors(p);
  const s = p.borderSides;
  const w = p.borderWeight;
  const st = p.borderStyle;
  const side = (on) => (on ? `${w}pt ${st} ${c.borderColor}` : "none");
  return {
    top: side(s.top),
    bottom: side(s.bottom),
    left: side(s.left),
    right: side(s.right),
    insideH: side(s.insideH),
    insideV: side(s.insideV),
    color: c.borderColor,
    weight: w,
    style: st,
  };
}

/* ---------- Dimensions imprimées ---------- */

const MM_PT = 2.834645;
const MARGINS_MM = {
  narrow: { v: 10, h: 8 },
  normal: { v: 15, h: 13 },
  wide: { v: 22, h: 20 },
};

function paperWidthPt(p) {
  return p.orientation === "landscape" ? 792 : 612;
}

function marginsPt(p) {
  const m = MARGINS_MM[p.margins] || MARGINS_MM.normal;
  return { v: m.v * MM_PT, h: m.h * MM_PT };
}

function printableWidthPt(p) {
  const m = marginsPt(p);
  return paperWidthPt(p) - m.h * 2;
}

/** Facteur d'affichage : sert uniquement à l'aperçu pour que la table
 *  tienne dans la largeur de page. N'affecte aucune dimension réelle. */
function printScale(t, p) {
  const widths = t.columns.map((c) => printColWidthPx(c, p) || 160);
  const totalPx = widths.reduce((a, b) => a + b, 0) + (p.rowNumbers ? 56 : 0);
  const totalPt = totalPx * 0.75;
  if (!totalPt) return 1;
  return clampNum(printableWidthPt(p) / totalPt, 0.25, 3, 1);
}

/* ---------- Dimensions d'impression : indépendantes du style écran ---------- */

function printRowHeightPt(p) {
  return clampNum(p.rowHeight, 8, 80, 24);
}

function printHeadHeightPt(p) {
  return clampNum(p.headHeight, 8, 80, 26);
}

/** Largeur d'une colonne pour l'impression (px). */
function printColWidthPx(col, p) {
  if (p && p.useColWidths === false) return null;
  const w = Number(col.printWidth);
  if (Number.isFinite(w) && w > 0) return Math.min(900, Math.max(60, Math.round(w)));
  const f = Number(col.width);
  if (Number.isFinite(f) && f > 0) return Math.min(900, Math.max(60, Math.round(f)));
  return defaultColWidth(col);
}

function printColWidthsPt(t, p) {
  const widths = t.columns.map((c) => printColWidthPx(c, p) || 160);
  const total = widths.reduce((a, b) => a + b, 0) + (p.rowNumbers ? 56 : 0);
  return {
    rowNum: p.rowNumbers ? Math.round((56 / total) * 1000) / 10 : 0,
    cols: widths.map((w) => Math.round((w / total) * 1000) / 10),
  };
}

function defaultStyle() {
  return Object.assign({ theme: "sombre" }, THEMES.sombre);
}

function normalizeStyle(s) {
  const base = defaultStyle();
  const out = Object.assign({}, base, s || {});
  out.font = FONTS[out.font] ? out.font : base.font;
  out.borderStyle = ["solid", "dashed", "dotted", "double", "none"].includes(out.borderStyle) ? out.borderStyle : "solid";
  out.headTransform = ["none", "uppercase"].includes(out.headTransform) ? out.headTransform : "none";
  out.headAlign = ["left", "center"].includes(out.headAlign) ? out.headAlign : "left";
  out.theme = THEMES[out.theme] ? out.theme : "personnalisé";
  out.fontSize = clampNum(out.fontSize, 9, 22, base.fontSize);
  out.rowHeight = clampInt(out.rowHeight, 24, 90, base.rowHeight);
  out.headHeight = clampInt(out.headHeight, 32, 110, base.headHeight);
  out.headWeight = clampInt(out.headWeight, 300, 800, base.headWeight);
  out.borderWidth = clampInt(out.borderWidth, 0, 4, base.borderWidth);
  out.radius = clampInt(out.radius, 0, 28, base.radius);
  out.zebra = Boolean(out.zebra);
  out.hoverRow = Boolean(out.hoverRow);
  ["borderColor", "headBg", "headFg", "cellBg", "cellBgAlt", "cellFg", "accent"].forEach((k) => {
    if (!/^#[0-9a-f]{6}$/i.test(out[k] || "")) out[k] = base[k];
  });
  return out;
}

function applyStyle() {
  const r = document.documentElement.style;
  const s = normalizeStyle(state.style);
  state.style = s;
  const mode = viewMode();

  if (mode === "print") {
    // Vue imprimée : TOUT provient de state.print, rien du style écran.
    const p = normalizePrint(state.print);
    state.print = p;
    const c = resolvePrintColors(p);
    const b = borderSpecs(p);
    const fontStack = FONTS[p.font].stack;
    const anyBorder = p.borderSides.insideV || p.borderSides.insideH;

    r.setProperty("--tbl-font", fontStack);
    r.setProperty("--tbl-font-size", (p.fontSize * 1.35).toFixed(2) + "px");
    r.setProperty("--tbl-row-h", Math.round(p.rowHeight * 1.33) + "px");
    r.setProperty("--tbl-head-h", Math.round(p.headHeight * 1.33) + "px");
    r.setProperty("--tbl-head-weight", String(p.headWeight));
    r.setProperty("--tbl-head-transform", p.headTransform);
    r.setProperty("--tbl-head-align", p.headAlign);
    r.setProperty("--tbl-head-bg", c.headBg);
    r.setProperty("--tbl-head-fg", c.cellFg);
    r.setProperty("--tbl-cell-bg", c.cellBg);
    r.setProperty("--tbl-cell-bg-alt", c.cellBgAlt);
    r.setProperty("--tbl-cell-fg", c.cellFg);
    r.setProperty("--tbl-border-w", anyBorder ? Math.max(1, Math.round(b.weight * 1.4)) + "px" : "0px");
    r.setProperty("--tbl-border-style", p.borderStyle);
    r.setProperty("--tbl-border-color", c.borderColor);
    r.setProperty("--tbl-radius", "0px");
    r.setProperty("--tbl-accent", p.borderColor);
    document.body.classList.toggle("tbl-zebra", p.zebra);
    document.body.classList.remove("tbl-hover");
    document.body.classList.add("view-print");
    r.setProperty("--vp-bt", b.top);
    r.setProperty("--vp-bb", b.bottom);
    r.setProperty("--vp-bl", b.left);
    r.setProperty("--vp-br", b.right);
    r.setProperty("--vp-bih", b.insideH);
    r.setProperty("--vp-biv", b.insideV);
    return;
  }

  document.body.classList.remove("view-print");
  ["--vp-bt", "--vp-bb", "--vp-bl", "--vp-br", "--vp-bih", "--vp-biv"].forEach((k) => r.removeProperty(k));

  r.setProperty("--tbl-font", FONTS[s.font].stack);
  r.setProperty("--tbl-font-size", s.fontSize + "px");
  r.setProperty("--tbl-row-h", s.rowHeight + "px");
  r.setProperty("--tbl-head-h", s.headHeight + "px");
  r.setProperty("--tbl-head-weight", String(s.headWeight));
  r.setProperty("--tbl-head-transform", s.headTransform);
  r.setProperty("--tbl-head-align", s.headAlign);
  r.setProperty("--tbl-head-bg", s.headBg);
  r.setProperty("--tbl-head-fg", s.headFg);
  r.setProperty("--tbl-cell-bg", s.cellBg);
  r.setProperty("--tbl-cell-bg-alt", s.cellBgAlt);
  r.setProperty("--tbl-cell-fg", s.cellFg);
  r.setProperty("--tbl-border-w", s.borderWidth + "px");
  r.setProperty("--tbl-border-style", s.borderStyle);
  r.setProperty("--tbl-border-color", s.borderColor);
  r.setProperty("--tbl-radius", s.radius + "px");
  r.setProperty("--tbl-accent", s.accent);
  document.body.classList.toggle("tbl-zebra", s.zebra);
  document.body.classList.toggle("tbl-hover", s.hoverRow);
}

/* ---------- Mode d'affichage Écran / Impression ---------- */

function viewMode() {
  const t = activeTable();
  return t && t.view === "print" ? "print" : "screen";
}

function setViewMode(mode) {
  const t = activeTable();
  if (!t) return;
  if (mode === "print") t.view = "print";
  else delete t.view;
  save();
  applyStyle();
  paintViewSwitch();
  toast(mode === "print" ? "Affichage : apparence imprimée" : "Affichage : écran");
}

function paintViewSwitch() {
  const sw = $("#view-switch");
  if (!sw) return;
  const mode = viewMode();
  sw.querySelectorAll("button").forEach((b) => {
    const on = b.dataset.view === mode;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function blankState() {
  const t = makeTable("Mon tableau");
  return { tables: [t], activeId: t.id, print: defaultPrint(), style: defaultStyle() };
}

let state = load();
let searchTerm = "";
let sortCol = null;
let sortDir = 1;
let colFilters = {}; // { colId: [valeurs autorisées] }
let dragRowId = null;
let dragColId = null;
let activeCell = null; // { row, col }

function makeTable(name) {
  const colA = uid(), colB = uid(), colC = uid();
  return {
    id: uid(),
    name: name || "Tableau",
    createdAt: Date.now(),
    columns: [
      { id: colA, name: "Nom", type: "text", options: [] },
      { id: colB, name: "Quantité", type: "number", options: [] },
      { id: colC, name: "Statut", type: "select", options: ["À faire", "En cours", "Terminé"] },
    ],
    rows: [],
  };
}

function load() {
  try {
    // Application Windows : l'etat vient de SQLite. Navigateur : localStorage.
    const raw = window.tableaux && window.tableaux.lireEtat
      ? window.tableaux.lireEtat()
      : localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.tables) || data.tables.length === 0) return blankState();
    data.tables.forEach(normalizeTable);
    if (!data.tables.some((t) => t.id === data.activeId)) data.activeId = data.tables[0].id;
    data.print = normalizePrint(data.print);
    data.style = normalizeStyle(data.style);
    return data;
  } catch (err) {
    console.error("Chargement impossible, réinitialisation :", err);
    return blankState();
  }
}

function normalizeTable(t) {
  t.id ||= uid();
  t.name ||= "Tableau";
  t.columns = Array.isArray(t.columns) ? t.columns : [];
  t.rows = Array.isArray(t.rows) ? t.rows : [];
  t.columns.forEach((c) => {
    c.id ||= uid();
    c.name ||= "Colonne";
    c.type = TYPES[c.type] ? c.type : "text";
    c.options = Array.isArray(c.options) ? c.options : [];
    const w = Number(c.width);
    if (Number.isFinite(w) && w > 0) c.width = Math.min(900, Math.max(60, Math.round(w)));
    else delete c.width;
  });
  t.rows.forEach((r) => {
    r.id ||= uid();
    r.cells = r.cells && typeof r.cells === "object" ? r.cells : {};
    if (r.fmt && typeof r.fmt === "object") {
      Object.keys(r.fmt).forEach((k) => {
        const v = String(r.fmt[k] || "").split("").filter((c) => "biu".includes(c)).join("");
        if (v) r.fmt[k] = v;
        else delete r.fmt[k];
      });
      if (Object.keys(r.fmt).length === 0) delete r.fmt;
    } else {
      delete r.fmt;
    }
    t.columns.forEach((c) => {
      if (!(c.id in r.cells)) r.cells[c.id] = defaultValue(c);
    });
  });
}

function save() {
  const json = JSON.stringify(state);
  // Application Windows : l'etat part vers SQLite. Navigateur : localStorage.
  if (window.tableaux && window.tableaux.ecrireEtat) window.tableaux.ecrireEtat(json);
  else localStorage.setItem(STORAGE_KEY, json);
}

function activeTable() {
  return state.tables.find((t) => t.id === state.activeId) || state.tables[0];
}

function defaultValue(col) {
  if (col.type === "checkbox") return false;
  if (col.type === "number") return "";
  return "";
}

function defaultColWidth(col) {
  if (col.type === "checkbox") return 110;
  if (col.type === "date") return 150;
  return 200;
}

function colWidth(col) {
  const w = Number(col.width);
  return Number.isFinite(w) && w > 0 ? Math.min(900, Math.max(60, Math.round(w))) : defaultColWidth(col);
}

function colFlex(col) {
  const w = colWidth(col);
  return col.width ? `0 0 ${w}px` : `1 1 ${w}px`;
}

/** Largeur effective selon le mode d'affichage : écran et impression sont indépendants. */
function activeColWidth(col) {
  return viewMode() === "print" ? printColWidthPx(col, normalizePrint(state.print)) : colWidth(col);
}

function activeColFlex(col) {
  const w = activeColWidth(col);
  const fixed = viewMode() === "print" ? (col.printWidth || col.width) : col.width;
  return fixed ? `0 0 ${w}px` : `1 1 ${w}px`;
}

/* ---------- utilitaires ---------- */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function el(tag, props = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") n.className = v;
    else if (k === "text") n.textContent = v;
    else if (k === "html") n.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === false || v === null || v === undefined) n.toggleAttribute(k, false);
    else if (v === true) n.setAttribute(k, "");
    else n.setAttribute(k, v);
  }
  children.flat().forEach((c) => {
    if (c === null || c === undefined || c === false || c === true) return;
    n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return n;
}

function fmtNumber(v) {
  if (v === "" || v === null || v === undefined) return "";
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString("fr-FR") : String(v);
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function parseLocalDate(s) {
  const m = String(s ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateFR(s) {
  const d = parseLocalDate(s);
  return d ? d.toLocaleDateString("fr-FR") : "";
}

function displayValue(col, v) {
  if (col.type === "checkbox") return v ? "Oui" : "Non";
  if (col.type === "date") return v ? formatDateFR(v) : "";
  if (col.type === "number") return v === "" || v === null || v === undefined ? "" : String(v);
  return v === null || v === undefined ? "" : String(v);
}

let toastTimer;
function toast(msg, kind = "ok") {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast show " + kind;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => (t.hidden = true), 220);
  }, 2200);
}

/* ---------- modale ---------- */

let modalSession = null;

function openModal({ title, body, okText = "OK", danger = false, className = "", actions = [] }) {
  const back = $("#modal");
  $("#modal-title").textContent = title;
  $("#modal-body").innerHTML = "";
  if (typeof body === "string") $("#modal-body").innerHTML = body;
  else $("#modal-body").appendChild(body);

  const ok = $("#modal-ok");
  ok.textContent = okText;
  ok.className = "btn " + (danger ? "btn-danger" : "btn-primary");
  back.hidden = false;

  const box = $(".modal");
  box.className = "modal" + (className ? " " + className : "");

  // boutons supplémentaires, à gauche des actions principales
  const actionsBar = $(".modal-actions");
  const extra = el("div", { class: "modal-extra" });
  actions.forEach((a) => {
    extra.appendChild(el("button", {
      class: "btn btn-ghost",
      type: "button",
      text: a.label,
      onclick: () => a.onClick(),
    }));
  });
  actionsBar.insertBefore(extra, actionsBar.firstChild);

  return new Promise((resolve) => {
    const first = $("#modal-body input:not([type=hidden]), #modal-body select, #modal-body textarea");
    if (first) setTimeout(() => first.focus(), 30);

    const finish = (accepted) => {
      if (!modalSession) return;
      const data = accepted ? readModal() : null;
      back.hidden = true;
      back.querySelector(".modal").className = "modal";
      extra.remove();
      ok.removeEventListener("click", onOk);
      $("#modal-cancel").removeEventListener("click", onCancel);
      document.removeEventListener("keydown", onKey, true);
      modalSession = null;
      resolve(data);
    };

    const onOk = () => finish(true);
    const onCancel = () => finish(false);
    const onKey = (e) => {
      if (!modalSession) return;
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); finish(false); return; }
      if (e.key !== "Enter" || e.shiftKey) return;
      const t = e.target;
      // Entrée confirme depuis un champ de saisie ou depuis le bouton OK,
      // jamais depuis un bouton, une case à cocher ou une vignette.
      const champ = t.tagName === "INPUT" && !["checkbox", "radio", "button", "submit"].includes(t.type);
      const liste = t.tagName === "SELECT";
      if (!champ && !liste && t !== ok) return;
      e.preventDefault();
      e.stopPropagation();
      finish(true);
    };

    modalSession = { finish };
    ok.addEventListener("click", onOk);
    $("#modal-cancel").addEventListener("click", onCancel);
    document.addEventListener("keydown", onKey, true);
  });
}

function closeModal(accepted = false) {
  if (modalSession) modalSession.finish(accepted);
}

function readModal() {
  const out = {};
  $$("#modal-body [data-field]").forEach((f) => {
    out[f.dataset.field] = f.type === "checkbox" ? f.checked : f.value;
  });
  return out;
}

/* ============================================================
   Rendu
   ============================================================ */

function render() {
  renderSidebar();
  renderToolbar();
  renderGrid();
  renderStatus();
  updateHistoryUI();
  updateExportAvailability();
  paintViewSwitch();
  applyStyle();
}

function updateExportAvailability() {
  const t = activeTable();
  const vide = t.columns.length === 0 || t.rows.length === 0;
  [["btn-export-csv", "Aucune donnée à exporter"], ["btn-export-doc", "Aucune donnée à exporter"]].forEach(([id, why]) => {
    const b = document.getElementById(id);
    if (!b) return;
    b.disabled = vide;
    b.title = vide ? why : b.dataset.tip || b.title;
  });
  const p = document.getElementById("btn-print");
  if (p) {
    p.disabled = t.columns.length === 0;
    p.title = t.columns.length === 0 ? "Aucune colonne à imprimer" : p.dataset.tip || p.title;
  }
}

function renderSidebar() {
  const list = $("#table-list");
  list.innerHTML = "";

  state.tables.forEach((t) => {
    const btn = el("button", {
      class: "table-item" + (t.id === state.activeId ? " active" : ""),
      type: "button",
      draggable: "true",
      "data-id": t.id,
      onclick: () => {
        if (document.body.classList.contains("reordering")) return;
        state.activeId = t.id;
        sortCol = null;
        searchTerm = "";
        colFilters = {};
        $("#search").value = "";
        save();
        render();
      },
    },
      el("span", { class: "t-icon", "aria-hidden": "true", text: "▦" }),
      el("span", { class: "t-name", text: t.name }),
      el("span", { class: "t-count", text: String(t.rows.length) }),
    );
    bindTableDrag(btn, t);

    const menu = el("button", {
      class: "t-menu",
      type: "button",
      text: "⋯",
      "aria-label": `Actions pour le tableau ${t.name}`,
      "aria-haspopup": "menu",
      onclick: (e) => {
        e.stopPropagation();
        openTableMenu(t, menu);
      },
    });

    const row = el("div", { class: "table-row" }, btn, menu);
    list.appendChild(row);
  });
}

/* ---------- Menu d'un tableau ---------- */

async function openTableMenu(t, anchor) {
  const menu = el("div", { class: "t-pop", role: "menu" },
    el("button", { type: "button", role: "menuitem", text: "Renommer", onclick: () => { fermer(); renameTableOf(t); } }),
    el("button", { type: "button", role: "menuitem", text: "Dupliquer", onclick: () => { fermer(); duplicateTable(t); } }),
    el("button", {
      type: "button", role: "menuitem", class: "danger", text: "Supprimer",
      onclick: () => { fermer(); deleteTableOf(t); },
    }),
  );

  const r = anchor.getBoundingClientRect();
  menu.style.top = Math.round(r.bottom + 4) + "px";
  menu.style.left = Math.round(Math.max(8, r.right - 176)) + "px";
  document.body.appendChild(menu);

  const fermer = () => {
    menu.remove();
    document.removeEventListener("mousedown", dehors, true);
    document.removeEventListener("keydown", esc, true);
  };
  const dehors = (e) => { if (!menu.contains(e.target) && e.target !== anchor) fermer(); };
  const esc = (e) => { if (e.key === "Escape") { e.stopPropagation(); fermer(); } };

  setTimeout(() => {
    document.addEventListener("mousedown", dehors, true);
    document.addEventListener("keydown", esc, true);
  }, 0);
}

async function renameTableOf(t) {
  const body = el("div", {},
    el("div", { class: "field" },
      el("label", { text: "Nom du tableau" }),
      el("input", { type: "text", "data-field": "name", value: t.name, spellcheck: "false" })
    )
  );
  const d = await openModal({ title: "Renommer le tableau", body, okText: "Enregistrer" });
  if (!d) return;
  const avant = t.name;
  t.name = (d.name || "").trim() || t.name;
  if (t.name !== avant) commit("Renommer un tableau");
}

function duplicateTable(t) {
  const copy = JSON.parse(JSON.stringify(t));
  copy.id = uid();
  copy.name = t.name + " (copie)";
  copy.rows = (copy.rows || []).map((r) => Object.assign({}, r, { id: uid() }));
  delete copy.view;
  const at = state.tables.findIndex((x) => x.id === t.id);
  state.tables.splice(at + 1, 0, copy);
  state.activeId = copy.id;
  sortCol = null;
  searchTerm = "";
  colFilters = {};
  $("#search").value = "";
  commit("Dupliquer un tableau");
  toast("Tableau dupliqué");
}

async function deleteTableOf(t) {
  if (state.tables.length === 1) {
    toast("Impossible de supprimer le dernier tableau", "err");
    return;
  }
  const body = el("div", {},
    el("p", { class: "help", text: `Supprimer « ${t.name} » et ses ${t.rows.length} ligne${t.rows.length > 1 ? "s" : ""} ? Cette action est annulable avec Ctrl+Z.` })
  );
  const d = await openModal({ title: "Supprimer le tableau", body, okText: "Supprimer", danger: true });
  if (!d) return;
  const at = state.tables.findIndex((x) => x.id === t.id);
  state.tables = state.tables.filter((x) => x.id !== t.id);
  if (state.activeId === t.id) {
    state.activeId = state.tables[Math.min(at, state.tables.length - 1)].id;
  }
  sortCol = null;
  searchTerm = "";
  colFilters = {};
  $("#search").value = "";
  commit("Supprimer un tableau");
  toast("Tableau supprimé");
}

let dragTableId = null;

function bindTableDrag(node, t) {
  node.addEventListener("dragstart", (e) => {
    dragTableId = t.id;
    document.body.classList.add("reordering");
    e.dataTransfer.effectAllowed = "move";
    node.classList.add("dragging");
  });
  node.addEventListener("dragend", () => {
    dragTableId = null;
    document.body.classList.remove("reordering");
    $$(".table-item").forEach((n) => n.classList.remove("dragging", "drop-before", "drop-after"));
  });
  node.addEventListener("dragover", (e) => {
    if (!dragTableId || dragTableId === t.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const r = node.getBoundingClientRect();
    const after = e.clientY > r.top + r.height / 2;
    node.classList.toggle("drop-before", !after);
    node.classList.toggle("drop-after", after);
  });
  node.addEventListener("dragleave", () => node.classList.remove("drop-before", "drop-after"));
  node.addEventListener("drop", (e) => {
    if (!dragTableId || dragTableId === t.id) return;
    e.preventDefault();
    const from = state.tables.findIndex((x) => x.id === dragTableId);
    if (from < 0) return;
    const r = node.getBoundingClientRect();
    const after = e.clientY > r.top + r.height / 2;
    const moved = state.tables.splice(from, 1)[0];
    let to = state.tables.findIndex((x) => x.id === t.id);
    if (after) to++;
    state.tables.splice(to, 0, moved);
    dragTableId = null;
    commit("Réordonner les tableaux");
  });
}

function renderToolbar() {
  const t = activeTable();
  const title = $("#table-title");
  if (document.activeElement !== title) title.value = t.name;
  $("#table-meta").textContent =
    `${t.rows.length} ligne${t.rows.length > 1 ? "s" : ""} · ${t.columns.length} colonne${t.columns.length > 1 ? "s" : ""}`;
}

function visibleRows() {
  const t = activeTable();
  let rows = t.rows;

  Object.entries(colFilters).forEach(([colId, allowed]) => {
    if (!Array.isArray(allowed)) return;
    rows = rows.filter((r) => allowed.includes(String(r.cells[colId] ?? "")));
  });

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    rows = rows.filter((r) =>
      t.columns.some((c) => String(r.cells[c.id] ?? "").toLowerCase().includes(q))
    );
  }

  if (sortCol) {
    const col = t.columns.find((c) => c.id === sortCol);
    if (col) {
      rows = [...rows].sort((a, b) => {
        const va = a.cells[col.id], vb = b.cells[col.id];
        if (col.type === "number") {
          return ((Number(va) || 0) - (Number(vb) || 0)) * sortDir;
        }
        if (col.type === "checkbox") {
          return ((va ? 1 : 0) - (vb ? 1 : 0)) * sortDir;
        }
        return String(va ?? "").localeCompare(String(vb ?? ""), "fr", { numeric: true }) * sortDir;
      });
    }
  }
  return rows;
}

function renderGrid() {
  const t = activeTable();
  const grid = $("#grid");
  grid.innerHTML = "";
  grid.setAttribute("aria-rowcount", String(t.rows.length + 1));
  grid.setAttribute("aria-colcount", String(t.columns.length + 1));
  grid.setAttribute("aria-label", `Tableau ${t.name}`);

  if (t.columns.length === 0) {
    grid.appendChild(
      el("div", { class: "empty-state" },
        el("h3", { text: "Ce tableau n'a pas encore de colonnes" }),
        el("p", { text: "Ajoutez une colonne pour commencer à saisir vos données." }),
        el("button", { class: "btn btn-primary", type: "button", onclick: addColumn }, "+ Ajouter une colonne")
      )
    );
    return;
  }

  /* ---- en-tête ---- */
  const head = el("div", { class: "grid-row head", role: "row", "aria-rowindex": "1" });
  head.appendChild(el("div", { class: "cell col-rownum", role: "columnheader", "aria-colindex": "1", text: "#" }));

  t.columns.forEach((col, ci) => {
    const idx = String(ci + 2);
    const nameInput = el("input", {
      class: "col-name",
      type: "text",
      value: col.name,
      spellcheck: "false",
      title: col.name,
      "aria-label": `Nom de la colonne ${ci + 1}`,
    });
    nameInput.addEventListener("change", () => {
      col.name = nameInput.value.trim() || "Colonne";
      nameInput.value = col.name;
      commit("Renommer une colonne");
    });

    const typeBtn = el("button", {
      class: "col-type",
      type: "button",
      title: "Changer le type",
      text: TYPES[col.type].label,
      "aria-label": `Type de « ${col.name} » : ${TYPES[col.type].label}. Modifier`,
      onclick: () => changeColumnType(col),
    });

    const sortBtn = el("button", {
      class: "icon-btn" + (sortCol === col.id ? " on" : ""),
      type: "button",
      title: "Trier par cette colonne",
      text: sortCol === col.id ? (sortDir === 1 ? "↑" : "↓") : "↕",
      "aria-label": `Trier par ${col.name}`,
      "aria-pressed": sortCol === col.id ? "true" : "false",
      onclick: () => {
        if (sortCol === col.id) {
          sortDir *= -1;
        } else {
          sortCol = col.id;
          sortDir = 1;
        }
        render();
      },
    });

    const filterBtn = el("button", {
      class: "icon-btn" + (colFilters[col.id] ? " on" : ""),
      type: "button",
      title: "Filtrer cette colonne",
      text: "▽",
      "aria-label": `Filtrer la colonne ${col.name}`,
      "aria-pressed": colFilters[col.id] ? "true" : "false",
      onclick: () => openColumnFilter(col),
    });

    const delBtn = el("button", {
      class: "icon-btn danger",
      type: "button",
      title: "Supprimer la colonne",
      text: "×",
      "aria-label": `Supprimer la colonne ${col.name}`,
      onclick: () => deleteColumn(col),
    });

    const resizer = el("div", {
      class: "col-resize",
      title: "Faire glisser pour redimensionner — double-clic pour réinitialiser",
    });
    bindColResize(resizer, col);

    const dragHandle = el("span", {
      class: "col-move",
      draggable: "true",
      title: "Glisser pour déplacer la colonne",
      "aria-hidden": "true",
      text: "⠿",
    });
    bindColDrag(dragHandle, col);

    const cell = el("div", { class: "head-cell", role: "columnheader", "aria-colindex": idx },
      el("div", { class: "head-top" }, dragHandle, nameInput, typeBtn),
      el("div", { class: "head-actions" }, sortBtn, filterBtn, delBtn),
      resizer,
    );
    cell.style.flex = activeColFlex(col);
    cell.style.minWidth = activeColWidth(col) + "px";
    cell.style.maxWidth = (viewMode() === "print" ? (col.printWidth || col.width) : col.width) ? activeColWidth(col) + "px" : "none";
    bindColDropTarget(cell, col);
    head.appendChild(cell);
  });

  head.appendChild(el("div", { class: "cell row-del head-cell", style: "flex:0 0 56px;min-width:56px;padding:0" }));
  grid.appendChild(head);

  /* ---- lignes ---- */
  const rows = visibleRows();

  if (rows.length === 0) {
    grid.appendChild(
      el("div", { class: "empty-state" },
        el("h3", { text: searchTerm ? "Aucun résultat" : "Aucune ligne" }),
        el("p", {
          text: searchTerm
            ? "Essayez un autre terme de recherche."
            : "Ajoutez votre première ligne pour commencer.",
        }),
        !searchTerm && el("button", { class: "btn btn-primary", type: "button", onclick: addRow }, "+ Ajouter une ligne")
      )
    );
    return;
  }

  rows.forEach((row, idx) => {
    const tr = el("div", {
      class: "grid-row body",
      role: "row",
      "data-id": row.id,
      "aria-rowindex": String(idx + 2),
    });
    const numCell = el("div", {
      class: "cell col-rownum",
      role: "rowheader",
      "aria-colindex": "1",
      text: String(idx + 1),
      draggable: "true",
      title: "Glisser pour déplacer la ligne",
      "aria-label": `Ligne ${idx + 1}. Glisser pour déplacer.`,
    });
    bindRowDrag(numCell, row);
    bindRowDropTarget(tr, row);
    tr.appendChild(numCell);

    t.columns.forEach((col, ci) => {
      const cell = el("div", { class: "cell", role: "gridcell", "aria-colindex": String(ci + 2) });
      cell.style.flex = activeColFlex(col);
      cell.style.minWidth = activeColWidth(col) + "px";
      cell.style.maxWidth = (viewMode() === "print" ? (col.printWidth || col.width) : col.width) ? activeColWidth(col) + "px" : "none";
      const alignCls = TYPES[col.type].align === "right" ? "num" : TYPES[col.type].align === "center" ? "check" : null;
      if (alignCls) cell.classList.add(alignCls);

      const editor = makeCellEditor(row, col);
      editor.setAttribute(
        "aria-label",
        `${col.name}, ligne ${idx + 1}${col.type === "checkbox" ? `, ${row.cells[col.id] ? "coché" : "non coché"}` : ""}`
      );
      cell.appendChild(editor);
      tr.appendChild(cell);
    });

    const dup = el("button", {
      class: "icon-btn",
      type: "button",
      title: "Dupliquer la ligne",
      text: "⧉",
      "aria-label": `Dupliquer la ligne ${idx + 1}`,
      onclick: () => duplicateRow(row),
    });
    const del = el("button", {
      class: "icon-btn danger",
      type: "button",
      title: "Supprimer la ligne",
      text: "×",
      "aria-label": `Supprimer la ligne ${idx + 1}`,
      onclick: () => {
        t.rows = t.rows.filter((r) => r.id !== row.id);
        commit("Supprimer une ligne");
      },
    });
    tr.appendChild(el("div", { class: "cell row-del" }, dup, del));
    grid.appendChild(tr);
  });
}

function duplicateRow(row) {
  const t = activeTable();
  const at = t.rows.findIndex((r) => r.id === row.id);
  if (at < 0) return;
  const copy = { id: uid(), cells: Object.assign({}, row.cells) };
  if (row.fmt) copy.fmt = JSON.parse(JSON.stringify(row.fmt));
  t.rows.splice(at + 1, 0, copy);
  commit("Dupliquer une ligne");
  toast("Ligne dupliquée");
}

function duplicateColumn(col) {
  const t = activeTable();
  const at = t.columns.findIndex((c) => c.id === col.id);
  if (at < 0) return;
  const copy = {
    id: uid(),
    name: col.name + " (copie)",
    type: col.type,
    options: Array.isArray(col.options) ? col.options.slice() : [],
  };
  if (col.width) copy.width = col.width;
  if (col.printWidth) copy.printWidth = col.printWidth;
  t.columns.splice(at + 1, 0, copy);
  t.rows.forEach((r) => (r.cells[copy.id] = r.cells[col.id]));
  commit("Dupliquer une colonne");
  toast("Colonne dupliquée");
}

/* ---------- Glisser-déposer ---------- */

function bindRowDrag(handle, row) {
  handle.addEventListener("dragstart", (e) => {
    dragRowId = row.id;
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", "row:" + row.id); } catch { /* ignore */ }
    handle.closest(".grid-row").classList.add("dragging");
  });
  handle.addEventListener("dragend", () => {
    dragRowId = null;
    $$(".grid-row").forEach((r) => r.classList.remove("dragging", "drop-before", "drop-after"));
  });
}

function bindRowDropTarget(tr, row) {
  tr.addEventListener("dragover", (e) => {
    if (!dragRowId || dragRowId === row.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = tr.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    tr.classList.toggle("drop-before", !after);
    tr.classList.toggle("drop-after", after);
  });
  tr.addEventListener("dragleave", () => tr.classList.remove("drop-before", "drop-after"));
  tr.addEventListener("drop", (e) => {
    if (!dragRowId || dragRowId === row.id) return;
    e.preventDefault();
    const t = activeTable();
    const from = t.rows.findIndex((r) => r.id === dragRowId);
    const to = t.rows.findIndex((r) => r.id === row.id);
    if (from < 0 || to < 0) return;
    const rect = tr.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    const moved = t.rows.splice(from, 1)[0];
    let target = t.rows.findIndex((r) => r.id === row.id);
    if (after) target++;
    t.rows.splice(target, 0, moved);
    dragRowId = null;
    commit("Déplacer une ligne");
  });
}

function bindColDrag(handle, col) {
  handle.addEventListener("dragstart", (e) => {
    e.stopPropagation();
    dragColId = col.id;
    e.dataTransfer.effectAllowed = "move";
    handle.closest(".head-cell").classList.add("dragging");
  });
  handle.addEventListener("dragend", () => {
    dragColId = null;
    $$(".head-cell").forEach((c) => c.classList.remove("dragging", "drop-before", "drop-after"));
  });
}

function bindColDropTarget(cell, col) {
  cell.addEventListener("dragover", (e) => {
    if (!dragColId || dragColId === col.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = cell.getBoundingClientRect();
    const after = e.clientX > rect.left + rect.width / 2;
    cell.classList.toggle("drop-before", !after);
    cell.classList.toggle("drop-after", after);
  });
  cell.addEventListener("dragleave", () => cell.classList.remove("drop-before", "drop-after"));
  cell.addEventListener("drop", (e) => {
    if (!dragColId || dragColId === col.id) return;
    e.preventDefault();
    const t = activeTable();
    const from = t.columns.findIndex((c) => c.id === dragColId);
    if (from < 0) return;
    const rect = cell.getBoundingClientRect();
    const after = e.clientX > rect.left + rect.width / 2;
    const moved = t.columns.splice(from, 1)[0];
    let target = t.columns.findIndex((c) => c.id === col.id);
    if (after) target++;
    t.columns.splice(target, 0, moved);
    dragColId = null;
    commit("Déplacer une colonne");
  });
}

function bindColResize(handle, col) {
  handle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const cell = handle.closest(".head-cell");
    const row = cell.parentElement;
    const idx = [...row.children].indexOf(cell);
    const startW = cell.getBoundingClientRect().width;
    const startX = e.clientX;
    document.body.classList.add("resizing");

    const apply = (w) => {
      const ww = Math.min(900, Math.max(60, Math.round(w)));
      const flex = `0 0 ${ww}px`;
      $$(".grid-row").forEach((r) => {
        const c = r.children[idx];
        if (!c) return;
        c.style.flex = flex;
        c.style.minWidth = ww + "px";
        c.style.maxWidth = ww + "px";
      });
    };

    const onMove = (ev) => apply(startW + (ev.clientX - startX));
    const onUp = (ev) => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.classList.remove("resizing");
      if (Math.abs(ev.clientX - startX) < 3) return;
      const w = Math.min(900, Math.max(60, Math.round(startW + (ev.clientX - startX))));
      // Chaque mode a ses propres largeurs : écran et impression restent indépendants.
      if (viewMode() === "print") {
        col.printWidth = w;
        commit("Largeur de colonne (impression)");
      } else {
        col.width = w;
        commit("Largeur de colonne");
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  handle.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMode() === "print") {
      if (col.printWidth === undefined) return;
      delete col.printWidth;
      commit("Réinitialiser la largeur d'impression");
    } else {
      if (col.width === undefined) return;
      delete col.width;
      commit("Réinitialiser la largeur");
    }
  });
}

/* ---------- Mise en forme du texte dans une cellule ---------- */

const FMT_KEYS = { b: "b", i: "i", u: "u" };

function cellFormat(row, col) {
  const f = row.fmt && row.fmt[col.id];
  return typeof f === "string" ? f : "";
}

function applyCellFormat(input, row, col) {
  const f = cellFormat(row, col);
  input.classList.toggle("cell-b", f.includes("b"));
  input.classList.toggle("cell-i", f.includes("i"));
  input.classList.toggle("cell-u", f.includes("u"));
}

/* ---------- Barre de mise en forme ---------- */

function setActiveCell(row, col) {
  activeCell = row && col ? { row, col } : null;
  const tools = $("#fmt-tools");
  if (!tools) return;
  tools.hidden = !activeCell;
  if (!activeCell) return;
  const f = cellFormat(activeCell.row, activeCell.col);
  [["btn-bold", "b"], ["btn-italic", "i"], ["btn-underline", "u"]].forEach(([id, k]) => {
    const b = document.getElementById(id);
    if (b) {
      const on = f.includes(k);
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    }
  });
}

function toggleActiveCellFormat(key) {
  if (!activeCell) return;
  const input = document.querySelector(".cell-input:focus");
  toggleCellFormat(activeCell.row, activeCell.col, key, input || document.createElement("input"));
  setActiveCell(activeCell.row, activeCell.col);
}

function clearActiveCell() {
  activeCell = null;
  const tools = $("#fmt-tools");
  if (tools) tools.hidden = true;
}

function toggleCellFormat(row, col, key, input) {
  if (!FMT_KEYS[key]) return;
  row.fmt = row.fmt || {};
  const cur = cellFormat(row, col);
  const set = new Set(cur.split("").filter((c) => FMT_KEYS[c]));
  if (set.has(key)) set.delete(key);
  else set.add(key);
  const next = ["b", "i", "u"].filter((k) => set.has(k)).join("");
  if (next) row.fmt[col.id] = next;
  else delete row.fmt[col.id];
  if (Object.keys(row.fmt).length === 0) delete row.fmt;
  applyCellFormat(input, row, col);
  flushSave();
  renderStatus();
  toast(
    (next ? "Mise en forme : " : "Mise en forme retirée : ") +
    [next.includes("b") && "gras", next.includes("i") && "italique", next.includes("u") && "souligné"]
      .filter(Boolean).join(" + ") || "aucune"
  );
}

function pasteBlock(row, col, text) {
  const t = activeTable();
  const startRow = t.rows.findIndex((r) => r.id === row.id);
  const startCol = t.columns.findIndex((c) => c.id === col.id);
  if (startRow < 0 || startCol < 0) return;

  const lines = text.replace(/\r\n?/g, "\n").split("\n").filter((l, i, arr) => !(i === arr.length - 1 && l === ""));
  const grid = lines.map((l) => l.split("\t"));

  const nbCols = Math.max(...grid.map((r) => r.length));
  const dispo = t.columns.length - startCol;
  const utilise = Math.min(nbCols, dispo);
  const ignorees = nbCols - utilise;

  remember("Coller un bloc");

  const ajoutees = Math.max(0, startRow + grid.length - t.rows.length);
  for (let i = 0; i < ajoutees; i++) {
    const r = { id: uid(), cells: {} };
    t.columns.forEach((c) => (r.cells[c.id] = defaultValue(c)));
    t.rows.push(r);
  }

  grid.forEach((ligne, ri) => {
    const target = t.rows[startRow + ri];
    if (!target) return;
    for (let ci = 0; ci < utilise; ci++) {
      const targetCol = t.columns[startCol + ci];
      target.cells[targetCol.id] = normVal(ligne[ci] ?? "", targetCol.type);
    }
  });

  commit();
  toast(
    `Bloc collé : ${grid.length} ligne${grid.length > 1 ? "s" : ""} × ${utilise} colonne${utilise > 1 ? "s" : ""}` +
    (ajoutees ? ` · ${ajoutees} ajoutée${ajoutees > 1 ? "s" : ""}` : "") +
    (ignorees ? ` · ${ignorees} colonne${ignorees > 1 ? "s" : ""} ignorée${ignorees > 1 ? "s" : ""}` : "")
  );
}

/* ---------- Filtre par colonne ---------- */

async function openColumnFilter(col) {
  const t = activeTable();

  const counts = new Map();
  t.rows.forEach((r) => {
    const v = displayValue(col, r.cells[col.id]);
    counts.set(v, (counts.get(v) || 0) + 1);
  });

  const values = [...counts.keys()].sort((a, b) =>
    a.localeCompare(b, "fr", { numeric: true })
  );

  if (values.length === 0) {
    toast("Aucune valeur à filtrer dans cette colonne", "err");
    return;
  }

  if (values.length > 200) {
    toast("Trop de valeurs distinctes pour un filtre (" + values.length + ")", "err");
    return;
  }

  const active = colFilters[col.id];
  const chks = {};
  const list = el("div", { class: "filter-list" });

  values.forEach((v) => {
    const cb = el("input", { type: "checkbox" });
    cb.checked = !active || active.includes(v);
    chks[v] = cb;
    list.appendChild(el("label", { class: "check-line filter-line" },
      cb,
      el("span", { class: "filter-val", text: v === "" ? "(vide)" : v }),
      el("span", { class: "filter-count", text: String(counts.get(v)) }),
    ));
  });

  const body = el("div", {},
    el("p", { class: "help", text: `Cochez les valeurs à afficher pour « ${col.name} ».` }),
    el("div", { class: "filter-actions" },
      el("button", {
        class: "btn btn-ghost btn-sm", type: "button", text: "Tout cocher",
        onclick: () => Object.values(chks).forEach((c) => (c.checked = true)),
      }),
      el("button", {
        class: "btn btn-ghost btn-sm", type: "button", text: "Tout décocher",
        onclick: () => Object.values(chks).forEach((c) => (c.checked = false)),
      }),
    ),
    list,
  );

  const d = await openModal({
    title: "Filtrer : " + col.name,
    body,
    okText: "Appliquer",
    actions: active
      ? [{ label: "Retirer le filtre", onClick: () => {
          closeModal(false);
          delete colFilters[col.id];
          commit();
          toast("Filtre retiré");
        } }]
      : [],
  });
  if (!d) return;

  const gardees = values.filter((v) => chks[v].checked);
  if (gardees.length === values.length) delete colFilters[col.id];
  else if (gardees.length === 0) colFilters[col.id] = ["\u0000"]; // rien ne passe
  else colFilters[col.id] = gardees;

  commit();
  const restant = visibleRows().length;
  toast(
    colFilters[col.id]
      ? `Filtre appliqué · ${restant} ligne${restant > 1 ? "s" : ""} affichée${restant > 1 ? "s" : ""}`
      : "Filtre retiré"
  );
}

function makeCellEditor(row, col) {
  const val = row.cells[col.id];

  if (col.type === "checkbox") {
    const input = el("input", { type: "checkbox" });
    input.checked = Boolean(val);
    input.addEventListener("change", () => {
      row.cells[col.id] = input.checked;
      softCommit();
    });
    return input;
  }

  if (col.type === "select") {
    const sel = el("select", { class: "cell-select" });
    sel.appendChild(el("option", { value: "", text: "—" }));
    (col.options || []).forEach((o) => sel.appendChild(el("option", { value: o, text: o })));
    sel.value = val ?? "";
    sel.addEventListener("change", () => {
      row.cells[col.id] = sel.value;
      softCommit();
    });
    return sel;
  }

  const input = el("input", {
    class: "cell-input",
    type: col.type === "number" ? "text" : col.type === "date" ? "date" : "text",
    value: val ?? "",
    spellcheck: "false",
  });

  applyCellFormat(input, row, col);

  if (col.type === "number") {
    input.style.textAlign = "right";
    input.addEventListener("input", () => {
      const cleaned = input.value.replace(/[^\d.,-]/g, "").replace(",", ".");
      if (cleaned !== input.value) input.value = cleaned;
    });
  }

  input.addEventListener("input", () => {
    row.cells[col.id] = input.value;
    scheduleSave();
  });
  input.addEventListener("change", () => {
    row.cells[col.id] = input.value;
    flushSave();
    renderSidebar();
    renderToolbar();
    renderStatus();
  });
  input.addEventListener("blur", () => {
    // champ détaché ou marqué obsolète (collage de bloc, re-rendu) : ne pas écraser les données
    if (!input.isConnected || input.dataset.stale) return;
    row.cells[col.id] = input.value;
    flushSave();
    renderStatus();
    setTimeout(() => {
      if (!document.querySelector(".cell-input:focus")) clearActiveCell();
    }, 120);
  });
  input.addEventListener("focus", () => setActiveCell(row, col));

  input.addEventListener("paste", (e) => {
    const text = e.clipboardData?.getData("text/plain") || "";
    if (!text || !/[\t\n\r]/.test(text)) return; // collage simple : laisser faire
    e.preventDefault();
    input.dataset.stale = "1";
    pasteBlock(row, col, text);
  });
  input.addEventListener("keydown", (e) => {
    // Raccourcis de mise en forme du texte
    if ((e.ctrlKey || e.metaKey) && ["b", "i", "u"].includes(e.key.toLowerCase())) {
      e.preventDefault();
      e.stopPropagation();
      toggleCellFormat(row, col, e.key.toLowerCase(), input);
      return;
    }
    if (e.key === "Enter") input.blur();
    if (e.key === "Escape") {
      input.value = row.cells[col.id] ?? "";
      input.blur();
    }
  });

  return input;
}

function renderStatus() {
  const t = activeTable();
  const shown = visibleRows().length;
  const total = t.rows.length;
  const nbFiltres = Object.keys(colFilters).length;
  const filtre = searchTerm || nbFiltres > 0;
  $("#status-text").textContent = filtre
    ? `${shown} ligne${shown > 1 ? "s" : ""} affichée${shown > 1 ? "s" : ""} sur ${total}` +
      (nbFiltres ? ` · ${nbFiltres} filtre${nbFiltres > 1 ? "s" : ""} de colonne` : "") +
      (searchTerm ? ` · recherche « ${searchTerm} »` : "")
    : `Dernière modification enregistrée automatiquement`;

  let sum = 0, hasNum = false;
  const numCol = t.columns.find((c) => c.type === "number");
  if (numCol && shown) {
    hasNum = true;
    sum = visibleRows().reduce((a, r) => a + (Number(r.cells[numCol.id]) || 0), 0);
  }

  const right = $("#status-right");
  right.innerHTML = "";
  right.appendChild(el("span", { text: `${t.columns.length} colonne${t.columns.length > 1 ? "s" : ""}` }));
  if (hasNum) right.appendChild(el("span", { text: `Somme : ${fmtNumber(sum)}` }));
  if (filtre) {
    right.appendChild(el("button", {
      class: "btn btn-ghost btn-sm status-clear",
      type: "button",
      text: "Effacer les filtres",
      onclick: () => {
        colFilters = {};
        searchTerm = "";
        $("#search").value = "";
        renderGrid();
        renderStatus();
      },
    }));
  }
}

/* ============================================================
   Historique — Annuler / Rétablir
   ============================================================ */

const HISTORY_MAX = 60;
let history = [];
let historyIndex = -1;
let historyLock = false;

function snapshot() {
  return JSON.stringify({
    tables: state.tables,
    activeId: state.activeId,
    style: state.style,
    print: state.print,
  });
}

function historyReset(label) {
  history = [{ snap: snapshot(), label: label || "État initial" }];
  historyIndex = 0;
  updateHistoryUI();
}

/** Enregistre un point de restauration. À appeler AVANT une action structurante. */
function remember(label) {
  if (historyLock) return;
  const snap = snapshot();
  if (history[historyIndex] && history[historyIndex].snap === snap) return;
  history = history.slice(0, historyIndex + 1);
  history.push({ snap, label: label || "Modification" });
  if (history.length > HISTORY_MAX) history.shift();
  historyIndex = history.length - 1;
  updateHistoryUI();
}

function applySnapshot(snap) {
  const data = JSON.parse(snap);
  historyLock = true;
  state.tables = data.tables;
  state.activeId = data.activeId;
  state.style = normalizeStyle(data.style);
  state.print = normalizePrint(data.print);
  historyLock = false;
  applyStyle();
  render();
  save();
}

function canUndo() { return historyIndex > 0; }
function canRedo() { return historyIndex < history.length - 1; }

function undo() {
  if (!canUndo()) { toast("Rien à annuler", "err"); return; }
  const label = history[historyIndex].label;
  historyIndex--;
  applySnapshot(history[historyIndex].snap);
  toast("Annulé : " + label);
}

function redo() {
  if (!canRedo()) { toast("Rien à rétablir", "err"); return; }
  historyIndex++;
  const label = history[historyIndex].label;
  applySnapshot(history[historyIndex].snap);
  toast("Rétabli : " + label);
}

function updateHistoryUI() {
  const u = document.getElementById("btn-undo");
  const r = document.getElementById("btn-redo");
  if (u) {
    u.disabled = !canUndo();
    u.title = canUndo() ? `Annuler : ${history[historyIndex].label}` : "Rien à annuler";
  }
  if (r) {
    r.disabled = !canRedo();
    r.title = canRedo() ? `Rétablir : ${history[historyIndex + 1].label}` : "Rien à rétablir";
  }
}

function commit(label) {
  remember(label || "Modification");
  save();
  render();
}

function softCommit() {
  save();
  renderSidebar();
  renderToolbar();
  renderStatus();
}

let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    save();
    renderSidebar();
    renderToolbar();
    renderStatus();
  }, 220);
}

function flushSave() {
  clearTimeout(saveTimer);
  save();
}

/* ============================================================
   Actions — tableaux
   ============================================================ */

function makeField(label, input, help) {
  const parts = [el("label", { text: label }), input];
  if (help) parts.push(el("p", { class: "help", text: help }));
  return el("div", { class: "field" }, ...parts);
}

async function newTable() {
  const tplSel = el("select", { "data-field": "template", id: "tpl-select" },
    el("option", { value: "personnalisé", text: "Personnalisé" }),
    el("option", { value: "base", text: "Basique (Nom, Quantité, Statut)" }),
    el("option", { value: "contacts", text: "Contacts (Nom, Email, Téléphone, Ville)" }),
    el("option", { value: "tasks", text: "Tâches (Tâche, Responsable, Priorité, Date, Fait)" }),
    el("option", { value: "vide", text: "Vide (sans colonne)" }),
  );

  const colsInput = el("input", {
    type: "number", "data-field": "cols", id: "cols-input",
    value: "4", min: "0", max: "60", step: "1",
  });

  const typeSel = el("select", { "data-field": "colType", id: "type-input" },
    ...Object.entries(TYPES).map(([k, m]) => el("option", { value: k, text: m.label })),
  );

  const rowsInput = el("input", {
    type: "number", "data-field": "rows", id: "rows-input",
    value: "5", min: "0", max: "2000", step: "1",
  });

  const colsField = el("div", { id: "cols-field" },
    makeField("Nombre de colonnes", colsInput, "De 0 à 60 colonnes.")
  );
  const typeField = el("div", { id: "type-field" },
    makeField("Type des colonnes", typeSel, "S'applique à toutes les colonnes créées.")
  );
  const rowsField = el("div", { id: "rows-field" },
    makeField("Nombre de lignes", rowsInput, "De 0 à 2000 lignes vierges.")
  );

  const body = el("div", {},
    makeField("Nom du tableau", el("input", {
      type: "text", "data-field": "name", value: "Nouveau tableau", spellcheck: "false",
    }), "Vous pourrez le renommer à tout moment."),
    makeField("Modèle", tplSel),
    colsField, typeField, rowsField,
  );

  const syncTpl = () => {
    const v = tplSel.value;
    const custom = v === "personnalisé" || v === "vide";
    colsField.hidden = !custom;
    typeField.hidden = !custom;
    if (v === "base") { colsInput.value = "3"; typeSel.value = "text"; rowsInput.value = "5"; }
    if (v === "contacts") { colsInput.value = "4"; typeSel.value = "text"; rowsInput.value = "5"; }
    if (v === "tasks") { colsInput.value = "5"; typeSel.value = "text"; rowsInput.value = "5"; }
    if (v === "vide") { colsInput.value = "0"; rowsInput.value = "0"; }
    if (v === "personnalisé") { rowsInput.value = "5"; }
  };
  tplSel.addEventListener("change", syncTpl);
  syncTpl();

  const data = await openModal({ title: "Nouveau tableau", body, okText: "Créer" });
  if (!data) return;

  const colCount = clampInt(data.cols, 0, 60, 4);
  const rowCount = clampInt(data.rows, 0, 2000, 5);
  const t = buildFromTemplate(data.name || "Nouveau tableau", data.template, {
    cols: colCount,
    rows: rowCount,
    colType: TYPES[data.colType] ? data.colType : "text",
  });

  state.tables.push(t);
  state.activeId = t.id;
  sortCol = null;
  searchTerm = "";
  $("#search").value = "";
  commit("Créer un tableau");
  toast(`Tableau créé · ${t.rows.length} ligne${t.rows.length > 1 ? "s" : ""} × ${t.columns.length} colonne${t.columns.length > 1 ? "s" : ""}`);
}

function clampInt(v, min, max, fallback) {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function clampNum(v, min, max, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function buildFromTemplate(name, template, opts = {}) {
  const t = makeTable(name);
  const rowCount = clampInt(opts.rows, 0, 2000, 0);

  const preset = {
    base: [
      { name: "Nom", type: "text", options: [] },
      { name: "Quantité", type: "number", options: [] },
      { name: "Statut", type: "select", options: ["À faire", "En cours", "Terminé"] },
    ],
    contacts: [
      { name: "Nom", type: "text", options: [] },
      { name: "Email", type: "text", options: [] },
      { name: "Téléphone", type: "text", options: [] },
      { name: "Ville", type: "text", options: [] },
    ],
    tasks: [
      { name: "Tâche", type: "text", options: [] },
      { name: "Responsable", type: "text", options: [] },
      { name: "Priorité", type: "select", options: ["Basse", "Moyenne", "Haute", "Urgente"] },
      { name: "Échéance", type: "date", options: [] },
      { name: "Fait", type: "checkbox", options: [] },
    ],
  };

  let colDefs;

  if (preset[template]) {
    colDefs = preset[template];
  } else {
    const colCount = clampInt(opts.cols, 0, 60, 3);
    const type = TYPES[opts.colType] ? opts.colType : "text";
    colDefs = Array.from({ length: colCount }, (_, i) => ({
      name: "Colonne " + (i + 1),
      type,
      options: type === "select" ? ["Option 1", "Option 2", "Option 3"] : [],
    }));
  }

  t.columns = colDefs.map((c) => ({ id: uid(), name: c.name, type: c.type, options: c.options }));
  t.rows = Array.from({ length: rowCount }, () => {
    const cells = {};
    t.columns.forEach((c) => (cells[c.id] = defaultValue(c)));
    return { id: uid(), cells };
  });

  t.seeded = true;
  return t;
}

async function renameTable() {
  const t = activeTable();
  const body = el("div", {},
    el("div", { class: "field" },
      el("label", { text: "Nom du tableau" }),
      el("input", { type: "text", "data-field": "name", value: t.name, spellcheck: "false" })
    )
  );
  const d = await openModal({ title: "Renommer le tableau", body, okText: "Enregistrer" });
  if (!d) return;
  t.name = (d.name || "").trim() || t.name;
  commit();
}

async function deleteTable() {
  const t = activeTable();
  if (state.tables.length === 1) {
    toast("Impossible de supprimer le dernier tableau", "err");
    return;
  }
  const body = el("div", {},
    el("p", {
      class: "help",
      text: `Voulez-vous vraiment supprimer « ${t.name} » ? Cette action est irréversible.`,
    })
  );
  const d = await openModal({ title: "Supprimer le tableau", body, okText: "Supprimer", danger: true });
  if (!d) return;
  state.tables = state.tables.filter((x) => x.id !== t.id);
  state.activeId = state.tables[0].id;
  sortCol = null;
  commit();
  toast("Tableau supprimé");
}

/* ============================================================
   Actions — colonnes
   ============================================================ */

async function addColumn() {
  const body = el("div", {},
    el("div", { class: "field" },
      el("label", { text: "Nom de la colonne" }),
      el("input", { type: "text", "data-field": "name", value: "Nouvelle colonne", spellcheck: "false" })
    ),
    el("div", { class: "field" },
      el("label", { text: "Type de données" }),
      makeTypePicker("text")
    ),
    el("div", { class: "field", id: "opt-field", hidden: "" },
      el("label", { text: "Options de la liste" }),
      el("textarea", {
        "data-field": "options",
        placeholder: "Une option par ligne\nEx :\nÀ faire\nEn cours\nTerminé",
      }),
      el("p", { class: "help", text: "Uniquement pour le type « Liste ». Une option par ligne." })
    )
  );

  const d = await openModal({ title: "Nouvelle colonne", body, okText: "Ajouter" });
  if (!d) return;

  const type = d.type || "text";
  const options = (d.options || "").split("\n").map((s) => s.trim()).filter(Boolean);

  const t = activeTable();
  const col = { id: uid(), name: d.name.trim() || "Colonne", type, options };
  t.columns.push(col);
  t.rows.forEach((r) => (r.cells[col.id] = defaultValue(col)));
  commit();
  toast("Colonne ajoutée");
}

function makeTypePicker(initial) {
  const wrap = el("div", { class: "type-grid", id: "type-picker" });
  let current = initial;
  Object.entries(TYPES).forEach(([key, meta]) => {
    const opt = el("div", {
      class: "type-opt" + (key === initial ? " active" : ""),
      "data-type": key,
      onclick: () => {
        current = key;
        $$("#type-picker .type-opt").forEach((o) => o.classList.toggle("active", o.dataset.type === key));
        const optField = $("#opt-field");
        if (optField) optField.hidden = key !== "select";
      },
    },
      el("span", { class: "ic", text: meta.ic }),
      el("span", { text: meta.label }),
    );
    wrap.appendChild(opt);
  });
  wrap.appendChild(el("input", { type: "hidden", "data-field": "type", value: initial, id: "type-value" }));

  const obs = () => {
    const hidden = $("#type-value");
    if (hidden) hidden.value = current;
  };

  wrap.addEventListener("input", obs);
  wrap.addEventListener("click", () => setTimeout(obs, 0));
  return wrap;
}

async function changeColumnType(col) {
  const enImpression = viewMode() === "print";
  const nameInput = el("input", {
    type: "text", "data-field": "name", value: col.name, spellcheck: "false",
  });
  const widthInput = el("input", {
    type: "number", "data-field": "width",
    value: String(activeColWidth(col)), min: "60", max: "900", step: "10",
  });

  const body = el("div", {},
    el("div", { class: "field" },
      el("label", { text: "Nom de la colonne" }),
      nameInput,
    ),
    el("div", { class: "field" },
      el("label", { text: "Type de données" }),
      makeTypePicker(col.type)
    ),
    el("div", { class: "field", id: "opt-field", hidden: col.type !== "select" },
      el("label", { text: "Options de la liste" }),
      el("textarea", { "data-field": "options", text: (col.options || []).join("\n") }),
      el("p", { class: "help", text: "Uniquement pour le type « Liste ». Une option par ligne." })
    ),
    el("div", { class: "field" },
      el("label", { text: enImpression ? "Largeur à l'impression" : "Largeur à l'écran" }),
      widthInput,
      el("p", { class: "help", text: enImpression
        ? "En pixels, de 60 à 900. Cette largeur ne s'applique qu'à l'impression. Vous pouvez aussi faire glisser le bord droit de l'en-tête."
        : "En pixels, de 60 à 900. Vous pouvez aussi faire glisser le bord droit de l'en-tête, ou double-cliquer dessus pour réinitialiser." })
    ),
    el("p", { class: "help", text: "Le changement de type peut modifier l'affichage des valeurs existantes." })
  );

  const d = await openModal({
    title: "Propriétés de la colonne",
    body,
    okText: "Appliquer",
    actions: [
      { label: "Dupliquer la colonne", onClick: () => { closeModal(false); duplicateColumn(col); } },
    ],
  });
  if (!d) return;

  col.name = (d.name || "").trim() || col.name;
  col.type = TYPES[d.type] ? d.type : col.type;
  col.options = (d.options || "").split("\n").map((s) => s.trim()).filter(Boolean);

  const w = Number(d.width);
  if (Number.isFinite(w) && w > 0) {
    const val = Math.min(900, Math.max(60, Math.round(w)));
    if (enImpression) col.printWidth = val;
    else col.width = val;
  } else if (enImpression) {
    delete col.printWidth;
  } else {
    delete col.width;
  }

  const t = activeTable();
  t.rows.forEach((r) => {
    const v = r.cells[col.id];
    if (col.type === "checkbox") r.cells[col.id] = Boolean(v) && v !== "false";
    else if (col.type === "number") r.cells[col.id] = v === "" ? "" : String(Number(String(v).replace(",", ".")) || "");
    else if (col.type === "select") r.cells[col.id] = col.options.includes(v) ? v : "";
    else if (col.type === "date") r.cells[col.id] = /^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? String(v) : "";
    else r.cells[col.id] = v === null || v === undefined ? "" : String(v);
  });

  commit();
  toast("Colonne mise à jour");
}

async function deleteColumn(col) {
  const t = activeTable();
  const body = el("div", {},
    el("p", {
      class: "help",
      text: `Supprimer la colonne « ${col.name} » et toutes ses données ?`,
    })
  );
  const d = await openModal({ title: "Supprimer la colonne", body, okText: "Supprimer", danger: true });
  if (!d) return;

  t.columns = t.columns.filter((c) => c.id !== col.id);
  t.rows.forEach((r) => {
    delete r.cells[col.id];
    if (r.fmt) {
      delete r.fmt[col.id];
      if (Object.keys(r.fmt).length === 0) delete r.fmt;
    }
  });
  if (sortCol === col.id) sortCol = null;
  commit();
  toast("Colonne supprimée");
}

/* ============================================================
   Actions — lignes
   ============================================================ */

function addRow() {
  const t = activeTable();
  const row = { id: uid(), cells: {} };
  t.columns.forEach((c) => (row.cells[c.id] = defaultValue(c)));
  t.rows.push(row);
  commit();

  const el2 = $(`.grid-row[data-id="${row.id}"] .cell-input`);
  if (el2) el2.focus();
}

/* ============================================================
   Import / Export
   ============================================================ */

function toCSV(t) {
  const cols = t.columns;
  const q = (v) => {
    const s = v === true ? "oui" : v === false ? "non" : String(v ?? "");
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [cols.map((c) => q(c.name)).join(";")];
  visibleRows().forEach((r) => {
    lines.push(cols.map((c) => {
      let v = r.cells[c.id];
      if (c.type === "number" && v !== "" && v !== null && v !== undefined) v = String(v).replace(".", ",");
      return q(v);
    }).join(";"));
  });
  return "\uFEFF" + lines.join("\r\n");
}

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function slug(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tableau";
}

function exportCSV() {
  const t = activeTable();
  download(slug(t.name) + ".csv", toCSV(t), "text/csv;charset=utf-8");
  toast("CSV exporté");
}

/* ---------- Sauvegarde et restauration ---------- */

const BACKUP_FORMAT = 1;

function exportJSON() {
  const payload = {
    app: "tableaux",
    format: BACKUP_FORMAT,
    exporteLe: new Date().toISOString(),
    version: "1.0",
    tables: state.tables,
    activeId: state.activeId,
    style: state.style,
    print: state.print,
  };
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  download(`sauvegarde-tableaux-${stamp}.json`, JSON.stringify(payload, null, 2), "application/json");
  toast(`Sauvegarde créée · ${state.tables.length} tableau${state.tables.length > 1 ? "x" : ""}`);
}

async function importJSON(file) {
  let data;
  try {
    data = JSON.parse(await file.text());
  } catch {
    toast("Fichier illisible : ce n'est pas du JSON valide", "err");
    return;
  }

  const list = Array.isArray(data) ? data : data.tables;
  if (!Array.isArray(list) || list.length === 0) {
    toast("Aucun tableau trouvé dans ce fichier", "err");
    return;
  }

  const nbTables = list.length;
  const nbLignes = list.reduce((a, t) => a + (Array.isArray(t.rows) ? t.rows.length : 0), 0);

  const body = el("div", {},
    el("p", { class: "help", text: `Ce fichier contient ${nbTables} tableau${nbTables > 1 ? "x" : ""} et ${nbLignes} ligne${nbLignes > 1 ? "s" : ""}.` }),
    el("div", { class: "field" },
      el("label", { text: "Que faire ?" }),
      el("select", { "data-field": "mode" },
        el("option", { value: "replace", text: "Remplacer mes tableaux actuels" }),
        el("option", { value: "merge", text: "Ajouter à la suite de mes tableaux" }),
      ),
      el("p", { class: "help", text: "« Remplacer » écrase tout. Cette action est annulable avec Ctrl+Z." }),
    ),
  );

  const d = await openModal({ title: "Restaurer une sauvegarde", body, okText: "Restaurer" });
  if (!d) return;

  remember("Restaurer une sauvegarde");

  const incoming = list.map((t) => {
    const copy = JSON.parse(JSON.stringify(t));
    copy.id = uid();
    copy.rows = (copy.rows || []).map((r) => Object.assign({}, r, { id: uid() }));
    normalizeTable(copy);
    copy.id = uid();
    return copy;
  });

  if (d.mode === "merge") {
    incoming.forEach((t) => {
      t.id = uid();
      state.tables.push(t);
    });
  } else {
    state.tables = incoming;
  }

  if (data.style && d.mode !== "merge") state.style = normalizeStyle(data.style);
  if (data.print && d.mode !== "merge") state.print = normalizePrint(data.print);
  state.activeId = state.tables[state.tables.length - 1].id;
  sortCol = null;
  searchTerm = "";
  $("#search").value = "";

  applyStyle();
  commit();
  toast(`${nbTables} tableau${nbTables > 1 ? "x" : ""} restauré${nbTables > 1 ? "s" : ""}`);
}

function importBackup() {
  const inp = $("#file-json");
  inp.value = "";
  inp.click();
}

/* ---------- Export Word (.doc) ---------- */

function toDocHTML(t, rows) {
  const cols = t.columns;
  const p = normalizePrint(state.print);
  state.print = p;
  const st = normalizeStyle(state.style);
  const c = resolvePrintColors(p);
  const landscape = p.orientation === "landscape";
  const title = (p.title && p.title.trim()) || t.name;
  const subtitle = (p.subtitle || "").trim();

  const fontStack = p.font === "inherit" ? FONTS[st.font].stack : FONTS[p.font].stack;
  const fontPt = p.fontSize;
  const b = borderSpecs(p);
  const paper = PAPER.letter;
  const paperSize = landscape ? paper.landscape : paper.portrait;

  const head = cols.map((c) => `<th class="h-${c.type}">${esc(c.name)}</th>`).join("");

  const w = printColWidthsPt(t, p);
  const rowH = printRowHeightPt(p);
  const headH = printHeadHeightPt(p);
  const colgroup = `<colgroup>${p.rowNumbers ? `<col style="width:${w.rowNum}%">` : ""}${w.cols
    .map((pc) => `<col style="width:${pc}%">`)
    .join("")}</colgroup>`;
  const bodyRows = rows.map((r, i) => {
    const cells = cols.map((c) => {
      const v = displayValue(c, r.cells[c.id]);
      const cls = c.type === "number" ? "num" : c.type === "checkbox" ? "center" : "";
      const f = (r.fmt && r.fmt[c.id]) || "";
      const style = [
        f.includes("b") ? "font-weight:bold" : "",
        f.includes("i") ? "font-style:italic" : "",
        f.includes("u") ? "text-decoration:underline" : "",
      ].filter(Boolean).join(";");
      return style
        ? `<td class="${cls}" style="${style}">${esc(v)}</td>`
        : `<td class="${cls}">${esc(v)}</td>`;
    }).join("");
    const rowNum = p.rowNumbers ? `<td class="rownum">${i + 1}</td>` : "";
    return `<tr>${rowNum}${cells}</tr>`;
  }).join("");

  const firstRow = p.rowNumbers ? `<th class="rownum">#</th>` : "";
  const metaBits = [];
  if (p.showDate) metaBits.push("Édité le " + new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }));
  if (p.showCount) metaBits.push(`${rows.length} ligne${rows.length > 1 ? "s" : ""} · ${cols.length} colonne${cols.length > 1 ? "s" : ""}`);

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<!--[if gte mso 9]><xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
  </w:WordDocument>
</xml><![endif]-->
<style>
  @page WordSection1 {
    size: ${paperSize};
    mso-page-orientation: ${landscape ? "landscape" : "portrait"};
    margin: ${PRINT_MARGINS_DOC[p.margins] || PRINT_MARGINS_DOC.normal};
    mso-header-margin: 1cm;
    mso-footer-margin: 1cm;
  }
  div.WordSection1 { page: WordSection1; }
  body {
    font-family: ${fontStack};
    font-size: ${fontPt}pt;
    color: #111;
  }
  h1 {
    font-size: 18pt;
    font-weight: bold;
    margin: 0 0 2pt;
    color: #000;
  }
  .subtitle {
    font-size: 10.5pt;
    color: #444;
    margin: 0 0 4pt;
    font-style: italic;
  }
  .meta {
    font-size: 8.5pt;
    color: #666;
    margin: 0 0 12pt;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    mso-table-layout: fixed;
  }
  th, td {
    border-top: ${b.top};
    border-bottom: ${b.insideH};
    border-left: ${b.left};
    border-right: ${b.insideV};
    padding: 5pt 7pt;
    vertical-align: top;
    text-align: left;
    font-family: ${fontStack};
    font-size: ${fontPt}pt;
    color: ${c.cellFg};
    background: ${c.cellBg};
    word-wrap: break-word;
    height: ${rowH}pt;
    mso-line-height-rule: exactly;
    line-height: ${Math.round(rowH * 0.62 * 10) / 10}pt;
  }
  tr:last-child td { border-bottom: ${b.bottom}; }
  th:last-child, td:last-child { border-right: ${b.right}; }
  th {
    background: ${c.headBg};
    font-weight: ${st.headWeight};
    color: ${c.cellFg};
    text-transform: ${st.headTransform};
    text-align: ${st.headAlign === "center" ? "center" : "left"};
    mso-pattern: solid ${c.headBg};
    background: ${c.headBg};
    height: ${headH}pt;
    line-height: ${Math.round(headH * 0.62 * 10) / 10}pt;
    border-bottom: ${b.insideH};
  }
  th.rownum, td.rownum {
    text-align: center;
    width: 28pt;
    background: ${c.cellBgAlt};
    color: #666;
    border-left: ${b.left};
    border-right: ${b.insideV};
  }
  td.num { text-align: right; }
  td.center, th.center { text-align: center; }
  th.h-number, td.num { text-align: right; }
  th.h-checkbox, th.center { text-align: center; }
  ${st.zebra ? `tr:nth-child(even) td { background: ${c.cellBgAlt}; }\n  tr:nth-child(even) td.rownum { background: ${c.cellBg}; }` : ""}
  .footer {
    margin-top: 10pt;
    padding-top: 5pt;
    border-top: ${b.insideH === "none" ? "1pt solid #bbb" : b.insideH};
    font-size: 8pt;
    color: #777;
    font-family: ${fontStack};
  }
</style>
</head>
<body>
<div class="WordSection1">
  <h1>${esc(title)}</h1>
  ${subtitle ? `<p class="subtitle">${esc(subtitle)}</p>` : ""}
  <p class="meta">${esc(metaBits.join("  ·  "))}</p>
  <table>
    ${colgroup}
    <thead>
      <tr>${firstRow}${head}</tr>
    </thead>
    <tbody>
      ${bodyRows || `<tr>${p.rowNumbers ? "<td class=\"rownum\"></td>" : ""}${cols.map(() => "<td>&nbsp;</td>").join("")}</tr>`}
    </tbody>
  </table>
  ${p.showFooter ? `<p class="footer">Document généré depuis Tableaux — ${esc(title)}</p>` : ""}
</div>
</body>
</html>`;
}

function exportDoc() {
  const t = activeTable();
  const rows = visibleRows();
  const html = toDocHTML(t, rows);
  download(slug(t.name) + ".doc", html, "application/msword;charset=utf-8");
  toast("Document Word exporté");
}

/* ---------- Impression ---------- */

function applyPrintPage() {
  let st = document.getElementById("page-style");
  if (!st) {
    st = document.createElement("style");
    st.id = "page-style";
    document.head.appendChild(st);
  }
  const p = normalizePrint(state.print);
  state.print = p;
  const c = resolvePrintColors(p);
  const b = borderSpecs(p);
  const paper = PAPER.letter;
  const size = p.orientation === "landscape" ? `${paper.css} landscape` : `${paper.css} portrait`;
  const margin = PRINT_MARGINS[p.margins] || PRINT_MARGINS.normal;

  st.textContent = `@page { size: ${size}; margin: ${margin}; }`;

  const r = document.documentElement.style;
  const fontStack = p.font === "inherit" ? FONTS[normalizeStyle(state.style).font].stack : FONTS[p.font].stack;
  r.setProperty("--pv-font", fontStack);
  r.setProperty("--pv-font-size", p.fontSize + "pt");
  r.setProperty("--pv-head-bg", c.headBg);
  r.setProperty("--pv-head-fg", c.cellFg);
  r.setProperty("--pv-cell-bg", c.cellBg);
  r.setProperty("--pv-cell-bg-alt", c.cellBgAlt);
  r.setProperty("--pv-cell-fg", c.cellFg);
  r.setProperty("--pv-border-color", c.borderColor);
  r.setProperty("--pv-row-h", printRowHeightPt(p) + "pt");
  r.setProperty("--pv-head-h", printHeadHeightPt(p) + "pt");
  r.setProperty("--pv-bt", b.top);
  r.setProperty("--pv-bb", b.bottom);
  r.setProperty("--pv-bl", b.left);
  r.setProperty("--pv-br", b.right);
  r.setProperty("--pv-bih", b.insideH);
  r.setProperty("--pv-biv", b.insideV);

  document.body.classList.toggle("no-print-rownums", !p.rowNumbers);
  document.body.classList.toggle("no-print-footer", !p.showFooter);
}

function renderPrintHeader() {
  const t = activeTable();
  const p = state.print || defaultPrint();
  const box = $("#print-header");
  box.innerHTML = "";

  const title = (p.title && p.title.trim()) || t.name;
  box.appendChild(el("h2", { class: "ph-title", text: title }));
  if (p.subtitle && p.subtitle.trim()) {
    box.appendChild(el("p", { class: "ph-sub", text: p.subtitle.trim() }));
  }

  const meta = el("div", { class: "ph-meta" });
  if (p.showDate) {
    meta.appendChild(el("span", {
      text: "Imprimé le " + new Date().toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      }),
    }));
  }
  if (p.showCount) {
    meta.appendChild(el("span", {
      text: `${t.rows.length} ligne${t.rows.length > 1 ? "s" : ""} · ${t.columns.length} colonne${t.columns.length > 1 ? "s" : ""}`,
    }));
  }
  if (searchTerm) {
    meta.appendChild(el("span", { text: `Filtre : « ${searchTerm} »` }));
  }
  if (meta.children.length) box.appendChild(meta);
}

function preparePrint() {
  $$(".cell-select").forEach((sel) => {
    const span = el("span", { class: "print-text", text: sel.value || "" });
    sel.replaceWith(span);
  });
  $$(".cell.check input[type=checkbox]").forEach((cb) => {
    const span = el("span", { class: "print-text", text: cb.checked ? "Oui" : "Non" });
    cb.replaceWith(span);
  });
  $$(".cell-input").forEach((inp) => {
    const cell = inp.closest(".cell");
    let text = inp.value || "";
    if (inp.type === "date" && text) text = formatDateFR(text);
    const classes = ["print-text"];
    if (inp.classList.contains("cell-b")) classes.push("fmt-b");
    if (inp.classList.contains("cell-i")) classes.push("fmt-i");
    if (inp.classList.contains("cell-u")) classes.push("fmt-u");
    const span = el("span", { class: classes.join(" "), text });
    if (cell && cell.classList.contains("num")) span.style.textAlign = "right";
    inp.replaceWith(span);
  });
  $$(".empty-state button").forEach((b) => b.remove());
}

function restoreAfterPrint() {
  renderGrid();
}

async function printOptions() {
  const t = activeTable();
  const p = normalizePrint(state.print);

  const previewBox = el("div", { class: "print-opt-preview" });

  const readDraft = () => {
    const raw = {};
    body.querySelectorAll("[data-field]").forEach((f) => {
      raw[f.dataset.field] = f.type === "checkbox" ? f.checked : f.value;
    });
    return normalizePrint(Object.assign({}, state.print, {
      title: (raw.title || "").trim(),
      subtitle: (raw.subtitle || "").trim(),
      orientation: raw.orientation === "landscape" ? "landscape" : "portrait",
      margins: raw.margins,
      rowNumbers: Boolean(raw.rowNumbers),
      showDate: Boolean(raw.showDate),
      showCount: Boolean(raw.showCount),
      showFooter: Boolean(raw.showFooter),
    }));
  };

  function refresh() {
    const draft = readDraft();
    const saved = state.print;
    state.print = draft;
    previewBox.innerHTML = "";
    previewBox.appendChild(buildPrintPreview({ maxRows: 5 }));
    state.print = saved;
  }

  const body = el("div", { class: "print-opt-grid" },
    el("div", { class: "print-opt-fields" },
      makeField("Titre à l'impression",
        el("input", { type: "text", "data-field": "title", value: p.title || t.name, spellcheck: "false" }),
        "Laissez vide pour utiliser le nom du tableau."),
      makeField("Sous-titre",
        el("input", { type: "text", "data-field": "subtitle", value: p.subtitle || "", spellcheck: "false", placeholder: "Ex : Rapport mensuel — Équipe ventes" })),
      makeField("Orientation",
        el("select", { "data-field": "orientation" },
          el("option", { value: "portrait", text: "Portrait (Lettre)" }),
          el("option", { value: "landscape", text: "Paysage (Lettre)" }),
        )),
      makeField("Marges",
        el("select", { "data-field": "margins" },
          el("option", { value: "narrow", text: "Étroites" }),
          el("option", { value: "normal", text: "Normales" }),
          el("option", { value: "wide", text: "Larges" }),
        )),
      el("div", { class: "field" },
        el("label", { text: "Éléments affichés" }),
        el("label", { class: "check-line" },
          el("input", { type: "checkbox", "data-field": "rowNumbers" }),
          el("span", { text: "Numéros de ligne" }),
        ),
        el("label", { class: "check-line" },
          el("input", { type: "checkbox", "data-field": "showDate" }),
          el("span", { text: "Date d'impression" }),
        ),
        el("label", { class: "check-line" },
          el("input", { type: "checkbox", "data-field": "showCount" }),
          el("span", { text: "Nombre de lignes / colonnes" }),
        ),
        el("label", { class: "check-line" },
          el("input", { type: "checkbox", "data-field": "showFooter" }),
          el("span", { text: "Pied de page" }),
        ),
      ),
      el("p", { class: "help", text: "Les colonnes, listes et cases à cocher sont converties en texte pour l'impression." }),
      el("p", {
        class: "help",
        text: "Pour changer les couleurs, la police ou les contours imprimés, utilisez le panneau Style → onglet Impression.",
      }),
    ),
    el("div", { class: "print-opt-side" },
      el("div", { class: "pv-bar" },
        el("span", { class: "pv-badge", text: "Aperçu d'impression" }),
        el("span", { class: "pv-hint", text: "Mise à jour en direct." }),
      ),
      previewBox,
    ),
  );

  // valeurs initiales
  body.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = Boolean(p[cb.dataset.field]);
  });
  body.querySelectorAll("select[data-field]").forEach((s) => {
    s.value = String(p[s.dataset.field] ?? "");
  });

  body.addEventListener("input", refresh);
  body.addEventListener("change", refresh);
  refresh();

  const d = await openModal({
    title: "Options d'impression",
    body,
    okText: "Imprimer",
    className: "print-opt-modal",
  });
  if (!d) return;

  state.print = readDraft();
  save();
  doPrint();
}

function doPrint() {
  renderPrintHeader();
  applyPrintPage();
  preparePrint();
  setTimeout(() => {
    window.print();
    setTimeout(restoreAfterPrint, 250);
  }, 60);
}

/* ============================================================
   Style des tableaux
   ============================================================ */

function makeTabs(items, initial, onChange) {
  const wrap = el("div", { class: "pv-tabs" });
  let cur = initial;
  const sync = () => wrap.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === cur));
  items.forEach(([value, label]) => {
    wrap.appendChild(el("button", {
      type: "button",
      "data-v": value,
      text: label,
      onclick: () => {
        cur = value;
        sync();
        onChange(value);
      },
    }));
  });
  sync();
  return wrap;
}

function buildScreenPreview() {
  const t = activeTable();
  const s = normalizeStyle(state.style);
  const rows = visibleRows().slice(0, 4);

  if (t.columns.length === 0) {
    return el("div", { class: "style-preview" },
      el("div", { class: "pv-empty", text: "Ajoutez une colonne pour voir l'aperçu" })
    );
  }

  const total = t.columns.reduce((a, c) => a + colWidth(c), 0);
  const pct = (c) => (colWidth(c) / total) * 100;

  const frame = el("div", { class: "style-preview" });

  const head = el("div", { class: "pv-head", "data-align": s.headAlign });
  t.columns.forEach((c) => {
    const cell = el("div", { class: "pv-cell", text: c.name });
    cell.style.flex = `0 0 ${pct(c)}%`;
    if (c.type === "number") cell.classList.add("pv-num");
    if (c.type === "checkbox") cell.classList.add("pv-ctr");
    head.appendChild(cell);
  });
  frame.appendChild(head);

  const shown = rows.length
    ? rows
    : [{ cells: Object.fromEntries(t.columns.map((c) => [c.id, ""])) }];

  shown.forEach((r) => {
    const row = el("div", { class: "pv-row" });
    t.columns.forEach((c) => {
      const val = displayValue(c, r.cells[c.id]);
      const cell = el("div", { class: "pv-cell" });
      cell.style.flex = `0 0 ${pct(c)}%`;
      if (c.type === "number") cell.classList.add("pv-num");
      const f = (r.fmt && r.fmt[c.id]) || "";
      if (f.includes("b")) cell.classList.add("fmt-b");
      if (f.includes("i")) cell.classList.add("fmt-i");
      if (f.includes("u")) cell.classList.add("fmt-u");
      if (c.type === "checkbox") {
        cell.classList.add("pv-ctr");
        cell.appendChild(el("span", { class: "pv-check" + (r.cells[c.id] ? " on" : ""), text: r.cells[c.id] ? "✓" : "" }));
      } else {
        cell.textContent = val;
      }
      row.appendChild(cell);
    });
    frame.appendChild(row);
  });

  return frame;
}

function buildPrintPreview(opts = {}) {
  const t = activeTable();
  const p = normalizePrint(state.print);
  const st = normalizeStyle(state.style);
  const c = resolvePrintColors(p);
  const b = borderSpecs(p);
  const rows = visibleRows();
  const limit = opts.maxRows || 8;
  const shown = rows.slice(0, limit);
  const paper = PAPER.letter;

  const fontStack = p.font === "inherit" ? FONTS[st.font].stack : FONTS[p.font].stack;
  const rowHPt = printRowHeightPt(p);
  const headHPt = printHeadHeightPt(p);
  const paperW = paperWidthPt(p);
  const mg = marginsPt(p);

  const sheet = el("div", {
    class: "pp-sheet",
    style: [
      `--pp-head-bg:${c.headBg}`,
      `--pp-cell-bg:${c.cellBg}`,
      `--pp-cell-bg-alt:${c.cellBgAlt}`,
      `--pp-cell-fg:${c.cellFg}`,
      `--pp-bt:${b.top}`,
      `--pp-bb:${b.bottom}`,
      `--pp-bl:${b.left}`,
      `--pp-br:${b.right}`,
      `--pp-bih:${b.insideH}`,
      `--pp-biv:${b.insideV}`,
      `--pp-font:${fontStack}`,
      `--pp-pt:${p.fontSize}`,
      `--pp-row-pt:${rowHPt}`,
      `--pp-head-pt:${headHPt}`,
      `--pp-paper-w:${paperW}`,
      `--pp-mv:${Math.round(mg.v * 10) / 10}`,
      `--pp-mh:${Math.round(mg.h * 10) / 10}`,
    ].join(";"),
  });

  const page = el("div", {
    class: "pp-page",
    "data-orient": p.orientation,
    "data-label": `${paper.label} ${p.orientation === "landscape" ? "paysage" : "portrait"}`,
  }, sheet);

  const title = (p.title && p.title.trim()) || t.name;
  const head = el("div", { class: "pp-head" },
    el("p", { class: "pp-title", text: title }),
  );
  if (p.subtitle && p.subtitle.trim()) {
    head.appendChild(el("p", { class: "pp-sub", text: p.subtitle.trim() }));
  }

  const meta = [];
  if (p.showDate) {
    meta.push("Imprimé le " + new Date().toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    }));
  }
  if (p.showCount) {
    meta.push(`${rows.length} ligne${rows.length > 1 ? "s" : ""} · ${t.columns.length} colonne${t.columns.length > 1 ? "s" : ""}`);
  }
  if (searchTerm) meta.push(`Filtre : « ${searchTerm} »`);
  if (meta.length) head.appendChild(el("p", { class: "pp-meta", text: meta.join("  ·  ") }));
  sheet.appendChild(head);

  if (t.columns.length === 0) {
    sheet.appendChild(el("div", { class: "pp-empty", text: "Aucune colonne à imprimer — ajoutez une colonne au tableau." }));
    return page;
  }

  const widths = printColWidthsPt(t, p);
  const pct = (i) => (p.rowNumbers && i < 0 ? widths.rowNum : widths.cols[i]);

  const table = el("table", { class: "pp-table" });

  const trh = el("tr");
  if (p.rowNumbers) {
    const th = el("th", { class: "pp-num", text: "#" });
    th.style.width = widths.rowNum + "%";
    trh.appendChild(th);
  }
  t.columns.forEach((col, i) => {
    const th = el("th", { text: col.name });
    th.style.width = widths.cols[i] + "%";
    if (col.type === "number") th.classList.add("pp-num");
    if (col.type === "checkbox") th.classList.add("pp-ctr");
    trh.appendChild(th);
  });
  table.appendChild(el("thead", {}, trh));

  const tbody = el("tbody");
  const mkRow = (cells) => {
    const tr = el("tr");
    if (p.rowNumbers) tr.appendChild(el("td", { class: "pp-num", text: cells.num }));
    t.columns.forEach((col) => {
      const td = el("td", { text: cells.vals[col.id] ?? "" });
      if (col.type === "number") td.classList.add("pp-num");
      if (col.type === "checkbox") td.classList.add("pp-ctr");
      const f = (cells.fmt && cells.fmt[col.id]) || "";
      if (f.includes("b")) td.classList.add("fmt-b");
      if (f.includes("i")) td.classList.add("fmt-i");
      if (f.includes("u")) td.classList.add("fmt-u");
      tr.appendChild(td);
    });
    return tr;
  };

  if (shown.length === 0) {
    const vals = {};
    t.columns.forEach((col) => (vals[col.id] = searchTerm ? "Aucun résultat" : ""));
    tbody.appendChild(mkRow({ num: "", vals }));
  } else {
    shown.forEach((r, i) => {
      const vals = {};
      t.columns.forEach((col) => (vals[col.id] = displayValue(col, r.cells[col.id])));
      tbody.appendChild(mkRow({ num: String(i + 1), vals, fmt: r.fmt }));
    });
  }
  table.appendChild(tbody);
  sheet.appendChild(table);

  if (rows.length > shown.length) {
    sheet.appendChild(el("p", {
      class: "pp-more",
      text: `… et ${rows.length - shown.length} autre${rows.length - shown.length > 1 ? "s" : ""} ligne${rows.length - shown.length > 1 ? "s" : ""} à l'impression`,
    }));
  }

  if (p.showFooter) {
    sheet.appendChild(el("div", { class: "pp-page-foot" },
      el("p", { class: "pp-foot", text: `Document généré depuis Tableaux — ${title}` }),
      el("p", { class: "pp-foot", text: "Page 1" }),
    ));
  }

  return page;
}

function makeSeg(field, options, initial) {
  const hidden = el("input", { type: "hidden", "data-field": field, value: String(initial) });
  const wrap = el("div", { class: "seg" }, hidden);
  const sync = () => wrap.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === hidden.value));
  options.forEach(([value, label]) => {
    wrap.appendChild(el("button", {
      type: "button",
      "data-v": String(value),
      text: label,
      onclick: () => {
        hidden.value = String(value);
        sync();
        wrap.dispatchEvent(new Event("change", { bubbles: true }));
      },
    }));
  });
  sync();
  return wrap;
}

function makePick(field, options, initial) {
  const sel = el("select", { "data-field": field });
  options.forEach(([v, label]) => sel.appendChild(el("option", { value: String(v), text: label })));
  setPickValue(sel, initial);
  return sel;
}

/** Sélectionne une valeur dans un <select>, en ajoutant l'option si elle manque. */
function setPickValue(sel, value) {
  const v = String(value);
  if (![...sel.options].some((o) => o.value === v)) {
    sel.appendChild(el("option", { value: v, text: v + " pt" }));
  }
  sel.value = v;
}

function makeColor(field, initial) {
  const hex = el("span", { class: "hex", text: String(initial).toUpperCase() });
  const input = el("input", { type: "color", "data-field": field, value: initial });
  input.addEventListener("input", () => { hex.textContent = input.value.toUpperCase(); });
  return {
    node: el("div", { class: "color-ctrl" }, input, hex),
    sync: (v) => { input.value = v; hex.textContent = String(v).toUpperCase(); },
  };
}

function styleGroup(title, ...children) {
  return el("div", { class: "style-group" }, el("h3", { text: title }), ...children);
}

function ctrl(labelText, node) {
  return el("div", { class: "style-ctrl" }, el("label", {}, el("span", { text: labelText })), node);
}

function row(...children) {
  return el("div", { class: "style-rows" }, ...children);
}

function note(text) {
  return el("p", { class: "help", style: "margin:0", text });
}

/** Groupe repliable pour les réglages destinés aux utilisateurs avancés. */
function advancedGroup(title, children) {
  const inner = el("div", { class: "adv-body" }, ...children);
  const det = el("details", { class: "adv" },
    el("summary", {}, el("span", { text: title })),
    inner,
  );
  return det;
}

function checkLine(input, label) {
  return el("label", { class: "check-line" }, input, el("span", { text: label }));
}

/* ---------- Vignettes de style (galerie) ---------- */

function themeThumb(th, label, active, onclick) {
  return el("div", {
    class: "th-thumb" + (active ? " active" : ""),
    onclick,
    role: "button",
    tabindex: "0",
    style: `--t-head:${th.headBg};--t-cell:${th.cellBg};--t-alt:${th.cellBgAlt};--t-fg:${th.cellFg};--t-accent:${th.accent}`,
  },
    el("div", { class: "tt-title", text: label }),
    el("div", { class: "tt-frame" },
      el("div", { class: "tt-head" }, el("i"), el("i"), el("i")),
      el("div", { class: "tt-row" }, el("i"), el("i"), el("i")),
      el("div", { class: "tt-row alt" }, el("i"), el("i"), el("i")),
      el("div", { class: "tt-row" }, el("i"), el("i"), el("i")),
    ),
  );
}

function lookThumb(look, key, active, onclick) {
  const sw = look.swatch || ["#cccccc", "#fff", "#eee", "#999"];
  return el("div", {
    class: "th-thumb look" + (active ? " active" : ""),
    onclick,
    role: "button",
    tabindex: "0",
    style: `--t-head:${sw[0]};--t-cell:${sw[1]};--t-alt:${sw[2]};--t-border:${sw[3]}`,
  },
    el("div", { class: "tt-title", text: look.label }),
    el("div", { class: "tt-frame", "data-borders": look.borders },
      el("div", { class: "tt-head" }, el("i"), el("i"), el("i")),
      el("div", { class: "tt-row" }, el("i"), el("i"), el("i")),
      el("div", { class: "tt-row alt" }, el("i"), el("i"), el("i")),
    ),
  );
}

/* ============================================================
   Panneau de style — 3 onglets à la Word
   ============================================================ */

function buildStyleForm() {
  const styleSnap = () => normalizeStyle(state.style);
  const printSnap = () => normalizePrint(state.print);

  // Le panneau ne présente que les réglages du mode choisi : Écran ou Impression.
  const mode = viewMode();
  const tabDefs = mode === "print"
    ? [["print", "Mise en forme imprimée"]]
    : [
        ["style", "Style de tableau"],
        ["format", "Mise en forme"],
      ];

  let currentTab = tabDefs[0][0];

  const panes = {};
  const paneWrap = el("div", { class: "style-panes" });
  const previewWrap = el("div", { class: "pv-wrap" });

  function renderPreview() {
    previewWrap.innerHTML = "";
    const isPrint = mode === "print" || currentTab === "print";
    const node = isPrint ? buildPrintPreview({ maxRows: 5 }) : buildScreenPreview();
    previewWrap.appendChild(el("div", { class: "pv-bar" },
      el("span", { class: "pv-badge", text: isPrint ? "Aperçu d'impression" : "Aperçu à l'écran" }),
      el("span", {
        class: "pv-hint",
        text: isPrint
          ? "Rendu de la page imprimée, mise à jour en direct."
          : "Rendu du tableau à l'écran, mise à jour en direct.",
      }),
    ));
    previewWrap.appendChild(node);
    updateDimReadout();
  }

  function showTab(key) {
    currentTab = key;
    tabsBar.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.tab === key));
    paneWrap.innerHTML = "";
    paneWrap.appendChild(panes[key]);
    renderPreview();
  }

  const tabsBar = el("div", { class: "style-tabs" },
    ...tabDefs.map(([key, label]) => el("button", {
      type: "button",
      "data-tab": key,
      text: label,
      onclick: () => showTab(key),
    })),
  );

  /* =========================
     Onglet 1 — Style de tableau
     ========================= */
  const themeGrid = el("div", { class: "theme-gallery" });
  const themeThumbs = {};

  function paintThemeGallery() {
    themeGrid.innerHTML = "";
    const cur = styleSnap();
    Object.entries(THEMES).forEach(([key, th]) => {
      const node = themeThumb(th, th.label, cur.theme === key, () => {
        state.style = normalizeStyle(Object.assign({}, state.style, th, { theme: key }));
        applyStyle();
        paintThemeGallery();
        syncForm();
        renderPreview();
      });
      themeThumbs[key] = node;
      themeGrid.appendChild(node);
    });
  }

  panes.style = el("div", {},
    styleGroup("Galerie de styles",
      note("Un clic applique l'ensemble : polices, couleurs, contours et densité. Vous pouvez ensuite tout affiner dans l'onglet « Mise en forme »."),
      themeGrid,
    ),
    styleGroup("",
      el("div", { style: "display:flex;gap:8px;flex-wrap:wrap" },
        el("button", {
          class: "btn btn-ghost btn-sm", type: "button", text: "Réinitialiser le style",
          onclick: () => {
            state.style = defaultStyle();
            applyStyle();
            paintThemeGallery();
            syncForm();
            renderPreview();
          },
        }),
        el("button", {
          class: "btn btn-ghost btn-sm", type: "button", text: "Réinitialiser l'impression",
          onclick: () => {
            state.print = normalizePrint({ title: state.print.title, subtitle: state.print.subtitle });
            paintLookGallery();
            syncForm();
            renderPreview();
            toast("Réglages d'impression réinitialisés");
          },
        }),
      ),
    ),
  );

  paintThemeGallery();

  /* =========================
     Onglet 2 — Mise en forme
     ========================= */
  const st0 = styleSnap();

  const fontSel = makePick("font", Object.entries(FONTS).map(([k, f]) => [k, f.label]), st0.font);
  const sizeSel = makePick("fontSize", [[9, "9 px"], [10, "10 px"], [11, "11 px"], [12, "12 px"], [13, "13 px"], [14, "14 px"], [16, "16 px"], [18, "18 px"], [20, "20 px"]], st0.fontSize);
  const rowSel = makePick("rowHeight", [[28, "Compacte"], [32, "Serrée"], [36, "Réduite"], [40, "Normale"], [48, "Confortable"], [56, "Aérée"], [64, "Très aérée"]], st0.rowHeight);
  const headHSel = makePick("headHeight", [[40, "Basse"], [48, "Réduite"], [56, "Normale"], [64, "Haute"], [72, "Très haute"]], st0.headHeight);
  const weightSel = makePick("headWeight", [[400, "Normal"], [500, "Medium"], [600, "Semi-gras"], [700, "Gras"]], st0.headWeight);
  const radiusSel = makePick("radius", [[0, "Angles droits"], [4, "Légèrement arrondis"], [8, "Arrondis"], [12, "Très arrondis"], [18, "Capsule"], [24, "Très arrondi"]], st0.radius);

  const headTSeg = makeSeg("headTransform", [["none", "Normal"], ["uppercase", "MAJUSCULES"]], st0.headTransform);
  const headASeg = makeSeg("headAlign", [["left", "Gauche"], ["center", "Centré"]], st0.headAlign);
  const bwSeg = makeSeg("borderWidth", [[0, "Aucun"], [1, "Fin"], [2, "Moyen"], [3, "Épais"]], st0.borderWidth);
  const bsSeg = makeSeg("borderStyle", [["solid", "Plein"], ["dashed", "Tirets"], ["dotted", "Pointillé"], ["double", "Double"]], st0.borderStyle);

  const colRefs = {
    headBg: makeColor("headBg", st0.headBg),
    headFg: makeColor("headFg", st0.headFg),
    cellBg: makeColor("cellBg", st0.cellBg),
    cellBgAlt: makeColor("cellBgAlt", st0.cellBgAlt),
    cellFg: makeColor("cellFg", st0.cellFg),
    borderColor: makeColor("borderColor", st0.borderColor),
    accent: makeColor("accent", st0.accent),
  };

  const zebraChk = el("input", { type: "checkbox", "data-field": "zebra" });
  zebraChk.checked = st0.zebra;
  const hoverChk = el("input", { type: "checkbox", "data-field": "hoverRow" });
  hoverChk.checked = st0.hoverRow;

  panes.format = el("div", {},
    styleGroup("Texte et densité",
      row(
        ctrl("Police", fontSel),
        ctrl("Taille du texte", sizeSel),
      ),
      row(
        ctrl("Hauteur des lignes", rowSel),
      ),
    ),
    styleGroup("Couleurs",
      row(
        ctrl("Fond de l'en-tête", colRefs.headBg.node),
        ctrl("Fond des cellules", colRefs.cellBg.node),
      ),
      row(
        ctrl("Fond alterné", colRefs.cellBgAlt.node),
        ctrl("Couleur du texte", colRefs.cellFg.node),
      ),
      row(
        ctrl("Couleur d'accent", colRefs.accent.node),
      ),
    ),
    styleGroup("Contours",
      row(
        ctrl("Épaisseur", bwSeg),
        ctrl("Angles", radiusSel),
      ),
    ),
    styleGroup("Confort de lecture",
      row(
        el("div", { class: "style-ctrl" },
          el("label", {}, el("span", { text: "Affichage" })),
          el("div", { class: "toggle-row" },
            checkLine(zebraChk, "Alterner les couleurs de ligne"),
            checkLine(hoverChk, "Surligner la ligne au survol"),
          ),
        ),
      ),
    ),
    advancedGroup("Options avancées", [
      styleGroup("En-tête",
        row(
          ctrl("Hauteur", headHSel),
          ctrl("Graisse", weightSel),
        ),
        row(
          ctrl("Casse", headTSeg),
          ctrl("Alignement", headASeg),
        ),
        row(
          ctrl("Couleur du texte d'en-tête", colRefs.headFg.node),
        ),
      ),
      styleGroup("Contours",
        row(
          ctrl("Style du trait", bsSeg),
          ctrl("Couleur du contour", colRefs.borderColor.node),
        ),
      ),
    ]),
  );

  /* =========================
     Onglet 3 — Impression
     ========================= */
  const p0 = printSnap();

  const pTitle = el("input", { type: "text", value: p0.title || "", placeholder: "Titre du document", spellcheck: "false" });
  const pSub = el("input", { type: "text", value: p0.subtitle || "", placeholder: "Sous-titre (facultatif)", spellcheck: "false" });

  const orientSeg = makeSeg("orientation", [["portrait", "Portrait"], ["landscape", "Paysage"]], p0.orientation);
  const marginsSeg = makeSeg("margins", [["narrow", "Étroites"], ["normal", "Normales"], ["wide", "Larges"]], p0.margins);

  const pRowNums = el("input", { type: "checkbox" });
  pRowNums.checked = p0.rowNumbers;
  const pDate = el("input", { type: "checkbox" });
  pDate.checked = p0.showDate;
  const pCount = el("input", { type: "checkbox" });
  pCount.checked = p0.showCount;
  const pFooter = el("input", { type: "checkbox" });
  pFooter.checked = p0.showFooter;

  const PT_OPTS = [[14, "14 pt"], [18, "18 pt"], [22, "22 pt"], [24, "24 pt"], [28, "28 pt"], [32, "32 pt"], [40, "40 pt"], [48, "48 pt"]];

  const pRowHSel = el("select", { "data-field": "p-rowHeight" },
    ...PT_OPTS.map(([v, l]) => el("option", { value: String(v), text: l })),
  );
  setPickValue(pRowHSel, p0.rowHeight);

  const pHeadHSel = el("select", { "data-field": "p-headHeight" },
    ...PT_OPTS.map(([v, l]) => el("option", { value: String(v), text: l })),
  );
  setPickValue(pHeadHSel, p0.headHeight);

  const pWeightSel2 = el("select", { "data-field": "p-headWeight" },
    ...[["400", "Normal"], ["500", "Medium"], ["600", "Semi-gras"], ["700", "Gras"]]
      .map(([v, l]) => el("option", { value: v, text: l })),
  );
  setPickValue(pWeightSel2, p0.headWeight);

  const pHeadTSeg = makeSeg("p-headTransform", [["none", "Normal"], ["uppercase", "MAJUSCULES"]], p0.headTransform);
  const pHeadASeg = makeSeg("p-headAlign", [["left", "Gauche"], ["center", "Centré"]], p0.headAlign);

  const pZebraChk = el("input", { type: "checkbox" });
  pZebraChk.checked = p0.zebra !== false;

  const pUseColW = el("input", { type: "checkbox" });
  pUseColW.checked = p0.useColWidths !== false;

  const dimReadout = el("p", { class: "dim-readout" });

  function updateDimReadout() {
    const t = activeTable();
    const p = printSnap();
    const st = normalizeStyle(state.style);
    const scale = printScale(t, p);
    const sc = Math.round(st.rowHeight * 0.75 * scale * 10) / 10;

    const parts = [];
    if (p.useColWidths !== false) {
      const w = t.columns.map((c) => colWidth(c));
      parts.push(`Colonnes : ${w.join(" · ")} px`);
    } else {
      parts.push(`Colonnes : parts égales`);
    }
    parts.push(`hauteur : ${p.rowHeight === "auto" ? `${sc} pt (automatique depuis ${st.rowHeight} px)` : `${p.rowHeight} pt (fixe)`}`);
    parts.push(`échelle : ${String(Math.round(scale * 100) / 100).replace(".", ",")}×`);
    dimReadout.textContent = parts.join("  —  ");
  }

  const pFontSel = el("select", { "data-field": "p-font" },
    ...Object.entries(FONTS).map(([k, f]) => el("option", { value: k, text: f.label })),
  );
  setPickValue(pFontSel, p0.font);

  const pSizeSel = el("select", { "data-field": "p-fontSize" },
    ...[[8, "8 pt"], [8.5, "8,5 pt"], [9, "9 pt"], [9.5, "9,5 pt"], [10, "10 pt"], [10.5, "10,5 pt"], [11, "11 pt"], [12, "12 pt"], [14, "14 pt"]]
      .map(([v, l]) => el("option", { value: String(v), text: l })),
  );
  setPickValue(pSizeSel, p0.fontSize);

  const pColRefs = {
    headBg: makeColor("p-headBg", p0.headBg),
    cellBg: makeColor("p-cellBg", p0.cellBg),
    cellBgAlt: makeColor("p-cellBgAlt", p0.cellBgAlt),
    cellFg: makeColor("p-cellFg", p0.cellFg),
    borderColor: makeColor("p-borderColor", p0.borderColor),
  };

  /* --- Contours imprimés (à la Word) --- */
  const sideLabels = [
    ["top", "Haut"], ["bottom", "Bas"], ["left", "Gauche"],
    ["right", "Droite"], ["insideH", "Int. horizontal"], ["insideV", "Int. vertical"],
  ];
  const sideChks = {};
  sideLabels.forEach(([key, label]) => {
    const cb = el("input", { type: "checkbox", "data-pborder": key });
    cb.checked = Boolean(p0.borderSides[key]);
    sideChks[key] = cb;
    cb.addEventListener("change", () => {
      const sides = Object.assign({}, printSnap().borderSides, { [key]: cb.checked });
      state.print = normalizePrint(Object.assign({}, state.print, {
        borderSides: sides,
        look: "personnalisé",
      }));
      paintBorderPresets();
      paintLookGallery();
      renderPreview();
      save();
    });
  });

  const presetWrap = el("div", { class: "seg" });
  function paintBorderPresets() {
    const cur = presetKeyFor(printSnap().borderSides);
    presetWrap.innerHTML = "";
    Object.entries(BORDER_PRESETS).forEach(([key, pr]) => {
      presetWrap.appendChild(el("button", {
        type: "button",
        "data-v": key,
        text: pr.label,
        class: cur === key ? "on" : "",
        onclick: () => {
          state.print = normalizePrint(Object.assign({}, state.print, {
            borderSides: Object.assign({}, pr.sides),
            look: "personnalisé",
          }));
          Object.entries(sideChks).forEach(([k, cb]) => (cb.checked = Boolean(pr.sides[k])));
          paintBorderPresets();
          paintLookGallery();
          renderPreview();
          save();
        },
      }));
    });
    if (cur === "personnalisé") {
      presetWrap.appendChild(el("button", { type: "button", class: "on", text: "Personnalisé" }));
    }
  }
  paintBorderPresets();

  const pWeightSel = el("select", { "data-field": "p-borderWeight" },
    ...BORDER_WEIGHTS.map(([v, l]) => el("option", { value: String(v), text: l })),
  );
  setPickValue(pWeightSel, p0.borderWeight);
  pWeightSel.addEventListener("change", () => {
    state.print = normalizePrint(Object.assign({}, state.print, {
      borderWeight: Number(pWeightSel.value),
      look: "personnalisé",
    }));
    paintLookGallery();
    renderPreview();
    save();
  });

  const pBStyleSeg = makeSeg("p-borderStyle", [
    ["solid", "Plein"], ["dashed", "Tirets"], ["dotted", "Pointillé"], ["double", "Double"],
  ], p0.borderStyle);
  pBStyleSeg.addEventListener("change", () => {
    state.print = normalizePrint(Object.assign({}, state.print, {
      borderStyle: pBStyleSeg.querySelector("input").value,
      look: "personnalisé",
    }));
    paintLookGallery();
    renderPreview();
    save();
  });

  const lookGrid = el("div", { class: "theme-gallery looks" });

  function paintLookGallery() {
    lookGrid.innerHTML = "";
    const cur = printSnap();
    Object.entries(PRINT_LOOKS).forEach(([key, look]) => {
      const display = Object.assign({}, look);
      if (key === "theme") {
        const st = normalizeStyle(state.style);
        display.swatch = [st.headBg, st.cellBg, st.cellBgAlt, st.borderColor];
      }
      lookGrid.appendChild(lookThumb(display, key, cur.look === key, () => {
        const next = Object.assign({}, state.print, {
          look: key,
          borderSides: Object.assign({}, (BORDER_PRESETS[look.borders] || BORDER_PRESETS.grille).sides),
          borderWeight: look.borderWeight,
          borderStyle: look.borderStyle,
        });
        if (look.headBg) {
          next.headBg = look.headBg;
          next.cellBg = look.cellBg;
          next.cellBgAlt = look.cellBgAlt;
          next.cellFg = look.cellFg;
          next.borderColor = look.borderColor;
        }
        state.print = normalizePrint(next);
        paintLookGallery();
        syncForm();
        renderPreview();
      }));
    });
    lookGrid.appendChild(lookThumb(
      {
        label: "Personnalisé",
        swatch: [cur.headBg, cur.cellBg, cur.cellBgAlt, cur.borderColor],
        borders: presetKeyFor(cur.borderSides),
      },
      "custom",
      cur.look === "personnalisé",
      () => {
        state.print = normalizePrint(Object.assign({}, state.print, { look: "personnalisé" }));
        paintLookGallery();
        renderPreview();
      },
    ));
  }

  function writePrint() {
    state.print = normalizePrint(Object.assign({}, state.print, {
      title: pTitle.value.trim(),
      subtitle: pSub.value.trim(),
      orientation: orientSeg.querySelector("input").value,
      margins: marginsSeg.querySelector("input").value,
      rowNumbers: pRowNums.checked,
      showDate: pDate.checked,
      showCount: pCount.checked,
      showFooter: pFooter.checked,
      font: pFontSel.value,
      fontSize: Number(pSizeSel.value),
      rowHeight: Number(pRowHSel.value),
      headHeight: Number(pHeadHSel.value),
      headWeight: Number(pWeightSel2.value),
      headTransform: pHeadTSeg.querySelector("input").value,
      headAlign: pHeadASeg.querySelector("input").value,
      zebra: pZebraChk.checked,
      useColWidths: pUseColW.checked,
    }));
    save();
    if (viewMode() === "print") applyStyle();
    renderPreview();
    updateDimReadout();
  }

  [pTitle, pSub, pRowNums, pDate, pCount, pFooter, pFontSel, pSizeSel, pRowHSel, pHeadHSel, pWeightSel2, pZebraChk, pUseColW].forEach((n) => {
    n.addEventListener("input", writePrint);
    n.addEventListener("change", writePrint);
  });
  [orientSeg, marginsSeg, pHeadTSeg, pHeadASeg].forEach((n) => n.addEventListener("change", writePrint));

  Object.entries(pColRefs).forEach(([key, ref]) => {
    const field = key;
    ref.node.addEventListener("input", () => {
      state.print = normalizePrint(Object.assign({}, state.print, {
        [field]: ref.node.querySelector("input").value,
        look: "personnalisé",
      }));
      paintLookGallery();
      renderPreview();
    });
    ref.node.addEventListener("change", () => save());
  });

  panes.print = el("div", {},
    styleGroup("Page",
      row(
        ctrl("Orientation", orientSeg),
        ctrl("Marges", marginsSeg),
      ),
    ),
    styleGroup("Typographie imprimée",
      row(
        ctrl("Police", pFontSel),
        ctrl("Taille du texte", pSizeSel),
      ),
      row(
        ctrl("Hauteur des lignes", pRowHSel),
        ctrl("Hauteur de l'en-tête", pHeadHSel),
      ),
      row(
        ctrl("Graisse de l'en-tête", pWeightSel2),
        ctrl("Casse", pHeadTSeg),
      ),
      row(
        ctrl("Alignement", pHeadASeg),
        el("div", { class: "style-ctrl" },
          el("label", {}, el("span", { text: "Lignes" })),
          el("div", { class: "toggle-row" },
            checkLine(pZebraChk, "Alterner les couleurs"),
          ),
        ),
      ),
    ),
    styleGroup("Largeur des colonnes",
      row(
        el("div", { class: "style-ctrl" },
          el("label", {}, el("span", { text: "Largeurs" })),
          el("div", { class: "toggle-row" },
            checkLine(pUseColW, "Utiliser les largeurs définies à l'écran"),
          ),
        ),
      ),
      dimReadout,
      note("Faites glisser le bord droit d'un en-tête pour fixer une largeur propre à l'impression."),
    ),
    styleGroup("En-tête du document",
      row(
        el("div", { class: "style-ctrl" },
          el("label", {}, el("span", { text: "Titre" })), pTitle),
        el("div", { class: "style-ctrl" },
          el("label", {}, el("span", { text: "Sous-titre" })), pSub),
      ),
    ),
    styleGroup("Éléments affichés",
      row(
        el("div", { class: "style-ctrl" },
          el("label", {}, el("span", { text: "Contenu" })),
          el("div", { class: "toggle-row" },
            checkLine(pRowNums, "Numéros"),
            checkLine(pDate, "Date"),
            checkLine(pCount, "Compteur"),
            checkLine(pFooter, "Pied de page"),
          ),
        ),
      ),
    ),
    styleGroup("Apparence imprimée",
      note("Choisissez un style, ou ajustez les couleurs ci-dessous."),
      lookGrid,
    ),
    styleGroup("Contours imprimés",
      row(
        el("div", { class: "style-ctrl" },
          el("label", {}, el("span", { text: "Réglage rapide" })),
          presetWrap,
        ),
      ),
      row(
        ctrl("Épaisseur du trait", pWeightSel),
      ),
    ),
    advancedGroup("Options avancées", [
      styleGroup("Couleurs d'impression",
        row(
          ctrl("Fond de l'en-tête", pColRefs.headBg.node),
          ctrl("Fond des cellules", pColRefs.cellBg.node),
        ),
        row(
          ctrl("Fond alterné", pColRefs.cellBgAlt.node),
          ctrl("Couleur du texte", pColRefs.cellFg.node),
        ),
        row(
          ctrl("Couleur du contour", pColRefs.borderColor.node),
        ),
      ),
      styleGroup("Lignes à afficher",
        row(
          el("div", { class: "style-ctrl" },
            el("label", {}, el("span", { text: "Lignes de la grille" })),
            el("div", { class: "toggle-row wrap" },
              ...sideLabels.map(([key, label]) => checkLine(sideChks[key], label)),
            ),
          ),
        ),
      ),
      styleGroup("Style du trait",
        row(ctrl("Type de trait", pBStyleSeg)),
      ),
    ]),
  );

  paintLookGallery();

  /* =========================
     Assemblage + synchronisation
     ========================= */
  function syncForm() {
    const s = styleSnap();
    fontSel.value = s.font;
    sizeSel.value = String(s.fontSize);
    rowSel.value = String(s.rowHeight);
    headHSel.value = String(s.headHeight);
    weightSel.value = String(s.headWeight);
    radiusSel.value = String(s.radius);
    headTSeg.querySelector("input").value = s.headTransform;
    headTSeg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === s.headTransform));
    headASeg.querySelector("input").value = s.headAlign;
    headASeg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === s.headAlign));
    bwSeg.querySelector("input").value = String(s.borderWidth);
    bwSeg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === String(s.borderWidth)));
    bsSeg.querySelector("input").value = s.borderStyle;
    bsSeg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === s.borderStyle));
    zebraChk.checked = s.zebra;
    hoverChk.checked = s.hoverRow;
    colRefs.headBg.sync(s.headBg);
    colRefs.headFg.sync(s.headFg);
    colRefs.cellBg.sync(s.cellBg);
    colRefs.cellBgAlt.sync(s.cellBgAlt);
    colRefs.cellFg.sync(s.cellFg);
    colRefs.borderColor.sync(s.borderColor);
    colRefs.accent.sync(s.accent);

    const p = printSnap();
    pColRefs.headBg.sync(p.headBg);
    pColRefs.cellBg.sync(p.cellBg);
    pColRefs.cellBgAlt.sync(p.cellBgAlt);
    pColRefs.cellFg.sync(p.cellFg);
    pColRefs.borderColor.sync(p.borderColor);
    pWeightSel.value = String(p.borderWeight);
    pBStyleSeg.querySelector("input").value = p.borderStyle;
    pBStyleSeg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === p.borderStyle));
    Object.entries(sideChks).forEach(([k, cb]) => (cb.checked = Boolean(p.borderSides[k])));
    paintBorderPresets();
    setPickValue(pRowHSel, p.rowHeight);
    setPickValue(pHeadHSel, p.headHeight);
    setPickValue(pWeightSel2, p.headWeight);
    pHeadTSeg.querySelector("input").value = p.headTransform;
    pHeadTSeg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === p.headTransform));
    pHeadASeg.querySelector("input").value = p.headAlign;
    pHeadASeg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === p.headAlign));
    pZebraChk.checked = p.zebra !== false;
    pUseColW.checked = p.useColWidths !== false;
    orientSeg.querySelector("input").value = p.orientation;
    orientSeg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === p.orientation));
    marginsSeg.querySelector("input").value = p.margins;
    marginsSeg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === p.margins));
    updateDimReadout();
  }

  function liveUpdate(e) {
    if (e.target.dataset && e.target.dataset.v !== undefined) return;
    const raw = {};
    paneWrap.querySelectorAll("[data-field]").forEach((f) => {
      const k = f.dataset.field;
      if (k.startsWith("p-")) return;
      if (!STYLE_FIELDS.includes(k)) return;
      raw[k] = f.type === "checkbox" ? f.checked : f.value;
    });
    if (Object.keys(raw).length === 0) return;

    const next = Object.assign({}, state.style, raw);
    ["fontSize", "rowHeight", "headHeight", "headWeight", "borderWidth", "radius"].forEach((k) => {
      if (raw[k] !== undefined) next[k] = Number(raw[k]);
    });
    state.style = normalizeStyle(next);
    applyStyle();
    if (e.target.dataset && e.target.dataset.field) state.style.theme = "personnalisé";
    paintThemeGallery();
    renderPreview();
  }

  const form = el("div", { class: "style-form" },
    tabsBar,
    el("div", { class: "style-cols" }, paneWrap, previewWrap),
  );

  form.addEventListener("input", liveUpdate);
  form.addEventListener("change", liveUpdate);

  showTab(currentTab);
  return form;
}

const STYLE_FIELDS = [
  "font", "fontSize", "rowHeight", "headHeight", "headWeight", "headTransform", "headAlign",
  "borderWidth", "borderStyle", "borderColor", "radius", "zebra", "hoverRow",
  "headBg", "headFg", "cellBg", "cellBgAlt", "cellFg", "accent",
];

async function openStyleModal() {
  const snapshot = JSON.parse(JSON.stringify(state.style));
  const printSnapshot = JSON.parse(JSON.stringify(state.print || defaultPrint()));
  const body = buildStyleForm();

  const data = await openModal({
    title: "Style du tableau",
    body,
    okText: "Appliquer",
    className: "style-modal",
  });

  if (data) {
    const picked = {};
    STYLE_FIELDS.forEach((k) => {
      if (data[k] !== undefined) picked[k] = data[k];
    });
    ["fontSize", "rowHeight", "headHeight", "headWeight", "borderWidth", "radius"].forEach((k) => {
      if (picked[k] !== undefined) picked[k] = Number(picked[k]);
    });
    if (Object.keys(picked).length) {
      state.style = normalizeStyle(Object.assign({}, state.style, picked));
      applyStyle();
    }
    save();
    toast("Style appliqué");
  } else {
    state.style = normalizeStyle(snapshot);
    state.print = normalizePrint(printSnapshot);
    applyStyle();
    save();
    renderGrid();
    renderStatus();
  }
}

function parseCSV(text) {
  text = text.replace(/^\uFEFF/, "");
  const delim = detectDelim(text);
  const rows = [];
  let cur = [], field = "", inQ = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === delim) { cur.push(field); field = ""; }
      else if (ch === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; }
      else if (ch === "\r") { /* skip */ }
      else field += ch;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function detectDelim(text) {
  const line = text.split(/\r?\n/)[0] || "";
  const counts = { ";": 0, ",": 0, "\t": 0 };
  let inQ = false;
  for (const ch of line) {
    if (ch === '"') inQ = !inQ;
    else if (!inQ && ch in counts) counts[ch]++;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function guessType(values) {
  const vals = values.filter((v) => v !== "" && v !== null && v !== undefined).map(String);
  if (!vals.length) return "text";
  if (vals.every((v) => v === "oui" || v === "non" || v === "true" || v === "false" || v === "0" || v === "1" || v.toLowerCase() === "vrai" || v.toLowerCase() === "faux")) return "checkbox";
  if (vals.every((v) => /^-?\d+([.,]\d+)?$/.test(v))) return "number";
  if (vals.every((v) => /^\d{4}-\d{2}-\d{2}$/.test(v) || /^\d{2}[/-]\d{2}[/-]\d{4}$/.test(v))) return "date";
  return "text";
}

function normVal(v, type) {
  const s = String(v ?? "").trim();
  if (type === "checkbox") return ["oui", "true", "1", "vrai", "yes", "x"].includes(s.toLowerCase());
  if (type === "number") return s.replace(",", ".");
  if (type === "date") {
    const m = s.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    return s;
  }
  return s;
}

function importCSV() {
  $("#file-csv").value = "";
  $("#file-csv").click();
}

async function handleCSVFile(file) {
  const text = await file.text();
  const rows = parseCSV(text);
  if (rows.length < 1) {
    toast("Fichier CSV vide ou illisible", "err");
    return;
  }

  const headers = rows[0].map((h) => h.trim() || "Colonne");
  const dataRows = rows.slice(1);

  const columns = headers.map((h, i) => {
    const values = dataRows.map((r) => r[i] ?? "");
    const type = guessType(values);
    return { id: uid(), name: h, type, options: [] };
  });

  const tableRows = dataRows.map((r) => {
    const cells = {};
    columns.forEach((c, i) => (cells[c.id] = normVal(r[i] ?? "", c.type)));
    return { id: uid(), cells };
  });

  // listes : options uniques
  columns.forEach((c, i) => {
    if (c.type !== "select") return;
    const opts = [...new Set(dataRows.map((r) => String(r[i] ?? "").trim()).filter(Boolean))];
    c.options = opts.slice(0, 30);
    if (c.options.length < 2) {
      c.type = "text";
      tableRows.forEach((r) => (r.cells[c.id] = String(r.cells[c.id] ?? "")));
    }
  });

  const base = file.name.replace(/\.[^.]+$/, "") || "Import CSV";
  const t = {
    id: uid(),
    name: base,
    createdAt: Date.now(),
    columns,
    rows: tableRows,
  };

  state.tables.push(t);
  state.activeId = t.id;
  sortCol = null;
  searchTerm = "";
  $("#search").value = "";
  commit();
  toast(`Importé : ${tableRows.length} ligne${tableRows.length > 1 ? "s" : ""}`);
}

/* ============================================================
   Menu contextuel colonne (clic droit sur l'en-tête)
   ============================================================ */

function bindEvents() {
  [["btn-export-csv"], ["btn-export-doc"], ["btn-print"], ["btn-undo"], ["btn-redo"]].forEach(([id]) => {
    const b = document.getElementById(id);
    if (b && b.title) b.dataset.tip = b.title;
  });

  $("#btn-new-table").addEventListener("click", newTable);
  $("#btn-add-col").addEventListener("click", addColumn);
  $("#btn-add-row").addEventListener("click", addRow);
  const sw = $("#view-switch");
  if (sw) {
    sw.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-view]");
      if (!b) return;
      setViewMode(b.dataset.view);
    });
  }

  $("#btn-undo").addEventListener("click", undo);
  $("#btn-redo").addEventListener("click", redo);
  const fmtTools = $("#fmt-tools");
  if (fmtTools) {
    // empêche la cellule de perdre le focus quand on clique un bouton de mise en forme
    fmtTools.addEventListener("mousedown", (e) => e.preventDefault());
  }
  $("#btn-bold").addEventListener("click", () => toggleActiveCellFormat("b"));
  $("#btn-italic").addEventListener("click", () => toggleActiveCellFormat("i"));
  $("#btn-underline").addEventListener("click", () => toggleActiveCellFormat("u"));

  const closeSidebar = () => document.body.classList.remove("sidebar-open");
  const sb = $("#btn-sidebar");
  if (sb) {
    sb.addEventListener("click", (e) => {
      e.stopPropagation();
      document.body.classList.toggle("sidebar-open");
    });
  }
  const back = $("#sidebar-backdrop");
  if (back) back.addEventListener("click", closeSidebar);
  $("#table-list").addEventListener("click", closeSidebar);
  $("#btn-export-csv").addEventListener("click", exportCSV);
  $("#btn-export-doc").addEventListener("click", exportDoc);
  $("#btn-backup").addEventListener("click", exportJSON);
  $("#btn-restore").addEventListener("click", importBackup);
  $("#btn-print").addEventListener("click", printOptions);
  $("#btn-style").addEventListener("click", openStyleModal);
  $("#btn-import").addEventListener("click", importCSV);

  $("#file-json").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (f) importJSON(f).catch(() => toast("Erreur lors de la restauration", "err"));
  });

  window.addEventListener("afterprint", restoreAfterPrint);
  window.addEventListener("beforeprint", () => {
    renderPrintHeader();
    applyPrintPage();
    preparePrint();
  });

  $("#file-csv").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (f) handleCSVFile(f).catch(() => toast("Erreur lors de l'import", "err"));
  });

  $("#search").addEventListener("input", (e) => {
    searchTerm = e.target.value.trim();
    renderGrid();
    renderStatus();
  });

  $("#table-title").addEventListener("change", (e) => {
    const t = activeTable();
    t.name = e.target.value.trim() || t.name;
    e.target.value = t.name;
    commit();
    toast("Nom enregistré");
  });

  $("#modal-cancel").addEventListener("click", () => closeModal(false));

  $("#modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal(false);
  });

  document.addEventListener("keydown", (e) => {
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
    const mod = e.ctrlKey || e.metaKey;

    if (e.key === "Escape") {
      if (!$("#modal").hidden) { closeModal(false); return; }
      if (document.activeElement?.id === "search") {
        $("#search").value = "";
        searchTerm = "";
        renderGrid();
        renderStatus();
      }
      return;
    }

    if (!$("#modal").hidden) return;

    // Dans un champ de saisie, Ctrl+Z / Ctrl+Y restent natifs (annulation du texte).
    if (mod && (e.key.toLowerCase() === "z" || e.key.toLowerCase() === "y")) {
      if (typing) return;
      e.preventDefault();
      if (e.key.toLowerCase() === "y" || e.shiftKey) redo();
      else undo();
      return;
    }

    if (typing) return;

    if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); save(); toast("Enregistré"); return; }
    if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); $("#search").focus(); return; }
    if (mod && e.key.toLowerCase() === "p") { e.preventDefault(); printOptions(); return; }
    if (mod && e.key === "Enter") { e.preventDefault(); addRow(); return; }
  });

  // double-clic sur le titre de la sidebar
  $("#table-list").addEventListener("dblclick", () => renameTable());

  window.addEventListener("beforeunload", save);
}

/* ============================================================
   Démarrage
   ============================================================ */

function boot() {
  state.style = normalizeStyle(state.style);
  applyStyle();
  bindEvents();
  render();

  const t = activeTable();
  if (!t.seeded) {
    t.seeded = true;
    if (t.rows.length === 0 && t.columns.length > 0) {
      ["Exemple : ligne 1", "Exemple : ligne 2"].forEach((n, i) => {
        const row = { id: uid(), cells: {} };
        t.columns.forEach((c) => (row.cells[c.id] = defaultValue(c)));
        if (t.columns[0]) row.cells[t.columns[0].id] = n;
        if (t.columns[1]) row.cells[t.columns[1].id] = String((i + 1) * 10);
        if (t.columns[2]) row.cells[t.columns[2].id] = t.columns[2].options?.[i % (t.columns[2].options.length || 1)] || "";
        t.rows.push(row);
      });
    }
    save();
    render();
  }

  historyReset("Ouverture");
}

boot();
