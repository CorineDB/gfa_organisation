# Historique des tâches - Affichage de la carte dans le dashboard organisation

## Date de début
2025-10-02

## Objectif global
Afficher une carte Leaflet dans le dashboard organisation avec les coordonnées des sites.

---

## Tâche 1 : Lecture du code existant ✅

### Ce qui a été fait
- Lecture du fichier `src\views\dashboard\projets\index.vue`
- Analyse du code autour de la ligne 170

### Contexte et observations

#### Structure du template (lignes 73-76)
```vue
<div>
  <div id="map" style="height: 40vh"></div>
</div>
```
- Une div avec l'id `map` est créée pour contenir la carte
- Hauteur définie à 40% de la viewport height

#### Imports Leaflet (lignes 88-98)
```javascript
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { LMap, LTileLayer, LMarker, LPolygon, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { addressPoints } from "./markerDemo";
import icon from "./icon.png";
import markerShadow from "./marker-shadow.png";
```

#### Initialisation de la carte (lignes 156-196)

**Configuration de l'icône personnalisée (lignes 159-167)**
```javascript
this.myIcon = L.icon({
  iconUrl: icon,
  iconSize: [30, 30],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowUrl: markerShadow,
  shadowSize: [60, 30],
  shadowAnchor: [22, 94],
});
```

**Initialisation de la carte - LIGNE 170**
```javascript
this.initialMap = L.map("map", {
  zoomControl: true,
  zoom: 1,
  zoomAnimation: false,
  fadeAnimation: true,
  markerZoomAnimation: true,
}).setView([6.8041, 2.4152], 6);
```
- **Position initiale** : `[6.8041, 2.4152]` (latitude, longitude) - coordonnées du Bénin
- **Zoom initial** : 6

**Ajout de la couche de tuiles OpenStreetMap (lignes 178-181)**
```javascript
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(this.initialMap);
```

**Ajout de marqueurs individuels (lignes 184-185)**
```javascript
L.marker([6.3746, 2.6004], { icon: this.myIcon }).addTo(this.initialMap);
L.marker([6.3752, 2.8349], { icon: this.myIcon }).addTo(this.initialMap);
```

**Utilisation de MarkerCluster (lignes 188-196)**
```javascript
const markers = L.markerClusterGroup();

addressPoints.forEach((element, index) => {
  const each_marker = new L.marker([element.latitude, element.longitude], { icon: this.myIcon })
    .bindPopup(`<strong> Hello Bangladesh! </strong> <br> I am a popup number ${index}`);
  markers.addLayer(each_marker);
});

this.initialMap.addLayer(markers);
```

#### Méthode de préparation des coordonnées (lignes 143-154)
Une méthode `prepareCoordinatesData()` existe déjà pour transformer les sites en coordonnées :
```javascript
prepareCoordinatesData() {
  if (!this.sites || !Array.isArray(this.sites)) {
    return [];
  }

  return this.sites.map((site) => ({
    lat: parseFloat(site.latitude),
    lng: parseFloat(site.longitude),
    label: `${site.nom}<br>Quartier: ${site.quartier}<br>Commune: ${site.commune}`,
  }));
}
```

#### Données disponibles
```javascript
data() {
  return {
    initialMap: null,
    myIcon: null,
    sites: [],  // ← Tableau qui devrait contenir les sites avec coordonnées
    // ... autres données
  };
}
```

### Conclusions de la tâche 1
1. **Leaflet est déjà configuré** avec une carte fonctionnelle
2. **MarkerCluster est utilisé** pour regrouper les marqueurs
3. **Une méthode existe déjà** pour préparer les coordonnées depuis `this.sites`
4. **Les sites ne semblent pas être chargés** - le tableau `sites` est vide par défaut
5. **Coordonnées de démonstration** utilisent `addressPoints` importé depuis `./markerDemo`

---

## Tâche 2 : Explication du fonctionnement de Leaflet ✅

### Qu'est-ce que Leaflet ?

**Leaflet** est une bibliothèque JavaScript open-source pour créer des cartes interactives sur le web. Elle est légère (~42KB), performante et facile à utiliser.

### Concepts principaux

#### 1. **La carte (Map)**
```javascript
L.map("map", options).setView([latitude, longitude], zoom)
```
- `L.map("id_div")` : Crée une carte dans l'élément HTML avec l'id spécifié
- `.setView([lat, lng], zoom)` : Définit le centre et le niveau de zoom initial
- **Options** :
  - `zoomControl: true` - Affiche les boutons +/- pour zoomer
  - `zoom: 1` - Niveau de zoom par défaut
  - `zoomAnimation: false` - Désactive l'animation du zoom
  - `fadeAnimation: true` - Active le fondu des tuiles
  - `markerZoomAnimation: true` - Anime les marqueurs lors du zoom

#### 2. **Les tuiles (Tiles / TileLayer)**
```javascript
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map)
```
- Les tuiles sont les "images" qui composent la carte
- Elles sont téléchargées depuis un serveur (ici OpenStreetMap)
- `{z}/{x}/{y}` : paramètres pour le zoom et la position
- `maxZoom: 19` : niveau de zoom maximum autorisé

#### 3. **Les marqueurs (Markers)**
```javascript
L.marker([latitude, longitude], { icon: customIcon })
  .addTo(map)
  .bindPopup("Contenu de la popup")
```
- Représentent un point sur la carte
- Peuvent avoir une icône personnalisée
- Peuvent afficher une popup au clic

#### 4. **Les icônes personnalisées**
```javascript
L.icon({
  iconUrl: 'chemin/vers/image.png',
  iconSize: [30, 30],        // taille de l'icône [largeur, hauteur]
  iconAnchor: [15, 30],       // point d'ancrage (où pointe l'icône)
  popupAnchor: [0, -30],      // où la popup s'ouvre par rapport à l'icône
  shadowUrl: 'chemin/vers/ombre.png',
  shadowSize: [40, 40]
})
```

#### 5. **MarkerCluster** (plugin)
```javascript
const markers = L.markerClusterGroup();
markers.addLayer(marker1);
markers.addLayer(marker2);
map.addLayer(markers);
```
- **Problème** : Trop de marqueurs rendent la carte illisible
- **Solution** : MarkerCluster regroupe les marqueurs proches en clusters
- Quand on zoome, les clusters se divisent pour montrer les marqueurs individuels
- Affiche le nombre de marqueurs dans chaque cluster

#### 6. **Les popups**
```javascript
marker.bindPopup("<h3>Titre</h3><p>Description</p>")
```
- Fenêtre qui s'ouvre au clic sur un marqueur
- Peut contenir du HTML

### Fonctionnement dans le code actuel

#### Flux d'exécution (mounted hook)

1. **Création de l'icône personnalisée**
   ```javascript
   this.myIcon = L.icon({ ... })
   ```

2. **Initialisation de la carte**
   ```javascript
   this.initialMap = L.map("map").setView([6.8041, 2.4152], 6)
   ```
   - Centre sur le Bénin
   - Zoom niveau 6

3. **Ajout de la couche OpenStreetMap**
   ```javascript
   L.tileLayer("https://...").addTo(this.initialMap)
   ```

4. **Ajout de 2 marqueurs individuels**
   ```javascript
   L.marker([6.3746, 2.6004], { icon: this.myIcon }).addTo(this.initialMap)
   L.marker([6.3752, 2.8349], { icon: this.myIcon }).addTo(this.initialMap)
   ```

5. **Création d'un groupe de clusters**
   ```javascript
   const markers = L.markerClusterGroup()
   ```

6. **Ajout de marqueurs depuis addressPoints**
   ```javascript
   addressPoints.forEach((element) => {
     const marker = L.marker([element.latitude, element.longitude])
       .bindPopup("Hello Bangladesh!")
     markers.addLayer(marker)
   })
   ```

7. **Ajout du groupe de clusters à la carte**
   ```javascript
   this.initialMap.addLayer(markers)
   ```

### Système de coordonnées

- **Latitude** : -90° (pôle Sud) à +90° (pôle Nord)
- **Longitude** : -180° (ouest) à +180° (est)
- Format : `[latitude, longitude]`
- Exemple Bénin : `[6.8041, 2.4152]`

### Niveau de zoom

- **0** : Vue du monde entier
- **6** : Vue d'un pays (utilisé actuellement)
- **10** : Vue d'une ville
- **15** : Vue d'un quartier
- **19** : Vue très détaillée (maximum dans le code actuel)

### Points clés pour notre implémentation

1. La carte doit être initialisée dans le hook `mounted()` (après le rendu du DOM)
2. L'élément HTML doit exister avec l'id correspondant
3. Les coordonnées sont au format `[latitude, longitude]`
4. MarkerCluster améliore les performances avec beaucoup de marqueurs
5. Les popups permettent d'afficher des informations sur chaque site

---

## Tâche 3 : Afficher une carte avec un seul marqueur ✅

### Ce qui a été fait
- Modification du fichier `src\views\dashboard\Dashboard.vue`
- Simplification du code pour afficher un seul marqueur au lieu de MarkerCluster

### Fichier modifié
`src\views\dashboard\Dashboard.vue` (lignes 511-530)

### Modifications apportées

#### Avant (code avec MarkerCluster)
```javascript
// Initialiser la carte
initialMap.value = L.map("map", {
  zoomControl: true,
  zoom: 1,
  zoomAnimation: false,
  fadeAnimation: true,
  markerZoomAnimation: true,
}).setView([6.8041, 2.4152], 6);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(initialMap.value);

// Ajouter des marqueurs seulement si des sites existent
if (graphiqueData.value?.sites?.length > 0) {
  const markers = L.markerClusterGroup();

  graphiqueData.value.sites.forEach((site) => {
    const marker = new L.marker([parseFloat(site.latitude), parseFloat(site.longitude)], { icon: myIcon.value });
    markers.addLayer(marker);
  });

  initialMap.value.addLayer(markers);
}
```

#### Après (code avec un seul marqueur)
```javascript
// Initialiser la carte
initialMap.value = L.map("map", {
  zoomControl: true,
  zoom: 1,
  zoomAnimation: false,
  fadeAnimation: true,
  markerZoomAnimation: true,
}).setView([6.8041, 2.4152], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(initialMap.value);

// Afficher un seul marqueur pour tester
const singleMarker = L.marker([6.8041, 2.4152], { icon: myIcon.value })
  .addTo(initialMap.value)
  .bindPopup("<strong>Point de test</strong><br>Cotonou, Bénin");

singleMarker.openPopup();
```

### Changements clés

1. **Zoom augmenté** : De `6` à `10` pour une vue plus rapprochée de la ville
2. **Suppression de MarkerCluster** : Plus besoin de gérer plusieurs marqueurs
3. **Un seul marqueur** : Placé à `[6.8041, 2.4152]` (Cotonou, Bénin)
4. **Popup ajoutée** :
   - Contenu HTML : `"<strong>Point de test</strong><br>Cotonou, Bénin"`
   - Ouverte automatiquement avec `.openPopup()`
5. **Suppression de la condition** : Plus besoin de vérifier `graphiqueData.value?.sites?.length`

### Résultat attendu
- La carte s'affiche centrée sur Cotonou
- Un seul marqueur est visible avec l'icône personnalisée
- Une popup s'ouvre automatiquement au chargement
- La popup affiche "Point de test" et "Cotonou, Bénin"

### Contexte technique
- **Fichier** : `src\views\dashboard\Dashboard.vue`
- **Fonction** : `getStat()` - appelée dans `onMounted()`
- **Élément HTML** : `<div id="map" class="h-48 mb-4 bg-gray-200 rounded-md"></div>` (ligne 164)
- **Condition d'affichage** : La section carte n'est visible que si `graphiqueData.value?.sites?.length > 0` (ligne 158)

### Note importante
⚠️ La section contenant la carte (ligne 158) a une condition `v-if="graphiqueData?.sites?.length > 0"`.
Pour voir la carte, il faut que le tableau `sites` contienne au moins un élément dans les données retournées par l'API.

### Mise à jour importante
Suite à une demande de changement, cette implémentation a été abandonnée au profit d'une nouvelle carte créée en bas de la page (voir Tâche 3 - Version 2).

---

## Tâche 3 - Version 2 : Création d'une nouvelle carte en bas de page ✅

### Ce qui a été fait
- Création d'une nouvelle section "Carte des Sites" en bas de la page
- Nouvelle carte indépendante avec l'id `mapOrganisation`
- Affichage d'un seul marqueur de test

### Fichier modifié
`src\views\dashboard\Dashboard.vue`

### Modifications apportées

#### 1. Ajout d'une nouvelle section dans le template (lignes 233-237)
```vue
<!-- Nouvelle section pour la carte -->
<section class="p-6 mt-6 bg-white rounded-md shadow-md">
  <h2 class="mb-4 text-lg font-semibold text-gray-700">Carte des Sites</h2>
  <div id="mapOrganisation" style="height: 50vh" class="rounded-md"></div>
</section>
```

**Caractéristiques :**
- Section placée après "Suivi Indicateurs" (tout en bas de la page)
- Hauteur de 50vh (50% de la hauteur de la fenêtre)
- ID unique : `mapOrganisation` (différent de l'ancienne carte `map`)
- Pas de condition `v-if` - la carte s'affiche toujours

#### 2. Ajout d'une variable pour la nouvelle carte (ligne 486)
```javascript
const mapOrganisation = ref(null);
```

#### 3. Création d'une fonction d'initialisation (lignes 546-582)
```javascript
// Fonction pour initialiser la nouvelle carte organisation
const initMapOrganisation = () => {
  // Initialiser l'icône si elle n'existe pas encore
  if (!myIcon.value) {
    myIcon.value = L.icon({
      iconUrl: icon,
      iconSize: [30, 30],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowUrl: markerShadow,
      shadowSize: [60, 30],
      shadowAnchor: [22, 94],
    });
  }

  // Initialiser la carte organisation
  mapOrganisation.value = L.map("mapOrganisation", {
    zoomControl: true,
    zoom: 1,
    zoomAnimation: false,
    fadeAnimation: true,
    markerZoomAnimation: true,
  }).setView([6.8041, 2.4152], 10);

  // Ajouter la couche de tuiles OpenStreetMap
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapOrganisation.value);

  // Afficher un seul marqueur pour tester
  const singleMarker = L.marker([6.8041, 2.4152], { icon: myIcon.value })
    .addTo(mapOrganisation.value)
    .bindPopup("<strong>Point de test</strong><br>Cotonou, Bénin");

  singleMarker.openPopup();
};
```

#### 4. Appel de la fonction dans onMounted (lignes 584-588)
```javascript
onMounted(() => {
  getStat();
  getcurrentUser();
  initMapOrganisation();
});
```

### Avantages de cette nouvelle implémentation

1. **Indépendance** : Nouvelle carte séparée de l'ancienne
2. **Toujours visible** : Pas de condition v-if, la carte s'affiche toujours
3. **Position claire** : En bas de page après toutes les sections
4. **Code modulaire** : Fonction dédiée `initMapOrganisation()`
5. **Réutilisation de l'icône** : Utilise `myIcon` si déjà initialisée

### Résultat attendu
- Une nouvelle section "Carte des Sites" apparaît en bas de la page
- La carte affiche un marqueur sur Cotonou, Bénin
- Une popup s'ouvre automatiquement avec "Point de test"
- Zoom niveau 10 (vue rapprochée de la ville)

---

## Tâche 4 : Récupérer le tableau des coordonnées et afficher tous les sites ✅

### Ce qui a été fait
- Récupération des données depuis `graphiqueData.sites`
- Modification de la fonction `initMapOrganisation()` pour parcourir tous les sites
- Affichage de tous les marqueurs avec leurs informations
- Gestion des cas où aucun site n'est disponible

### Structure des données

Chaque site dans `graphiqueData.sites` a la structure suivante (exemple de `src\data2.json`) :
```json
{
  "id": "PrAJaL1KZ0ADkN61X43ovVY7aPKBeE5aL3WjlQ2RdJMpLxgyzmrnwqG98g0lzdm6",
  "nom": "site a projet 1",
  "longitude": 2.402229,
  "latitude": 6.367676,
  "quartier": "HAKOUE",
  "arrondissement": "AVLO",
  "commune": "GRAND-POPO",
  "departement": "MONO",
  "pays": "Bénin"
}
```

### Modifications apportées

#### 1. Modification de `initMapOrganisation()` (lignes 547-610)
```javascript
// Fonction pour initialiser la nouvelle carte organisation
const initMapOrganisation = () => {
  // Initialiser l'icône si elle n'existe pas encore
  if (!myIcon.value) {
    myIcon.value = L.icon({
      iconUrl: icon,
      iconSize: [30, 30],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowUrl: markerShadow,
      shadowSize: [60, 30],
      shadowAnchor: [22, 94],
    });
  }

  // Initialiser la carte organisation
  mapOrganisation.value = L.map("mapOrganisation", {
    zoomControl: true,
    zoom: 1,
    zoomAnimation: false,
    fadeAnimation: true,
    markerZoomAnimation: true,
  }).setView([6.8041, 2.4152], 8);  // Zoom 8 pour voir plusieurs sites

  // Ajouter la couche de tuiles OpenStreetMap
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapOrganisation.value);

  // Récupérer et afficher tous les sites
  if (graphiqueData.value?.sites && graphiqueData.value.sites.length > 0) {
    console.log("Nombre de sites trouvés:", graphiqueData.value.sites.length);

    graphiqueData.value.sites.forEach((site) => {
      const lat = parseFloat(site.latitude);
      const lng = parseFloat(site.longitude);

      // Vérifier que les coordonnées sont valides
      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng], { icon: myIcon.value })
          .addTo(mapOrganisation.value)
          .bindPopup(`
            <strong>${site.nom}</strong><br>
            Quartier: ${site.quartier || 'N/A'}<br>
            Commune: ${site.commune || 'N/A'}<br>
            Département: ${site.departement || 'N/A'}<br>
            <em>Lat: ${lat}, Lng: ${lng}</em>
          `);
      }
    });
  } else {
    console.log("Aucun site disponible dans graphiqueData.sites");
    // Afficher un marqueur par défaut si pas de sites
    L.marker([6.8041, 2.4152], { icon: myIcon.value })
      .addTo(mapOrganisation.value)
      .bindPopup("<strong>Aucun site disponible</strong><br>Position par défaut: Cotonou, Bénin");
  }
};
```

#### 2. Appel de `initMapOrganisation()` après le chargement des données (ligne 543)
```javascript
ProjetService.statistiques(ongId)
  .then((data) => {
    graphiqueData.value = data.data.data;
    console.log("Données chargées:", graphiqueData.value);
    initTabulator();

    // ... initialisation de l'icône et de la première carte ...

    // Initialiser la nouvelle carte organisation après le chargement des données
    initMapOrganisation();
  })
  .catch((error) => {
    console.log(error);
  });
```

#### 3. Suppression de l'appel dans `onMounted()` (lignes 612-615)
**Avant :**
```javascript
onMounted(() => {
  getStat();
  getcurrentUser();
  initMapOrganisation(); // ❌ Appelé trop tôt, avant le chargement des données
});
```

**Après :**
```javascript
onMounted(() => {
  getStat();
  getcurrentUser();
  // initMapOrganisation() est maintenant appelé dans getStat() après le chargement
});
```

### Fonctionnement du code

1. **Chargement de la page** : `onMounted()` appelle `getStat()`
2. **Récupération des données** : `ProjetService.statistiques()` charge `graphiqueData`
3. **Initialisation de la carte** : Une fois les données chargées, `initMapOrganisation()` est appelé
4. **Parcours des sites** :
   - Vérifie si `graphiqueData.sites` existe et contient des éléments
   - Pour chaque site, extrait `latitude` et `longitude`
   - Valide les coordonnées (vérifie que ce ne sont pas des `NaN`)
   - Crée un marqueur avec une popup contenant les informations du site
5. **Cas spécial** : Si aucun site n'est disponible, affiche un marqueur par défaut sur Cotonou

### Informations affichées dans les popups

Pour chaque site :
- **Nom** en gras
- **Quartier**
- **Commune**
- **Département**
- **Coordonnées** (latitude, longitude) en italique

### Changements clés

1. **Zoom ajusté** : De 10 à 8 pour voir plusieurs sites à la fois
2. **Boucle forEach** : Parcourt tous les sites dans `graphiqueData.sites`
3. **Validation** : Vérifie que les coordonnées sont des nombres valides
4. **Popups personnalisées** : Affiche les informations de chaque site
5. **Gestion d'erreur** : Affiche un marqueur par défaut si pas de sites
6. **Console logs** : Affiche le nombre de sites trouvés pour le débogage

### Timing d'exécution

```
onMounted()
  ↓
getStat()
  ↓
ProjetService.statistiques()
  ↓
.then((data) => {
  graphiqueData.value = data.data.data
  ↓
  initMapOrganisation()  ← Appelé ici après chargement des données
})
```

### Résultat attendu

- Tous les sites de `graphiqueData.sites` sont affichés sur la carte
- Chaque site a un marqueur avec l'icône personnalisée
- Au clic sur un marqueur, une popup affiche les informations du site
- La carte est centrée sur le Bénin avec un zoom permettant de voir plusieurs sites
- Console affiche le nombre de sites chargés

---

---

## Correction : Erreur "Map container not found" ✅

### Problème rencontré
```
Error: Map container not found.
    at NewClass._initContainer (chunk-BTR332JE.js?v=402b7dfa:2254:19)
    at Dashboard.vue:522:32
```

### Cause
L'élément DOM `<div id="mapOrganisation">` n'était pas encore rendu dans le DOM quand `initMapOrganisation()` était appelé, même après le chargement des données.

### Solution appliquée

#### 1. Import de `nextTick` (ligne 244)
```javascript
import { ref, onMounted, computed, reactive, watch, nextTick } from "vue";
```

#### 2. Utilisation de `nextTick()` avant l'initialisation (lignes 542-546)
**Avant :**
```javascript
// Initialiser la nouvelle carte organisation après le chargement des données
initMapOrganisation();
```

**Après :**
```javascript
// Initialiser la nouvelle carte organisation après le chargement des données
// Utiliser nextTick pour attendre que le DOM soit rendu
nextTick(() => {
  initMapOrganisation();
});
```

### Explication technique

**Qu'est-ce que `nextTick` ?**
- `nextTick` est une fonction Vue qui attend le prochain cycle de mise à jour du DOM
- Garantit que tous les changements réactifs sont appliqués et le DOM est mis à jour
- Permet d'accéder aux éléments DOM qui viennent d'être créés

**Pourquoi c'était nécessaire ici ?**
1. Les données `graphiqueData.value` sont mises à jour dans le `.then()`
2. Vue planifie la mise à jour du DOM mais ne l'exécute pas immédiatement
3. Sans `nextTick`, `L.map("mapOrganisation")` s'exécute avant que l'élément ne soit dans le DOM
4. Avec `nextTick`, on attend que Vue ait fini de mettre à jour le DOM

**Flux d'exécution corrigé :**
```
ProjetService.statistiques()
  ↓
.then((data) => {
  graphiqueData.value = data.data.data  ← Mise à jour des données
  ↓
  Vue planifie la mise à jour du DOM
  ↓
  nextTick(() => {  ← Attend que le DOM soit mis à jour
    ↓
    L.map("mapOrganisation")  ← L'élément existe maintenant !
  })
})
```

### Résultat
- L'erreur "Map container not found" est résolue
- La carte s'initialise correctement après le rendu du DOM
- Tous les sites s'affichent avec leurs marqueurs

---

## Tâches terminées
- ✅ Tâche 1 : Lecture du code existant
- ✅ Tâche 2 : Explication du fonctionnement de Leaflet
- ✅ Tâche 3 : Afficher une carte avec un seul marqueur (Version 2)
- ✅ Tâche 4 : Récupérer le tableau des coordonnées et afficher tous les sites
- ✅ Correction : Résolution de l'erreur "Map container not found"
