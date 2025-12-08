# Correction du Bug - Composant PlanDecaissement.vue

## Date
2025-12-08

## Problème Identifié

### Localisation
**Fichier** : `/home/freddy/Bureau/gfa/gfa-organisation/src/components/PlanDecaissement.vue`
**Méthode** : `sendForm()` (ligne 230-304)

### Description du Bug
Le composant `PlanDecaissement.vue` utilisait le même système de trimestres avec valeurs uniques au format `"année-trimestre"` (ex: `"2026-1"`), mais lors de la soumission, il envoyait directement `this.formData` sans extraire l'année et le trimestre séparément.

### Données Envoyées (AVANT la correction)
```javascript
// ❌ INCORRECT
{
  activiteId: "abc123",
  annee: "2025",              // Année du champ séparé
  trimestre: "2025-4",        // Valeur complète non extraite
  budgetNational: 200,
  pret: 200
}
```

Le backend recevait `trimestre: "2025-4"` au lieu de `trimestre: 4`, ce qui causait l'erreur.

## Solution Implémentée

### Code Modifié

**Avant (ligne 263-270)** :
```javascript
// alert("ok");
this.isLoading = true;
this.formData.budgetNational = parseInt(this.formData.budgetNational);
this.formData.pret = parseInt(this.formData.pret);

console.log("this.formData.annee", this.formData.annee);

PlanDeCaissement.create(this.formData)  // ❌ Envoi direct sans extraction
```

**Après (ligne 263-290)** :
```javascript
// Création d'un nouveau plan
this.isLoading = true;

// Extraire l'année et le trimestre de la valeur unique (format "année-trimestre")
const trimestreValue = this.formData.trimestre;
let annee, trimestre;

if (typeof trimestreValue === 'string' && trimestreValue.includes('-')) {
  // Nouveau format: "2026-1"
  [annee, trimestre] = trimestreValue.split('-').map(Number);
} else {
  // Ancien format (fallback): utiliser l'année séparée
  annee = this.formData.annee;
  trimestre = parseInt(trimestreValue);
}

// Préparer les données à envoyer
const planData = {
  activiteId: this.formData.activiteId,
  annee: annee,                    // ✅ Année extraite
  trimestre: trimestre,            // ✅ Trimestre extrait
  budgetNational: parseInt(this.formData.budgetNational),
  pret: parseInt(this.formData.pret)
};

console.log("Données envoyées au backend:", planData);

PlanDeCaissement.create(planData)  // ✅ Envoi avec données correctes
```

### Données Envoyées (APRÈS la correction)
```javascript
// ✅ CORRECT
{
  activiteId: "abc123",
  annee: 2026,                // ✅ Nombre extrait de "2026-1"
  trimestre: 1,               // ✅ Nombre extrait de "2026-1"
  budgetNational: 200,
  pret: 200
}
```

## Logique d'Extraction

### Cas 1 : Nouveau Format (avec valeur unique)
```javascript
// Entrée
formData.trimestre = "2026-1"

// Extraction
[annee, trimestre] = "2026-1".split('-').map(Number)
// annee = 2026
// trimestre = 1
```

### Cas 2 : Ancien Format (fallback)
```javascript
// Entrée
formData.trimestre = "1"
formData.annee = 2026

// Extraction
annee = formData.annee           // 2026
trimestre = parseInt("1")        // 1
```

## Cohérence avec le Fichier Principal

Cette correction rend le composant `PlanDecaissement.vue` cohérent avec le fichier principal :
- `src/views/dashboard/projets/activites-globale/index.vue`

Les deux fichiers utilisent maintenant la même logique d'extraction :
1. Vérifier si la valeur contient un tiret (`-`)
2. Si oui, extraire année et trimestre en séparant la chaîne
3. Si non, utiliser le fallback avec les champs séparés

## Tests à Effectuer

### Test 1 : Création d'un Plan
1. Ouvrir le modal "Ajouter un Plan de décaissement"
2. Sélectionner une activité
3. Sélectionner une année (ex: 2026)
4. Sélectionner un trimestre (ex: Trimestre 1 (2026))
5. Remplir les montants
6. Soumettre

**Résultat attendu** :
```json
{
  "activiteId": "...",
  "annee": 2026,
  "trimestre": 1,
  "budgetNational": 1000,
  "pret": 2000
}
```

### Test 2 : Vérification Console
Ouvrir la console du navigateur et vérifier le log :
```
Données envoyées au backend: {
  activiteId: "...",
  annee: 2026,
  trimestre: 1,
  budgetNational: 1000,
  pret: 2000
}
```

## Fichiers Modifiés

1. **`/home/freddy/Bureau/gfa/gfa-organisation/src/components/PlanDecaissement.vue`**
   - Méthode `sendForm()` (lignes 230-304)
   - Titre du modal (ligne 437) - nettoyage du texte de test

## Avantages

✅ **Cohérence** : Les deux composants utilisent la même logique
✅ **Clarté** : Log console pour déboguer facilement
✅ **Rétrocompatibilité** : Fallback pour l'ancien format
✅ **Données propres** : Le backend reçoit des nombres, pas des chaînes

## Validation

- [x] Extraction de l'année et du trimestre implémentée
- [x] Fallback pour l'ancien format ajouté
- [x] Log console ajouté pour le débogage
- [x] Titre du modal nettoyé
- [x] Cohérence avec le fichier principal assurée

## Conclusion

Le bug dans `PlanDecaissement.vue` était identique à celui du fichier principal : la valeur unique `"année-trimestre"` n'était pas extraite avant l'envoi au backend. La correction applique la même logique d'extraction que dans `activites-globale/index.vue`, garantissant ainsi la cohérence et le bon fonctionnement de la soumission des plans de décaissement.
