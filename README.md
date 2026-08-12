# 🛒 DevShop — Application E-Commerce Dynamique (SPA)

> **Projet de fin de module JavaScript** — Développement d'une vitrine e-commerce dynamique en Single Page Application (SPA) consommant une API REST publique.

---

## 📌 Présentation du Projet

**DevShop** est une application web moderne conçue pour offrir une expérience d'achat fluide, réactive et sans rechargement de page. L'application récupère en temps réel des données produits depuis l'API publique **FakeStore API**, permet la recherche et le filtrage dynamique, et intègre un panier d'achat interactif avec persistance des données.

Une attention particulière a été portée à l'**architecture du code (Clean Code)**, à l'**ergonomie (UX/UI)** ainsi qu'à la **responsivité** sur tous les types d'écrans.

---

## 🚀 Fonctionnalités Principales

### 🔴 Niveau 1 : Les Fondamentaux & Communication API
* **Requêtes Asynchrones** : Utilisation de `fetch()` combiné à `async/await` pour charger le catalogue.
* **Génération Dynamique du DOM** : Création sécurisée des cartes produits (images, titres, prix, badges de catégorie).
* **Gestion des États UX** :
  * **Loader** animé pendant la récupération des données réseau.
  * **Gestion d'erreurs robuste** avec bloc `try/catch` et retours visuels explicites pour l'utilisateur.
* **Layout Responsive** : Structure fluide construite avec **CSS Grid** (grille de produits) et **Flexbox** (navigation, header et panier).

### 🟡 Niveau 2 : Interactivité & Manipulation de Données
* **Filtrage par Catégorie** : Boutons générés dynamiquement selon les catégories renvoyées par l'API (`Array.filter()`).
* **Barre de Recherche en Temps Réel** : Filtrage instantané sur la saisie textuelle (`input` event + `String.includes()`).
* **Filtres Combinés** : La recherche et le filtre par catégorie fonctionnent en synergie sans se chevaucher.
* **Ajout au Panier** : Incrémentation instantanée du compteur d'articles dans la barre de navigation.

### 🟢 Niveau 3 : Fonctionnalités Avancées (Bonus)
* **Tiroir Panier (Off-canvas)** : Panneau latéral coulissant permettant de visualiser le résumé des achats.
* **Gestion des Quantités & Suppression** : Boutons d'incrémentation (+), de décrémentation (-) et de suppression d'articles.
* **Persistance des Données** : Sauvegarde automatique du panier via **`localStorage`** pour préserver la session utilisateur après rafraîchissement.

### ✨ Finitions & UI Pro Tech
* **Notifications Toast** : Feedback visuel animé lors de l'ajout d'un produit.
* **Mode Sombre / Mode Clair (Dark/Light Mode)** : Basculement dynamique du thème avec sauvegarde de la préférence dans le `localStorage`.
* **Design Responsive Pro** : Adaptation ergonomique garantie sur desktop, tablette et mobile.

---

## 🛠️ Technologies Utilisées

| Domaine | Technologie |
| :--- | :--- |
| **HTML5** | Balisage sémantique, structure de la SPA et conteneurs d'états |
| **CSS3** | CSS Grid, Flexbox, Variables CSS (`:root`), animations keyframes, `backdrop-filter` |
| **JavaScript (ES6+)** | Dynamic DOM, `fetch()`, `async/await`, Event Delegation, `localStorage` |
| **API Externe** | [FakeStore API](https://fakestoreapi.com/) (API REST gratuite) |
| **Typographie / Icônes** | Google Fonts (Inter), SVG inline optimisés |

---

## 📂 Structure du Projet

```text
devshop/
├── index.html        # Structure HTML5 principale de la SPA
├── css/styles.css        # Styles UI, thèmes (Dark/Light), layout & responsive
├── js/app.js            # Logique métier, requêtes API, gestion du DOM & panier
└── README.md         # Document de présentation du projet