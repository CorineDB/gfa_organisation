import ApiService from "@/services/configs/api.service";

const RolesServices = {
  query(type, params) {
    return ApiService.query("bsds", {
      params: params,
    });
  },

  getRole(slug) {
    return ApiService.get("roles", slug);
  },
  getInfo() {
    return ApiService.get("authentification/utilisateur-connecte");
  },
  getPermission(slug) {
    return ApiService.get("permissions", slug);
  },

  create(params) {
    return ApiService.post("roles", params);
  },

  update(slug, params) {
    return ApiService.update("roles", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`roles/${slug}`);
  },
};

export default RolesServices;
