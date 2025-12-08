import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import EvaluationPerception from '../EvaluationPerception.vue';
import { generateUniqueId } from '../../../utils/helpers';
import { useRoute } from 'vue-router';
import axios from 'axios';

// Mock dependencies
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock('../../../utils/helpers', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    generateUniqueId: vi.fn(),
  };
});

// Mock axios
const axiosGetMock = vi.fn(() => Promise.resolve({ 
  data: { 
    data: {
      formulaire_de_gouvernance: {
        categories_de_gouvernance: []
      }
    } 
  } 
}));
const axiosPostMock = vi.fn(() => Promise.resolve({ data: {} }));

vi.mock('axios', () => {
  return {
    default: {
      create: () => ({
        interceptors: {
          response: { use: vi.fn() }
        },
        get: axiosGetMock,
        post: axiosPostMock,
      }),
    },
  };
});

// Mock child components
vi.mock('@/components/LoaderSnipper.vue', () => ({ default: { template: '<div>Loader</div>' } }));
vi.mock('@/components/news/VButton.vue', () => ({ default: { template: '<button></button>' } }));
vi.mock('@/components/news/InputForm.vue', () => ({ default: { template: '<input />' } }));
vi.mock('vue3-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() } }));
vi.mock('@/services/modules/auth.service', () => ({
    default: {
        getCurrentUser: vi.fn(() => Promise.resolve({ data: { data: { id: 1, type: 'admin' } } }))
    }
}));

describe('EvaluationPerception.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use participantId from URL if present and NOT call generateUniqueId', async () => {
    // Arrange
    const participantId = 'part_69300cb1848204.29124084';
    const token = 'token_123';
    useRoute.mockReturnValue({
      params: { id: token },
      query: { participantId: participantId },
    });
    
    // Act
    mount(EvaluationPerception, {
        global: {
            stubs: {
                TomSelect: true,
                AccordionGroup: true,
                AccordionItem: true,
                Accordion: true,
                ChevronDownIcon: true,
                AccordionPanel: true,
                Alert: true,
                Modal: true,
                ModalHeader: true,
                ModalBody: true,
                ModalFooter: true
            }
        }
    });
    
    // Assert
    // generateUniqueId should NOT be called
    expect(generateUniqueId).not.toHaveBeenCalled();
    
    // The API call should use the participantId from the URL
    // URL format: gfa/enquete-de-gouvernance/evaluations-de-gouvernance-perception/${participant_identifier}/${token}
    expect(axiosGetMock).toHaveBeenCalledWith(
        expect.stringContaining(`/${participantId}/${token}`)
    );
  });

  it('should generate unique ID if participantId is NOT in URL', async () => {
    // Arrange
    const generatedId = 'generated_id_123';
    const token = 'token_123';
    useRoute.mockReturnValue({
      params: { id: token },
      query: {},
    });
    generateUniqueId.mockReturnValue(generatedId);

    // Act
    mount(EvaluationPerception, {
        global: {
            stubs: {
                TomSelect: true,
                AccordionGroup: true,
                AccordionItem: true,
                Accordion: true,
                ChevronDownIcon: true,
                AccordionPanel: true,
                Alert: true,
                Modal: true,
                ModalHeader: true,
                ModalBody: true,
                ModalFooter: true
            }
        }
    });

    // Assert
    expect(generateUniqueId).toHaveBeenCalled();
    
    // The API call should use the generated ID
    expect(axiosGetMock).toHaveBeenCalledWith(
        expect.stringContaining(`/${generatedId}/${token}`)
    );
  });
});
