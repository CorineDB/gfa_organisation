
import ApiService from '@/services/configs/api.service'

const GroupeService = {

    query(type, params) {
      return ApiService.query("groupes", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("groupes", slug);
    },
    getGroupeByEntreprise(slug){
      return ApiService.get("entreprise/groupes", slug);
    },
   
   
    create(params) {
      return ApiService.post("groupes", params);
    },

    update(slug, params) {
      return ApiService.update("groupes", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`groupes/${slug}`);
    },


  };

  export default GroupeService;
  