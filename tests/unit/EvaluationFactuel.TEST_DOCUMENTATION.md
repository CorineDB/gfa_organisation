# 📋 Documentation de Test - Fonctionnalité openPreview()

## 🎯 Objectif de la fonctionnalité

Sauvegarder automatiquement les réponses du formulaire avant d'afficher la prévisualisation, garantissant que les données affichées sont à jour et synchronisées avec le backend.

---

## 📝 Code de la fonctionnalité

### Avant modification (code défectueux)
```javascript
const openPreview = () => {
  // submitAnsweredQuestionsOnly()  // ❌ Commenté - pas de sauvegarde
  showModalPreview.value = true;
  isValidate.value = true;
};
```

### Après modification (code corrigé)
```javascript
const openPreview = () => {
  submitAnsweredQuestionsOnly();  // ✅ Sauvegarde avant prévisualisation
  showModalPreview.value = true;
  isValidate.value = true;
};
```

---

## 🧪 Tests Unitaires

### Structure des tests

Les tests sont organisés en 2 suites :

1. **Tests unitaires** (`EvaluationFactuel - openPreview()`)
   - 7 tests focalisés sur la fonction `openPreview()`
   
2. **Tests d'intégration** (`EvaluationFactuel - Workflow de prévisualisation`)
   - 2 tests pour le workflow complet

### Liste des tests

#### Suite 1 : Tests unitaires

| # | Nom du test | Objectif |
|---|-------------|----------|
| 1 | `devrait appeler submitAnsweredQuestionsOnly() avant d'afficher la prévisualisation` | Vérifier que la sauvegarde est déclenchée |
| 2 | `devrait définir showModalPreview à true` | Vérifier l'affichage du modal |
| 3 | `devrait définir isValidate à true` | Vérifier l'activation du mode validation |
| 4 | `devrait appeler submitAnsweredQuestionsOnly() AVANT de modifier les états` | Vérifier l'ordre d'exécution |
| 5 | `devrait pouvoir être appelée plusieurs fois sans erreur` | Vérifier la robustesse |
| 6 | `ne devrait pas lancer d'erreur lors de l'exécution` | Vérifier la stabilité |
| 7 | `devrait être déclenchée par le bouton Prévisualiser dans le template` | Vérifier l'intégration UI |

#### Suite 2 : Tests d'intégration

| # | Nom du test | Objectif |
|---|-------------|----------|
| 1 | `devrait sauvegarder les données et afficher la prévisualisation dans le bon ordre` | Workflow complet |
| 2 | `devrait préserver les données des réponses après ouverture de la prévisualisation` | Intégrité des données |

---

## ✅ Critères de validation

### Critères fonctionnels

| Critère | Description | Statut |
|---------|-------------|--------|
| **CV-1** | La fonction `submitAnsweredQuestionsOnly()` DOIT être appelée | ✅ Obligatoire |
| **CV-2** | La fonction DOIT être appelée AVANT l'affichage du modal | ✅ Obligatoire |
| **CV-3** | `showModalPreview` DOIT passer à `true` | ✅ Obligatoire |
| **CV-4** | `isValidate` DOIT passer à `true` | ✅ Obligatoire |
| **CV-5** | La fonction NE DOIT PAS lancer d'erreur | ✅ Obligatoire |
| **CV-6** | Les données des réponses DOIVENT être préservées | ✅ Obligatoire |
| **CV-7** | La fonction DOIT supporter les appels multiples | ✅ Recommandé |

### Critères de performance

| Critère | Description | Seuil |
|---------|-------------|-------|
| **CP-1** | Temps d'exécution de `openPreview()` | < 100ms |
| **CP-2** | Temps de sauvegarde (async) | < 2s |
| **CP-3** | Pas de fuite mémoire après 10 appels | Stable |

### Critères d'intégration

| Critère | Description | Statut |
|---------|-------------|--------|
| **CI-1** | Le bouton "Prévisualiser" déclenche bien `openPreview()` | ✅ Obligatoire |
| **CI-2** | Le modal de prévisualisation s'affiche correctement | ✅ Obligatoire |
| **CI-3** | Les données affichées correspondent aux données sauvegardées | ✅ Obligatoire |
| **CI-4** | Le mode validation est activé dans le modal | ✅ Obligatoire |

---

## 🚀 Exécution des tests

### Commandes

```bash
# Exécuter tous les tests
npm run test

# Exécuter uniquement les tests de ce fichier
npm run test -- EvaluationFactuel.spec.js

# Exécuter en mode watch
npm run test:watch

# Générer un rapport de couverture
npm run test:coverage
```

### Résultats attendus

```
✓ EvaluationFactuel - openPreview() (7)
  ✓ devrait appeler submitAnsweredQuestionsOnly() avant d'afficher la prévisualisation
  ✓ devrait définir showModalPreview à true
  ✓ devrait définir isValidate à true
  ✓ devrait appeler submitAnsweredQuestionsOnly() AVANT de modifier les états
  ✓ devrait pouvoir être appelée plusieurs fois sans erreur
  ✓ ne devrait pas lancer d'erreur lors de l'exécution
  ✓ devrait être déclenchée par le bouton Prévisualiser dans le template

✓ EvaluationFactuel - Workflow de prévisualisation (2)
  ✓ devrait sauvegarder les données et afficher la prévisualisation dans le bon ordre
  ✓ devrait préserver les données des réponses après ouverture de la prévisualisation

Test Files  1 passed (1)
     Tests  9 passed (9)
  Start at  16:02:21
  Duration  1.23s
```

---

## 📊 Couverture de code attendue

| Métrique | Objectif | Seuil minimum |
|----------|----------|---------------|
| **Lignes** | 100% | 90% |
| **Fonctions** | 100% | 100% |
| **Branches** | 100% | 80% |
| **Statements** | 100% | 90% |

---

## ✔️ Validation finale

### La fonctionnalité est considérée comme **VALIDÉE** si :

1. ✅ **Tous les tests passent** (9/9)
2. ✅ **Couverture de code ≥ 90%**
3. ✅ **Aucune régression détectée** sur les autres fonctionnalités
4. ✅ **Test manuel réussi** :
   - Remplir le formulaire jusqu'à la dernière page
   - Cliquer sur "Prévisualiser"
   - Vérifier que les données affichées sont correctes
   - Vérifier qu'un appel réseau a été effectué (DevTools Network)
5. ✅ **Validation UX** :
   - Pas de délai perceptible avant l'affichage du modal
   - Pas de double sauvegarde visible
   - Comportement cohérent avec les autres pages

---

## 🐛 Cas d'échec possibles

| Scénario | Symptôme | Solution |
|----------|----------|----------|
| `submitAnsweredQuestionsOnly()` non appelée | Données obsolètes dans la prévisualisation | Vérifier que la ligne n'est pas commentée |
| Ordre d'exécution inversé | Modal s'affiche avant la sauvegarde | Vérifier l'ordre des instructions |
| Erreur lors de la sauvegarde | Modal ne s'affiche pas | Ajouter un try/catch et gérer l'erreur |
| Appels multiples | Sauvegardes en double | Ajouter un debounce ou un flag de chargement |

---

## 📅 Historique

| Date | Version | Auteur | Modification |
|------|---------|--------|--------------|
| 2025-12-01 | 1.0 | Antigravity | Création du test et activation de la sauvegarde |

---

## 📚 Références

- Fichier source : `/src/views/dashboard/EvaluationFactuel.vue`
- Fichier de test : `/tests/unit/EvaluationFactuel.spec.js`
- Framework de test : Vitest
- Librairie de test Vue : @vue/test-utils
