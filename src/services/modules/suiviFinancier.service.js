import ApiService from "@/services/configs/api.service";

const SuiviFinanciersService = {
  query(type, params) {
    return ApiService.query("suiviFinanciers", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/suiviFinanciers", slug);
  },

  create(params) {
    return ApiService.post("gfa/suiviFinanciers", params);
  },
  importCSV(params) {
    return ApiService.post("gfa/suiviFinanciers/importation", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/suiviFinanciers", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/suiviFinanciers/${slug}`);
  },

  byProgramme(slug) {
    return ApiService.get(`gfa/programmes/${slug}/suiviFinanciers`);
  },
  filtre(params) {
    return ApiService.post("gfa/suiviFinanciers/filtres", params);
  },
  getSuiviByActivite(slug, params) {
    return ApiService.post(`gfa/activites/${slug}/suivis-financier`, params);
  },
};

export default SuiviFinanciersService;
