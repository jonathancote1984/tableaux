# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Public général sans formation.** Commerçants, associations, secrétariats, enseignants, artisans — des personnes qui savent utiliser un navigateur et un traitement de texte, mais qui n'ont jamais appris un tableur. Elles ne connaissent ni les formules, ni les tableaux croisés dynamiques, ni les filtres avancés, et n'ont aucune envie de les apprendre.

Situation typique : il faut produire une liste ou un relevé propre — un inventaire, une liste de présence, un suivi de commandes, un planning simple — et le remettre sur papier ou dans un document Word. La personne est seule devant son écran, sans collègue pour l'aider, et doit y arriver du premier coup.

Le travail à accomplir : saisir des données en lignes et colonnes, les mettre en forme lisiblement, puis **sortir un document imprimé présentable** — pas un brouillon.

## Product Purpose

Créer, organiser et imprimer des tableaux de données depuis un navigateur, sans compte, sans installation et sans formation.

L'app existe parce que ce public se retrouve coincé entre deux mauvais choix : le tableur, trop puissant et intimidant, qui produit des impressions bâclées ; et le traitement de texte, où dessiner un tableau à la main est pénible dès qu'il dépasse quelques lignes.

Réussite = une personne non technique obtient un tableau correct **et** son impression soignée sans avoir eu besoin qu'on lui explique quoi que ce soit.

## Positioning

**Aussi simple qu'une feuille quadrillée, mais avec une vraie sortie papier.**

Le mécanisme que ne copie pas un tableur classique : l'apparence écran et l'apparence imprimée sont **deux réglages distincts et indépendants**. L'utilisateur travaille dans une interface confortable (thème sombre, survol, couleurs), puis bascule en mode Impression pour voir et régler exactement ce qui sortira sur le papier — police, tailles, contours ligne par ligne, couleurs d'impression, marges, orientation — sans que ses réglages de travail soient altérés.

Un tableur impose de deviner le résultat via un aperçu avant impression. Ici, le tableau lui-même devient la prévisualisation : on bascule, on voit, on ajuste, on imprime.

## Operating Context

- **Usage au bureau ou à la maison**, sur un ordinateur de bureau ou portable. La souris est l'outil principal ; le clavier sert à taper, pas à naviguer.
- **Français** comme langue de travail : libellés, messages, dates, nombres et virgule décimale.
- Les données sont **locales au navigateur** (`localStorage`). Aucun serveur, aucun compte, aucune synchronisation. L'utilisateur doit être averti du risque de perte et disposer d'une sauvegarde/restauration par fichier.
- Les impressions se font sur **papier format Lettre** (8,5 × 11 po), portrait ou paysage.
- L'export vers **Word (.doc)** est demandé quand le document doit être retouché ou transmis par courriel.
- Les données arrivent souvent **par copier-coller depuis un autre document** ou par **import CSV** ; elles doivent souvent ressortir vers Excel ou Word.

## Capabilities and Constraints

**Fonctionnalités confirmées**

- Plusieurs tableaux, avec nom, duplication, réordonnancement et suppression.
- Colonnes typées : Texte, Nombre, Date, Liste déroulante, Case à cocher.
- Lignes et colonnes : ajout, suppression, duplication, déplacement par glisser-déposer, redimensionnement des largeurs et hauteurs.
- Mise en forme du texte dans une cellule : gras, italique, souligné.
- Tri par colonne, recherche globale, filtres par valeur de colonne.
- Annuler / Rétablir (60 étapes).
- Thèmes d'apparence écran, réglages d'impression indépendants, mode Écran / Impression.
- Import CSV avec détection automatique des types ; export CSV, Word (.doc) et JSON ; sauvegarde et restauration complètes.
- Impression et aperçu au format Lettre, contours par côté, marges, orientation, en-tête et pied de page.

**Contraintes techniques**

- HTML, CSS et JavaScript seuls, sans framework ni étape de compilation. Un petit serveur statique Node sert les fichiers.
- Interface entièrement en français.
- Aucun compte, aucune authentification, aucun appel serveur pour les données.
- Les réglages écran et les réglages d'impression sont stockés séparément et ne doivent jamais se contaminer l'un l'autre.

**Faits non décidés**

- Aucune cible d'hébergement ni de distribution n'est arrêtée.
- Aucun modèle économique n'est défini.

## Brand Commitments

- Nom : **Tableaux**.
- Langue : **français exclusivement**, y compris les messages d'erreur et les libellés de boutons.
- Ton : direct et rassurant, jamais technique. Pas de jargon de tableur (formule, plage, pivot, macro).
- La **police Inter** est utilisée pour l'interface, avec repli système.

## Evidence on Hand

- Application fonctionnelle et complète dans `C:\webapps\tableaux` : `index.html`, `styles.css`, `app.js`, `server.js`.
- Aucun témoignage client, aucune donnée d'usage, aucune étude utilisateur. Ces éléments ne doivent pas être inventés.

## Product Principles

1. **Aucune formation requise.** Si une fonction a besoin d'être expliquée, elle est mal faite. Les réglages avancés existent, mais repliés.
2. **Écran et impression sont deux mondes séparés.** Un réglage de travail ne change jamais le rendu papier, et inversement. L'étanchéité est une promesse, pas un détail.
3. **La sortie papier est le livrable.** Un tableau réussi est un tableau qu'on ose remettre à quelqu'un.
4. **Les données appartiennent à l'utilisateur.** Locales, exportables, sauvegardables, jamais enfermées.
5. **Le français d'abord.** Vocabulaire courant, jamais celui du tableur.

## Accessibility & Inclusion

- Public non technique : les libellés doivent être explicites et les actions destructrices confirmées.
- Navigation clavier avec indicateur de focus visible ; la grille expose les rôles ARIA et des libellés de cellule.
- Contraste suffisant sur les thèmes clairs comme sombres ; le mode Impression à l'écran reste lisible.
- Aucun standard formel (RGAA, WCAG) n'a été exigé par l'utilisateur.
