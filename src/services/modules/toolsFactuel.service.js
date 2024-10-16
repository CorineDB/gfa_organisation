import ApiService from "@/services/configs/api.service";

const FormulaireFactuel = {
  query(type, params) {
    return ApiService.query("gfa/types-de-gouvernance", {
      params: params,
    });
  },

  getDataFormFactuel() {
    return ApiService.get(`gfa/formulaire-factuel`);
  },

  getDataFormPerception() {
    return ApiService.get(`gfa/formulaire-de-perception`);
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
