# Explication de la Solution - Sélection de Trimestre avec Filtrage par Année

## Pourquoi deux champs (Année + Trimestre) ?

### ❌ Problème initial
Avoir un seul champ avec tous les trimestres de toutes les années crée une liste très longue et difficile à naviguer :

```
Trimestre 1 (2024)
Trimestre 2 (2024)
Trimestre 3 (2024)
Trimestre 4 (2024)
Trimestre 1 (2025)
Trimestre 2 (2025)
Trimestre 3 (2025)
Trimestre 4 (2025)
Trimestre 1 (2026)
Trimestre 2 (2026)
... (liste très longue)
```

### ✅ Solution avec filtrage
Deux champs pour une meilleure expérience utilisateur :

1. **Champ Année** : Permet de filtrer les trimestres
2. **Champ Trimestre** : Affiche uniquement les trimestres de l'année sélectionnée

## Architecture de la Solution

### 1. Interface Utilisateur (Frontend)

```vue
<!-- Champ 1 : Année (pour filtrage) -->
<div>
  <label>Sélectionner l'année</label>
  <TomSelect v-model="plan.anneeFiltre">
    <option value="2024">2024</option>
    <option value="2025">2025</option>
    <option value="2026">2026</option>
  </TomSelect>
  <p class="text-xs text-gray-500">Filtrer les trimestres par année</p>
</div>

<!-- Champ 2 : Trimestre (valeur réelle) -->
<div>
  <label>Sélectionner le trimestre</label>
  <TomSelect v-model="plan.trimestre">
    <!-- Affiche uniquement les trimestres de l'année filtrée -->
    <option v-for="trimestre in filteredTrimestresForPlan(plan.anneeFiltre)" 
            :value="trimestre.value">
      Trimestre {{ trimestre.trimestre }} ({{ trimestre.annee }})
    </option>
  </TomSelect>
</div>
```

### 2. Structure des Données

#### Objet Plan dans le formulaire
```javascript
{
  activiteId: "abc123",
  anneeFiltre: 2026,           // ⚠️ Utilisé UNIQUEMENT pour filtrer l'interface
  trimestre: "2026-1",         // ✅ Valeur réelle au format "année-trimestre"
  budgetNational: 1000,
  pret: 2000,
  id: "unique-id"
}
```

#### Données envoyées au Backend
```javascript
{
  activiteId: "abc123",
  annee: 2026,                 // ✅ Extrait de "2026-1"
  trimestre: 1,                // ✅ Extrait de "2026-1"
  budgetNational: 1000,
  pret: 2000
  // ⚠️ anneeFiltre est EXCLU (ne doit pas être envoyé)
}
```

### 3. Flux de Données

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Utilisateur sélectionne l'année                          │
│    anneeFiltre = 2026                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. La liste des trimestres est filtrée                      │
│    filteredTrimestresForPlan(2026) → [T1, T2, T3, T4]      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Utilisateur sélectionne le trimestre                     │
│    trimestre = "2026-1"                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Lors de la soumission                                    │
│    - Extraction: "2026-1" → annee=2026, trimestre=1        │
│    - Exclusion: anneeFiltre est retiré                     │
│    - Envoi au backend: {annee: 2026, trimestre: 1, ...}    │
└─────────────────────────────────────────────────────────────┘
```

## Code Clé

### Filtrage des Trimestres
```javascript
filteredTrimestresForPlan(annee) {
  if (!annee) {
    return this.trimestres;  // Tous les trimestres si aucune année
  }
  return this.trimestres.filter((trimestre) => trimestre.annee == annee);
}
```

### Extraction et Exclusion lors de la Soumission
```javascript
async planDeDecaissementActivite() {
  for (let index = 0; index < this.planDeDecaissement.length; index++) {
    // 1. Extraire année et trimestre de la valeur unique
    const trimestreValue = this.planDeDecaissement[index].trimestre;
    let annee, trimestre;
    
    if (typeof trimestreValue === 'string' && trimestreValue.includes('-')) {
      [annee, trimestre] = trimestreValue.split('-').map(Number);
    }

    // 2. Exclure anneeFiltre et préparer les données
    const { anneeFiltre, ...planDataWithoutFilter } = this.planDeDecaissement[index];
    const planData = {
      ...planDataWithoutFilter,
      annee: annee,        // Année extraite
      trimestre: trimestre // Trimestre extrait
    };

    // 3. Envoyer au backend
    await this.storePlanDecaissement(planData);
  }
}
```

## Avantages de cette Approche

### ✅ Meilleure UX
- Liste de trimestres plus courte et ciblée
- Navigation en deux étapes intuitive
- Moins de défilement nécessaire

### ✅ Données Cohérentes
- Une seule source de vérité : le champ `trimestre` au format "année-trimestre"
- Le champ `anneeFiltre` est clairement identifié comme un outil de filtrage UI
- Pas de confusion entre les champs

### ✅ Backend Propre
- Le backend reçoit des données simples et claires
- Pas de champs inutiles envoyés
- Format standard : `{annee: 2026, trimestre: 1}`

## Exemple Complet

### Scénario : Ajouter un plan pour T1 2026

1. **Utilisateur ouvre le modal**
   ```javascript
   plan = {
     anneeFiltre: 2026,      // Première année disponible
     trimestre: "2026-1",    // Premier trimestre de 2026
     budgetNational: 0,
     pret: 0
   }
   ```

2. **Utilisateur change l'année à 2025**
   ```javascript
   plan.anneeFiltre = 2025
   // La liste des trimestres se met à jour pour afficher uniquement 2025
   ```

3. **Utilisateur sélectionne T4 2025**
   ```javascript
   plan.trimestre = "2025-4"
   ```

4. **Utilisateur remplit les montants et soumet**
   ```javascript
   // Données envoyées au backend :
   {
     activiteId: "abc123",
     annee: 2025,           // ✅ Extrait de "2025-4"
     trimestre: 4,          // ✅ Extrait de "2025-4"
     budgetNational: 1000,
     pret: 2000
   }
   // anneeFiltre n'est PAS envoyé ✅
   ```

## Résumé

| Champ | Rôle | Envoyé au Backend |
|-------|------|-------------------|
| `anneeFiltre` | Filtrage de l'interface uniquement | ❌ Non |
| `trimestre` | Valeur réelle (format "année-trimestre") | ✅ Oui (après extraction) |
| `annee` (extrait) | Année extraite de `trimestre` | ✅ Oui |
| `trimestre` (extrait) | Trimestre extrait de `trimestre` | ✅ Oui |

Cette solution combine le meilleur des deux mondes :
- **Interface intuitive** avec filtrage par année
- **Données cohérentes** avec une seule source de vérité
- **Backend propre** avec des données simples et claires
