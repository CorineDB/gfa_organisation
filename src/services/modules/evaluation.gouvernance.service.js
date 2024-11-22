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
  getFactuelFormEvaluation(token) {
    return ApiService.get(`gfa/formulaire-factuel/${token}`);
  },
  getPerceptionFormEvaluation(participant_identifier, token) {
    return ApiService.get(`gfa/formulaire-de-perception/${participant_identifier}/${token}`);
  },
  getSource() {
    return ApiService.get(`gfa/sources-de-verification`);
  },
  getSoumissionsEvaluation(id) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${id}/soumissions`);
  },

  getFormulaireFactuelEvaluation(id) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${id}/formulaire-factuel`);
  },
  
  getOneSoumissionsEvaluation(idEvaluation, idSoumissions) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${idEvaluation}/soumissions/${idSoumissions}`);
  },

  sendReminderToPerceptionParticipants(id) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${id}/rappel-soumission`);
  },

  submitSumission(id, params) {
    return ApiService.post(`gfa/evaluations-de-gouvernance/${id}/soumissions`, params);
  },
  submitPerceptionSumission(id, params) {
    return ApiService.post(`gfa/evaluations-de-gouvernance/${id}/perception-soumission`, params);
  },
  validatePerceptionSumission(id, params) {
    console.log("dsgdfgjlfg");
    return ApiService.post(`gfa/evaluations-de-gouvernance/${id}/perception-soumission-validation`, params);
  },
  validateSumission(id, params) {
    return ApiService.post(`gfa/evaluations-de-gouvernance/${id}/validate-soumission`, params);
  },

  create(params) {
    return ApiService.post("gfa/evaluations-de-gouvernance/", params);
  },

  addParticipantPerception(evaluation, payload) {
    return ApiService.post(`gfa/evaluations-de-gouvernance/${evaluation}/envoi-mail-au-participants`, payload);
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

  getRecommandationsEvaluation(idEvaluation) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${idEvaluation}/recommandations`);
  },
  
  getFeuilleDeRouteEvaluation(idEvaluation) {
    return ApiService.get(`gfa/evaluations-de-gouvernance/${idEvaluation}/actions-a-mener`);
  },
};

export default EvaluationService;
