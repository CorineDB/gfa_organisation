import ApiService from "@/services/configs/api.service";

const ProgrammeService = {
    query(type, params) {
        return ApiService.query("programmes", {
            params: params,
        });
    },

    get(slug) {
        return ApiService.get("programmes", slug);
    },

    create(params) {
        return ApiService.post("programmes", params);
    },
    createKobo(params) {
        return ApiService.post("programme/kobo", params);
    },

    getLabel(params) {
        return ApiService.post("programme/koboPreview", params);
    },
    update(slug, params) {
        return ApiService.update("programmes", slug, params);
    },

    destroy(slug) {
        return ApiService.delete(`programmes/${slug}`);
    },

    uniteeGestion(slug) {
        return ApiService.get(`programmes/${slug}/unitee-de-gestion`);
    },

    projets(slug) {
        return ApiService.get(`programmes/${slug}/projets`);
    },

    mods(slug) {
        return ApiService.get(`programmes/${slug}/mods`);
    },

    decaissements(slug) {
        return ApiService.get(`programmes/${slug}/decaissements`);
    },

    entreprisesExecutante(slug) {
        return ApiService.get(`programmes/${slug}/entreprise-executants`);
    },

    structures(slug) {
        return ApiService.get(`programmes/${slug}/structures`);
    },

    activites(slug) {
        return ApiService.get(`programmes/${slug}/activites`);
    },

    filtreActivites(params) {
        return ApiService.post(`activites/filtre`, params);
    },

    scopes(slug) {
        return ApiService.get(`programmes/${slug}/scopes`);
    },
    dashboard() {
        return ApiService.get(`programme/dashboard`);
    },
    kobo() {
        return ApiService.get(`programme/kobo`);
    },
    updatekobo() {
        return ApiService.put(`programme/kobo`);
    },
    rapport(params) {
        return ApiService.post(`programme/rapport`, params);
    },

    sendMailRapport(params) {
        return ApiService.post(`programme/rapport/sendMail`, params);
    },

    rapports() {
        return ApiService.get(`programme/rapports`);
    },
    updateRapports(slug, params) {
        return ApiService.put(`programme/rapport/${slug}`, params);
    },
    deleteRapport(slug) {
        return ApiService.delete(`programme/rapport/${slug}`);
    },
    emailRapports() {
        return ApiService.get(`programme/emailRapports`);
    },
    getCadreRendement(id) {
      return ApiService.get(`gfa/programmes/${id}/cadre-de-mesure-rendement`);
    },
    scoresAuFilDuTemps(organisationId) {
      return ApiService.get(`gfa/programmes/evolution-des-scores-au-fil-du-temps/${organisationId}`);
    },
};

export default ProgrammeService;
