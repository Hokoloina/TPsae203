# Instant Weather V2

## Description

Instant Weather V2 est un projet individuel en JavaScript qui permet d'afficher les prévisions météorologiques pour une ville au choix.  
Le projet utilise l’API Météo Concept et l’API Geo du gouvernement français pour récupérer les données météo et les informations géographiques de la commune sélectionnée.  
La page intègre plusieurs fonctionnalités modernes et une expérience utilisateur soignée :
- Choix du nombre de jours à afficher (1 à 7) via un slider.
- Options supplémentaires (latitude, longitude, cumul de pluie, vent moyen et direction du vent) présentées sous forme de toggle switches.
- **Fonctionnalité créative** : un fond dynamique qui change en fonction du temps prédominant (basé sur la prévision du premier jour) et une animation de nuages en arrière-plan.
- Mode sombre avec persistance (les réglages sont sauvegardés en local) pour améliorer l'expérience de lecture en conditions de faible luminosité.
- Design responsive et conforme aux exigences d’accessibilité WCAG AA 2.0.

## Fonctionnalités

- **Affichage météo interactif** : Saisie de la ville, sélection du nombre de jours et options supplémentaires.
- **Fond dynamique** : Le background change selon la météo du premier jour avec des dégradés de couleurs adaptés.
- **Animation de nuages** : Des nuages animés en arrière-plan apportent une ambiance immersive.
- **Mode sombre** : Activation via un bouton dédié avec affichage clair du libellé "Mode sombre" et persistance dans le stockage local.
- **Interface Accessible** : Utilisation d'attributs ARIA et d'une structure HTML sémantique.

## Technologies utilisées

- **Langages** : HTML, CSS, JavaScript.
- **APIs** :
  - [Météo Concept](https://api.meteo-concept.com) (utilisé avec un token personnel)
  - [Geo API du gouvernement français](https://geo.api.gouv.fr/communes)
- **Outils de développement** : Visual Studio Code.
- **Versionnage** : Git et GitHub.
- **Déploiement** : Le projet est hébergé sur GitHub Pages.

## Instructions d'utilisation
- **Saisie de la ville** : Entrez le nom d'une ville dans le champ prévu.
- **Sélection du nombre de jours** : Utilisez le slider pour choisir entre 1 et 7 jours.
- **Options supplémentaire**s : Activez les toggles pour afficher des informations complémentaires (latitude, longitude, cumul de pluie, vent moyen, direction du vent).
- **Obtenir la météo** : Cliquez sur le bouton "Obtenir la météo" (affiché en bleu) pour lancer la recherche et afficher les prévisions.
- **Mode sombre** : Activez ou désactivez le mode sombre en cliquant sur le bouton 🌓 situé en haut à droite, accompagné du libellé "Mode sombre".

## Auteur
Raveloson Ho Koloina TP1.2

## Lien vers le site
https://hokoloina.github.io/TPsae203/
