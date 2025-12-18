# Plan Détaillé du Rapport PFE
## Système de Gestion des Fonds Bancaires - Amen Bank

---

## Pages Liminaires

1. **Page de Garde**
   - Titre du projet
   - Noms des étudiants
   - Établissement et année

2. **Dédicace**

3. **Remerciements**
   - Remerciements à Amen Bank
   - Remerciements à l'équipe pédagogique

4. **Résumés et Mots-clés**
   - Résumé en français
   - Résumé en anglais
   - Mots-clés: Gestion des fonds, Workflow, RBAC, Next.js, PostgreSQL

5. **Table des Matières**

6. **Liste des Figures**
   - Tous les diagrammes UML
   - Captures d'écran des interfaces

7. **Liste des Tableaux**
   - Tableaux de comparaison technologies
   - Tableaux de user stories
   - Tableaux de planification Gantt

8. **Liste des Acronymes**
   - API, CRUD, JWT, ORM, RBAC, SSR, UML, RGPD, KPI, MoSCoW, etc.

---

## I. Introduction Générale

- **Contexte**: Digitalisation des processus bancaires et automatisation de la gestion des mouvements de fonds
- **Problématique**: Gestion manuelle inefficace des fonds inter-agences, risques de sécurité, délais prolongés, traçabilité limitée
- **Objectifs du projet**: 
  - Automatiser le cycle complet de gestion (demande → validation → dispatch → réception)
  - Mettre en place un système de workflow sécurisé avec contrôle d'accès basé sur les rôles (RBAC)
  - Assurer la traçabilité et l'audit des opérations
- **Solution proposée**: Application web full-stack moderne avec architecture microservices et sécurité renforcée
- **Organisation du rapport**: Structure chapitres (Cadre général, État de l'art, Sprints de développement, Conclusion)

---

## Chapitre 1: Cadre Général du Projet

### 1.1. Introduction
Présentation générale du contexte du projet et des enjeux

### 1.2. Présentation d'Amen Bank
- **Historique et position**: Position d'Amen Bank sur le marché tunisien, nombre d'agences
- **Services offerts**: Services bancaires classiques, réseau de distribution
- **Structure organisationnelle** (Diagramme Organigramme):
  - Direction Générale
  - Caisse Centrale (Trésorerie)
  - Direction Sécurité (Tunisie Sécurité)
  - Réseau d'agences régionales
  - Relations hiérarchiques et responsabilités

### 1.3. Cadrage du Projet
- **Problème identifié**: 
  - Gestion manuelle des mouvements de fonds (provisionnement et versement)
  - Absence de traçabilité numérique
  - Risques opérationnels et de sécurité
  - Délais de traitement importants
- **Solution proposée**: 
  - Plateforme web centralisée
  - Workflow automatisé et tracé
  - Contrôle d'accès granulaire par rôle

### 1.4. Étude de l'Existant
- **Solutions concurrentes sur le marché**:
  - SAP Banking Module (coût, complexité)
  - Oracle FLEXCUBE (infrastructure lourde)
  - Solutions custom développées par d'autres banques (variabilité)
- **Critique de l'existant**: Coûts de licence élevés, manque de flexibilité, absence de workflow adapté au contexte local

### 1.5. Méthodologie de Travail Adoptée

#### 1.5.1. Comparaison Méthodologies
- **Cascade (Waterfall)**: Prédictif, rigide, adaptation tardive
- **Agile**: Itératif, adaptatif, feedback continu
- **Choix justifié**: Scrum pour sa flexibilité et itérations rapides

#### 1.5.2. Framework Scrum
- **Rôles**:
  - Product Owner: Gestion du backlog produit, priorités
  - Scrum Master: Facilitation, élimination des obstacles
  - Équipe de développement: Réalisation des tâches
- **Événements**:
  - Sprint Planning: Sélection des user stories (début de sprint)
  - Daily Standup: Points quotidiens d'avancement
  - Sprint Review: Démonstration des fonctionnalités terminées
  - Sprint Retrospective: Amélioration des processus
- **Artefacts**:
  - Product Backlog: Ensemble des fonctionnalités prioritaires
  - Sprint Backlog: Tâches sélectionnées pour le sprint
  - Increment: Fonctionnalités livrables

#### 1.5.3. Planification Temporelle
- **Nombre de sprints**: 4 sprints
- **Durée**: 2-3 semaines par sprint
- **Timeline**: Sprint 1 (Architecture & Auth) → Sprint 2 (Demandes) → Sprint 3 (Validation) → Sprint 4 (Dispatch & Analytics)
- **Diagramme de Gantt**: 
  - Axes: Phases du projet, timeline calendaire
  - Barres: Durée de chaque sprint avec jalons
  - Dépendances entre sprints

### 1.6. Conclusion du Chapitre

---

## Chapitre 2: État de l'Art et Technologies

### 2.1. Introduction
Présentation du contexte technologique et académique du projet

### 2.2. Concepts Métiers Bancaires

#### 2.2.1. Gestion de Trésorerie
- Définition et enjeux de la trésorerie bancaire
- Mouvements de fonds inter-agences

#### 2.2.2. Types de Mouvements
- **Provisionnement**: Envoi de fonds d'une agence vers la Caisse Centrale
- **Versement**: Envoi de fonds de la Caisse Centrale vers une agence

#### 2.2.3. Workflow d'Approbation Multiniveaux
- Étapes: Demande → Validation → Assignment → Dispatch → Réception
- Acteurs: Agence, Caisse Centrale, Tunisie Sécurité
- **Diagramme de flux processus** (État transitions):
  - SUBMITTED → VALIDATED/REJECTED
  - VALIDATED → ASSIGNED
  - ASSIGNED → DISPATCHED
  - DISPATCHED → RECEIVED/COMPLETED

#### 2.2.4. Traçabilité et Audit Trail
- Logs de chaque action
- Identification des utilisateurs
- Timestamps
- Justifications des rejets

### 2.3. Pile Technologique

#### 2.3.1. Architecture Générale
- **Pattern**: Full-Stack JavaScript/TypeScript
- **Architecture**: Monolithe Next.js avec API Routes (approche moderne)
- **Déploiement**: Architecture serverless (Vercel pour frontend + API, PostgreSQL cloud)

#### 2.3.2. Technologies Frontend
- **Framework**: Next.js 15
  - App Router (routing moderne)
  - Server Components (performance)
  - API Routes (backend intégré)
  - SSR et optimisations
- **Langage**: TypeScript (type-safety)
- **Styling**: Tailwind CSS + Radix UI (shadcn/ui)
- **État client**: Zustand (gestion d'état simple et performante)
- **Validation**: Zod (schémas de validation)

#### 2.3.3. Technologies Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Base de données**: PostgreSQL (robustesse, transactions ACID)
- **ORM**: Prisma
  - Migrations automatisées
  - Type-safety (génération de types)
  - Studio (interface de gestion BD)
- **Authentification**: NextAuth.js
  - Stratégie: JWT + cookies
  - Providers: Credentials provider
  - Sessions sécurisées

#### 2.3.4. Sécurité
- **Hashing**: bcrypt pour les mots de passe
- **JWT**: Tokens pour les sessions
- **Middleware**: Authentification et autorisation
- **RBAC**: Contrôle d'accès basé sur les rôles

#### 2.3.5. Outils de Développement
- **Version Control**: Git + GitHub
- **IDE**: VS Code
- **Gestion BD**: Prisma Studio
- **API Testing**: Postman/Thunder Client
- **Formatage**: Prettier, ESLint
- **Package Manager**: npm/yarn/pnpm

#### 2.3.6. Tableau Comparatif Technologies
| Aspect | Next.js | Alternative (Express) | Justification |
|--------|---------|----------------------|---------------|
| Framework | Next.js 15 | Express | SSR natif, API Routes intégrées |
| BD | PostgreSQL | MongoDB | Transactionalité, ACID |
| ORM | Prisma | TypeORM | Type-safety, migrations faciles |
| Auth | NextAuth.js | jwt/passport | Intégration Next.js, sessions gérées |
| État Client | Zustand | Redux | Légèreté, courbe d'apprentissage |

### 2.4. Conclusion du Chapitre

---

## Chapitre 3: Sprint 1 - Architecture et Authentification

### 3.1. Introduction
Premier sprint dédié à la mise en place de l'infrastructure et des mécanismes de sécurité

### 3.2. Objectifs du Sprint
- Configurer l'architecture Next.js full-stack
- Mettre en place l'authentification sécurisée
- Créer les bases du modèle de données
- Implémenter le système RBAC

### 3.3. Spécification des Besoins

#### 3.3.1. Besoins Fonctionnels
- **Authentification**:
  - Connexion (login) avec email et mot de passe
  - Gestion de session
  - Déconnexion (logout)
  - Redirection automatique (utilisateurs non authentifiés vers login)
- **Gestion des utilisateurs** (Admin):
  - Créer un utilisateur
  - Consulter la liste des utilisateurs
  - Modifier les détails utilisateur
  - Supprimer un utilisateur
- **Gestion des rôles**:
  - Rôles prédéfinis: Admin, Agence, CaisseCentrale, TunisieSécurité
  - Permissions associées à chaque rôle
- **Gestion des agences**:
  - Créer agence
  - Lister agences
  - Assigner agences aux utilisateurs
- **Tableau de bord**:
  - Dashboard personnalisé par rôle
  - Affichage des informations pertinentes selon le rôle

#### 3.3.2. Besoins Non-Fonctionnels
- **Sécurité**:
  - Hashing des mots de passe (bcrypt)
  - Tokens JWT pour les sessions
  - Middleware de protection des routes
  - Validation côté serveur
- **Performance**:
  - SSR pour chargement rapide
  - Optimisations Next.js
  - Caching approprié
- **Ergonomie**:
  - Interface responsive (mobile-first)
  - Notifications toast pour feedback utilisateur
  - Messages d'erreur clairs
- **Maintenabilité**:
  - Code en TypeScript (type-safety)
  - Architecture modulaire
  - Separation of concerns (controllers, services, models)

#### 3.3.3. Acteurs Identifiés
- **Administrateur**: Gestion globale des utilisateurs et rôles
- **Agence**: Soumission de demandes, consultation
- **Caisse Centrale**: Validation des demandes
- **Tunisie Sécurité**: Assignment et dispatch

#### 3.3.4. Diagramme de Cas d'Utilisation - Sprint 1
```
Acteurs: Admin, Agence, CaisseCentrale, TunisieSécurité
Cas d'utilisation:
- [Admin] Se connecter → Authentification
- [Admin] Créer utilisateur → Gestion Utilisateurs
- [Admin] Voir tableau de bord admin → Dashboard
- [Agence] Se connecter → Authentification
- [Agence] Voir tableau de bord agence → Dashboard
- [CaisseCentrale] Se connecter → Authentification
- [TunisieSécurité] Se connecter → Authentification
```

### 3.4. Conception du Sprint

#### 3.4.1. Diagramme de Classes - Entités Principales
```
Entités:
- User: id, email, password, firstName, lastName, role, agencyId, createdAt
- Role: id, name, permissions[]
- Agency: id, name, location, codeAgence
- Permission: id, name, description

Relations:
- User has one Role
- User belongs to Agency
- Role has many Permissions
```

#### 3.4.2. Diagramme de Séquence - Processus de Connexion
```
Acteur: Utilisateur
1. Utilisateur saisit email + mot de passe
2. Soumet formulaire (POST /api/auth/signin)
3. API valide email + mot de passe
4. API vérifie hash bcrypt
5. Si valide: API génère JWT token
6. API retourne token + user info
7. Frontend stocke token dans cookie sécurisé
8. Frontend redirige vers dashboard
```

#### 3.4.3. Diagramme de Séquence - Création d'Utilisateur (Admin)
```
Acteur: Administrateur
1. Admin saisit détails utilisateur (email, mot de passe, rôle, agence)
2. Soumet formulaire (POST /api/users)
3. API valide les données (Zod schema)
4. API vérifie email unique
5. API hash le mot de passe (bcrypt)
6. API insère en base de données (Prisma)
7. API retourne user créé
8. Frontend affiche succès + redirection
```

#### 3.4.4. Diagramme d'Activités - Flux d'Authentification
```
Début: Utilisateur visite application
↓
Utilisateur authentifié?
├─ NON → Redirection vers page login
│  ├─ Formulaire login
│  ├─ Vérification credentials
│  └─ Génération JWT
└─ OUI → Accès application
   └─ Affichage dashboard selon rôle
```

#### 3.4.5. Modèle de Données - Schema Prisma
```
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  firstName String
  lastName  String
  role      Role    @relation(fields: [roleId], references: [id])
  roleId    Int
  agency    Agency? @relation(fields: [agencyId], references: [id])
  agencyId  Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Role {
  id    Int     @id @default(autoincrement())
  name  String  @unique
  users User[]
}

model Agency {
  id        Int     @id @default(autoincrement())
  name      String
  location  String
  codeAgence String @unique
  users     User[]
}
```

### 3.5. Réalisation du Sprint

#### 3.5.1. Composants Frontend
- **LoginPage** (`app/login/page.tsx`): Formulaire de connexion
- **DashboardLayout** (`components/layout/dashboard-layout.tsx`): Layout principal
- **ProtectedRoute** (`components/auth/protected-route.tsx`): Protection des routes
- **UserManagement** (Admin): Liste et formulaire utilisateurs
- **RoleManagement** (Admin): Gestion des rôles

#### 3.5.2. Routes API
- `POST /api/auth/signin`: Authentification
- `POST /api/auth/signout`: Déconnexion
- `POST /api/users`: Créer utilisateur
- `GET /api/users`: Lister utilisateurs
- `GET /api/users/[id]`: Détails utilisateur
- `PUT /api/users/[id]`: Modifier utilisateur
- `DELETE /api/users/[id]`: Supprimer utilisateur
- `GET /api/roles`: Lister rôles
- `GET /api/agencies`: Lister agences

#### 3.5.3. Composants Logique (Services)
- `lib/auth.ts`: Configuration NextAuth.js
- `lib/auth-utils.ts`: Utilitaires authentification
- `lib/db.ts`: Connection base de données (Prisma)

### 3.6. Tests et Validation
- Vérification login valide/invalide
- Vérification création utilisateur
- Test de protection des routes
- Test permissions par rôle

### 3.7. Revue de Sprint
- Démonstration: Authentification, CRUD utilisateurs, Dashboard
- Validation Product Owner: Approche architecture, couverture besoins
- Feedback: Améliorations prochains sprints

### 3.8. Conclusion du Chapitre

---

## Chapitre 4: Sprint 2 - Module Gestion des Demandes

### 4.1. Introduction
Sprint dédié au module core de gestion des demandes de fonds

### 4.2. Vue d'Ensemble
Développement du système de création et consultation des demandes de provisionnement/versement avec détails des coupures et pièces

### 4.3. Objectif Principal
Permettre aux agences de soumettre des demandes détaillées spécifiant les montants et coupures requises, et à la Caisse Centrale de consulter toutes les demandes

### 4.4. User Stories Détaillées

| ID | En tant que | Je veux | Critères d'acceptation | Priorité |
|----|-------------|---------|-------|----------|
| US-01 | Agence | Créer une demande de provisionnement | Formulaire complet, validation montants | Must |
| US-02 | Agence | Spécifier les coupures/pièces détaillées | Ajouter plusieurs denominations | Must |
| US-03 | Agence | Consulter mes demandes avec filtres | Liste avec pagination, filtrage statut/date | Must |
| US-04 | CaisseCentrale | Voir toutes les demandes soumises | Vue globale, tri par agence/date/statut | Must |
| US-05 | Agence | Télécharger un PDF de ma demande | Export PDF formaté | Should |

### 4.5. Analyse et Spécifications

#### 4.5.1. Diagramme de Cas d'Utilisation - Sprint 2
```
Acteurs: Agence, CaisseCentrale
Cas d'utilisation:
- [Agence] Créer demande → Validation montant
- [Agence] Ajouter denominations → Gestion detailles
- [Agence] Consulter mes demandes → Filtrages
- [CaisseCentrale] Voir toutes demandes → Consultation globale
- [Système] Calculer montant total → Validation
```

#### 4.5.2. Raffinements Textuels - Scénario Nominal: Création Demande
```
Acteur Principal: Utilisateur Agence
Préconditions: Utilisateur authentifié, rattaché à une agence
1. Utilisateur accède page "Créer demande"
2. Saisit: Type mouvement (Provisionnement/Versement), Description, Montant total
3. Ajoute denominations: 
   - Sélectionne coupure (100DT, 50DT, 20DT, 10DT, 5DT, 2DT, 1DT)
   - Saisit quantité
   - Répète pour plusieurs denominations
4. Système calcule automatiquement montant = somme(coupure × quantité)
5. Utilisateur valide: montant calculé = montant saisi
6. Soumet la demande (POST API)
7. Système sauvegarde avec statut "SUBMITTED"
8. Système affiche confirmation + numéro demande
9. Email notification envoyée à Caisse Centrale
Postconditions: Demande créée, visible dans listes
```

#### 4.5.3. Raffinements Textuels - Scénario Alternatif: Montants Mismatch
```
Cas d'erreur: Montant denominations ≠ Montant total
1. Utilisateur saisit montant total 1000DT
2. Ajoute denominations pour 950DT seulement
3. Soumet formulaire
4. API valide et détecte mismatch
5. API retourne erreur: "Montant total ne correspond pas à la somme des denominations"
6. Frontend affiche message erreur en rouge
7. Utilisateur corrige et resubmit
```

#### 4.5.4. Diagramme de Classes - Entités Demandes
```
model Request {
  id              Int      @id @default(autoincrement())
  requestNumber   String   @unique
  type            String   // "PROVISIONING" | "REMITTANCE"
  agency          Agency   @relation(fields: [agencyId], references: [id])
  agencyId        Int
  totalAmount     Float
  description     String?
  status          String   @default("SUBMITTED") // SUBMITTED, VALIDATED, REJECTED, ASSIGNED, DISPATCHED, RECEIVED, COMPLETED
  denominations   DenominationDetail[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model DenominationDetail {
  id        Int      @id @default(autoincrement())
  request   Request  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  requestId Int
  denomination Float  // 100, 50, 20, 10, 5, 2, 1
  quantity  Int
  subtotal  Float    // denomination × quantity
}
```

#### 4.5.5. Diagramme de Séquence - Création Demande Complète
```
Agence → Frontend → API → Base Données → Frontend
1. Utilisateur remplit formulaire
2. Frontend: Validation client (Zod)
3. POST /api/requests → API
4. API: Validation serveur
5. API: Vérification calcul montant
6. API: Génération requestNumber
7. API: INSERT Request + DenominationDetails
8. Base de données: Confirm insert
9. API: Retourne request créée
10. Frontend: Affiche succès
```

#### 4.5.6. Diagramme d'Activités - Flux Consultation Demandes (Agence)
```
Début: Agence accède liste demandes
↓
Charger demandes de l'agence
↓
Appliquer filtres?
├─ PAR STATUT → Filter demandes
├─ PAR DATE → Sort demandes
├─ PAR MONTANT → Filter demandes
└─ CHERCHER → Search requestNumber
↓
Afficher tableau paginé
↓
Utilisateur clique demande?
├─ OUI → Afficher détails (denominations, timeline)
└─ NON → Rester liste
↓
Fin
```

### 4.6. Conception Détaillée

#### 4.6.1. Architecture Composants Frontend
```
app/requests/
├── page.tsx (Liste demandes)
├── create/
│   └── page.tsx (Création demande)
└── [id]/
    └── page.tsx (Détails demande)

components/requests/
├── request-filters.tsx (Filtrages et recherche)
├── denomination-input.tsx (Ajout denominations dynamique)
├── request-table.tsx (Tableau demandes)
└── request-details.tsx (Vue détails)
```

#### 4.6.2. Routes API
```
GET /api/requests
  - Query params: agencyId, status, startDate, endDate
  - Retourne: paginated list

POST /api/requests
  - Body: { type, agencyId, totalAmount, description, denominations }
  - Validation: Schema Zod
  - Retourne: Created request

GET /api/requests/[id]
  - Retourne: Request details with denominations

PUT /api/requests/[id]
  - Body: { description, ... }
  - Retourne: Updated request

GET /api/requests/[id]/export/pdf
  - Retourne: PDF file
```

#### 4.6.3. Schémas Validation (Zod)
```typescript
CreateRequestSchema = {
  type: enum("PROVISIONING", "REMITTANCE"),
  totalAmount: number.min(100).max(1000000),
  description: string.max(500).optional(),
  agencyId: number.positive(),
  denominations: array({
    denomination: enum(100, 50, 20, 10, 5, 2, 1),
    quantity: number.min(1).max(10000)
  })
}
```

### 4.7. Réalisation - Implémentation

#### 4.7.1. Composant Création Demande
- Formulaire avec 2 sections: Infos générales + Détails denominations
- Ajouter/Supprimer lignes denominations dynamiquement
- Calcul automatique montant total
- Comparaison et validation avant soumission
- Message succès avec numéro demande

#### 4.7.2. Composant Liste Demandes
- Tableau avec colonnes: Numéro demande, Type, Montant, Statut, Date, Actions
- Filtres en haut: Statut (dropdown), Date (date picker), Recherche (input)
- Pagination: 10/25/50 par page
- Action "Voir détails" → navigation vers détails

#### 4.7.3. Composant Détails Demande
- Header: Numéro, Statut (badge couleur), Agence
- Section: Infos générales (type, montant total, date création, description)
- Section: Détails denominations (tableau avec coupures/quantités/subtotals)
- Section: Timeline/Historique (actions et statuts)
- Bouton: "Télécharger PDF" (si applicable)

#### 4.7.4. État Zustand - Request Store
```typescript
useRequestStore = create((set) => ({
  requests: [],
  filters: { status: null, dateFrom: null, dateTo: null },
  setRequests: (requests) => set({ requests }),
  setFilters: (filters) => set({ filters }),
  addRequest: (request) => set((state) => ({ requests: [request, ...state.requests] }))
}))
```

### 4.8. Tests et Validation
- Création demande: Validation montants, denominations, calcul
- Consultation: Filtrage, pagination, recherche
- Permission: Agence voit seulement ses demandes, Caisse Centrale voit toutes
- Export PDF: Format, contenu, téléchargement

### 4.9. Revue de Sprint
- Démonstration: Création demande, liste demandes, détails, filtrage
- Validation Product Owner: Couverture user stories, UX
- Métriques: Nombre d'utilisateurs testant, feedback

### 4.10. Conclusion du Chapitre

---

## Chapitre 5: Sprint 3 - Module Validation et Assignment

### 5.1. Introduction
Sprint 3 dédie au workflow de validation des demandes et assignment des équipes

### 5.2. Vue d'Ensemble
Mise en place du workflow multiniveaux: Validation par Caisse Centrale et Assignment d'équipes par Tunisie Sécurité

### 5.3. Objectif Principal
Automatiser le processus d'approbation et d'attribution des ressources logistiques pour le transport des fonds

### 5.4. User Stories Détaillées

| ID | En tant que | Je veux | Critères d'acceptation | Priorité |
|----|-------------|---------|-------|----------|
| US-06 | CaisseCentrale | Valider une demande soumise | Transition SUBMITTED → VALIDATED | Must |
| US-07 | CaisseCentrale | Rejeter une demande avec motif | Transition SUBMITTED → REJECTED + justification | Must |
| US-08 | TunisieSécurité | Assigner une équipe à une demande validée | Sélectionner chauffeur + transporteur | Must |
| US-09 | TunisieSécurité | Voir liste équipes disponibles | CIN + noms + contact | Must |
| US-10 | Système | Tracer chaque action (audit trail) | Logs utilisateur + timestamp + action | Should |
| US-11 | Système | Envoyer notifications statut | Notification à Agence et Caisse Centrale | Could |

### 5.5. Analyse et Spécifications

#### 5.5.1. Diagramme de Cas d'Utilisation - Sprint 3
```
Acteurs: CaisseCentrale, TunisieSécurité, Système
Cas d'utilisation:
- [CaisseCentrale] Valider demande
- [CaisseCentrale] Rejeter demande
- [TunisieSécurité] Assigner équipe
- [TunisieSécurité] Consulter équipes disponibles
- [Système] Enregistrer action (audit)
- [Système] Notifier parties
```

#### 5.5.2. Raffinements Textuels - Scénario: Validation Demande
```
Acteur Principal: Caisse Centrale
Préconditions: Demande en statut SUBMITTED
1. CaisseCentrale accède liste demandes en attente
2. Clique "Examiner" sur une demande
3. Voit détails complets (denominations, montant, agence)
4. Examine la demande
5. Choisit: "Valider" ou "Rejeter"
6. Si Valider:
   - Clique bouton "Valider"
   - Système met à jour statut → VALIDATED
   - Système enregistre action (utilisateur, timestamp, action)
   - Notification envoyée à Tunisie Sécurité
7. Si Rejeter:
   - Clique bouton "Rejeter"
   - Dialog appear: "Motif du rejet?"
   - CaisseCentrale saisit motif (min 10 caractères)
   - Système met à jour statut → REJECTED + rejectionReason
   - Système enregistre action
   - Notification envoyée à Agence
Postconditions: Demande validée/rejetée, parties notifiées
```

#### 5.5.3. Raffinements Textuels - Scénario: Assignment Équipe
```
Acteur Principal: Tunisie Sécurité
Préconditions: Demande en statut VALIDATED, équipe disponible
1. TunisieSécurité accède liste demandes validées
2. Clique "Assigner équipe"
3. Dialog modal appears: Form assignment
4. Form fields:
   - Sélectionner chauffeur (dropdown, CIN + nom)
   - Sélectionner transporteur (dropdown, CIN + nom)
   - Notes spéciales (textarea, optional)
5. TunisieSécurité vérifie disponibilité équipe (OK ou indisponible)
6. Soumet formulaire
7. Système valide:
   - Chauffeur ≠ Transporteur
   - Les deux disponibles
8. Système met à jour:
   - statut → ASSIGNED
   - assignedDriver, assignedGuard, assignedDate
   - Enregistre action
9. Notification envoyée à Agence + CaisseCentrale
10. Vue retour liste avec nouveau statut
Postconditions: Équipe assignée, demande en phase dispatch
```

#### 5.5.4. Diagramme de Classes - Entités Validation/Assignment
```
model Request {
  ...
  status: String // SUBMITTED, VALIDATED, REJECTED, ASSIGNED, ...
  validatedAt?: DateTime
  validatedBy?: User
  rejectionReason?: String
  rejectedAt?: DateTime
  rejectedBy?: User
  assignedDriver?: SecurityOfficer
  assignedDriverId?: Int
  assignedGuard?: SecurityOfficer
  assignedGuardId?: Int
  assignedAt?: DateTime
  actionLogs: ActionLog[]
}

model SecurityOfficer {
  id      Int     @id @default(autoincrement())
  cin     String  @unique
  firstName String
  lastName String
  email   String
  phone   String
  role    String  // "DRIVER" | "GUARD"
  availability Boolean @default(true)
  assignedRequests Request[] // Relations
}

model ActionLog {
  id        Int     @id @default(autoincrement())
  request   Request @relation(fields: [requestId], references: [id])
  requestId Int
  action    String  // "VALIDATED", "REJECTED", "ASSIGNED"
  actor     User    @relation(fields: [actorId], references: [id])
  actorId   Int
  details   String? // JSON string with details
  timestamp DateTime @default(now())
}
```

#### 5.5.5. Diagramme de Séquence - Validation Demande
```
CaisseCentrale → Frontend → API → Base Données
1. CC clique "Valider"
2. Frontend: Dialog confirmation
3. Frontend: POST /api/requests/[id]/validate
4. API: Vérifier authz (user est CaisseCentrale)
5. API: Vérifier statut demande = SUBMITTED
6. API: UPDATE Request set status=VALIDATED, validatedBy=userId, validatedAt=now()
7. API: INSERT ActionLog (action=VALIDATED, actor=userId)
8. API: Déclencher notification
9. Base données: Confirm update
10. API: Retourne request updated
11. Frontend: Affiche succès, update vue locale
12. User voit statut changé en VALIDATED (badge vert)
```

#### 5.5.6. Diagramme de Séquence - Assignment Équipe
```
TunisieSécurité → Frontend → API → Base Données → Notifications
1. TS remplit form assignment (chauffeur, garde, notes)
2. Frontend: Validation client (Zod)
3. Frontend: POST /api/requests/[id]/assign-team
4. API: Vérifier authz
5. API: Vérifier statut = VALIDATED
6. API: Vérifier chauffeur ≠ garde
7. API: Vérifier disponibilité équipe
8. API: UPDATE Request (assignedDriver, assignedGuard, status=ASSIGNED)
9. API: INSERT ActionLog
10. API: Déclencher notifications (Agence, CC)
11. Base données: Confirm
12. API: Retourne request
13. Frontend: Affiche succès
```

#### 5.5.7. Diagramme d'Activités - Validation Workflow
```
Début: Demande SUBMITTED
↓
CaisseCentrale examine demande?
├─ NON → Attendre
└─ OUI → 
   ↓
   Valide la demande?
   ├─ OUI (Validation OK) →
   │  UPDATE status = VALIDATED
   │  Notifier Tunisie Sécurité
   │  ↓
   │  Prêt pour Assignment
   └─ NON (Montant excessif, etc.) →
      INPUT motif rejet
      UPDATE status = REJECTED
      Notifier Agence
      ↓
      Fin cycle (Agence peut resubmit)
```

### 5.6. Conception Détaillée

#### 5.6.1. Architecture Composants Frontend
```
components/
├── validate-dialog.tsx (Dialog validation/rejet)
├── assign-team-dialog.tsx (Dialog assignment)
├── validation-form.tsx (Form rejet avec motif)
├── team-selector.tsx (Sélection chauffeur/garde)
└── action-logs.tsx (Timeline actions)

app/requests/[id]/
└── page.tsx (Détails demande avec actions conditionnelles)
```

#### 5.6.2. Routes API
```
POST /api/requests/[id]/validate
  - Body: {}
  - Retourne: Updated request (status=VALIDATED)

POST /api/requests/[id]/reject
  - Body: { rejectionReason }
  - Retourne: Updated request (status=REJECTED)

POST /api/requests/[id]/assign-team
  - Body: { driverId, guardId, notes? }
  - Retourne: Updated request (status=ASSIGNED)

GET /api/requests/[id]/history
  - Retourne: Array of ActionLogs

GET /api/security-officers
  - Query: role (DRIVER|GUARD), available (true|false)
  - Retourne: List of SecurityOfficers
```

#### 5.6.3. Middleware - Vérification Permissions
```
// Protection par rôle
- POST /validate → Rôle CaisseCentrale uniquement
- POST /reject → Rôle CaisseCentrale uniquement
- POST /assign-team → Rôle TunisieSécurité uniquement

// Vérifications métier
- État demande valide pour opération
- Utilisateur assigné à bonne agence/zone
```

### 5.7. Réalisation - Implémentation

#### 5.7.1. Dialog Validation
- Header: "Valider la demande #XYZ"
- Body: Résumé demande (montant, agence, denominations)
- Buttons: "Valider" (vert), "Annuler" (gris)
- Confirmation action avec toast succès

#### 5.7.2. Dialog Rejet
- Header: "Rejeter la demande"
- Body: Résumé demande
- Form: Textarea "Motif du rejet" (validation: min 10 chars)
- Buttons: "Rejeter" (rouge), "Annuler"
- Après rejet: Toast + redirection liste

#### 5.7.3. Dialog Assignment
- Header: "Assigner une équipe"
- Form:
  - Dropdown "Chauffeur": Select component with search (CIN + Nom)
  - Dropdown "Garde": Select component with search (CIN + Nom)
  - Textarea "Notes" (optional)
- Validation client: Les deux sélectionnés, différents
- Buttons: "Assigner" (vert), "Annuler"
- Après assignment: Toast + refresh request

#### 5.7.4. Component Timeline Actions
- Chronologie verticale des actions
- Pour chaque action: Date/Heure, Type (Validation/Rejet/Assignment), Acteur, Détails
- Icones par type d'action (checkmark pour validation, X pour rejet, person pour assignment)

#### 5.7.5. État Zustand - Action Logs
```typescript
useActionLogStore = create((set) => ({
  logs: [],
  setLogs: (logs) => set({ logs }),
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] }))
}))
```

### 5.8. Tests et Validation
- Validation demande: Statut change, logs enregistrés
- Rejet demande: Motif stocké, notification agence
- Assignment: Équipe assignée, statut ASSIGNED
- Permission: Seul CaisseCentrale peut valider, seule TunisieSécurité peut assigner
- Edge cases: Révalidation, équipe indisponible

### 5.9. Revue de Sprint
- Démonstration: Validation, rejet, assignment
- Validation workflow: Transitions états cohérentes
- Audit trail: Actions tracées correctement

### 5.10. Conclusion du Chapitre

---

## Chapitre 6: Sprint 4 - Module Dispatch et Analytics

### 6.1. Introduction
Sprint final: Finalisation du cycle de traitement et mise en place du module analytics

### 6.2. Vue d'Ensemble
Implémentation des étapes finales (dispatch par Tunisie Sécurité, réception par Agence) et tableau de bord analytics pour l'administration

### 6.3. Objectif Principal
Compléter le cycle de traitement des demandes et fournir une visibilité sur les KPIs et performances du système

### 6.4. User Stories Détaillées

| ID | En tant que | Je veux | Critères d'acceptation | Priorité |
|----|-------------|---------|-------|----------|
| US-12 | TunisieSécurité | Confirmer le dispatch d'une demande | Transition ASSIGNED → DISPATCHED | Must |
| US-13 | Agence | Confirmer la réception des fonds | Transition DISPATCHED → RECEIVED | Must |
| US-14 | Agence | Signaler une non-conformité | Ajouter raison non-conformité | Should |
| US-15 | Administrateur | Voir tableau de bord analytics | Charts, KPIs, tables agrégées | Must |
| US-16 | Administrateur | Exporter les données analytics | Export Excel/PDF | Should |

### 6.5. Analyse et Spécifications

#### 6.5.1. Diagramme de Cas d'Utilisation - Sprint 4
```
Acteurs: TunisieSécurité, Agence, Administrateur
Cas d'utilisation:
- [TunisieSécurité] Confirmer dispatch
- [Agence] Confirmer réception
- [Agence] Déclarer non-conformité
- [Administrateur] Consulter analytics
- [Administrateur] Exporter données
- [Système] Calculer KPIs
```

#### 6.5.2. Raffinements Textuels - Scénario: Dispatch Demande
```
Acteur Principal: Tunisie Sécurité
Préconditions: Demande en statut ASSIGNED, équipe assignée
1. TS accède liste demandes assignées
2. Clique "Dispatcher"
3. Dialog confirmation: "Confirmer le dispatch de la demande #XYZ?"
4. Dialog affiche: Équipe assignée (noms), destination (agence)
5. TS clique "Confirmer dispatch"
6. Système met à jour:
   - statut → DISPATCHED
   - dispatchedAt = now()
   - dispatchedBy = userId
7. Système enregistre ActionLog
8. Notification envoyée à Agence destinataire
9. Toast succès, vue refresh
Postconditions: Demande en transit, Agence notifiée
```

#### 6.5.3. Raffinements Textuels - Scénario: Réception Demande
```
Acteur Principal: Agence (destinataire)
Préconditions: Demande en statut DISPATCHED
1. Agence accède liste demandes en attente de réception
2. Clique "Recevoir"
3. Dialog appears: Form réception
4. Form fields:
   - Checkbox "Conforme?" (default: checked)
   - Si Non-conforme: Textarea "Raison non-conformité" (mandatory)
   - Notes additionnelles (optional textarea)
5. Agence saisit détails réception
6. Clique "Confirmer réception"
7. Système valide:
   - Si non-conforme: Raison remplie
8. Système met à jour:
   - statut → RECEIVED (si conforme) ou COMPLETED_WITH_ISSUES (si non-conforme)
   - receivedAt = now()
   - receivedBy = userId
   - nonConformityReason (si applicable)
9. Système enregistre ActionLog
10. Notification envoyée à Caisse Centrale + TunisieSécurité
Postconditions: Cycle terminé, parties notifiées, données pour analytics
```

#### 6.5.4. Diagramme de Classes - Entités Dispatch/Reception
```
model Request {
  ...
  status: String // DISPATCHED, RECEIVED, COMPLETED_WITH_ISSUES
  dispatchedAt?: DateTime
  dispatchedBy?: User
  receivedAt?: DateTime
  receivedBy?: User
  nonConformityReason?: String
  receiverNotes?: String
  completedAt?: DateTime
}
```

#### 6.5.5. Diagrammes de Séquence - Dispatch
```
TunisieSécurité → Frontend → API → BD → Notifications
1. TS clique "Dispatcher"
2. Frontend: Dialog confirmation
3. Frontend: POST /api/requests/[id]/dispatch
4. API: Vérifier authz (TS)
5. API: Vérifier statut = ASSIGNED
6. API: UPDATE status=DISPATCHED, dispatchedAt, dispatchedBy
7. API: INSERT ActionLog
8. API: Déclencher notification
9. Base données: Confirm
10. Frontend: Toast succès
```

#### 6.5.6. Diagrammes d'Activités - Flux Réception
```
Début: Demande DISPATCHED
↓
Agence reçoit fonds
↓
Conforme?
├─ OUI (Conforme) →
│  UPDATE status = RECEIVED
│  Fin cycle (SUCCESS)
└─ NON (Non-conforme) →
   INPUT raison non-conformité
   UPDATE status = COMPLETED_WITH_ISSUES
   Notifier CC et TS
   ↓
   Fin cycle (ISSUES)
```

#### 6.5.7. Spécification Analytics
```
KPIs à afficher:
1. Nombre demandes par statut (pie chart)
2. Nombre demandes par agence (bar chart)
3. Montant total transité (value card)
4. Délai moyen du cycle (valeur + trend)
5. Taux de rejet (%)
6. Taux de non-conformité (%)

Tables:
- Top 5 agences (par volume)
- Top 5 agences (par montant)
- Demandes récentes (derniers 10)

Filtres:
- Plage dates (date picker range)
- Agence spécifique (multiselect)
- Statut (multiselect)
```

### 6.6. Conception Détaillée

#### 6.6.1. Architecture Composants Frontend
```
components/dashboard/
├── request-stats-chart.tsx (Pie chart statuts)
├── agency-volume-chart.tsx (Bar chart agences)
├── analytics-kpi-cards.tsx (KPI cards)
├── analytics-table.tsx (Tables données)
└── analytics-filters.tsx (Filtres)

app/admin/analytics/
└── page.tsx (Page dashboard admin)
```

#### 6.6.2. Routes API
```
POST /api/requests/[id]/dispatch
  - Body: {}
  - Retourne: Updated request

POST /api/requests/[id]/receive
  - Body: { conforme, nonConformityReason?, notes? }
  - Retourne: Updated request

GET /api/analytics/summary
  - Query: dateFrom, dateTo, agencyId[], status[]
  - Retourne: { totalRequests, totalAmount, averageDelay, rejectionRate, nonConformityRate }

GET /api/analytics/by-status
  - Retourne: [{ status, count }]

GET /api/analytics/by-agency
  - Retourne: [{ agencyName, count, totalAmount }]

GET /api/analytics/recent-requests
  - Retourne: Last 10 requests

GET /api/analytics/export
  - Query: format (excel|pdf), dateFrom, dateTo
  - Retourne: File
```

#### 6.6.3. Composant Chart - Statuts (Pie Chart)
```typescript
// Données:
[ 
  { status: "SUBMITTED", count: 5 },
  { status: "VALIDATED", count: 12 },
  { status: "DISPATCHED", count: 20 },
  { status: "RECEIVED", count: 15 }
]

// Display:
- Pie chart avec legend
- Couleurs différentes par statut
- Labels avec pourcentages
```

#### 6.6.4. Composant Chart - Agences (Bar Chart)
```
// Données:
[
  { agencyName: "Agence Tunis Centre", volume: 25, amount: 500000 },
  { agencyName: "Agence Sousse", volume: 18, amount: 380000 },
  ...
]

// Display:
- Bar chart (volume) avec axis secondaire (montant)
- Top 5 agences
```

#### 6.6.5. KPI Cards Layout
```
Row 1:
├── Card "Demandes totales": 150 (trending +5%)
├── Card "Montant total": 5.2M DT (trending +12%)
└── Card "En cours": 35

Row 2:
├── Card "Délai moyen": 3.2j (trending -0.5j)
├── Card "Taux rejet": 8% (trending -2%)
└── Card "Non-conformité": 12% (trending +1%)
```

#### 6.6.6. Dialog Réception
```
Header: "Recevoir la demande #XYZ"
Body: Détails demande (montant, équipe, date dispatch)

Form:
├── Checkbox "Conforme" (default: checked)
├── Textarea "Raison (si non-conforme)" (hidden si checked)
└── Textarea "Notes additionnelles" (optional)

Buttons:
├── "Recevoir" (vert)
└── "Annuler"
```

### 6.7. Réalisation - Implémentation

#### 6.7.1. Composant Liste Dispatch (TunisieSécurité)
- Tableau demandes ASSIGNED
- Colonne: Numéro, Agence, Équipe, Montant, Date assignation
- Bouton "Dispatcher" (avec confirmation dialog)
- Toast succès après dispatch

#### 6.7.2. Composant Liste Réception (Agence)
- Tableau demandes DISPATCHED
- Colonne: Numéro, Équipe, Montant, Date dispatch, Heures depuis dispatch
- Bouton "Recevoir" (ouvre dialog)
- Dialog réception avec formulaire
- Après succès: Update statut visible, toast

#### 6.7.3. Page Dashboard Analytics (Admin)
- Header: Titre "Analytics" + Filtres (date range, agence, statut)
- 3 KPI cards (demandes, montant, délai moyen)
- 3 Charts (pie statuts, bar agences, line timeline)
- 2 Tables (top agences, demandes récentes)
- Bouton "Exporter" (format selecteur: Excel, PDF)

#### 6.7.4. État Zustand - Analytics Store
```typescript
useAnalyticsStore = create((set) => ({
  stats: null,
  filters: { dateFrom, dateTo, agencyIds: [], statuses: [] },
  setStats: (stats) => set({ stats }),
  setFilters: (filters) => set({ filters })
}))
```

#### 6.7.5. Calcul KPIs (Backend)
```
requestsByStatus = GROUP BY status COUNT
totalAmount = SUM(totalAmount) for dateRange

averageDelay = AVG(EXTRACT(DAY FROM (receivedAt - createdAt)))

rejectionRate = COUNT(status=REJECTED) / COUNT(*) * 100

nonConformityRate = COUNT(nonConformityReason IS NOT NULL) / COUNT(status IN [RECEIVED, COMPLETED_WITH_ISSUES]) * 100
```

### 6.8. Tests et Validation
- Dispatch: Statut change ASSIGNED→DISPATCHED
- Réception: Statut change DISPATCHED→RECEIVED/COMPLETED_WITH_ISSUES
- Non-conformité: Raison validée, notification envoyée
- Analytics: Données correctes, filtrage fonctionne
- Export: Fichier généré, format correct
- Permission: Admin seul accès analytics

### 6.9. Revue de Sprint
- Démonstration complète du cycle end-to-end
- Validation dashboard analytics
- Récupération du feedback utilisateurs
- Performance et scalabilité

### 6.10. Conclusion du Chapitre

---

## Conclusion Générale

### Synthèse du Projet
Le projet "Système de Gestion des Fonds Bancaires - Amen Bank" représente une solution complète et opérationnelle pour automatiser le cycle de vie des mouvements de fonds inter-agences. À travers les 4 sprints décrits, nous avons mis en place:

1. **Sprint 1**: Fondations solides avec authentification sécurisée et architecture full-stack
2. **Sprint 2**: Module core de gestion des demandes avec validation et traçabilité
3. **Sprint 3**: Workflow multiniveaux avec validation et assignment des ressources
4. **Sprint 4**: Finalisation du cycle et analytics pour visibilité sur la performance

### Compétences Acquises
- Développement full-stack avec Next.js 15 (App Router, Server Components)
- Gestion de la sécurité (JWT, bcrypt, RBAC, middleware)
- Conception de workflow complexes avec transitions d'états
- Modélisation de bases de données relationnelles (PostgreSQL, Prisma)
- Gestion d'état client (Zustand)
- Validation de données côté serveur et client (Zod)
- UI responsive et user-centric (Tailwind CSS, shadcn/ui)
- Pratiques Agile/Scrum
- Traçabilité et audit trail

### Difficultés Rencontrées et Solutions
1. **Gestion des états complexes**: Utilisation d'une machine d'états clairement définie
2. **Validation transactionnelle**: Utilisation des transactions Prisma pour garantir l'intégrité
3. **Sécurité JWT**: Implémentation correcte des expirations et refresh tokens
4. **Performance des queries**: Optimisation avec includes/selects Prisma et caching
5. **Concurrence (race conditions)**: Utilisation d'optimistic locking ou versioning

### Perspectives Futures et Améliorations

#### Court terme (Post-MVP)
- **Notifications push/email**: Intégration SendGrid pour notifications réelles
- **Module de reporting avancé**: Export PDF/Excel formaté avec logos
- **Gestion des équipes**: Interface de gestion des SecurityOfficers
- **Tableaux de bord agence**: Vue personnalisée par agence

#### Moyen terme
- **Versionnage des demandes**: Permettre modifications avant validation
- **Signature électronique**: Intégration pour validation légale
- **Intégration mobile**: App React Native pour consultation et notification
- **API GraphQL**: Complément REST pour requêtes complexes
- **Module de multi-approbation**: Approbations parallèles ou séquentielles

#### Long terme
- **IA/ML**: Prédiction des délais, détection d'anomalies
- **Blockchain**: Immutabilité des transactions critiques
- **Microservices**: Découplage de domaines métier
- **Scaling horizontale**: Load balancing, caching distribué
- **Intégration Swift**: Connexion au système Swift de la banque

---

## Bibliographie et Netographie

### Documentation Officielle
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma ORM Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Méthodologies
- Scrum Guide - Schwaber, K., & Sutherland, J. (2020)
- The Pragmatic Programmer - Hunt, A., & Thomas, D. (2019)
- Clean Code - Martin, R. C. (2008)

### Sécurité et Bonnes Pratiques
- OWASP Top 10 - Security Risks
- JWT Best Practices - Auth0
- Zero Trust Architecture - Google

### Ressources Complémentaires
- GitHub: Exemples de code open source
- Stack Overflow: Solutions problèmes techniques
- Medium: Articles techniques et retours d'expérience
