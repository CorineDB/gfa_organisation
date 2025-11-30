# 📱 Validation du numéro de téléphone - Documentation technique

## 🎯 Vue d'ensemble

Le système de validation du numéro de téléphone dans `EvaluationFactuel.vue` utilise **deux niveaux de validation** pour garantir que les numéros sont valides et conformes aux standards internationaux.

---

## 🔍 Qu'est-ce qui permet de dire qu'un numéro de téléphone est valide ?

### 1️⃣ Validation en temps réel (affichage visuel)

**Variable** : `isValid` (computed property)  
**Emplacement** : Lignes 20-36  
**Affichage** : Lignes 1461-1472

#### Code de validation
```javascript
const isValid = computed(() => {
  // Convertir en chaîne et supprimer les espaces
  const contactValue = currentMember.value.contact ? String(currentMember.value.contact).trim() : "";
  
  // Vérifier que le contact n'est pas vide
  if (!contactValue) {
    return false;
  }
  
  // Vérifier que le contact contient entre 8 et 13 chiffres
  if (!/^\d{8,13}$/.test(contactValue)) {
    return false;
  }
  
  // Vérifier avec libphonenumber-js pour le format du pays (BJ = Bénin)
  return proxy.$isValidPhoneNumber(contactValue, "BJ");
});
```

#### Critères de validation (3 conditions TOUTES requises)

| # | Condition | Description | Exemple valide | Exemple invalide |
|---|-----------|-------------|----------------|------------------|
| 1 | **Non vide** | Le contact ne doit pas être vide ou uniquement des espaces | `"97123456"` | `""` ou `"   "` |
| 2 | **Longueur 8-13 chiffres** | Le contact doit contenir entre 8 et 13 chiffres uniquement | `"97123456"` (8) ou `"22997123456"` (11) | `"123"` (trop court) ou `"12345abc"` (lettres) |
| 3 | **Format Bénin valide** | Le numéro doit être valide selon les règles du Bénin (libphonenumber-js) | `"97123456"` ou `"22997123456"` | `"00000000"` |

#### Affichage visuel

```vue
<!-- Si valide : affiche un message vert avec icône ✓ -->
<p v-if="isValid" class="flex items-center text-green-600 font-medium text-sm animate-pulse">
  <svg>...</svg>
  Numéro valide
</p>

<!-- Si invalide : affiche un message rouge avec icône ✗ -->
<p v-else-if="currentMember.contact && currentMember.contact.length > 0" 
   class="flex items-center text-red-500 font-medium text-sm">
  <svg>...</svg>
  Numéro invalide
</p>
```

---

### 2️⃣ Validation lors de la soumission (formulaire)

**Fonction** : `validateMemberForm()`  
**Emplacement** : Lignes 365-386  
**Déclenchement** : Lors de l'ajout d'un membre

#### Code de validation
```javascript
function validateMemberForm() {
  memberFormErrors.value = {};

  // ... validation nom et prénom ...

  // Ensure contact is treated as a string for validation
  const contactValue = currentMember.value.contact ? String(currentMember.value.contact).trim() : "";

  if (!contactValue) {
    memberFormErrors.value.contact = ["Le contact est requis."];
  } else if (!/^\d{8,13}$/.test(contactValue)) {
    memberFormErrors.value.contact = ["Le contact doit contenir entre 8 et 13 chiffres."];
  }

  return Object.keys(memberFormErrors.value).length === 0;
}
```

#### Critères de validation (2 conditions)

| # | Condition | Message d'erreur | Exemple invalide |
|---|-----------|------------------|------------------|
| 1 | **Non vide** | "Le contact est requis." | `""` ou `"   "` |
| 2 | **Longueur 8-13 chiffres** | "Le contact doit contenir entre 8 et 13 chiffres." | `"123"` ou `"12345abc"` |

**Note** : Cette validation ne vérifie PAS le format du pays (libphonenumber-js), seulement la longueur et le format numérique.

---

## 🔄 Différences entre les deux validations

| Aspect | `isValid` (temps réel) | `validateMemberForm()` (soumission) |
|--------|------------------------|-------------------------------------|
| **Quand** | En temps réel pendant la saisie | Lors du clic sur "Ajouter" |
| **Affichage** | Message visuel vert/rouge | Message d'erreur sous le champ |
| **Validation libphonenumber-js** | ✅ OUI | ❌ NON |
| **Validation longueur 8-13** | ✅ OUI | ✅ OUI |
| **Validation non vide** | ✅ OUI | ✅ OUI |
| **Stricte** | Plus stricte (3 conditions) | Moins stricte (2 conditions) |

---

## 📚 Bibliothèque utilisée : libphonenumber-js

### Installation
```json
// package.json
{
  "dependencies": {
    "libphonenumber-js": "^1.12.9"
  }
}
```

### Configuration
**Fichier** : `/src/plugins/phoneValidator.js`

```javascript
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

export default {
  install(app) {
    app.config.globalProperties.$isValidPhoneNumber = isValidPhoneNumber;
    app.config.globalProperties.$parsePhoneNumber = parsePhoneNumber;
  }
};
```

### Utilisation
```javascript
// Vérifier si un numéro est valide pour le Bénin
proxy.$isValidPhoneNumber("97123456", "BJ"); // true ou false
```

### Formats de numéros valides pour le Bénin (BJ)

| Format | Exemple | Valide ? |
|--------|---------|----------|
| **8 chiffres** | `97123456` | ✅ |
| **11 chiffres avec indicatif** | `22997123456` | ✅ |
| **Avec espaces** | `97 12 34 56` | ❌ (rejeté par regex) |
| **Avec +** | `+22997123456` | ❌ (rejeté par regex) |
| **Avec tirets** | `97-12-34-56` | ❌ (rejeté par regex) |

---

## 🎯 Exemples concrets

### Exemple 1 : Numéro valide (8 chiffres)
```javascript
// Entrée utilisateur
currentMember.contact = "97123456";

// Validation isValid
// ✅ Non vide : true
// ✅ 8-13 chiffres : true (8 chiffres)
// ✅ Format BJ : true
// Résultat : isValid = true → Affiche "Numéro valide" en vert

// Validation validateMemberForm
// ✅ Non vide : true
// ✅ 8-13 chiffres : true
// Résultat : Aucune erreur
```

### Exemple 2 : Numéro valide (11 chiffres avec indicatif)
```javascript
// Entrée utilisateur
currentMember.contact = "22997123456";

// Validation isValid
// ✅ Non vide : true
// ✅ 8-13 chiffres : true (11 chiffres)
// ✅ Format BJ : true
// Résultat : isValid = true → Affiche "Numéro valide" en vert

// Validation validateMemberForm
// ✅ Non vide : true
// ✅ 8-13 chiffres : true
// Résultat : Aucune erreur
```

### Exemple 3 : Numéro invalide (trop court)
```javascript
// Entrée utilisateur
currentMember.contact = "123";

// Validation isValid
// ✅ Non vide : true
// ❌ 8-13 chiffres : false (seulement 3 chiffres)
// Résultat : isValid = false → Affiche "Numéro invalide" en rouge

// Validation validateMemberForm
// ✅ Non vide : true
// ❌ 8-13 chiffres : false
// Résultat : Erreur "Le contact doit contenir entre 8 et 13 chiffres."
```

### Exemple 4 : Numéro avec espaces (trim appliqué)
```javascript
// Entrée utilisateur
currentMember.contact = "  97123456  ";

// Après trim
contactValue = "97123456";

// Validation isValid
// ✅ Non vide : true
// ✅ 8-13 chiffres : true
// ✅ Format BJ : true
// Résultat : isValid = true → Affiche "Numéro valide" en vert
```

### Exemple 5 : Numéro avec lettres
```javascript
// Entrée utilisateur
currentMember.contact = "9712345a";

// Validation isValid
// ✅ Non vide : true
// ❌ 8-13 chiffres : false (contient une lettre)
// Résultat : isValid = false → Affiche "Numéro invalide" en rouge

// Validation validateMemberForm
// ✅ Non vide : true
// ❌ 8-13 chiffres : false
// Résultat : Erreur "Le contact doit contenir entre 8 et 13 chiffres."
```

### Exemple 6 : Numéro vide
```javascript
// Entrée utilisateur
currentMember.contact = "";

// Validation isValid
// ❌ Non vide : false
// Résultat : isValid = false → Aucun message affiché

// Validation validateMemberForm
// ❌ Non vide : false
// Résultat : Erreur "Le contact est requis."
```

---

## 🔧 Expression régulière utilisée

### Pattern : `/^\d{8,13}$/`

**Décomposition** :
- `^` : Début de la chaîne
- `\d` : Un chiffre (0-9)
- `{8,13}` : Entre 8 et 13 fois
- `$` : Fin de la chaîne

**Signification** : La chaîne doit contenir UNIQUEMENT entre 8 et 13 chiffres, rien d'autre.

**Exemples** :
- ✅ `"12345678"` (8 chiffres)
- ✅ `"123456789"` (9 chiffres)
- ✅ `"1234567890123"` (13 chiffres)
- ❌ `"1234567"` (7 chiffres - trop court)
- ❌ `"12345678901234"` (14 chiffres - trop long)
- ❌ `"12345abc"` (contient des lettres)
- ❌ `"123 456 789"` (contient des espaces)
- ❌ `"+22997123456"` (contient un +)

---

## 🎨 Interface utilisateur

### Affichage en temps réel

```
┌─────────────────────────────────────┐
│ Numéro de téléphone                 │
│ ┌─────────────────────────────────┐ │
│ │ 97123456                        │ │
│ └─────────────────────────────────┘ │
│ Ecrivez le numéro directement...    │
│                                     │
│ ✓ Numéro valide                     │ ← Vert si isValid = true
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Numéro de téléphone                 │
│ ┌─────────────────────────────────┐ │
│ │ 123                             │ │
│ └─────────────────────────────────┘ │
│ Ecrivez le numéro directement...    │
│                                     │
│ ✗ Numéro invalide                   │ ← Rouge si isValid = false
└─────────────────────────────────────┘
```

### Affichage des erreurs de validation

```
┌─────────────────────────────────────┐
│ Numéro de téléphone                 │
│ ┌─────────────────────────────────┐ │
│ │ 123                             │ │
│ └─────────────────────────────────┘ │
│ Le contact doit contenir entre 8    │ ← Message d'erreur rouge
│ et 13 chiffres.                     │
│                                     │
│ Ecrivez le numéro directement...    │
│                                     │
│ ✗ Numéro invalide                   │
└─────────────────────────────────────┘
```

---

## 📊 Flux de validation

```
┌─────────────────────────────────────────────────────────────┐
│                    Utilisateur saisit un numéro             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              VALIDATION EN TEMPS RÉEL (isValid)             │
├─────────────────────────────────────────────────────────────┤
│ 1. Trim des espaces                                         │
│ 2. Vérification non vide                                    │
│ 3. Vérification 8-13 chiffres (regex)                       │
│ 4. Vérification format BJ (libphonenumber-js)               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Affichage     │
                  │ visuel        │
                  │ ✓ Valide      │
                  │ ✗ Invalide    │
                  └───────────────┘
                          
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         Utilisateur clique sur "Ajouter le membre"          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         VALIDATION À LA SOUMISSION (validateMemberForm)     │
├─────────────────────────────────────────────────────────────┤
│ 1. Trim des espaces                                         │
│ 2. Vérification non vide                                    │
│ 3. Vérification 8-13 chiffres (regex)                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
         ┌──────────┐        ┌──────────┐
         │ ✅ Valide │        │ ❌ Erreur │
         │          │        │          │
         │ Membre   │        │ Message  │
         │ ajouté   │        │ d'erreur │
         └──────────┘        └──────────┘
```

---

## ✅ Résumé

### Pour qu'un numéro soit considéré comme valide :

#### Validation visuelle (temps réel)
1. ✅ Ne doit pas être vide
2. ✅ Doit contenir entre 8 et 13 chiffres uniquement
3. ✅ Doit être un numéro valide pour le Bénin (libphonenumber-js)

#### Validation à la soumission
1. ✅ Ne doit pas être vide
2. ✅ Doit contenir entre 8 et 13 chiffres uniquement

### Numéros valides pour le Bénin
- `97123456` (8 chiffres - numéro local)
- `22997123456` (11 chiffres - avec indicatif pays)
- Tout numéro entre 8 et 13 chiffres qui respecte le format du Bénin

### Numéros invalides
- Moins de 8 chiffres
- Plus de 13 chiffres
- Contient des lettres
- Contient des caractères spéciaux
- Contient des espaces (sauf avant/après, car trim est appliqué)

---

**Date de création** : 2025-11-30  
**Version** : 1.2  
**Bibliothèque** : libphonenumber-js v1.12.9  
**Pays** : Bénin (BJ)
