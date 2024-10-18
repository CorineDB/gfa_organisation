import ApiService from "@/services/configs/api.service";
import { numeric } from "@vuelidate/validators";

const FormulaireFactuel = {
  query(type, params) {
    return ApiService.query("gfa/types-de-gouvernance", {
      params: params,
    });
  },

  getDataFormFactuel(enqueteDeCollecteId = null, organisationId = null) {
    return ApiService.get(`gfa/enquetes-de-collecte/${enqueteDeCollecteId}/formulaire-factuel/${organisationId}`);
  },
  getDataFormPerception(enqueteDeCollecteId = null, organisationId = null) {
    return ApiService.get(`gfa/enquetes-de-collecte/${enqueteDeCollecteId}/formulaire-de-perception/${organisationId}`);
  },

  getAllProgrammes() {
    return ApiService.get("programmes");
  },

  create(idEnquete, data) {
    return ApiService.put(`gfa/enquetes-de-collecte/${idEnquete}/collecter`, data);
  },

  update(slug, params) {
    return ApiService.update("gfa/types-de-gouvernance", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/types-de-gouvernance/${slug}`);
  },
};

export default FormulaireFactuel;
