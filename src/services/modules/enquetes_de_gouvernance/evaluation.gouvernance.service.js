import ApiService from "@/services/configs/api.service";
import { param } from "jquery";

const EvaluationService = {
  query(type, params) {
    return ApiService.query("gfa/enquete-de-gouvernance/evaluations-de-gouvernance/", {
      params: params,
    });
  },

  get() {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance`);
  },

  getFormEvaluation(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/formulaires-de-gouvernance`);
  },

  getFormEvaluation(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/organisations`);
  },
  
  getFactuelFormEvaluation(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/formulaire-factuel`);
  },
  
  getPerceptionFormEvaluation(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/formulaire-perception`);
  },

  getResultatWithClassementOng(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/voir-resultats-avec-classement-organisations`);
  },
  
  getFactuelFormEvaluation(token) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance-factuel/${token}`);
  },
  findEvaluation(id) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}`);
  },
  getSource() {
    return ApiService.get(`gfa/enquete-de-gouvernance/sources-de-verification`);
  },
  getSoumissionsEvaluation(id) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/soumissions`);
  },
  
  getOneSoumissionsEvaluation(idEvaluation, idSoumission, type = 'factuel') {
    if(type == 'factuel'){return  this.getOneSoumissionFactuelEvaluation(idEvaluation, idSoumission);}
    if(type == 'perception'){return this.getOnePerceptionSoumissionEvaluation(idEvaluation, idSoumission);}
    else return null;
  },

  getSoumissionsFactuelEvaluation(id) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/soumissions-factuel`);
  },
  getOneSoumissionFactuelEvaluation(idEvaluation, idSoumissions) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/soumissions-factuel/${idSoumissions}`);
  },
  submitFactuelSoumission(id, params) {
    return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/soumissions-factuel`, params);
  },
  validateFactuelSoumission(id, params) {
    return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/validate-soumission-factuel`, params);
  },

  getPerceptionSoumissionsEvaluation(id) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/soumissions-de-perception`);
  },

  getOnePerceptionSoumissionEvaluation(idEvaluation, idSoumissions) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/soumissions-de-perception/${idSoumissions}`);
  },
  
  getPerceptionFormEvaluation(participant_identifier, token) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance-perception/${participant_identifier}/${token}`);
  },
  
  submitPerceptionSoumission(id, params) {
    return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance-de-perception/${id}/soumissions`, params);
  },
  validatePerceptionSoumission(id, params) {
    return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance-de-perception/${id}/validate-soumission`, params);
  },

  create(params) {
    return ApiService.post("gfa/enquete-de-gouvernance/evaluations-de-gouvernance/", params);
  },

  addParticipantPerception(evaluation, payload) {
    return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${evaluation}/envoi-mail-au-participants`, payload);
  },

  update(slug, params) {
    return ApiService.update("gfa/enquete-de-gouvernance/evaluations-de-gouvernance/", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${slug}`);
  },
  deleteOneSoumission(slug, soumission) {
    return ApiService.delete(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${slug}/soumissions/${soumission}`);
  },

  prolonger(slug, params) {
    return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${slug}/ajouterDuree`, params);
  },
};

export default EvaluationService;
