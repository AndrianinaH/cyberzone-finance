# Application de Gestion Financière

## Contexte

Créer une application NextJS moderne pour la gestion financière d'une boutique de smartphones avec une UX parfaite et minimaliste.

## Stack Technique OBLIGATOIRE

- **NextJS** (App Router)
- **ShadcnUI** pour tous les composants UI
- **Tailwind CSS** pour le styling
- **Jotai** pour le state management
- **TypeScript** strict
- **Lucide React** pour les icônes

## Fonctionnalités Core V1

### 1. Authentification Simple

- Page login/register épurée
- Gestion session basique
- Profil utilisateur minimal (username, email, password)

### 2. Dashboard Principal

**Interface centrale avec cards modernes affichant :**

- Solde global en MGA (gros chiffre prominent)
- Entrées du jour/semaine/mois
- Sorties du jour/semaine/mois
- Graphique simple des 7 derniers jours
- Toggle rapide période : Jour/Semaine/Mois/Année

### 3. Gestion des Mouvements

**Interface ultra-simple :**

- Liste des mouvements récents (tableau moderne avec shadcn)
- Bouton flottant "+" pour ajouter un mouvement
- Modal d'ajout rapide avec seulement :
  - Type : Toggle Entrée/Sortie (avec couleurs distinctes)
  - Montant : Input numérique large
  - Devise : Select (MGA par défaut, RMB, AED, EUR, USD)
  - Taux change : Input optionnel (si devise ≠ MGA)
  - Description : Input texte
  - Date : Date picker (défaut aujourd'hui)
  - Responsable : Select des utilisateurs
- Actions rapides : Édition inline, suppression avec confirmation

## Exigences UX/UI CRITIQUES

### Design System

- **Palette** : Utiliser des couleurs modernes (dark mode ready)
- **Typographie** : Hiérarchie claire avec des tailles contrastées
- **Espacements** : Généreux, aéré, respiration visuelle
- **Couleurs sémantiques** : Vert pour entrées, rouge pour sorties

### Interactions

- **Feedback visuel** : Toasts pour actions, loading states
- **Micro-animations** : Transitions fluides, hover effects
- **Responsive** : Mobile-first, parfait sur tous écrans
- **Accessibilité** : Focus states, keyboard navigation

### Simplicité d'usage

- **Minimum de clics** : Actions principales en 1-2 clics max
- **Saisie rapide** : Focus automatique, validation temps réel
- **Raccourcis** : Boutons d'action visibles et accessibles
- **Feedback immédiat** : Confirmation visuelle des actions

## Structure des Données

```typescript
interface Movement {
  id: string;
  type: "entry" | "exit";
  amount: number;
  currency: "MGA" | "RMB" | "AED" | "EUR" | "USD";
  exchangeRate?: number;
  amountMGA: number; // calculé
  description: string;
  date: Date;
  author: string; // user connecté
  responsible: string; // user sélectionné
  createdAt: Date;
  updatedAt: Date;
}
```

## Pages/Routes

- `/` - Dashboard principal
- `/auth/login` - Authentification
- `/movements` - Gestion mouvements
- `/profile` - Profil utilisateur

## Priorités d'implémentation

1. **Setup projet** NextJS + ShadcnUI + Jotai - ✅ **Fait**

### Configuration de Shadcn/UI et Jotai

- **Shadcn/UI** a été initialisé avec succès. Les composants seront installés dans `src/components/ui` et les utilitaires dans `src/lib/utils.ts`.
- **Jotai** a été installé et est prêt à être utilisé pour la gestion de l'état global.

2. **Authentification** basique fonctionnelle - ✅ **Fait**
   - Design de la page de connexion amélioré : suppression du fond de carte sur mobile, ajout d'une image de fond pour la version desktop (actuellement un placeholder).

3. **Dashboard** avec données mockées - ✅ **Fait**
4. **Mouvements** CRUD complet - ✅ **Fait**
5. **Polish UI/UX** final - ✅ **Fait** (Navigation globale, Dark Mode et tous les composants ShadcnUI nécessaires ajoutés)
6. **Profil utilisateur** - ✅ **Fait**
   - Page de profil refactorisée avec des onglets (Shadcn UI Tabs) pour séparer la modification du nom/email et la gestion du mot de passe.
   - Mise à jour de la session utilisateur corrigée pour refléter les dernières modifications du profil.
   - Messages d'erreur du serveur traduits en français pour les API de profil et de mot de passe.

## Contraintes Importantes

- **Zéro formulaires complexes** : Tout doit être simple et rapide
- **Mobile-first** : L'interface doit être parfaite sur mobile
- **Performance** : Chargement rapide, interactions fluides
- **Pas de sur-engineering** : Simplicité avant tout

## Demandes spécifiques

- Utilise les composants ShadcnUI exclusivement
- Implémente Jotai pour l'état global
- Crée des composants réutilisables
- Code TypeScript strict avec interfaces claires
- Ajoute des commentaires pour les parties complexes

**Objectif** : Interface moderne, intuitive, rapide à utiliser au quotidien dans une boutique.