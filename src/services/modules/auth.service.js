
import ApiService from '@/services/configs/api.service'

const AuthService = {

    getCurrentUser() {
      return ApiService.get("authentification/utilisateur-connecte");
    },

    refreshToken() {
      return ApiService.get("authentification/refresh-token");
    },

    logout() {
      return ApiService.post("authentification/deconnexion");
    },

    login(params) {
      return ApiService.post("organisation-authentification", params);
    },

    changeProfil(slug, params) {
      return ApiService.update("utilisateurs", slug, params);
    },

    role(slug) {
      return ApiService.get(`utilisateurs/${slug}/roles`);
    },

    permissions(slug, roleSlug) {
      return ApiService.get(`utilisateurs/${slug}/roles/${roleSlug}/permissions`);
    }

  };

  export default AuthService;
  