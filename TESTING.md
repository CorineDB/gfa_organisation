# Tests Unitaires - GFA Organisation

## 🚀 Démarrage rapide

### Installation des dépendances de test
Les dépendances de test sont déjà installées. Si vous avez besoin de les réinstaller :

```bash
npm install
```

### Exécuter les tests

#### Mode watch (recommandé pour le développement)
```bash
npm run test
```
Les tests se relancent automatiquement à chaque modification de fichier.

#### Exécution unique
```bash
npm run test:run
```
Exécute tous les tests une seule fois et affiche les résultats.

#### Interface UI
```bash
npm run test:ui
```
Ouvre une interface web interactive pour visualiser et exécuter les tests.

#### Couverture de code
```bash
npm run test:coverage
```
Génère un rapport de couverture de code HTML dans le dossier `coverage/`.

---

## 📁 Structure des tests

```
src/
└── views/
    └── dashboard/
        ├── EvaluationFactuel.vue          # Composant principal
        └── __tests__/
            └── EvaluationFactuel.spec.js  # Tests unitaires
```

---

## 🧪 Tests disponibles

### validateMemberForm()
**Fichier** : `src/views/dashboard/__tests__/EvaluationFactuel.spec.js`

**Description** : Tests de validation du formulaire d'ajout de membres au comité.

**Couverture** :
- ✅ 25 tests au total
- ✅ Validation du nom (4 tests)
- ✅ Validation du prénom (3 tests)
- ✅ Validation du contact (9 tests)
- ✅ Validation complète du formulaire (4 tests)
- ✅ Cas limites et edge cases (5 tests)

**Résultats** :
```
✓ src/views/dashboard/__tests__/EvaluationFactuel.spec.js (25 tests) 15ms
  ✓ validateMemberForm (25)
    ✓ Validation du nom (4)
    ✓ Validation du prénom (3)
    ✓ Validation du contact (9)
    ✓ Validation complète du formulaire (4)
    ✓ Cas limites et edge cases (5)

Test Files  1 passed (1)
     Tests  25 passed (25)
```

---

## 🛠️ Configuration

### Vitest
Le projet utilise **Vitest** comme framework de test, configuré dans `vitest.config.js`.

**Caractéristiques** :
- ⚡ Rapide et moderne
- 🔄 Hot Module Replacement (HMR)
- 🌐 Support de Vue 3
- 📊 Couverture de code intégrée
- 🎨 Interface UI optionnelle

### Environnement
- **Environment** : `happy-dom` (simulation du DOM pour les tests)
- **Globals** : Activés (pas besoin d'importer `describe`, `it`, `expect`)

---

## 📝 Écrire de nouveaux tests

### Template de base

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { ref } from 'vue';

describe('Ma fonctionnalité', () => {
  beforeEach(() => {
    // Initialisation avant chaque test
  });

  it('devrait faire quelque chose', () => {
    // Arrange (préparation)
    const valeur = ref(0);

    // Act (action)
    valeur.value = 42;

    // Assert (vérification)
    expect(valeur.value).toBe(42);
  });
});
```

### Bonnes pratiques

1. **Nommage clair** : Utilisez des descriptions explicites
   ```javascript
   it('devrait retourner false si le nom est vide', () => { ... });
   ```

2. **Un test = une assertion** : Testez une seule chose par test
   ```javascript
   // ✅ Bon
   it('devrait valider le nom', () => {
     expect(validateNom("Dupont")).toBe(true);
   });

   // ❌ Éviter
   it('devrait valider tout', () => {
     expect(validateNom("Dupont")).toBe(true);
     expect(validatePrenom("Jean")).toBe(true);
     expect(validateContact("0123456789")).toBe(true);
   });
   ```

3. **Arrange-Act-Assert** : Structurez vos tests
   ```javascript
   it('devrait ajouter un membre', () => {
     // Arrange
     const membre = { nom: "Dupont", prenom: "Jean", contact: "0123456789" };

     // Act
     const result = addMember(membre);

     // Assert
     expect(result).toBe(true);
   });
   ```

4. **Testez les cas limites** : N'oubliez pas les edge cases
   ```javascript
   it('devrait gérer les valeurs null', () => { ... });
   it('devrait gérer les chaînes vides', () => { ... });
   it('devrait gérer les valeurs undefined', () => { ... });
   ```

---

## 🐛 Débogage

### Afficher les valeurs pendant les tests
```javascript
it('devrait faire quelque chose', () => {
  const valeur = ref(42);
  console.log('Valeur:', valeur.value); // Affiche dans la console
  expect(valeur.value).toBe(42);
});
```

### Exécuter un seul test
```javascript
it.only('devrait exécuter uniquement ce test', () => {
  // Ce test sera le seul à s'exécuter
});
```

### Ignorer un test temporairement
```javascript
it.skip('devrait être ignoré', () => {
  // Ce test sera ignoré
});
```

### Mode debug avec l'UI
```bash
npm run test:ui
```
Puis cliquez sur un test pour voir les détails et les erreurs.

---

## 📊 Couverture de code

### Générer le rapport
```bash
npm run test:coverage
```

### Visualiser le rapport
Ouvrez `coverage/index.html` dans votre navigateur.

### Objectifs de couverture
- **Lignes** : > 80%
- **Fonctions** : > 80%
- **Branches** : > 75%

---

## 🔧 Dépannage

### Les tests ne se lancent pas
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur "Cannot find module"
Vérifiez que les alias de chemin sont correctement configurés dans `vitest.config.js` :
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Les tests sont lents
- Utilisez `it.concurrent` pour les tests indépendants
- Évitez les `beforeEach` coûteux
- Utilisez des mocks pour les appels API

---

## 📚 Ressources

- [Documentation Vitest](https://vitest.dev/)
- [Documentation Vue Test Utils](https://test-utils.vuejs.org/)
- [Guide des tests Vue 3](https://vuejs.org/guide/scaling-up/testing.html)

---

## 🤝 Contribution

Avant de soumettre du code :

1. ✅ Exécutez les tests : `npm run test:run`
2. ✅ Vérifiez la couverture : `npm run test:coverage`
3. ✅ Assurez-vous que tous les tests passent
4. ✅ Ajoutez des tests pour les nouvelles fonctionnalités

---

**Dernière mise à jour** : 2025-11-30  
**Version** : 1.0
