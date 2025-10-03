# Documentation des Modifications - Fonction getInfoActivite

**Date:** 2025-10-02
**Fichier modifié:** `src\views\dashboard\projets\activites-globale\index.vue`
**Ligne:** 357-407
**Type de modification:** Enrichissement de fonction existante

---

## Contexte

La fonction `getInfoActivite` dans le fichier `index.vue` était incomplète par rapport à sa version dans `index copy.vue`. Elle ne récupérait que les valeurs TEP (Taux d'Exécution Physique) et TEF (Taux d'Exécution Financière) sans traiter les informations essentielles pour la gestion des plans de décaissement.

## Problème Identifié

### Avant modification (version incomplète)
```javascript
getInfoActivite(id) {
  if (id !== null || id !== "") {
    ActiviteService.get(id)
      .then((response) => {
        console.log(response.data.data);
        this.activiteTep = response.data.data.tep;
        this.activiteTef = response.data.data.tef;
        console.log("this.activiteTep ", this.activiteTep);
        console.log("this.activiteTef ", this.activiteTef);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
```

**Limitations:**
- Ne récupère pas la durée de l'activité
- Ne calcule pas les trimestres de planification
- Ne gère pas les prolongations d'activités
- Ne calcule pas les années disponibles pour les plans
- Ne calcule pas le montant total à décaisser

## Solution Implémentée

### Après modification (version complète)
La fonction a été enrichie pour inclure tous les traitements nécessaires à la gestion complète des plans de décaissement.

### Nouvelles fonctionnalités ajoutées:

#### 1. **Récupération de la durée de l'activité**
```javascript
this.dureeActivite = {
  debut: response.data.data.debut,
  fin: response.data.data.fin,
};
```
- Stocke les dates de début et fin de l'activité
- Utilisé pour l'affichage et la validation des plans de décaissement

#### 2. **Calcul des trimestres de base**
```javascript
this.trimestres = this.getQuartersInDuration(response.data.data.debut, response.data.data.fin);
```
- Génère automatiquement tous les trimestres entre la date de début et de fin
- Utilise la fonction helper `getQuartersInDuration`
- Retourne un tableau d'objets: `{trimestre: number, value: number, annee: number}`

#### 3. **Gestion des prolongations (durees)**
```javascript
if (response.data.data.durees && response.data.data.durees.length) {
  this.plageDureeActivite = response.data.data.durees;

  this.plageDureeActivite.forEach((duree) => {
    const quartersInDuree = this.getQuartersInDuration(duree.debut, duree.fin);

    quartersInDuree.forEach((quarter) => {
      const exists = this.trimestres.some((t) => t.trimestre === quarter.trimestre);
      if (!exists) {
        this.trimestres.push(quarter);
      }
    });
  });

  this.trimestres.sort((a, b) => a.trimestre - b.trimestre);
}
```
- Récupère les périodes de prolongation de l'activité
- Calcule les trimestres pour chaque prolongation
- Fusionne intelligemment avec les trimestres de base (évite les doublons)
- Trie les trimestres par ordre chronologique

#### 4. **Extraction des années uniques**
```javascript
const anneesUniques = [...new Set(this.trimestres.map((t) => t.annee))];
this.trimestreYears = anneesUniques.sort((a, b) => a - b);
```
- Extrait toutes les années uniques des trimestres disponibles
- Utilisé pour filtrer les trimestres par année dans l'interface
- Facilite la navigation dans les plans de décaissement multi-années

#### 5. **Calcul du montant total à décaisser**
```javascript
this.montantADecaisser = response.data.data.pret + response.data.data.budgetNational;
```
- Somme du prêt (subvention) et du budget national (fonds propres)
- Montant de référence pour valider les plans de décaissement
- Permet de calculer le montant restant à planifier

#### 6. **Correction de la condition**
```javascript
// AVANT: if (id !== null || id !== "") - logique incorrecte (toujours vraie)
// APRÈS: if (id !== null && id !== "") - logique correcte
```

## Variables d'état mises à jour

| Variable | Type | Description |
|----------|------|-------------|
| `dureeActivite` | Object | `{debut: Date, fin: Date}` - Période principale de l'activité |
| `trimestres` | Array | Liste complète des trimestres (base + prolongations) |
| `plageDureeActivite` | Array | Périodes de prolongation de l'activité |
| `trimestreYears` | Array | Années uniques extraites des trimestres |
| `montantADecaisser` | Number | Montant total à planifier (subvention + fonds propres) |
| `activiteTep` | Number | Taux d'exécution physique (inchangé) |
| `activiteTef` | Number | Taux d'exécution financière (inchangé) |

## Impact sur l'application

### Composants/fonctionnalités affectés:
1. **Plan de décaissement** - Peut maintenant afficher correctement tous les trimestres disponibles
2. **Filtrage par année** - Fonctionne avec `trimestreYears`
3. **Validation des montants** - Utilise `montantADecaisser`
4. **Affichage de la durée** - Utilise `dureeActivite`
5. **Gestion des prolongations** - Affiche `plageDureeActivite`

### Où cette fonction est appelée:
- Lors de la sélection d'une activité dans le composant de plan de décaissement
- Au chargement des statistiques d'une activité
- Via l'événement `@change` sur le sélecteur d'activité (ligne 1087 du template)

## Tests recommandés

1. ✅ Sélectionner une activité sans prolongation → Vérifier que les trimestres sont corrects
2. ✅ Sélectionner une activité avec prolongation → Vérifier la fusion des trimestres
3. ✅ Vérifier que `trimestreYears` contient les bonnes années
4. ✅ Vérifier que `montantADecaisser` = subvention + fonds propres
5. ✅ Tester le plan de décaissement avec les nouveaux trimestres
6. ✅ Vérifier l'affichage des statistiques TEP/TEF (inchangé)

## Fichiers liés

- **Source de référence:** `src\views\dashboard\projets\activites-globale\index copy.vue:306-356`
- **Fichier modifié:** `src\views\dashboard\projets\activites-globale\index.vue:357-407`
- **Service API:** `src\services\modules\activite.service.js` (méthode `get(id)`)
- **Composant enfant:** `src\components\PlanDecaissement.vue`

## Notes pour les développeurs

- Cette modification aligne `index.vue` avec `index copy.vue`
- La logique est identique, seule la condition initiale a été corrigée (`&&` au lieu de `||`)
- Les variables d'état doivent être initialisées dans `data()` du composant
- La fonction `getQuartersInDuration` doit être disponible dans les méthodes

## Auteur de la modification

Modification effectuée pour synchroniser la logique de gestion des trimestres et des plans de décaissement.

---

**Fin de documentation**
