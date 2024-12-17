
import ApiService from '@/services/configs/api.service'

const AuthentificationService = {

  create(params) {
    return ApiService.post("login/entreprise", params);
  },
  logout() {
    return ApiService.post("authentificate/logout");
  },
  changePassword(params){
    return ApiService.post("gfa/utilisateurs/updatePassword",params)
  },
  changeProfil(params){
      return ApiService.post("users/photo",params)  
  },
  ChangeInfo(params){
    return ApiService.post("users/changeInfo",params)
  },
  getMail(slug){
     return ApiService.get(`reinitialisation-de-mot-de-passe/${slug}`);
  },
  updatePasswordbyMail(params){
    return ApiService.post(`reinitialisation-de-mot-de-passe`,params)
  },
  updateUserInfo(slug,params){
    return ApiService.put(`users/${slug}`,params)
  }
 
};


const  ApiClientService = {

  get() {
    return ApiService.get("api/oauth/clients", );
  },

  create() {
    return ApiService.post("api/oauth/clients", );
  },

  destroy(slug) {
    return ApiService.delete(`api/oauth/clients/${slug}`);
  },

  


}

export default AuthentificationService;
  