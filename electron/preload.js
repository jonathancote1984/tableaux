"use strict";

const { contextBridge, ipcRenderer } = require("electron");

/**
 * Pont minimal : l'application ne voit que ces fonctions,
 * aucun acces direct a Node.
 */
contextBridge.exposeInMainWorld("tableaux", {
  lireEtat: () => ipcRenderer.sendSync("etat:lire"),
  ecrireEtat: (json) => ipcRenderer.send("etat:ecrire", json),
  infos: () => ipcRenderer.invoke("app:infos"),
  surMenu: (canal, action) => {
    const autorises = [
      "menu:nouveau",
      "menu:sauvegarder",
      "menu:restaurer",
      "menu:imprimer",
      "menu:annuler",
      "menu:retablir",
      "menu:mode-ecran",
      "menu:mode-impression",
    ];
    if (autorises.includes(canal)) ipcRenderer.on(canal, action);
  },
});
