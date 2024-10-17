
import ApiService from '@/services/configs/api.service'

const TachesService = {

    query(type, params) {
      return ApiService.query("taches", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("taches", slug);
    },

    create(params) {
      return ApiService.post("taches", params);
    },

    addDate(slug,params) {
      return ApiService.post(`taches/${slug}/ajouterDuree`, params);
      //return ApiService.post(`taches/ajouterDuree/${slug}`, params);
    },
    suiviTache(params) {
      return ApiService.post(`suivis`, params);
    },
    mySuivis(slug) {
      return ApiService.get(`taches/${slug}/suivis`);
    },
    myOldSuivis(params) {
      return ApiService.post(`suivisV2`, params);
    },
    deleteSuivis(slug) {
      return ApiService.get(`taches/${slug}/changeStatut`);
    },
    getSuivi() {
      const params = {
        type: "tache"
      }
      return ApiService.post(`suivis/filterByModule`, params);
    },

    update(slug, params) {
      return ApiService.update("taches", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`taches/${slug}`);
    },

    activite(slug) {
      return ApiService.get(`taches/${slug}/activite`);
    }

  };

  export default TachesService;
  