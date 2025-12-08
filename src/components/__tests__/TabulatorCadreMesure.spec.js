import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TabulatorCadreMesure from '../TabulatorCadreMesure.vue';
import IndicateursService from '@/services/modules/indicateur.service';

// Mock dependencies
vi.mock('@/services/modules/indicateur.service');
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));
vi.mock('vue3-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('@/utils/verifyPermission', () => ({
  default: () => true,
}));

describe('TabulatorCadreMesure.vue', () => {
  let wrapper;

  const mockIndicateur = {
    id: 1,
    nom: 'Indicateur Test',
    agreger: false,
    valeursCible: [
      { annee: 2023, valeurCible: 100, valeur_realiser: 50 },
      { annee: 2024, valeurCible: 200, valeur_realiser: 150 },
    ],
    value_keys: [],
  };

  const mockIndicateurAgreger = {
    id: 2,
    nom: 'Indicateur Agreger',
    agreger: true,
    valeursCible: [
      { 
        annee: 2023, 
        valeurCible: { key1: 10, key2: 20 }, 
        valeur_realiser: { key1: 5, key2: 15 } 
      },
    ],
    value_keys: [
      { id: 'k1', key: 'key1', libelle: 'Key 1' },
      { id: 'k2', key: 'key2', libelle: 'Key 2' },
    ],
  };

  beforeEach(() => {
    wrapper = mount(TabulatorCadreMesure, {
      props: {
        data: [],
        years: [2023, 2024, 2025],
      },
      global: {
        stubs: {
          ExportationIndicateur: true,
          TabGroup: { template: '<div><slot /></div>' },
          TabList: { template: '<div><slot /></div>' },
          Tab: { template: '<div><slot /></div>' },
          TabPanels: { template: '<div><slot /></div>' },
          TabPanel: { template: '<div><slot /></div>' },
          Modal: { template: '<div><slot /></div>' },
          ModalHeader: { template: '<div><slot /></div>' },
          ModalBody: { template: '<div><slot /></div>' },
          ModalFooter: { template: '<div><slot /></div>' },
          TomSelect: { template: '<select><slot /></select>' },
          InputForm: { 
            template: '<input :disabled="disabled" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue', 'disabled', 'label', 'control', 'type']
          },
          VButton: true,
          DeleteButton: true,
          AccordionGroup: true,
          AccordionItem: true,
          Accordion: true,
          AccordionPanel: true,
          ChevronDownIcon: true,
          ChartDetailIndicateur: true,
          AddYearCibleIndicateur: true,
        },
      },
    });
  });

  it('devrait désactiver le champ valeur cible et afficher la valeur existante si une cible existe pour l\'année sélectionnée (Non Agrégé)', async () => {
    // Simuler l'ouverture du modal de suivi pour un indicateur non agrégé
    await wrapper.vm.handleSuivi(mockIndicateur);
    
    // Sélectionner l'année 2023 (qui a une cible)
    wrapper.vm.payloadSuivi.annee = "2023";
    
    // Attendre que le watcher se déclenche
    await wrapper.vm.$nextTick();

    // Vérifier que la valeur cible est correctement remplie
    expect(wrapper.vm.payloadSuivi.valeurCible).toBe(100);
    
    // Vérifier que le champ est désactivé
    expect(wrapper.vm.shouldDisableValeurCible).toBe(true);
  });

  it('devrait activer le champ valeur cible et le vider si aucune cible n\'existe pour l\'année sélectionnée (Non Agrégé)', async () => {
    // Simuler l'ouverture du modal de suivi
    await wrapper.vm.handleSuivi(mockIndicateur);
    
    // Sélectionner l'année 2025 (qui n'a PAS de cible)
    wrapper.vm.payloadSuivi.annee = "2025";
    
    // Attendre que le watcher se déclenche
    await wrapper.vm.$nextTick();

    // Vérifier que la valeur cible est vide (ou réinitialisée)
    expect(wrapper.vm.payloadSuivi.valeurCible).toBe("");
    
    // Vérifier que le champ est activé
    expect(wrapper.vm.shouldDisableValeurCible).toBe(false);
  });

  it('devrait désactiver les champs valeurs cibles et afficher les valeurs existantes si une cible existe pour l\'année sélectionnée (Agrégé)', async () => {
    // Simuler l'ouverture du modal de suivi pour un indicateur agrégé
    await wrapper.vm.handleSuivi(mockIndicateurAgreger);
    
    // Sélectionner l'année 2023 (qui a des cibles)
    wrapper.vm.payloadSuivi.annee = "2023";
    
    // Attendre que le watcher se déclenche
    await wrapper.vm.$nextTick();

    // Vérifier que les valeurs cibles sont correctement remplies dans le tableau valeurCible
    // Note: valeurCible est un tableau d'objets { keyId, value }
    const valCible = wrapper.vm.valeurCible;
    expect(valCible.find(v => v.keyId === 'k1').value).toBe(10);
    expect(valCible.find(v => v.keyId === 'k2').value).toBe(20);
    
    // Vérifier que le champ est désactivé
    expect(wrapper.vm.shouldDisableValeurCible).toBe(true);
  });

  it('devrait activer les champs valeurs cibles et les vider si aucune cible n\'existe pour l\'année sélectionnée (Agrégé)', async () => {
    // Simuler l'ouverture du modal de suivi pour un indicateur agrégé
    await wrapper.vm.handleSuivi(mockIndicateurAgreger);
    
    // Sélectionner l'année 2025 (qui n'a PAS de cible)
    wrapper.vm.payloadSuivi.annee = "2025";
    
    // Attendre que le watcher se déclenche
    await wrapper.vm.$nextTick();

    // Vérifier que les valeurs cibles sont vides
    const valCible = wrapper.vm.valeurCible;
    expect(valCible.find(v => v.keyId === 'k1').value).toBe("");
    expect(valCible.find(v => v.keyId === 'k2').value).toBe("");
    
    // Vérifier que le champ est activé
    expect(wrapper.vm.shouldDisableValeurCible).toBe(false);
  });
});
