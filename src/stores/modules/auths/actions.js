import {
    SET_ACCESS_TOKEN,
    SET_AUTH_DATA,
    RESET_AUTH_DATA
} from '../../mutations.type';

import { FETCH_AUTHENTICATE_USER, LOGIN, LOGOUT } from "../../actions.type";

import AuthService from "@/services/modules/auth.service";

export default {

    async [FETCH_AUTHENTICATE_USER]({ commit }) {

        const { data, status } = await AuthService.getCurrentUser()

        if (status === 200 || status === 201) {
            commit(SET_AUTH_DATA, data.data)
        }

        return { data: data.data, status }
    },

    async [LOGIN]({ commit }, payload) {

        const { data, status } = await AuthService.login(payload)

        let response = data.data

        if (status === 200 || status === 201) {
            if (response.hasOwnProperty("utilisateur")) {
                commit(SET_AUTH_DATA, response.utilisateur)
            }

            if (response.hasOwnProperty("access_token"))
                commit(SET_ACCESS_TOKEN, response.access_token)
        }

        return { data: response, status }
    },

    async [LOGOUT]({ commit }) {

        const { status } = await AuthService.logout()

        if (status === 200 || status === 204)
            commit(RESET_AUTH_DATA)

        return { status }
    }

}