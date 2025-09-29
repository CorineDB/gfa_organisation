import ApiService from "@/services/configs/api.service";

const QuestionOperationnelle = {
  query(type, params) {
    return ApiService.query("gfa/enquete-de-gouvernance/questions-operationnelle", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/enquete-de-gouvernance/questions-operationnelle", slug);
  },

  create(params) {
    return ApiService.post("gfa/enquete-de-gouvernance/questions-operationnelle", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/enquete-de-gouvernance/questions-operationnelle", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/enquete-de-gouvernance/questions-operationnelle/${slug}`);
  },
};

export default QuestionOperationnelle;
