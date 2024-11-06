import ApiService from "@/services/configs/api.service";
import { param } from "jquery";

const EvaluationService = {
  query(type, params) {
    return ApiService.query("gfa/evaluations-de-gouvernance/", {
      params: params,
    });
  },

  getFormEvaluation(idEvaluation) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${idEvaluation}/formulaires-de-gouvernance`);
  },
  findEvaluation(id) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${id}`);
  },
  getSource() {
    return ApiService.get(`gfa/sources-de-verification`);
  },
  getSoumissionsEvaluation(id) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${id}/soumissions`);
  },
  submitSumission(id, params) {
    return ApiService.post(`gfa/evaluations-de-gouvernance/${id}/soumissions`, params);
  },
  submitPerceptionSumission(id, params) {
    return ApiService.post(`gfa/evaluations-de-gouvernance/${id}/perception-soumission`, params);
  },
  validatePerceptionSumission(id, params) {
    return ApiService.post(`gfa/evaluations-de-gouvernance/${id}/perception-soumission-validation`, params);
  },
  validateSumission(id, params) {
    return ApiService.post(`gfa/evaluations-de-gouvernance/${id}/validate-soumission`, params);
  },

  create(params) {
    return ApiService.post("gfa/evaluations-de-gouvernance/", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/evaluations-de-gouvernance/", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/evaluations-de-gouvernance/${slug}`);
  },
  deleteOneSoumission(slug, soumission) {
    return ApiService.delete(`gfa/evaluations-de-gouvernance/${slug}/soumissions/${soumission}`);
  },

  prolonger(slug, params) {
    return ApiService.post(`gfa/evaluations-de-gouvernance/${slug}/ajouterDuree`, params);
  },
};

export default EvaluationService;
