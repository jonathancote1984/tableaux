"use strict";

const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require("electron");
const path = require("path");
const db = require("./db");

let fenetre = null;
let cheminDb = null;

function envoyer(canal) {
  if (fenetre && !fenetre.isDestroyed()) fenetre.webContents.send(canal);
}

function creerFenetre() {
  fenetre = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#0f1115",
    title: "Tableaux",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  fenetre.once("ready-to-show", function () {
    fenetre.show();
  });

  fenetre.loadFile(path.join(__dirname, "..", "index.html"));

  fenetre.webContents.setWindowOpenHandler(function (details) {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  fenetre.on("closed", function () {
    fenetre = null;
  });
}

function construireMenu() {
  const modele = [
    {
      label: "Fichier",
      submenu: [
        { label: "Nouveau tableau", accelerator: "CmdOrCtrl+N", click: function () { envoyer("menu:nouveau"); } },
        { type: "separator" },
        { label: "Sauvegarder une copie...", accelerator: "CmdOrCtrl+S", click: function () { envoyer("menu:sauvegarder"); } },
        { label: "Restaurer une sauvegarde...", click: function () { envoyer("menu:restaurer"); } },
        { type: "separator" },
        { label: "Imprimer...", accelerator: "CmdOrCtrl+P", click: function () { envoyer("menu:imprimer"); } },
        { type: "separator" },
        { role: "quit", label: "Quitter" },
      ],
    },
    {
      label: "Edition",
      submenu: [
        { label: "Annuler", accelerator: "CmdOrCtrl+Z", click: function () { envoyer("menu:annuler"); } },
        { label: "Retablir", accelerator: "CmdOrCtrl+Y", click: function () { envoyer("menu:retablir"); } },
        { type: "separator" },
        { role: "cut", label: "Couper" },
        { role: "copy", label: "Copier" },
        { role: "paste", label: "Coller" },
        { role: "selectAll", label: "Tout selectionner" },
      ],
    },
    {
      label: "Affichage",
      submenu: [
        { label: "Mode Ecran", click: function () { envoyer("menu:mode-ecran"); } },
        { label: "Mode Impression", click: function () { envoyer("menu:mode-impression"); } },
        { type: "separator" },
        { role: "resetZoom", label: "Taille normale" },
        { role: "zoomIn", label: "Agrandir" },
        { role: "zoomOut", label: "Reduire" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Plein ecran" },
      ],
    },
    {
      label: "Aide",
      submenu: [
        {
          label: "Emplacement de la base de donnees",
          click: function () {
            shell.showItemInFolder(cheminDb);
          },
        },
        {
          label: "A propos",
          click: function () {
            dialog.showMessageBox(fenetre, {
              type: "info",
              title: "Tableaux",
              message: "Tableaux " + app.getVersion(),
              detail: "Editeur de tableaux de donnees.\n\nBase de donnees :\n" + cheminDb,
              buttons: ["Fermer"],
            });
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(modele));
}

app.whenReady().then(function () {
  cheminDb = db.cheminParDefaut(app.getPath("userData"));
  db.ouvrir(cheminDb);

  if (db.estVide()) {
    const graine = require("./graine");
    db.ecrireEtat(graine.etatInitial());
  }

  ipcMain.on("etat:lire", function (e) {
    e.returnValue = JSON.stringify(db.lireEtat());
  });

  ipcMain.on("etat:ecrire", function (_e, json) {
    try {
      db.ecrireEtat(JSON.parse(json));
    } catch (err) {
      console.error("Ecriture impossible :", err);
    }
  });

  ipcMain.handle("app:infos", function () {
    return {
      version: app.getVersion(),
      base: cheminDb,
      donnees: app.getPath("userData"),
    };
  });

  construireMenu();
  creerFenetre();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) creerFenetre();
  });
});

app.on("window-all-closed", function () {
  db.fermer();
  if (process.platform !== "darwin") app.quit();
});
