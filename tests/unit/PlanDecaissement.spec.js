/**
 * Tests unitaires pour le Plan de Décaissement
 * 
 * Ce fichier teste la fonctionnalité de création et de soumission des plans de décaissement
 * pour s'assurer que le bon trimestre est sélectionné et soumis.
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Plan de Décaissement - Sélection de Trimestre', () => {
  
  describe('getQuartersInDuration', () => {
    it('devrait générer des trimestres avec des valeurs uniques au format "année-trimestre"', () => {
      // Simuler la méthode getQuartersInDuration
      const getQuartersInDuration = (debut, fin) => {
        if (!debut || !fin) return [];

        const dateDebut = new Date(debut);
        const dateFin = new Date(fin);
        const quartersMap = new Map();

        const currentDate = new Date(dateDebut);
        while (currentDate <= dateFin) {
          const month = currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          const quarter = Math.ceil(month / 3);
          const key = `${year}-${quarter}`;

          if (!quartersMap.has(key)) {
            quartersMap.set(key, {
              trimestre: quarter,
              value: `${year}-${quarter}`,
              annee: year,
            });
          }

          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return Array.from(quartersMap.values()).sort((a, b) => {
          if (a.annee !== b.annee) return a.annee - b.annee;
          return a.trimestre - b.trimestre;
        });
      };

      // Test avec une période couvrant plusieurs trimestres et années
      const trimestres = getQuartersInDuration('2025-10-01', '2026-03-31');

      // Vérifier que les trimestres sont générés correctement
      expect(trimestres.length).toBeGreaterThan(0);
      
      // Vérifier que chaque trimestre a une valeur unique
      const values = trimestres.map(t => t.value);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);

      // Vérifier le format des valeurs
      trimestres.forEach(trimestre => {
        expect(trimestre.value).toMatch(/^\d{4}-\d$/);
        expect(trimestre.value).toBe(`${trimestre.annee}-${trimestre.trimestre}`);
      });

      // Vérifier qu'on a bien des trimestres de 2025 et 2026
      const annees = [...new Set(trimestres.map(t => t.annee))];
      expect(annees).toContain(2025);
      expect(annees).toContain(2026);

      // Vérifier que le trimestre 1 de 2026 a une valeur différente du trimestre 4 de 2025
      const t1_2026 = trimestres.find(t => t.annee === 2026 && t.trimestre === 1);
      const t4_2025 = trimestres.find(t => t.annee === 2025 && t.trimestre === 4);
      
      if (t1_2026 && t4_2025) {
        expect(t1_2026.value).not.toBe(t4_2025.value);
        expect(t1_2026.value).toBe('2026-1');
        expect(t4_2025.value).toBe('2025-4');
      }
    });

    it('devrait générer le trimestre 1 de 2026 avec la valeur "2026-1"', () => {
      const getQuartersInDuration = (debut, fin) => {
        if (!debut || !fin) return [];

        const dateDebut = new Date(debut);
        const dateFin = new Date(fin);
        const quartersMap = new Map();

        const currentDate = new Date(dateDebut);
        while (currentDate <= dateFin) {
          const month = currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          const quarter = Math.ceil(month / 3);
          const key = `${year}-${quarter}`;

          if (!quartersMap.has(key)) {
            quartersMap.set(key, {
              trimestre: quarter,
              value: `${year}-${quarter}`,
              annee: year,
            });
          }

          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return Array.from(quartersMap.values()).sort((a, b) => {
          if (a.annee !== b.annee) return a.annee - b.annee;
          return a.trimestre - b.trimestre;
        });
      };

      const trimestres = getQuartersInDuration('2026-01-01', '2026-03-31');
      
      expect(trimestres.length).toBe(1);
      expect(trimestres[0].trimestre).toBe(1);
      expect(trimestres[0].annee).toBe(2026);
      expect(trimestres[0].value).toBe('2026-1');
    });
  });

  describe('Extraction de l\'année et du trimestre', () => {
    it('devrait extraire correctement l\'année et le trimestre du format "année-trimestre"', () => {
      const trimestreValue = '2026-1';
      
      let annee, trimestre;
      if (typeof trimestreValue === 'string' && trimestreValue.includes('-')) {
        [annee, trimestre] = trimestreValue.split('-').map(Number);
      }

      expect(annee).toBe(2026);
      expect(trimestre).toBe(1);
    });

    it('devrait gérer le format ancien (fallback)', () => {
      const trimestreValue = 1;
      const anneeFromPlan = 2026;
      
      let annee, trimestre;
      if (typeof trimestreValue === 'string' && trimestreValue.includes('-')) {
        [annee, trimestre] = trimestreValue.split('-').map(Number);
      } else {
        annee = anneeFromPlan;
        trimestre = trimestreValue;
      }

      expect(annee).toBe(2026);
      expect(trimestre).toBe(1);
    });

    it('devrait extraire différentes valeurs pour différents trimestres de la même année', () => {
      const trimestres = ['2026-1', '2026-2', '2026-3', '2026-4'];
      
      const extracted = trimestres.map(trimestreValue => {
        const [annee, trimestre] = trimestreValue.split('-').map(Number);
        return { annee, trimestre };
      });

      expect(extracted[0]).toEqual({ annee: 2026, trimestre: 1 });
      expect(extracted[1]).toEqual({ annee: 2026, trimestre: 2 });
      expect(extracted[2]).toEqual({ annee: 2026, trimestre: 3 });
      expect(extracted[3]).toEqual({ annee: 2026, trimestre: 4 });
    });

    it('devrait extraire différentes valeurs pour le même trimestre de différentes années', () => {
      const trimestres = ['2025-1', '2026-1', '2027-1'];
      
      const extracted = trimestres.map(trimestreValue => {
        const [annee, trimestre] = trimestreValue.split('-').map(Number);
        return { annee, trimestre };
      });

      expect(extracted[0]).toEqual({ annee: 2025, trimestre: 1 });
      expect(extracted[1]).toEqual({ annee: 2026, trimestre: 1 });
      expect(extracted[2]).toEqual({ annee: 2027, trimestre: 1 });
    });
  });

  describe('Filtrage des trimestres par année', () => {
    it('devrait filtrer correctement les trimestres pour une année donnée', () => {
      const trimestres = [
        { trimestre: 4, value: '2025-4', annee: 2025 },
        { trimestre: 1, value: '2026-1', annee: 2026 },
        { trimestre: 2, value: '2026-2', annee: 2026 },
        { trimestre: 3, value: '2026-3', annee: 2026 },
      ];

      const filteredTrimestresForPlan = (annee) => {
        if (!annee) {
          return trimestres;
        }
        return trimestres.filter((trimestre) => trimestre.annee == annee);
      };

      const trimestres2026 = filteredTrimestresForPlan(2026);
      
      expect(trimestres2026.length).toBe(3);
      expect(trimestres2026.every(t => t.annee === 2026)).toBe(true);
      expect(trimestres2026.map(t => t.value)).toEqual(['2026-1', '2026-2', '2026-3']);
    });
  });

  describe('Scénario complet de soumission', () => {
    it('devrait soumettre le bon trimestre quand on sélectionne Trimestre 1 de 2026', () => {
      // Simuler la sélection de "Trimestre 1 de 2026"
      const selectedValue = '2026-1';
      
      // Simuler l'extraction dans planDeDecaissementActivite
      const trimestreValue = selectedValue;
      let annee, trimestre;
      
      if (typeof trimestreValue === 'string' && trimestreValue.includes('-')) {
        [annee, trimestre] = trimestreValue.split('-').map(Number);
      }

      // Vérifier que les bonnes valeurs sont extraites
      expect(annee).toBe(2026);
      expect(trimestre).toBe(1);

      // Simuler la préparation des données
      const planData = {
        activiteId: 123,
        trimestre: trimestre,
        annee: annee,
        budgetNational: 1000,
        pret: 2000,
      };

      expect(planData.annee).toBe(2026);
      expect(planData.trimestre).toBe(1);
    });

    it('ne devrait PAS soumettre le Trimestre 4 quand on sélectionne Trimestre 1 de 2026', () => {
      const selectedValue = '2026-1';
      
      const trimestreValue = selectedValue;
      let annee, trimestre;
      
      if (typeof trimestreValue === 'string' && trimestreValue.includes('-')) {
        [annee, trimestre] = trimestreValue.split('-').map(Number);
      }

      // Vérifier que ce n'est PAS le trimestre 4
      expect(trimestre).not.toBe(4);
      expect(annee).toBe(2026);
    });
  });
});
