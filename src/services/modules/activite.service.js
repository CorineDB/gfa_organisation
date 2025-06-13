
import ApiService from '@/services/configs/api.service'

const ActiviteService = {

    query(type, params) {
      return ApiService.query("gfa/activites", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("gfa/activites", slug);
    },

    create(params) {
      return ApiService.post("gfa/activites", params);
    },
    addDate(slug,params) {
      return ApiService.post(`gfa/activites/${slug}/ajouterDuree`, params);
      //return ApiService.post(`activites/ajouterDuree/${slug}`, params);
    },

    mySuivis(slug) {
      return ApiService.get(`gfa/activites/${slug}/suivis`);
    },
    getSuivi() {
      const params = {
        type: "activite"
      }
      return ApiService.post(`gfa/suivis/filterByModule`, params);
    },

    update(slug, params) {
      return ApiService.update("gfa/activites", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`gfa/activites/${slug}`);
    },

    prolonger(slug, params) {
      return ApiService.post(`gfa/activites/${slug}/ajouterDuree`, params);
    },
    
    editDuree(slug, dureeId, params) {
      return ApiService.post(`gfa/activites/${slug}/modifierDuree/${dureeId}`, params);
    },

    changerStatut(slug, params) {
      console.log("params", params);
      return ApiService.post(`gfa/activites/${slug}/changeStatut`, params);
    },

    composante(slug) {
      return ApiService.get(`gfa/activites/${slug}/composante`);
    },

    taches(slug) {
      return ApiService.get(`gfa/activites/${slug}/taches`);
    },

    plansDeDecaissement(slug) {
      return ApiService.get(`gfa/activites/${slug}/plansDeDecaissement`);
    }

  };

  export default ActiviteService;
  