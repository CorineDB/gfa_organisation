import ApiService from "@/services/configs/api.service";

const resultatService = {
  query(type, params) {
    return ApiService.query("resultats", {
      params: params,
    });
  },

  get(enqueteDeCollecteId, organisationId) {
    return ApiService.get(`gfa/enquetes-de-collecte/${enqueteDeCollecteId}/resultats/${organisationId}`);
  },
};

export default resultatService;
