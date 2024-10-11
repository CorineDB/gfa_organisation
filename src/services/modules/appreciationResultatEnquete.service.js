import ApiService from "@/services/configs/api.service";

const AppreciationResultatEnqueteService = {
  chargerAppreciationsDeResulatEnquete(enqueteDeCollecteId, organisationId) {
    return ApiService.get(`gfa/enquetes-de-collecte/${enqueteDeCollecteId}/resultat-appreciations/${organisationId}`);
  },

  emettreUneAppreciation(enqueteDeCollecteId) {
    return ApiService.post(`gfa/enquetes-de-collecte/${enqueteDeCollecteId}/appreciation`);
  },

  destroy(enqueteDeCollecteId, appreciationId) {
    return ApiService.delete(`gfa/enquetes-de-collecte/${enqueteDeCollecteId}/resultat-appreciations/${appreciationId}`);
  },

  update(enqueteDeCollecteId, appreciationId) {
    return ApiService.update(`gfa/enquetes-de-collecte/${enqueteDeCollecteId}/resultat-appreciations/${appreciationId}`);
  },
};

export default AppreciationResultatEnqueteService;
