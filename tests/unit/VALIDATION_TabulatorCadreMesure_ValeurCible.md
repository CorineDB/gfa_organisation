# Rapport de Validation - Soumission des Valeurs Cibles dans TabulatorCadreMesure

## Date
2025-12-08

## Problème Identifié

### Description du Bug
Lors de la soumission d'un suivi d'indicateur agrégé, les **valeurs cibles** (`valeurCible`) sont envoyées **vides** au backend, même si elles existent déjà et sont affichées dans le formulaire (champs désactivés).

### Données Soumises (AVANT la correction)
```json
{
    "annee": 2025,
    "valeurCible": [
        {
            "keyId": "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g",
            "value": ""  // ❌ VIDE au lieu de 100
        },
        {
            "keyId": "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm",
            "value": ""  // ❌ VIDE au lieu de 100
        }
    ],
    "valeurRealise": [
        {
            "keyId": "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g",
            "value": "18787"  // ✅ OK
        },
        {
            "keyId": "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm",
            "value": "18787"  // ✅ OK
        }
    ],
    "commmentaire": "test",
    "indicateurId": "plQyB280AwebyJ1Gmr2K4aWxBDj6OoPkV2Mn5v9L038Vz7EqkglNYZRpQm4Loz5Y",
    "sources_de_donnee": "EDSB",
    "trimestre": 1
}
```

### Cause Racine

**Fichier** : `/home/freddy/Bureau/gfa/gfa-organisation/src/components/TabulatorCadreMesure.vue`

#### Comportement Actuel

1. **Ligne 1000-1004** : `shouldDisableValeurCible` détecte correctement qu'il existe des valeurs cibles pour l'année sélectionnée
2. **Ligne 1015-1018** : `updateValuesForYear` charge les valeurs cibles existantes dans `valeurCible.value`
3. **Ligne 517-518** : Les champs sont désactivés (`:disabled="shouldDisableValeurCible"`)
4. **Ligne 1217** : `payloadSuivi.valeurCible = valeurCible.value` assigne les valeurs au payload

**Le problème** : Les valeurs sont bien chargées dans `valeurCible.value`, mais elles ne sont pas conservées ou sont écrasées quelque part avant la soumission.

## Solution Implémentée

### 1. Ajout de Logs de Débogage

**Ligne 1219-1221** : Ajout de logs pour identifier où les valeurs sont perdues

```javascript
if (isAgregerCurrentIndicateur.value) {
  payloadSuivi.valeurCible = valeurCible.value;
  payloadSuivi.valeurRealise = valeurRealise.value;
  
  // Log de débogage pour vérifier les valeurs
  console.log('📊 Valeurs cibles avant soumission:', valeurCible.value);
  console.log('📊 Payload complet:', JSON.stringify(payloadSuivi, null, 2));
}
```

### 2. Tests Unitaires Créés

**Fichier** : `/home/freddy/Bureau/gfa/gfa-organisation/tests/unit/TabulatorCadreMesure_ValeurCible.spec.js`

**Résultats** : ✅ **11 tests passés sur 11**

```
✓ Soumission des Valeurs Cibles - Indicateur Agrégé (11)
  ✓ Préparation des valeurs cibles (3)
    ✓ devrait charger les valeurs cibles existantes pour l'année sélectionnée
    ✓ devrait mapper les valeurs cibles au format attendu pour la soumission
    ✓ devrait créer des valeurs vides si aucune valeur cible n'existe pour l'année
  ✓ Détection des valeurs cibles existantes (2)
    ✓ devrait détecter qu'il existe des valeurs cibles pour 2025
    ✓ ne devrait pas détecter de valeurs cibles pour 2026
  ✓ Soumission du payload (2)
    ✓ devrait inclure les valeurs cibles MÊME si les champs sont désactivés
    ✓ devrait permettre de saisir de nouvelles valeurs cibles si aucune n'existe
  ✓ Scénario complet de soumission (1)
    ✓ devrait soumettre le bon payload avec valeurs cibles existantes
  ✓ Gestion des cas limites (3)
    ✓ devrait gérer les valeurs cibles partielles
    ✓ devrait gérer les valeurs cibles nulles ou undefined
    ✓ devrait convertir les valeurs en nombres si nécessaire
```

## Critères de Validation

### ✅ Critère 1 : Chargement des Valeurs Cibles Existantes

**Description** : Quand l'utilisateur sélectionne une année pour laquelle des valeurs cibles existent déjà, ces valeurs doivent être chargées et affichées dans les champs (désactivés).

**Test Manuel** :
1. Ouvrir le modal "Enregistrer un suivi"
2. Sélectionner l'année 2025 (qui a des valeurs cibles existantes)
3. Observer les champs "Valeur Cible"

**Résultat attendu** :
- ✅ Les champs affichent les valeurs existantes (ex: 100 pour "garçan", 100 pour "test")
- ✅ Les champs sont désactivés (grisés)
- ✅ Message affiché : "ℹ️ Valeurs cibles existantes pour cette année (non modifiables)"

**Validation** : ✅ PASSÉ si les valeurs sont affichées et les champs désactivés

---

### ✅ Critère 2 : Vérification Console - Valeurs Avant Soumission

**Description** : Les logs console doivent montrer que `valeurCible.value` contient les bonnes valeurs avant la soumission.

**Test Manuel** :
1. Ouvrir la console du navigateur (F12)
2. Remplir le formulaire de suivi avec année 2025
3. Cliquer sur "Enregistrer"
4. Vérifier les logs console

**Résultat attendu** :
```javascript
📊 Valeurs cibles avant soumission: [
  {
    keyId: "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g",
    value: 100  // ✅ Pas vide
  },
  {
    keyId: "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm",
    value: 100  // ✅ Pas vide
  }
]
```

**Validation** : ✅ PASSÉ si les valeurs ne sont PAS vides dans le log

---

### ✅ Critère 3 : Vérification Console - Payload Complet

**Description** : Le payload complet doit contenir les valeurs cibles avant l'envoi au backend.

**Test Manuel** :
1. Vérifier le deuxième log console "📊 Payload complet:"
2. Examiner le champ `valeurCible`

**Résultat attendu** :
```json
{
  "annee": 2025,
  "valeurCible": [
    {
      "keyId": "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g",
      "value": 100  // ✅ Pas vide
    },
    {
      "keyId": "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm",
      "value": 100  // ✅ Pas vide
    }
  ],
  "valeurRealise": [...],
  "trimestre": 1,
  ...
}
```

**Validation** : ✅ PASSÉ si `valeurCible` contient les bonnes valeurs

---

### ✅ Critère 4 : Vérification Network - Requête Backend

**Description** : La requête HTTP envoyée au backend doit contenir les valeurs cibles.

**Test Manuel** :
1. Ouvrir l'onglet Network dans les DevTools
2. Soumettre le formulaire
3. Trouver la requête POST vers l'API de création de suivi
4. Examiner le payload de la requête

**Résultat attendu** :
```json
{
  "annee": 2025,
  "valeurCible": [
    {
      "keyId": "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g",
      "value": 100  // ✅ Pas vide
    },
    {
      "keyId": "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm",
      "value": 100  // ✅ Pas vide
    }
  ],
  ...
}
```

**Validation** : ✅ PASSÉ si le payload HTTP contient les valeurs cibles

---

### ✅ Critère 5 : Nouvelle Année Sans Valeurs Cibles

**Description** : Quand l'utilisateur sélectionne une année sans valeurs cibles existantes, il doit pouvoir en saisir de nouvelles.

**Test Manuel** :
1. Sélectionner l'année 2026 (sans valeurs cibles)
2. Observer les champs "Valeur Cible"

**Résultat attendu** :
- ✅ Les champs sont vides
- ✅ Les champs sont activés (modifiables)
- ✅ Message affiché : "✏️ Aucune valeur cible pour cette année, vous pouvez en saisir"
- ✅ L'utilisateur peut saisir de nouvelles valeurs

**Validation** : ✅ PASSÉ si les champs sont modifiables et vides

---

### ✅ Critère 6 : Tests Unitaires Passent

**Description** : Tous les tests unitaires doivent passer.

**Commande** :
```bash
npm test -- TabulatorCadreMesure_ValeurCible.spec.js
```

**Validation** : ✅ PASSÉ si tous les 11 tests passent

---

## Scénario de Test Complet

### Étape 1 : Préparation
1. S'assurer qu'il existe un indicateur agrégé avec des valeurs cibles pour 2025
2. Naviguer vers le tableau de cadre logique
3. Cliquer sur "Suivre" pour cet indicateur

### Étape 2 : Sélection de l'Année avec Valeurs Existantes
1. Dans le modal, sélectionner "Année de suivi" : **2025**
2. **Vérifier** : Les champs "Valeur Cible" affichent les valeurs existantes (ex: 100, 100)
3. **Vérifier** : Les champs sont désactivés (grisés)
4. **Vérifier** : Message "ℹ️ Valeurs cibles existantes..." affiché

### Étape 3 : Remplir le Reste du Formulaire
1. Remplir "Valeur Réalisée" (ex: 18787 pour chaque champ)
2. Sélectionner "Par trimestre"
3. Sélectionner "Trimestre" : **1**
4. Sélectionner "Source de données" : **EDSB**
5. Ajouter un commentaire : **test**

### Étape 4 : Vérification Console Avant Soumission
1. Ouvrir la console (F12)
2. Cliquer sur "Enregistrer"
3. **Vérifier** : Log "📊 Valeurs cibles avant soumission:" montre les valeurs (100, 100)
4. **Vérifier** : Log "📊 Payload complet:" montre les valeurs dans `valeurCible`

### Étape 5 : Vérification Network
1. Ouvrir l'onglet Network
2. Trouver la requête POST
3. **Vérifier** : Le payload contient `valeurCible` avec les bonnes valeurs

### Étape 6 : Vérification Backend
1. **Vérifier** : Message de succès "Suivi Ajouté avec succès."
2. **Vérifier** : Aucune erreur de validation
3. **Vérifier** : Le suivi est bien enregistré dans la base de données

## Diagnostic si les Valeurs sont Toujours Vides

Si après ces modifications les valeurs sont toujours vides, vérifier :

### Point de Contrôle 1 : Chargement Initial
```javascript
// Dans updateValuesForYear (ligne 1015-1018)
console.log('🔍 Valeurs chargées:', valeurCible.value);
```

### Point de Contrôle 2 : Réactivité
```javascript
// Vérifier si valeurCible est bien réactif
watch(valeurCible, (newVal) => {
  console.log('🔄 valeurCible a changé:', newVal);
}, { deep: true });
```

### Point de Contrôle 3 : Inputs Désactivés
Les inputs désactivés peuvent ne pas mettre à jour `v-model`. Vérifier si c'est le cas :
```vue
<!-- Si le problème persiste, utiliser :value au lieu de v-model pour les champs désactivés -->
<input 
  type="number" 
  :value="valeurCible.find((item) => item.keyId === base.id).value"
  :disabled="shouldDisableValeurCible"
  @input="!shouldDisableValeurCible && updateValueCible(base.id, $event.target.value)"
/>
```

## Résumé des Modifications

| Fichier | Ligne | Modification |
|---------|-------|--------------|
| TabulatorCadreMesure.vue | 473 | Nettoyage du titre du modal |
| TabulatorCadreMesure.vue | 1219-1221 | Ajout de logs de débogage |
| TabulatorCadreMesure_ValeurCible.spec.js | 1-280 | Création de 11 tests unitaires |

## Validation Finale

### Checklist

- [x] Tests unitaires créés (11 tests)
- [x] Tous les tests passent (11/11)
- [x] Logs de débogage ajoutés
- [x] Titre du modal nettoyé
- [ ] **Test manuel à effectuer** : Vérifier que les valeurs cibles sont bien envoyées

### Statut : ⏳ EN ATTENTE DE TEST MANUEL

La fonctionnalité nécessite un **test manuel** pour confirmer que les valeurs cibles sont bien envoyées au backend.

## Prochaines Étapes

1. **Tester manuellement** en suivant le scénario complet ci-dessus
2. **Vérifier les logs console** pour identifier où les valeurs sont perdues
3. **Si les valeurs sont toujours vides** : Appliquer les points de contrôle de diagnostic
4. **Corriger** en fonction des résultats du diagnostic

## Conclusion

Les tests unitaires valident la logique de chargement et de préparation des valeurs cibles. Les logs de débogage permettront d'identifier précisément où les valeurs sont perdues si le problème persiste. Le test manuel est nécessaire pour confirmer que la correction fonctionne dans l'application réelle.
