# Outline du Rapport PFE
**Système de Gestion des Fonds Bancaires - Amen Bank**

---

## I. Pages Liminaires
1. Page de Garde
2. Dédicace
3. Remerciements
4. Résumés (FR/EN) + Mots-clés
5. Table des matières
6. Liste des figures
7. Liste des tableaux
8. Liste des acronymes (API, CRUD, JWT, ORM, RBAC, etc.)

---

## II. Introduction Générale
- Contexte: digitalisation des processus bancaires (gestion manuelle des fonds/valeurs)
- Problématique: risques, délais, traçabilité limitée dans les mouvements de fonds inter-agences
- Objectifs: automatiser le cycle complet (demande → validation → dispatch → réception)
- Solution: application web full-stack avec workflow sécurisé et RBAC
- Plan du rapport

---

## Chapitre 1: Cadre Général du Projet

### 1.1. Introduction

### 1.2. Présentation d'Amen Bank
- Historique et position sur le marché tunisien
- Services et réseau d'agences
- Organigramme (Direction Générale, Caisse Centrale, Sécurité, Agences)

### 1.3. Cadrage du Projet
- **Problème**: gestion manuelle inefficace des mouvements de fonds (provisionnement/versement)
- **Solution**: plateforme web centralisée avec workflow automatisé

### 1.4. Étude de l'Existant
- Solutions concurrentes (SAP Banking, Oracle FLEXCUBE, solutions custom)
- Critique: coûts élevés, manque de flexibilité, absence de workflow adapté

### 1.5. Méthodologie de Travail
- Comparaison: Cascade vs Agile
- Choix: **Scrum** (itérations rapides, feedback continu)
- Cadre Scrum: Rôles (Product Owner, Scrum Master, Dev Team), Événements (Sprint Planning, Daily Standup, Review, Retrospective), Artefacts (Product Backlog, Sprint Backlog)
- Planification: Diagramme de Gantt (4 sprints × 2-3 semaines)

### 1.6. Conclusion

---

## Chapitre 2: État de l'Art

### 2.1. Introduction

### 2.2. Concepts Métiers
- Gestion de trésorerie bancaire
- Provisionnement vs Versement
- Workflow d'approbation multiniveaux
- Traçabilité et audit trail

### 2.3. Technologies et Outils
**Architecture Full-Stack:**
- **Frontend/Backend**: Next.js 15 (App Router, Server Components, API Routes)
- **Langage**: TypeScript
- **Base de données**: PostgreSQL (Neon)
- **ORM**: Prisma (migrations, type-safety)
- **Authentification**: NextAuth.js (JWT, credentials provider)
- **Validation**: Zod
- **État client**: Zustand
- **UI**: Tailwind CSS + Radix UI (shadcn/ui)
- **Gestion de version**: Git/GitHub
- **Outils**: VS Code, Prisma Studio, Postman

### 2.4. Conclusion

---

## Chapitre 3: Sprint 1 - Architecture et Authentification

### 3.1. Introduction

### 3.2. Spécification des Besoins
**Besoins Fonctionnels:**
- Authentification sécurisée (login/logout, gestion de session)
- Gestion des utilisateurs (CRUD par administrateur)
- Gestion des rôles et agences
- Tableau de bord personnalisé par rôle

**Besoins Non-Fonctionnels:**
- Sécurité (hashing bcrypt, JWT, middleware)
- Performance (SSR, optimistic updates)
- Ergonomie (interface responsive, notifications toast)
- Maintenabilité (TypeScript, architecture modulaire)

**Acteurs:**
- Administrateur
- Agence
- Caisse Centrale
- Tunisie Sécurité

**Diagramme de Cas d'Utilisation Global**

### 3.3. Gestion Scrum
- Équipe: Product Owner, Développeur Full-Stack, Testeur
- Product Backlog (priorisation MoSCoW)
- Planification: 4 Sprints (Authentification → Requêtes → Workflow → Analytics)

### 3.4. Environnement de Travail
- **Logiciel**: Node.js 18+, PostgreSQL, VS Code, Git
- **Matériel**: PC développement
- **Architecture**: Next.js Full-Stack (Frontend + API Routes + Database)
- **Déploiement**: Vercel (Next.js), Neon/PostgreSQL (cloud), Architecture serverless

### 3.5. Conclusion

---

## Chapitre 4: Sprint 2 - Module Gestion des Demandes

### 4.1. Introduction

### 4.2. Vue d'Ensemble
Module core: création, consultation, filtrage des demandes de fonds

### 4.3. Objectif
Permettre aux agences de soumettre des demandes détaillées (coupures/pièces)

### 4.4. User Stories
| ID | En tant que | Je veux | Priorité |
|----|-------------|---------|----------|
| US-01 | Agence | Créer une demande de provisionnement | Must |
| US-02 | Agence | Spécifier les coupures/pièces | Must |
| US-03 | Agence | Consulter mes demandes | Must |
| US-04 | Caisse Centrale | Voir toutes les demandes soumises | Must |

### 4.5. Analyse
- Diagramme de cas d'utilisation (Créer demande, Consulter demandes)
- Raffinements textuels (scénarios nominaux/alternatifs)

### 4.6. Conception
- **Diagramme de Classes**: Request, DenominationDetail, User, Agency
- **Diagrammes de Séquence**: 
  - Création de demande (Agence → API → DB → Validation)
  - Consultation avec filtres
- **Diagrammes d'Activités**: Workflow de création (validation montant)

### 4.7. Réalisation
- Interface de création (formulaire avec denominations dynamiques)
- Liste des demandes avec filtres/pagination
- Détails de demande (statut, historique)

### 4.8. Revue de Sprint
- Démonstration fonctionnalités
- Validation Product Owner

### 4.9. Conclusion

---

## Chapitre 5: Sprint 3 - Module Validation et Assignment

### 5.1. Introduction

### 5.2. Vue d'Ensemble
Workflow multiniveaux: validation (Caisse Centrale) + assignment équipe (Tunisie Sécurité)

### 5.3. Objectif
Automatiser l'approbation et l'attribution des ressources logistiques

### 5.4. User Stories
| ID | En tant que | Je veux | Priorité |
|----|-------------|---------|----------|
| US-05 | Caisse Centrale | Valider/rejeter une demande | Must |
| US-06 | Caisse Centrale | Ajouter un motif de rejet | Should |
| US-07 | Tunisie Sécurité | Assigner une équipe (chauffeur/transporteur) | Must |
| US-08 | Système | Envoyer des notifications de changement de statut | Could |

### 5.5. Analyse
- Cas d'utilisation: Valider demande, Rejeter demande, Assigner équipe
- Raffinements (conditions de validation, champs obligatoires)

### 5.6. Conception
- **Classes**: ActionLog, SecurityTeam
- **Séquences**:
  - Validation (transition SUBMITTED → VALIDATED/REJECTED)
  - Assignment (transition VALIDATED → ASSIGNED)
- **Activités**: Décisions conditionnelles (if validé → assigner, else → rejeter)

### 5.7. Réalisation
- Boutons d'action conditionnels par rôle
- Dialogs de validation/rejet (formulaires)
- Interface d'assignment d'équipe (CIN chauffeur/transporteur)
- Logs d'actions (audit trail)

### 5.8. Revue de Sprint

### 5.9. Conclusion

---

## Chapitre 6: Sprint 4 - Module Dispatch et Analytics

### 6.1. Introduction

### 6.2. Vue d'Ensemble
Finalisation du cycle: dispatch (Tunisie Sécurité) + réception (Agence) + analytics (Admin)

### 6.3. Objectif
Traçabilité complète et indicateurs de performance

### 6.4. User Stories
| ID | En tant que | Je veux | Priorité |
|----|-------------|---------|----------|
| US-09 | Tunisie Sécurité | Confirmer le dispatch | Must |
| US-10 | Agence | Confirmer la réception | Must |
| US-11 | Agence | Signaler une non-conformité | Should |
| US-12 | Administrateur | Voir les statistiques globales | Should |

### 6.5. Analyse
- Cas: Dispatcher demande, Recevoir demande, Déclarer non-conformité
- États finaux: DISPATCHED → RECEIVED/COMPLETED

### 6.6. Conception
- **Séquences**:
  - Dispatch (update status + timestamps)
  - Réception (vérification + completion)
- **Activités**: Flow de réception (conformité check)
- **Diagramme de Classes**: Champs nonCompliance, dispatchedBy, receivedBy

### 6.7. Réalisation
- Boutons dispatch/receive avec confirmations
- Formulaire de non-conformité (textarea + validation)
- Dashboard analytics:
  - Charts (demandes par statut, par agence)
  - KPIs (délai moyen, taux de rejet)
  - Tables agrégées

### 6.8. Revue de Sprint

### 6.9. Conclusion

---

## Conclusion Générale
- Synthèse: système complet opérationnel couvrant le cycle de vie des fonds
- Compétences acquises: Next.js full-stack, Prisma, RBAC, workflow management
- Difficultés: gestion des états complexes, validation transactionnelle, sécurité JWT
- Perspectives:
  - Notifications push/email
  - Module de reporting avancé (PDF export)
  - Intégration mobile (React Native)
  - Versionnage des demandes
  - Signature électronique

---

## Bibliographie/Netographie
- Next.js Documentation: https://nextjs.org/docs
- Prisma ORM: https://www.prisma.io/docs
- NextAuth.js: https://next-auth.js.org
- Scrum Guide (Schwaber & Sutherland)
- PostgreSQL Documentation
- TypeScript Handbook
- Tailwind CSS Documentation
