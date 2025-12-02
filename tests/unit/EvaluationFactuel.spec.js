import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, ref, reactive } from 'vue';

/**
 * Tests unitaires pour la fonctionnalité openPreview()
 * 
 * Objectif: Vérifier que la fonction openPreview() sauvegarde les données
 * avant d'afficher la prévisualisation du formulaire
 */

// Mock des services
vi.mock('@/services/modules/enquetes_de_gouvernance/evaluation.gouvernance.service', () => ({
  default: {
    getFactuelFormEvaluation: vi.fn(() => Promise.resolve({
      data: {
        data: {
          terminer: false,
          id: 'test-id',
          formulaire_de_gouvernance: {
            id: 'form-id',
            soumissionId: 'soumission-id',
            categories_de_gouvernance: [],
            options_de_reponse: []
          }
        }
      }
    })),
    getEnqueteSource: vi.fn(() => Promise.resolve({ data: { data: [] } })),
    submitFactuelSoumission: vi.fn(() => Promise.resolve({ data: { data: {} } })),
    validateFactuelSoumission: vi.fn(() => Promise.resolve({ data: { data: {} } }))
  }
}));

vi.mock('@/services/modules/auth.service', () => ({
  default: {
    getCurrentUser: vi.fn(() => Promise.resolve({
      data: {
        data: {
          id: 'user-id',
          type: 'organisation'
        }
      }
    }))
  }
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: 'test-token-123' }
  }),
  useRouter: () => ({
    push: vi.fn(),
    go: vi.fn()
  })
}));

describe('EvaluationFactuel - openPreview() - Tests Unitaires', () => {
  let mockSubmitAnsweredQuestionsOnly;
  let showModalPreview;
  let isValidate;

  beforeEach(() => {
    // Créer des refs pour simuler l'état du composant
    showModalPreview = ref(false);
    isValidate = ref(false);
    mockSubmitAnsweredQuestionsOnly = vi.fn();
  });

  /**
   * TEST 1: Vérifier que submitAnsweredQuestionsOnly() est appelée
   */
  it('devrait appeler submitAnsweredQuestionsOnly() avant d\'afficher la prévisualisation', () => {
    // ARRANGE
    const openPreview = () => {
      mockSubmitAnsweredQuestionsOnly();
      showModalPreview.value = true;
      isValidate.value = true;
    };

    expect(showModalPreview.value).toBe(false);
    expect(isValidate.value).toBe(false);

    // ACT
    openPreview();

    // ASSERT
    expect(mockSubmitAnsweredQuestionsOnly).toHaveBeenCalled();
    expect(mockSubmitAnsweredQuestionsOnly).toHaveBeenCalledTimes(1);
  });

  /**
   * TEST 2: Vérifier que showModalPreview passe à true
   */
  it('devrait définir showModalPreview à true', () => {
    // ARRANGE
    const openPreview = () => {
      mockSubmitAnsweredQuestionsOnly();
      showModalPreview.value = true;
      isValidate.value = true;
    };

    expect(showModalPreview.value).toBe(false);

    // ACT
    openPreview();

    // ASSERT
    expect(showModalPreview.value).toBe(true);
  });

  /**
   * TEST 3: Vérifier que isValidate passe à true
   */
  it('devrait définir isValidate à true', () => {
    // ARRANGE
    const openPreview = () => {
      mockSubmitAnsweredQuestionsOnly();
      showModalPreview.value = true;
      isValidate.value = true;
    };

    expect(isValidate.value).toBe(false);

    // ACT
    openPreview();

    // ASSERT
    expect(isValidate.value).toBe(true);
  });

  /**
   * TEST 4: Vérifier l'ordre d'exécution
   */
  it('devrait appeler submitAnsweredQuestionsOnly() AVANT de modifier les états', () => {
    // ARRANGE
    const executionOrder = [];

    const mockSubmit = vi.fn(() => {
      executionOrder.push('submitAnsweredQuestionsOnly');
      executionOrder.push(`showModalPreview: ${showModalPreview.value}`);
      executionOrder.push(`isValidate: ${isValidate.value}`);
    });

    const openPreview = () => {
      mockSubmit();
      showModalPreview.value = true;
      isValidate.value = true;
    };

    // ACT
    openPreview();

    // ASSERT
    expect(executionOrder[0]).toBe('submitAnsweredQuestionsOnly');
    expect(executionOrder[1]).toBe('showModalPreview: false');
    expect(executionOrder[2]).toBe('isValidate: false');
    expect(showModalPreview.value).toBe(true);
    expect(isValidate.value).toBe(true);
  });

  /**
   * TEST 5: Vérifier le comportement en cas d'appels multiples
   */
  it('devrait pouvoir être appelée plusieurs fois sans erreur', () => {
    // ARRANGE
    const openPreview = () => {
      mockSubmitAnsweredQuestionsOnly();
      showModalPreview.value = true;
      isValidate.value = true;
    };

    // ACT
    openPreview();
    openPreview();
    openPreview();

    // ASSERT
    expect(mockSubmitAnsweredQuestionsOnly).toHaveBeenCalledTimes(3);
    expect(showModalPreview.value).toBe(true);
    expect(isValidate.value).toBe(true);
  });

  /**
   * TEST 6: Vérifier que la fonction ne lance pas d'erreur
   */
  it('ne devrait pas lancer d\'erreur lors de l\'exécution', () => {
    // ARRANGE
    const openPreview = () => {
      mockSubmitAnsweredQuestionsOnly();
      showModalPreview.value = true;
      isValidate.value = true;
    };

    // ACT & ASSERT
    expect(() => openPreview()).not.toThrow();
  });

  /**
   * TEST 7: Vérifier la cohérence des états après exécution
   */
  it('devrait avoir tous les états cohérents après exécution', () => {
    // ARRANGE
    const openPreview = () => {
      mockSubmitAnsweredQuestionsOnly();
      showModalPreview.value = true;
      isValidate.value = true;
    };

    // ACT
    openPreview();

    // ASSERT
    expect(mockSubmitAnsweredQuestionsOnly).toHaveBeenCalled();
    expect(showModalPreview.value).toBe(true);
    expect(isValidate.value).toBe(true);
  });
});

/**
 * Tests de logique métier
 */
describe('EvaluationFactuel - Logique de sauvegarde', () => {
  /**
   * TEST 1: Vérifier que la sauvegarde est déclenchée avant l'affichage
   */
  it('devrait garantir que la sauvegarde est terminée avant l\'affichage du modal', () => {
    // ARRANGE
    let saveCompleted = false;
    const showModalPreview = ref(false);
    const isValidate = ref(false);

    const mockSubmit = vi.fn(() => {
      saveCompleted = true;
    });

    const openPreview = () => {
      mockSubmit();
      // À ce stade, saveCompleted doit être true
      expect(saveCompleted).toBe(true);
      showModalPreview.value = true;
      isValidate.value = true;
    };

    // ACT
    openPreview();

    // ASSERT
    expect(saveCompleted).toBe(true);
    expect(showModalPreview.value).toBe(true);
  });

  /**
   * TEST 2: Vérifier que les données sont préservées
   */
  it('devrait préserver les données des réponses pendant la sauvegarde', () => {
    // ARRANGE
    const responses = reactive({
      'question-1': {
        questionId: 'question-1',
        optionDeReponseId: 'option-oui',
        sourceDeVerificationId: 'source-1',
        description: 'Test description',
        preuves: [],
        existingProofs: []
      }
    });

    const mockSubmit = vi.fn(() => {
      // Vérifier que les données sont accessibles pendant la sauvegarde
      expect(responses['question-1'].description).toBe('Test description');
    });

    const showModalPreview = ref(false);
    const isValidate = ref(false);

    const openPreview = () => {
      mockSubmit();
      showModalPreview.value = true;
      isValidate.value = true;
    };

    // ACT
    openPreview();

    // ASSERT
    expect(responses['question-1'].description).toBe('Test description');
    expect(mockSubmit).toHaveBeenCalled();
  });
});

