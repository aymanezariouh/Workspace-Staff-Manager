# 🏢 Staff Manager — Gestion Interactive du Personnel

Interface complète permettant d'ajouter, visualiser et affecter les employés dans différentes salles du bâtiment, tout en respectant des règles métier strictes.

Ce projet a été entièrement réalisé en **HTML**, **CSS** (responsive) et **Vanilla JavaScript**, sans frameworks ni bibliothèques externes.

---

## 🎯 Objectifs du projet

- Proposer une interface intuitive pour gérer le personnel.
- Appliquer des règles d'accès selon les rôles.
- Ajouter, déplacer et retirer des employés dynamiquement.
- Afficher un profil détaillé pour chaque membre.
- Assurer une compatibilité totale Desktop / Tablette / Mobile.
- Rester simple, léger et accessible aux débutants.

---

## 🚀 Fonctionnalités principales

### ➕ Ajout d’un employé
- Nom complet  
- Rôle  
- Photo (avec aperçu automatique)  
- Email  
- Téléphone  
- Expériences professionnelles dynamiques (ajout / suppression)

---

## 🗺️ Plan interactif du bâtiment

Le plan contient **6 zones** :

| Salle              | Description                        |
|--------------------|------------------------------------|
| Réception          | Accueil visiteurs                  |
| Salle des serveurs | Infrastructure IT                  |
| Salle de sécurité  | Surveillance & contrôle            |
| Salle de conférence| Réunions et présentations          |
| Salle du personnel | Pause & détente                    |
| Salle d’archives   | Documents sensibles                |

Chaque salle affiche un bouton **“+”** permettant d’affecter un employé.

---

## 🧠 Règles métier

| Rôle               | Accès autorisé                                      |
|--------------------|------------------------------------------------------|
| Receptionnistes    | Réception                                           |
| Techniciens IT     | Salle des serveurs                                  |
| Agents de sécurité | Salle de sécurité                                   |
| Manager            | Accès total                                         |
| Nettoyage          | Toutes les salles sauf **Salle d’archives**         |
| Autres rôles       | Accès général sauf zones restreintes                |

> Les assignations interdites sont automatiquement bloquées.

---

## 👥 Assignation intuitive via popup

- Un clic sur **“+”** ouvre une popup.
- Seuls les employés **éligibles** apparaissent.
- Un clic suffit pour assigner un employé à une salle.
- Les salles peuvent être limitées (ex : 3 employés max).

---

## ❌ Retrait d’un employé

Chaque carte dispose d’un bouton **“X”** permettant de :

- retirer l’employé de la salle,  
- le remettre automatiquement dans **Unassigned Staff**.

---

## 👤 Profil détaillé (popup)

En cliquant sur une carte :

- Photo  
- Nom  
- Rôle  
- Email  
- Téléphone  
- Expériences  
- Localisation actuelle (salle ou “Unassigned”)

---

## 📱 Responsive Design

Compatible avec :

- Desktop large (≥1280px)  
- Desktop classique (1024–1279px)  
- Tablette portrait & paysage (768–1023px)  
- Mobile portrait (≤767px)  
- Mobile paysage  

Le layout s’adapte automatiquement.

---

## 🛠️ Technologies utilisées

### **HTML5**
### **CSS3**
- Grid  
- Flexbox  
- Media Queries  
- Hover / transitions  
- Style moderne & clean

### **Vanilla JavaScript**
- Manipulation du DOM  
- Modals (ajout / assignation / profil)  
- Logique métier & restrictions  
- Système dynamique de cartes  
- Gestion des événements  

---

## 📂 Structure du projet
project/
│── index.html # Structure de l’interface
│── style.css # Styles + responsive
│── index.js # Logique complète en JS
│
└── images/ # Images des salles
├── reception--.png
├── serveurs--.png
├── securiter--.png
├── coverence--.png
├── personnel--.png
└── archives--.png

      Projet conçu et développé par Aymane zaariouh
