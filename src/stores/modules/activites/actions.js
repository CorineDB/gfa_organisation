import { SET_LIST as SET_LIST_ACTIVITE, FIND as findActivite, ADD as ADD_ACTIVITE, MODIFY as MODIFY_ACTIVITE, REMOVE as REMOVE_ACTIVITE } from "../../mutations.type";

import ActiviteService from "@/services/modules/activite.service";

import ComposanteService from "@/services/modules/composante.service";

import ProgrammeService from "@/services/modules/programme.service";

export default {
    FETCH_LIST_ACTIVITE: async ({ commit }) => {
        const { data, status } = await ActiviteService.get();

        if (status === 200 || status === 201) commit(SET_LIST_ACTIVITE, data.data);

        return { data, status };
    },

    FETCH_LIST_ACTIVITE_OF_PROGRAMME: async ({ commit }, id) => {
        const { data, status } = await ProgrammeService.activites(id);

        commit(SET_LIST_ACTIVITE, data.data);

        return { data, status };
    },

    FETCH_FILTRE_ACTIVITE_OF_PROGRAMME: async ({ commit }, params) => {
        const { data, status } = await ProgrammeService.filtreActivites(params);

        commit(SET_LIST_ACTIVITE, data.data);

        return { data, status };
    },

    FETCH_LIST_ACTIVITE_OF_COMPOSANTE: async ({ commit }, id) => {
        const { data, status } = await ComposanteService.activites(id);

        if (status === 200 || status === 201) commit(SET_LIST_ACTIVITE, data.data);

        return { data, status };
    },

    async GET_ACTIVITE({ commit, getters }, { key, value }) {
        let activite = getters.findActivite({ key: key, value: value });

        if ((activite === null || activite || undefined) && typeof value === "int") {
            const { data, status } = await ActiviteService.get(value);

            activite = data.data;

            return activite;
        }
    },

    async STORE_ACTIVITE({ commit }, payload) {
        const { data, status } = await ActiviteService.create(payload);

        if (status === 200 || status === 201) commit(ADD_ACTIVITE, data.data);

        return { data, status };
    },

    async UPDATE_ACTIVITE({ commit }, { activite, id }) {
        const { data, status } = await ActiviteService.update(id, activite);

        if (status === 200 || status === 201) commit(MODIFY_ACTIVITE, data.data);

        return { data, status };
    },

    async PROLONGER_DATE({ commit }, { dates, id }) {
        const { data, status } = await ActiviteService.prolonger(id, dates);

        return { data, status };
    },

    async EDIT_DUREE({ commit }, { dates, id, duree }) {

        const { data, status } = await ActiviteService.editDuree(id, duree, dates);

        return { data, status };
    },
    async CHANGER_STATUT({ commit }, { statut, id }) {

        const { data, status } = await ActiviteService.changerStatut(id, statut);

        return { data, status };
    },

    async DESTROY_ACTIVITE({ commit }, idActivite) {
        const { data, status } = await ActiviteService.destroy(idActivite);

        if (status === 200 || status === 201 || status === 204) commit(REMOVE_ACTIVITE, idActivite);

        return { data, status };
    },
};
