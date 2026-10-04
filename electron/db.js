"use strict";

/**
 * Couche SQLite de Tableaux.
 * Module SQLite integre a Node (node:sqlite) : aucune compilation native.
 */

const path = require("path");
const { DatabaseSync } = require("node:sqlite");

let db = null;

const SCHEMA = `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS tableaux (
  id TEXT PRIMARY KEY, nom TEXT NOT NULL, vue TEXT, cree_le INTEGER, ordre INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS colonnes (
  id TEXT PRIMARY KEY,
  tableau_id TEXT NOT NULL REFERENCES tableaux(id) ON DELETE CASCADE,
  nom TEXT NOT NULL, type TEXT NOT NULL, options TEXT,
  largeur INTEGER, largeur_impression INTEGER, ordre INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS lignes (
  id TEXT PRIMARY KEY,
  tableau_id TEXT NOT NULL REFERENCES tableaux(id) ON DELETE CASCADE,
  format TEXT, ordre INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS cellules (
  ligne_id TEXT NOT NULL REFERENCES lignes(id) ON DELETE CASCADE,
  colonne_id TEXT NOT NULL REFERENCES colonnes(id) ON DELETE CASCADE,
  valeur TEXT, PRIMARY KEY (ligne_id, colonne_id)
);
CREATE TABLE IF NOT EXISTS reglages (cle TEXT PRIMARY KEY, valeur TEXT);
CREATE INDEX IF NOT EXISTS idx_colonnes_tableau ON colonnes(tableau_id, ordre);
CREATE INDEX IF NOT EXISTS idx_lignes_tableau ON lignes(tableau_id, ordre);
CREATE INDEX IF NOT EXISTS idx_cellules_ligne ON cellules(ligne_id);
`;

function ouvrir(cheminFichier) {
  db = new DatabaseSync(cheminFichier);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA synchronous = NORMAL");
  db.exec(SCHEMA);
  return db;
}

function fermer() {
  if (db) { db.close(); db = null; }
}

function lireReglage(cle, defaut) {
  const r = db.prepare("SELECT valeur FROM reglages WHERE cle = ?").get(cle);
  return r ? JSON.parse(r.valeur) : defaut;
}

function ecrireReglage(cle, valeur) {
  db.prepare("INSERT INTO reglages (cle, valeur) VALUES (?, ?) ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur").run(cle, JSON.stringify(valeur));
}

function lireEtat() {
  const tableaux = db.prepare("SELECT * FROM tableaux ORDER BY ordre").all();
  const lireColonnes = db.prepare("SELECT * FROM colonnes WHERE tableau_id = ? ORDER BY ordre");
  const lireLignes = db.prepare("SELECT * FROM lignes WHERE tableau_id = ? ORDER BY ordre");
  const lireCellules = db.prepare("SELECT colonne_id, valeur FROM cellules WHERE ligne_id = ?");

  return {
    tables: tableaux.map(function (t) {
      const lignes = lireLignes.all(t.id).map(function (l) {
        const cellules = {};
        lireCellules.all(l.id).forEach(function (c) { cellules[c.colonne_id] = c.valeur; });
        const ligne = { id: l.id, cells: cellules };
        if (l.format) ligne.fmt = JSON.parse(l.format);
        return ligne;
      });
      const colonnes = lireColonnes.all(t.id).map(function (c) {
        const col = { id: c.id, name: c.nom, type: c.type, options: c.options ? JSON.parse(c.options) : [] };
        if (c.largeur != null) col.width = c.largeur;
        if (c.largeur_impression != null) col.printWidth = c.largeur_impression;
        return col;
      });
      const table = { id: t.id, name: t.nom, columns: colonnes, rows: lignes };
      if (t.vue) table.view = t.vue;
      if (t.cree_le) table.createdAt = t.cree_le;
      return table;
    }),
    activeId: lireReglage("activeId", null),
    style: lireReglage("style", null),
    print: lireReglage("print", null)
  };
}

function ecrireEtat(etat) {
  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM tableaux").run();
    const insTableau = db.prepare("INSERT INTO tableaux (id, nom, vue, cree_le, ordre) VALUES (?, ?, ?, ?, ?)");
    const insColonne = db.prepare("INSERT INTO colonnes (id, tableau_id, nom, type, options, largeur, largeur_impression, ordre) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    const insLigne = db.prepare("INSERT INTO lignes (id, tableau_id, format, ordre) VALUES (?, ?, ?, ?)");
    const insCellule = db.prepare("INSERT INTO cellules (ligne_id, colonne_id, valeur) VALUES (?, ?, ?)");

    (etat.tables || []).forEach(function (t, it) {
      insTableau.run(t.id, t.name || "Tableau", t.view || null, t.createdAt || Date.now(), it);
      (t.columns || []).forEach(function (c, ic) {
        insColonne.run(c.id, t.id, c.name || "Colonne", c.type || "text", JSON.stringify(c.options || []),
          c.width != null ? Math.round(c.width) : null,
          c.printWidth != null ? Math.round(c.printWidth) : null, ic);
      });
      (t.rows || []).forEach(function (r, ir) {
        insLigne.run(r.id, t.id, r.fmt ? JSON.stringify(r.fmt) : null, ir);
        (t.columns || []).forEach(function (c) {
          const v = r.cells ? r.cells[c.id] : null;
          insCellule.run(r.id, c.id, v === undefined || v === null ? "" : String(v));
        });
      });
    });

    ecrireReglage("activeId", etat.activeId === undefined ? null : etat.activeId);
    ecrireReglage("style", etat.style === undefined ? null : etat.style);
    ecrireReglage("print", etat.print === undefined ? null : etat.print);
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

function estVide() {
  return db.prepare("SELECT COUNT(*) AS n FROM tableaux").get().n === 0;
}

function cheminParDefaut(dossierDonnees) {
  return path.join(dossierDonnees, "tableaux.db");
}

module.exports = { ouvrir, fermer, lireEtat, ecrireEtat, estVide, cheminParDefaut };