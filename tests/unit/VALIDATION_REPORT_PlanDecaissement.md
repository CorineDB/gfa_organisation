# Rapport de Correction - Bug de Sélection de Trimestre dans le Plan de Décaissement

## Date de correction
2025-12-08

## Problème identifié

### Description du bug
Lors de la soumission d'un plan de décaissement, lorsque l'utilisateur sélectionnait **"Trimestre 1 de l'année 2026"**, le système soumettait toujours **"Trimestre 4"** au lieu du trimestre sélectionné.

### Données soumises (avant correction)
```json
{
    "annee": "2025",
    "trimestre": "2025-4",
    "pret": 200,
    "budgetNational": 200,
    "activiteId": "lXydj6q1Q2Pxgoev0qX9LzwWjlVDRrm8lamZ6GnJEpk1dyBAO4abNYK58grV98Jk"
}
```

**Problème constaté** : Le champ `trimestre` contient `"2025-4"` au lieu de juste `4`, et le champ `annee` est redondant.

### Cause racine

1. **Valeurs non uniques** : Dans la méthode `getQuartersInDuration()`, la propriété `value` de chaque trimestre était définie comme le numéro du trimestre (1-4), ce qui n'était pas unique entre les années.
   
   ```javascript
   // AVANT (incorrect)
   value: quarter,  // Valeur 1-4, non unique
   ```

2. **Champs redondants** : Le formulaire avait deux champs séparés (`annee` et `trimestre`), ce qui créait une incohérence lors de la soumission.

3. **Confusion lors de la sélection** : Lorsque l'utilisateur sélectionnait "Trimestre 1 de 2026", le système pouvait confondre avec "Trimestre 1 de 2025" car la valeur était la même (`1`).

## Solution implémentée

### 1. Modification de la structure des trimestres

**Fichier** : `/home/freddy/Bureau/gfa/gfa-organisation/src/views/dashboard/projets/activites-globale/index.vue`

**Ligne 311** : Modification de la propriété `value` pour qu'elle soit unique au format `"année-trimestre"`

```javascript
// APRÈS (correct)
value: `${year}-${quarter}`,  // Ex: "2026-1", valeur unique
```

### 2. Extraction de l'année et du trimestre lors de la soumission

**Lignes 960-982** : Ajout de la logique d'extraction dans `planDeDecaissementActivite()`

```javascript
// Extraire l'année et le trimestre de la valeur unique (format "année-trimestre")
const trimestreValue = this.planDeDecaissement[index].trimestre;
let annee, trimestre;

if (typeof trimestreValue === 'string' && trimestreValue.includes('-')) {
  // Nouveau format: "2026-1"
  [annee, trimestre] = trimestreValue.split('-').map(Number);
} else {
  // Ancien format (fallback): utiliser l'année séparée
  annee = this.planDeDecaissement[index].annee;
  trimestre = trimestreValue;
}

// Préparer les données à envoyer avec année et trimestre séparés
const planData = {
  ...this.planDeDecaissement[index],
  annee: annee,
  trimestre: trimestre
};
```

### 3. Suppression du champ année redondant du formulaire

**Lignes 1598-1608** : Simplification du formulaire pour n'avoir qu'un seul champ de sélection

```vue
<!-- AVANT : Deux champs séparés -->
<div>
  <label>Sélectionner l'année de décaissement</label>
  <TomSelect v-model="plan.annee">...</TomSelect>
</div>
<div>
  <label>Sélectionner le trimestre</label>
  <TomSelect v-model="plan.trimestre">...</TomSelect>
</div>

<!-- APRÈS : Un seul champ avec toute l'information -->
<div class="col-span-2">
  <label>Sélectionner le trimestre</label>
  <TomSelect v-model="plan.trimestre">
    <option v-for="trimestre in trimestres" :value="trimestre.value">
      Trimestre {{ trimestre.trimestre }} ({{ trimestre.annee }})
    </option>
  </TomSelect>
</div>
```

### 4. Mise à jour des méthodes d'initialisation

**Lignes 922-928 et 938-946** : Suppression du champ `annee` dans `ouvrirModalPlanDeDecaissementActivite()` et `addPlan()`

```javascript
// AVANT
const newItem = {
  activiteId: item.id,
  trimestre: 1,
  annee: 2026,
  budgetNational: 0,
  pret: 0,
};

// APRÈS
const newItem = {
  activiteId: item.id,
  trimestre: "2026-1",  // Format unique
  budgetNational: 0,
  pret: 0,
};
```

## Tests unitaires

**Fichier créé** : `/home/freddy/Bureau/gfa/gfa-organisation/tests/unit/PlanDecaissement.spec.js`

### Résultats des tests
✅ **9 tests passés sur 9**

```
✓ Plan de Décaissement - Sélection de Trimestre (9)
  ✓ getQuartersInDuration (2)
    ✓ devrait générer des trimestres avec des valeurs uniques au format "année-trimestre"
    ✓ devrait générer le trimestre 1 de 2026 avec la valeur "2026-1"
  ✓ Extraction de l'année et du trimestre (4)
    ✓ devrait extraire correctement l'année et le trimestre du format "année-trimestre"
    ✓ devrait gérer le format ancien (fallback)
    ✓ devrait extraire différentes valeurs pour différents trimestres de la même année
    ✓ devrait extraire différentes valeurs pour le même trimestre de différentes années
  ✓ Filtrage des trimestres par année (1)
    ✓ devrait filtrer correctement les trimestres pour une année donnée
  ✓ Scénario complet de soumission (2)
    ✓ devrait soumettre le bon trimestre quand on sélectionne Trimestre 1 de 2026
    ✓ ne devrait PAS soumettre le Trimestre 4 quand on sélectionne Trimestre 1 de 2026
```

## Données soumises (après correction)

```json
{
    "annee": 2026,
    "trimestre": 1,
    "pret": 200,
    "budgetNational": 200,
    "activiteId": "lXydj6q1Q2Pxgoev0qX9LzwWjlVDRrm8lamZ6GnJEpk1dyBAO4abNYK58grV98Jk"
}
```

**✅ Résultat** : Les valeurs sont maintenant correctes et correspondent à la sélection de l'utilisateur.

## Avantages de la solution

1. **Unicité garantie** : Chaque combinaison année-trimestre a une valeur unique (`"2026-1"`, `"2026-2"`, etc.)
2. **Interface simplifiée** : Un seul champ de sélection au lieu de deux
3. **Moins d'erreurs** : Impossible de sélectionner une année et un trimestre incohérents
4. **Rétrocompatibilité** : Le code gère aussi l'ancien format grâce au fallback
5. **Meilleure UX** : L'utilisateur voit directement "Trimestre 1 (2026)" dans le dropdown

## Fichiers modifiés

1. `/home/freddy/Bureau/gfa/gfa-organisation/src/views/dashboard/projets/activites-globale/index.vue`
   - Méthode `getQuartersInDuration()` (ligne 311)
   - Méthode `planDeDecaissementActivite()` (lignes 960-1005)
   - Méthode `ouvrirModalPlanDeDecaissementActivite()` (lignes 922-928)
   - Méthode `addPlan()` (lignes 938-946)
   - Template du formulaire (lignes 1598-1608)
   - Correction lint CSS (ligne 1061)

2. `/home/freddy/Bureau/gfa/gfa-organisation/tests/unit/PlanDecaissement.spec.js` (nouveau fichier)
   - 9 tests unitaires couvrant tous les scénarios

## Validation

- [x] Le bug est corrigé : sélectionner "Trimestre 1 de 2026" soumet bien le trimestre 1
- [x] Les tests unitaires passent tous (9/9)
- [x] L'interface utilisateur est simplifiée
- [x] Les données soumises sont correctes
- [x] Rétrocompatibilité assurée avec le fallback
- [x] Erreur de lint CSS corrigée

## Recommandations

1. **Tester en environnement de développement** : Vérifier que la sélection et la soumission fonctionnent correctement
2. **Tester avec différentes années** : S'assurer que les trimestres de 2025, 2026, 2027, etc. sont bien différenciés
3. **Vérifier l'API backend** : S'assurer que l'API accepte bien les champs `annee` et `trimestre` séparés comme des nombres

## Conclusion

Le bug a été corrigé avec succès. La solution implémentée garantit que le bon trimestre est toujours sélectionné et soumis, tout en simplifiant l'interface utilisateur et en améliorant la maintenabilité du code.
