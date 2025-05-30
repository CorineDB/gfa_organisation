import ApiService from "@/services/configs/api.service";

const IndicateurDeGouvernanceFactuel = {
  query(type, params) {
    return ApiService.query("gfa/enquete-de-gouvernance/indicateurs-de-gouvernance-factuel", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/enquete-de-gouvernance/indicateurs-de-gouvernance-factuel", slug);
  },

  create(params) {
    return ApiService.post("gfa/enquete-de-gouvernance/indicateurs-de-gouvernance-factuel", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/enquete-de-gouvernance/indicateurs-de-gouvernance-factuel", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/enquete-de-gouvernance/indicateurs-de-gouvernance-factuel/${slug}`);
  },
};

export default IndicateurDeGouvernanceFactuel;
