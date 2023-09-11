
import ApiService from '@/services/configs/api.service'

const UsersService = {

    query(type, params) {
      return ApiService.query("users", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("users", slug);
    },
  
   
    create(params) {
      return ApiService.post("register", params);
    },
    addUsers(params) {
      return ApiService.post("users", params);
    },
    

    update(slug, params) {
      return ApiService.update("users", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`users/${slug}`);
    },
    getUsersInfo(slug){
      return ApiService.get(`users/${slug}`);
    }


  };

  export default UsersService;
  