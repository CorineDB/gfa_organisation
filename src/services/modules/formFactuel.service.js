import ApiService from "@/services/configs/api.service";

const FormulaireFactuel = {
  query(type, params) {
    return ApiService.query("gfa/types-de-gouvernance", {
      params: params,
    });
  },

  getDataFormFactuel(idProgramme) {
    return ApiService.get(`gfa/programmes/${idProgramme}/formulaire-factuel`);
  },

  getDataFormPerception(idProgramme) {
    return ApiService.get(`gfa/programmes/${idProgramme}/formulaire-de-perception`);
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
