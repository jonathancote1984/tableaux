"use strict";

/**
 * Tableau d'exemple au tout premier lancement, comme dans la version web.
 */

function etatInitial() {
  const id = "t-" + Date.now().toString(36);
  return {
    tables: [
      {
        id: id,
        name: "Mon tableau",
        createdAt: Date.now(),
        columns: [
          { id: "c1", name: "Nom", type: "text", options: [] },
          { id: "c2", name: "Quantite", type: "number", options: [] },
          {
            id: "c3",
            name: "Statut",
            type: "select",
            options: ["A faire", "En cours", "Termine"],
          },
        ],
        rows: [
          { id: "r1", cells: { c1: "Exemple : ligne 1", c2: "10", c3: "A faire" } },
          { id: "r2", cells: { c1: "Exemple : ligne 2", c2: "20", c3: "En cours" } },
        ],
      },
    ],
    activeId: id,
    style: null,
    print: null,
  };
}

module.exports = { etatInitial };
