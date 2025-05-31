import ApiService from "@/services/configs/api.service";

const ResultatSyntheseService = {
  // getters services
  get(enqueteDeCollecteId, organisationId) {
    return ApiService.get(`gfa/enquetes-de-collecte/${enqueteDeCollecteId}/resultats/${organisationId}`);
  },

  getForEvaluation(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/fiches-de-synthese
`);
  },
  
  getOngClassement(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/fiches-de-synthese-with-organisations-classement
`);
  },

  resustatSyntheseEvaluation(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/resultats-syntheses
`);
  },

  getEvolutionByScore(ong) {
    return ApiService.get(`/gfa/programmes/evolution-des-scores-au-fil-du-temps/${ong}`);
  },

  getOrganizations(slug) {
    return ApiService.get(`gfa/organisations`);
  },
};

export default ResultatSyntheseService;
