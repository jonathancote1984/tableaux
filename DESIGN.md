---
name: Tableaux
description: Créer, organiser et imprimer des tableaux de données, sans formation.
colors:
  void: "#0f1115"
  graphite: "#151922"
  panel: "#191e28"
  panel-raised: "#1f2531"
  line: "#2a3241"
  line-soft: "#222a37"
  ink: "#e8ecf3"
  ink-dim: "#97a2b4"
  ink-faint: "#6b7688"
  azur: "#5b8cff"
  azur-deep: "#3d74f5"
  danger: "#ff5f6d"
  success: "#34d399"
  warn: "#f5b83d"
  paper: "#ffffff"
typography:
  title:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  section:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "11.5px"
    fontWeight: 700
    letterSpacing: "0.05em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  cell:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "11.5px"
    fontWeight: 600
  mono:
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "11.5px"
rounded:
  sm: "8px"
  md: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "22px"
components:
  button:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "9px 13px"
    typography: "{typography.body}"
    height: "36px"
  button-primary:
    backgroundColor: "{colors.azur}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "9px 13px"
    height: "36px"
  button-ghost:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.sm}"
    padding: "9px 13px"
    height: "36px"
  icon-button:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.sm}"
    size: "34px"
  table-cell:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.cell}"
    height: "40px"
  table-head:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "56px"
  field:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "9px 11px"
---

# Design System: Tableaux

## Overview

**Creative North Star: "La Feuille et l'Écran"**

L'écran n'est qu'un passage. Le produit, c'est la feuille qui sort. Tout le système visuel découle de cette idée : l'interface est volontairement sombre, silencieuse et mate, pour que la feuille blanche — dans l'aperçu d'impression, dans le mode Impression, dans le document Word — soit la seule chose lumineuse à l'écran. Le contraste entre le graphite de l'atelier et le blanc du papier n'est pas un effet : c'est la hiérarchie du produit rendue visible.

L'atmosphère est celle d'un plan de travail bien rangé. Rien ne brille pour attirer l'œil, rien ne bouge sans raison, rien ne demande à être appris. Les surfaces sont plates au repos et se distinguent par leur teinte, pas par leur ombre. L'accent azur est un outil, pas une décoration : il marque l'endroit où l'on agit et l'état actif, puis se retire. Sa rareté est ce qui le rend lisible.

Le public est non technique et ne lira aucune documentation. Chaque élément doit donc porter son sens par sa forme : un bouton ressemble à un bouton, un champ à un champ, une case à une case. La sobriété n'est pas un choix esthétique, c'est une exigence d'accessibilité.

**Key Characteristics:**
- Atelier graphite, papier blanc : le sombre sert le clair.
- Plat par défaut, l'ombre signale ce qui flotte.
- Un seul accent, l'azur, réservé à l'action et à l'état actif.
- Aucun effet décoratif, aucune animation gratuite, aucun anglicisme.
- Lisibilité immédiate pour quelqu'un qui n'a jamais ouvert un tableur.

## Colors

Une palette d'atelier : des gris graphite froids qui se distinguent par leur valeur, et un unique azur qui ne sert qu'à désigner l'action.

### Primary
- **Azur** (#5b8cff): la couleur d'action. Bouton principal, focus clavier, indicateur de tri actif, pastille de filtre, poignées de redimensionnement, curseur de champ actif. N'apparaît jamais comme décoration de fond.
- **Azur profond** (#3d74f5): le pied du dégradé du bouton principal et son état de survol. Utilisé uniquement en dégradé avec l'Azur, jamais seul.

### Neutral
- **Void** (#0f1115): le fond de l'application, le point le plus sombre. Porte un halo azur très diffus en haut à droite, seul dégradé décoratif autorisé.
- **Graphite** (#151922): fond de la barre latérale, des champs de saisie et des zones secondaires.
- **Panel** (#191e28): fond des surfaces principales — grille, modales, cartes.
- **Panel surélevé** (#1f2531): en-tête de colonne, boutons secondaires, pastilles, zones de contrôle.
- **Ligne** (#2a3241): bordures et séparateurs structurels.
- **Ligne douce** (#222a37): séparateurs internes, à peine visibles.
- **Encre** (#e8ecf3): texte principal.
- **Encre atténuée** (#97a2b4): libellés secondaires, métadonnées, texte des boutons au repos.
- **Encre estompée** (#6b7688): texte tertiaire, numéros de ligne, aide contextuelle.

### Tertiary
- **Danger** (#ff5f6d): suppression, erreurs, actions irréversibles.
- **Succès** (#34d399): confirmation.
- **Avertissement** (#f5b83d): réglages d'impression, éléments personnalisés.

### Named Rules
**The One Voice Rule.** L'Azur couvre moins de 10 % d'un écran donné. Sa rareté est sa lisibilité : dès qu'il devient fréquent, il cesse d'indiquer quoi que ce soit.

**The Paper Exception Rule.** Le blanc pur (#ffffff) n'existe à l'écran que dans l'aperçu d'impression et le mode Impression. Ailleurs, le point le plus clair est l'Encre.

## Typography

**Display Font:** Inter (avec repli `system-ui`, `-apple-system`, `Segoe UI`, sans-serif)
**Body Font:** Inter (même pile)
**Label/Mono Font:** `ui-monospace`, Cascadia Mono, Consolas pour les valeurs techniques (hexadécimal, dimensions)

**Character:** Une seule famille pour tout. Inter est neutre, très lisible aux petites tailles et disponible en repli système — ce qui compte pour un public qui n'installera rien. Aucune fantaisie typographique : la hiérarchie se fait par la taille et la graisse, jamais par le style.

### Hierarchy
- **Title** (700, 19px, 1.2, -0.02em): nom du tableau dans la barre d'outils, titre de modale.
- **Section** (700, 11.5px, majuscules, +0.05em): titres de groupes du panneau de style. Toujours en majuscules espacées, jamais en couleur pleine — ils sont des repères, pas des appels.
- **Body** (400, 13px, 1.5): texte courant, descriptions, aide contextuelle.
- **Cell** (400, 13px): contenu des cellules. La taille est un réglage utilisateur (9 à 22 px) ; 13 px est la valeur par défaut.
- **Label** (600, 11.5px): libellés de champ, noms de colonne, boutons.
- **Mono** (400, 11.5px): valeurs hexadécimales, récapitulatif des dimensions.

### Named Rules
**The Weight Ceiling Rule.** Aucun texte au-delà de 700. Le gras extrême crie ; ici on travaille.

**The Uppercase Reservation Rule.** Les majuscules sont réservées aux titres de section et aux badges de type de colonne. Jamais dans le contenu des cellules ni dans un libellé de bouton.

## Layout

Modèle en deux colonnes : une barre latérale fixe de 268 px pour les tableaux, et une zone principale élastique. La zone principale empile quatre bandes : barre d'outils (hauteur automatique), zone de grille défilante, barre d'état de 33 px.

La grille est le centre de gravité : elle défile dans les deux sens, avec la colonne des numéros gelée à gauche et l'en-tête collé en haut. Les colonnes ont une largeur propre (200 px par défaut, 110 px pour une case à cocher, 150 px pour une date) et se redimensionnent au glisser.

Rythme d'espacement : 4 px pour les écarts internes serrés, 8 px entre éléments voisins, 12 px pour le remplissage des contrôles, 16 px entre groupes, 22 px pour les marges de la zone de travail. Densité compacte assumée : une ligne de tableau fait 40 px, un en-tête 56 px, un bouton 36 px.

Ruptures : sous 1100 px les libellés de boutons disparaissent au profit des icônes ; sous 820 px la barre latérale devient un tiroir escamotable avec fond assombri ; sous 980 px le panneau de style passe en une seule colonne.

## Elevation & Depth

Système **plat par défaut**. Les surfaces ne portent aucune ombre au repos et se distinguent uniquement par leur valeur : Void, Graphite, Panel, Panel surélevé forment quatre paliers de clarté. C'est ce qui donne à l'interface son aspect de plan de travail plutôt que de fenêtres empilées.

L'ombre apparaît seulement pour détacher ce qui flotte réellement au-dessus du plan : les modales, et la feuille imprimée dans son aperçu. En mode Impression à l'écran, le fond de la zone de travail s'éclaircit et la grille reçoit une ombre portée — la feuille se pose sur le bureau.

### Shadow Vocabulary
- **Plan de travail** (`box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45)`): modales, tiroir latéral mobile. Signale une couche qui interrompt le travail.
- **Feuille** (`box-shadow: 0 12px 34px rgba(0, 0, 0, 0.38)`): la page imprimée dans l'aperçu. La seule ombre qui évoque un objet physique.
- **Feuille posée** (`box-shadow: 0 8px 26px rgba(0, 0, 0, 0.22)`): la grille en mode Impression, plus discrète car elle ne quitte pas le plan.

### Named Rules
**The Flat-By-Default Rule.** Une surface est plate au repos. Une ombre n'apparaît que si l'élément flotte au-dessus du plan de travail — jamais pour décorer un panneau.

**The One Gradient Rule.** Le seul dégradé décoratif de tout le système est le halo azur très diffus du fond de l'application. Le dégradé du bouton principal est fonctionnel (il donne du relief à l'action), pas décoratif.

## Shapes

Langage de forme doux et régulier. Deux rayons seulement : **8 px** pour tout ce qui est petit et interactif (boutons, champs, cases, badges), **12 px** pour les surfaces (grille, modales, cartes, panneaux). Les pastilles et les badges d'état utilisent une forme entièrement arrondie (999 px).

Les bordures font 1 px, dans la teinte Ligne, et sont toujours présentes sur les éléments interactifs — c'est ce qui les rend reconnaissables immédiatement. Aucune bordure décorative, aucun double trait.

La grille est le seul objet à géométrie variable : son rayon, l'épaisseur et le style de ses traits, ainsi que la largeur de ses colonnes, appartiennent à l'utilisateur. Neuf thèmes de tableau vont de l'angle droit (Blueprint, Minimal, Contraste) au très arrondi (Pastel, 14 px).

## Components

### Buttons
- **Shape:** coins doucement arrondis (8 px), bordure de 1 px, hauteur 36 px, remplissage 9 px × 13 px.
- **Primary:** dégradé Azur → Azur profond, texte blanc, ombre azur diffuse (`0 8px 20px rgba(61, 116, 245, 0.28)`). Un seul par écran en règle générale — c'est l'action attendue.
- **Hover / Focus:** survol = bordure éclaircie et translation de −1 px ; focus clavier = contour Azur de 3 px décalé de 2 px. Transition de 0,15 s.
- **Secondary:** fond Panel surélevé, bordure Ligne, texte Encre. Le bouton par défaut de la barre d'outils.
- **Ghost:** fond transparent, bordure Ligne douce, texte Encre atténuée. Pour les actions secondaires de la barre latérale.
- **Disabled:** opacité 0,38, curseur interdit, aucune transformation. Utilisé quand un tableau est vide.

### Icon Buttons
- **Shape:** carré de 34 px, rayon 8 px, bordure 1 px.
- **Style:** fond Panel surélevé, glyphe Encre atténuée.
- **State:** survol = fond éclairci et glyphe Encre ; actif (tri, filtre) = fond Azur atténué, bordure azur, glyphe Azur.
- **Small variant:** 22 px dans les en-têtes de colonne.

### Cards / Containers
- **Corner Style:** 12 px pour les surfaces, 16 px pour les modales.
- **Background:** Panel.
- **Shadow Strategy:** plate au repos ; voir Elevation & Depth.
- **Border:** 1 px Ligne.
- **Internal Padding:** 22 px pour les modales, 18-22 px pour les zones de travail.

### Inputs / Fields
- **Style:** fond Graphite, bordure 1 px Ligne, rayon 8 px, remplissage 9 px × 11 px, texte 13 px.
- **Focus:** bordure Azur et halo `0 0 0 3px rgba(91, 140, 255, 0.14)`.
- **Placeholder:** Encre estompée.
- **Cell inputs:** sans bordure ni fond au repos — la cellule elle-même est le cadre. Au focus, fond azur à 18 % et liseré interne Azur de 1,5 px.

### Navigation
- **Sidebar items:** hauteur 40 px, rayon 10 px, icône 28 px dans un carré arrondi. Au repos : texte Encre atténuée, fond transparent. Survol : fond Panel surélevé. Actif : fond Azur atténué, bordure azur à 32 %, icône Azur.
- **Count badge:** pastille arrondie, Encre estompée sur Panel surélevé.
- **Mobile:** sous 820 px, la barre devient un tiroir glissant de 250 px avec fond assombri, ouvert par un bouton ☰ dans la barre d'outils.

### Table Grid (signature)
Le composant qui définit le produit.
- **Head:** fond Panel surélevé, hauteur 56 px, nom de colonne en 12,5 px / 600, badge de type en 10 px majuscules espacées, actions au survol seulement.
- **Rows:** hauteur 40 px, fond Panel, alternance Panel/`#1c2230` quand les rayures sont actives, survol éclairci.
- **Frozen column:** la colonne des numéros (56 px) reste collée à gauche au défilement horizontal ; l'en-tête reste collé en haut.
- **Handles:** poignée de redimensionnement de 7 px sur le bord droit de chaque en-tête, invisible jusqu'au survol ; poignée de déplacement `⠿` dans l'en-tête.
- **Insertion indicator:** liseré Azur de 3 px en haut ou en bas de la ligne cible, à gauche ou à droite de la colonne cible.
- **Print mode:** la grille prend les couleurs, la police, les hauteurs et les contours d'impression ; les actions de structure disparaissent, les poignées de dimension restent.

### Mode Switch
Sélecteur segmenté à deux positions (Écran / Impression) dans la barre d'outils. Position active : fond Azur plein, texte blanc, ombre azur. C'est le contrôle qui incarne la promesse du produit : un clic sépare le travail de sa sortie papier.

### Modals
- **Shape:** rayon 16 px, fond Panel, bordure Ligne, ombre Plan de travail.
- **Header:** titre 17 px / 700.
- **Actions:** alignées à droite ; les actions tertiaires (Dupliquer, Retirer le filtre) sont repoussées à gauche par une marge automatique.
- **Entry animation:** apparition en 0,18 s (opacité + translation de 10 px + échelle 0,98). La seule animation d'entrée du système.

## Do's and Don'ts

### Do:
- **Do** garder l'Azur sous 10 % de la surface d'un écran. Il indique l'action, pas l'ambiance.
- **Do** distinguer les surfaces par leur valeur (Void → Graphite → Panel → Panel surélevé) avant d'envisager une ombre.
- **Do** réserver le blanc pur (#ffffff) à l'aperçu et au mode Impression — c'est le papier.
- **Do** écrire tout libellé, message et erreur en français courant, sans vocabulaire de tableur.
- **Do** montrer un contour de focus Azur de 3 px sur tout élément atteignable au clavier.
- **Do** confirmer toute action destructrice par une modale, avec un bouton en couleur Danger.
- **Do** garder les réglages avancés derrière un repli « Options avancées » fermé par défaut.
- **Do** conserver l'étanchéité écran / impression : un réglage de travail ne change jamais le rendu papier.

### Don't:
- **Don't** ajouter de dégradé décoratif, d'ombre colorée ou d'effet néon. Le seul dégradé autorisé est le halo du fond et le relief du bouton principal.
- **Don't** animer quoi que ce soit sans raison fonctionnelle. Pas de rebond, pas de pulsation, pas de défilement animé.
- **Don't** employer d'anglicisme ni de terme technique dans l'interface : « Liste », pas « select » ; « Nombre », pas « number ».
- **Don't** introduire une deuxième couleur d'accent. Les seules couleurs hors azur sont Danger, Succès et Avertissement, réservées à leur état.
- **Don't** dépasser la graisse 700 ni mettre du contenu de cellule en majuscules.
- **Don't** ajouter d'ombre à une surface au repos, même un panneau secondaire.
- **Don't** masquer une action principale derrière une icône sans libellé au-delà de 1100 px de large.
- **Don't** faire dépendre une information d'une couleur seule : la couleur double toujours un texte ou une forme.
