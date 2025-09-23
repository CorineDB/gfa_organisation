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
  
  getFormulaireFactuelEvaluation(idEvaluation) {
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
    return ApiService.get(`gfa/sources-de-verification`);
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
    console.log("🔵 [submitFactuelSoumission] - Début fonction");
    console.log("🔵 [submitFactuelSoumission] - Type de params:", typeof params);
    console.log("🔵 [submitFactuelSoumission] - params instanceof FormData:", params instanceof FormData);
    console.log("🔵 [submitFactuelSoumission] - params:", params);

    // Étape 1 : Vérifier la préservation du FormData
    if (params instanceof FormData) {
      console.log("🟢 [submitFactuelSoumission] - FORMDATA détecté - préservation activée");
      const config = {
        preserveFormData: true,
        headers: {}
      };
      console.log("🟢 [submitFactuelSoumission] - Config pour FormData:", config);
      return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/soumissions-factuel`, params, config);
    } else if (params && typeof params === 'object') {
      console.log("🟡 [submitFactuelSoumission] - OBJET JSON détecté");
      // Pour les objets JSON
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      console.log("🟡 [submitFactuelSoumission] - Config pour JSON:", config);
      return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/soumissions-factuel`, JSON.stringify(params), config);
    }

    console.log("🔴 [submitFactuelSoumission] - CAS PAR DÉFAUT");
    // Cas par défaut
    return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/soumissions-factuel`, params);
  },
  validateFactuelSoumission(id, params) {
    console.log("🔵 [validateFactuelSoumission] - Début fonction");
    console.log("🔵 [validateFactuelSoumission] - Type de params:", typeof params);
    console.log("🔵 [validateFactuelSoumission] - params instanceof FormData:", params instanceof FormData);
    console.log("🔵 [validateFactuelSoumission] - params:", params);

    // Étape 1 : Vérifier la préservation du FormData
    if (params instanceof FormData) {
      console.log("🟢 [validateFactuelSoumission] - FORMDATA détecté - préservation activée");
      // Ne pas modifier params, laisser FormData intact
      // Config vide pour indiquer à ApiService de ne pas ajouter Content-Type
      const config = {
        preserveFormData: true,
        headers: {}
      };
      console.log("🟢 [validateFactuelSoumission] - Config pour FormData:", config);
      return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/validate-soumission-factuel`, params, config);
    } else if (params && typeof params === 'object') {
      console.log("🟡 [validateFactuelSoumission] - OBJET JSON détecté");
      // Pour les objets JSON
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      console.log("🟡 [validateFactuelSoumission] - Config pour JSON:", config);
      return ApiService.post(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/validate-soumission-factuel`, JSON.stringify(params), config);
    }

    console.log("🔴 [validateFactuelSoumission] - CAS PAR DÉFAUT");
    // Cas par défaut
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

  sendReminderToPerceptionParticipants(id) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${id}/rappel-soumission`);
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

  getRecommandationsEvaluation(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/recommandations`);
  },
  
  getActionsAMenerEvaluation(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/actions-a-mener`);
  },
  
  getFeuilleDeRouteEvaluation(idEvaluation) {
    return ApiService.get(`gfa/enquete-de-gouvernance/evaluations-de-gouvernance/${idEvaluation}/feuille-de-route`);
  },
};

export default EvaluationService;
