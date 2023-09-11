
import ApiService from '@/services/configs/api.service'

const GroupeService = {

    query(type, params) {
      return ApiService.query("campagnes", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("entreprise/campagnes", slug);
    },
    getBsdByCampagne(slug) {
      return ApiService.get(`campagne/${slug}/bsds`);
    },
    getVote(slug) {
      return ApiService.get(`campagne/${slug}/statistiques`); 
    },
    
    getResolution(slug) {
      return ApiService.get(`campagne/${slug}/resolutions`);
    },

    postResolution(slug, params) {
      return ApiService.post(`campagne/${slug}/resolution`, params);
    },

    updateResolution(slug, params) {
      return ApiService.update(`campagne/${slug}/resolution`, params);
    },
    updatestatutResolution(slug, params) {
      return ApiService.update(`campagne/${slug}/updateStatut`, params);
    },
  
    create(params) {
      return ApiService.post("campagnes", params);
    },

    addBSD(slug,params) {
      return ApiService.post(`campagne/${slug}/ajouterBsd`, params);
    },

    addGestionnaire(slug,params) {
      return ApiService.post(`campagne/${slug}/ajouterGestionnaire`, params);
    },

    update(slug, params) {
      return ApiService.update("campagnes", slug, params);
    },

    updateStatut(slug, params) {
      return ApiService.post(`campagne/${slug}/updateStatut`, params);
    },

    destroy(slug) {
      return ApiService.delete(`campagnes/${slug}`);
    },

    getCampagneStatistique(slug, params) {

      return ApiService.post(`campagne/${slug}/statistiques`, params);


    },

    getAllResolution(){
      return ApiService.get("entreprise/resolutions")
    },

    getCampagneBSD(slug){
      return ApiService.get(`campagne/${slug}/bsds`);
    },

    addComment(slug,params) {
      return ApiService.post(`campagne/${slug}/commenter`,params)
    },

    getPlainte(slug){
            return ApiService.get(`campagne/${slug}/commentaires`)   
    },

    addFavoris(slug){
      return ApiService.post(`campagne/commentaires/${slug}/marquerFavoris`)
    }

  };

  export default GroupeService;
  