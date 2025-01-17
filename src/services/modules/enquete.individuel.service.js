import ApiService from "@/services/configs/api.service";

const EnqueteIndividuelService = {
  query(type, params) {
    return ApiService.query("gfa/survey-forms", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get(`gfa/survey-forms`);
  },
  getOne(id) {
    return ApiService.get(`gfa/survey-forms/${id}`);
  },

  create(params) {
    return ApiService.post("gfa/survey-forms", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/survey-forms", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/survey-forms/${slug}`);
  },
  getEvaluation(slug) {
    return ApiService.get(`gfa/surveys`);
  },
  getOneEvaluation(id) {
    return ApiService.get(`gfa/surveys/${id}`);
  },
  getResponseEvaluation(survey) {
    return ApiService.get(`gfa/surveys/${survey}/survey-reponses`);
  },
  getFormEvaluation(token, participantId) {
    return ApiService.get(`gfa/surveys/${token}/form/${participantId}`);
  },

  createEvaluation(params) {
    return ApiService.post("gfa/surveys", params);
  },
  sendResponse(params) {
    return ApiService.post("gfa/survey-reponses", params);
  },

  updateEvaluation(slug, params) {
    return ApiService.update("gfa/surveys", slug, params);
  },

  destroyEvaluation(slug) {
    return ApiService.delete(`gfa/surveys/${slug}`);
  },
};

export default EnqueteIndividuelService;
