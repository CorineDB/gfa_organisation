
import ApiService from '@/services/configs/api.service'

const UsersService = {

    query(type, params) {
      return ApiService.query("utilisateurs", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("utilisateurs", slug);
    },
  
   
    create(params) {
      return ApiService.post("register", params);
    },
    addUsers(params) {
      return ApiService.post("utilisateurs", params);
    },
    

    update(slug, params) {
      return ApiService.update("utilisateurs", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`utilisateurs/${slug}`);
    },
    getUsersInfo(slug){
      return ApiService.get(`utilisateurs/${slug}`);
    }


  };

  export default UsersService;
  