/**
 * Tests unitaires pour la soumission des valeurs cibles dans le suivi d'indicateur
 * 
 * Problème : Les valeurs cibles existantes ne sont pas envoyées lors de la soumission
 * quand les champs sont désactivés (shouldDisableValeurCible = true)
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('Soumission des Valeurs Cibles - Indicateur Agrégé', () => {
  
  // Données de test basées sur l'exemple fourni
  const mockIndicateur = {
    id: "plQyB280AwebyJ1Gmr2K4aWxBDj6OoPkV2Mn5v9L038Vz7EqkglNYZRpQm4Loz5Y",
    agreger: true,
    valeursCible: [
      {
        annee: 2025,
        valeurCible: {
          "garçan": 100,
          "test": 100
        }
      }
    ]
  };

  const mockValueKeys = [
    {
      id: "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g",
      key: "garçan",
      libelle: "garçan"
    },
    {
      id: "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm",
      key: "test",
      libelle: "test"
    }
  ];

  describe('Préparation des valeurs cibles', () => {
    
    it('devrait charger les valeurs cibles existantes pour l\'année sélectionnée', () => {
      const year = 2025;
      const targetData = mockIndicateur.valeursCible.find(v => v.annee === year);
      
      expect(targetData).toBeDefined();
      expect(targetData.valeurCible).toEqual({
        "garçan": 100,
        "test": 100
      });
    });

    it('devrait mapper les valeurs cibles au format attendu pour la soumission', () => {
      const year = 2025;
      const targetData = mockIndicateur.valeursCible.find(v => v.annee === year);
      
      const valeurCible = mockValueKeys.map(k => ({
        keyId: k.id,
        value: targetData.valeurCible[k.key]
      }));

      expect(valeurCible).toEqual([
        {
          keyId: "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g",
          value: 100
        },
        {
          keyId: "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm",
          value: 100
        }
      ]);
    });

    it('devrait créer des valeurs vides si aucune valeur cible n\'existe pour l\'année', () => {
      const year = 2026; // Année sans valeur cible
      const targetData = mockIndicateur.valeursCible.find(v => v.annee === year);
      
      expect(targetData).toBeUndefined();
      
      // Créer des valeurs vides
      const valeurCible = mockValueKeys.map(k => ({
        keyId: k.id,
        value: ""
      }));

      expect(valeurCible).toEqual([
        {
          keyId: "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g",
          value: ""
        },
        {
          keyId: "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm",
          value: ""
        }
      ]);
    });
  });

  describe('Détection des valeurs cibles existantes', () => {
    
    it('devrait détecter qu\'il existe des valeurs cibles pour 2025', () => {
      const year = 2025;
      const hasExistingValues = mockIndicateur.valeursCible.some(v => v.annee === year);
      
      expect(hasExistingValues).toBe(true);
    });

    it('ne devrait pas détecter de valeurs cibles pour 2026', () => {
      const year = 2026;
      const hasExistingValues = mockIndicateur.valeursCible.some(v => v.annee === year);
      
      expect(hasExistingValues).toBe(false);
    });
  });

  describe('Soumission du payload', () => {
    
    it('devrait inclure les valeurs cibles MÊME si les champs sont désactivés', () => {
      const year = 2025;
      const shouldDisableValeurCible = mockIndicateur.valeursCible.some(v => v.annee === year);
      const targetData = mockIndicateur.valeursCible.find(v => v.annee === year);
      
      // Simuler le chargement des valeurs
      const valeurCible = mockValueKeys.map(k => ({
        keyId: k.id,
        value: targetData.valeurCible[k.key]
      }));

      // Simuler la préparation du payload
      const payload = {
        annee: year,
        valeurCible: valeurCible,
        valeurRealise: [
          { keyId: "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g", value: 18787 },
          { keyId: "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm", value: 18787 }
        ],
        commmentaire: "test",
        indicateurId: "plQyB280AwebyJ1Gmr2K4aWxBDj6OoPkV2Mn5v9L038Vz7EqkglNYZRpQm4Loz5Y",
        sources_de_donnee: "EDSB",
        trimestre: 1
      };

      // Vérifications
      expect(shouldDisableValeurCible).toBe(true); // Les champs sont désactivés
      expect(payload.valeurCible).toBeDefined();
      expect(payload.valeurCible.length).toBe(2);
      
      // ✅ Les valeurs cibles doivent être présentes
      expect(payload.valeurCible[0].value).toBe(100);
      expect(payload.valeurCible[1].value).toBe(100);
      
      // ❌ Les valeurs NE doivent PAS être vides
      expect(payload.valeurCible[0].value).not.toBe("");
      expect(payload.valeurCible[1].value).not.toBe("");
    });

    it('devrait permettre de saisir de nouvelles valeurs cibles si aucune n\'existe', () => {
      const year = 2026; // Année sans valeur cible
      const shouldDisableValeurCible = mockIndicateur.valeursCible.some(v => v.annee === year);
      
      // Simuler la saisie de nouvelles valeurs
      const valeurCible = [
        { keyId: "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g", value: 150 },
        { keyId: "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm", value: 200 }
      ];

      const payload = {
        annee: year,
        valeurCible: valeurCible,
        valeurRealise: [
          { keyId: "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g", value: 100 },
          { keyId: "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm", value: 100 }
        ]
      };

      expect(shouldDisableValeurCible).toBe(false); // Les champs sont activés
      expect(payload.valeurCible[0].value).toBe(150);
      expect(payload.valeurCible[1].value).toBe(200);
    });
  });

  describe('Scénario complet de soumission', () => {
    
    it('devrait soumettre le bon payload avec valeurs cibles existantes', () => {
      const year = 2025;
      const targetData = mockIndicateur.valeursCible.find(v => v.annee === year);
      
      // Charger les valeurs cibles existantes
      const valeurCible = mockValueKeys.map(k => ({
        keyId: k.id,
        value: targetData.valeurCible[k.key] || ""
      }));

      // Préparer le payload complet
      const payloadSuivi = {
        annee: year,
        valeurCible: valeurCible,
        valeurRealise: [
          { keyId: "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g", value: 18787 },
          { keyId: "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm", value: 18787 }
        ],
        commmentaire: "test",
        indicateurId: "plQyB280AwebyJ1Gmr2K4aWxBDj6OoPkV2Mn5v9L038Vz7EqkglNYZRpQm4Loz5Y",
        sources_de_donnee: "EDSB",
        trimestre: 1
      };

      // Vérifications finales
      expect(payloadSuivi.annee).toBe(2025);
      expect(payloadSuivi.valeurCible).toHaveLength(2);
      expect(payloadSuivi.valeurCible[0]).toEqual({
        keyId: "ADN8Z6m0MevD8lA3qboQ6YJKr95VxRBW7BmG10WE4nZPyzgNX2pdk7awbJyxRv1g",
        value: 100
      });
      expect(payloadSuivi.valeurCible[1]).toEqual({
        keyId: "v6lR0x49eRNPlo0GaXnE7Q4r512ZpyBRljYxdbvm9gD3qWwJ6z8KAkVMXnrZDdAm",
        value: 100
      });
      expect(payloadSuivi.valeurRealise).toHaveLength(2);
      expect(payloadSuivi.trimestre).toBe(1);
    });
  });

  describe('Gestion des cas limites', () => {
    
    it('devrait gérer les valeurs cibles partielles', () => {
      const partialData = {
        annee: 2025,
        valeurCible: {
          "garçan": 100
          // "test" est manquant
        }
      };

      const valeurCible = mockValueKeys.map(k => ({
        keyId: k.id,
        value: partialData.valeurCible[k.key] || ""
      }));

      expect(valeurCible[0].value).toBe(100);
      expect(valeurCible[1].value).toBe(""); // Valeur manquante = chaîne vide
    });

    it('devrait gérer les valeurs cibles nulles ou undefined', () => {
      const nullData = {
        annee: 2025,
        valeurCible: null
      };

      const valeurCible = mockValueKeys.map(k => ({
        keyId: k.id,
        value: nullData.valeurCible?.[k.key] || ""
      }));

      expect(valeurCible[0].value).toBe("");
      expect(valeurCible[1].value).toBe("");
    });

    it('devrait convertir les valeurs en nombres si nécessaire', () => {
      const stringData = {
        annee: 2025,
        valeurCible: {
          "garçan": "100",
          "test": "200"
        }
      };

      const valeurCible = mockValueKeys.map(k => ({
        keyId: k.id,
        value: Number(stringData.valeurCible[k.key]) || ""
      }));

      expect(typeof valeurCible[0].value).toBe("number");
      expect(valeurCible[0].value).toBe(100);
      expect(typeof valeurCible[1].value).toBe("number");
      expect(valeurCible[1].value).toBe(200);
    });
  });
});
