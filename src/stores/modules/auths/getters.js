export default {

    GET_AUTHENTICATE_USER: state => {


        if (state.authenticateUser) {
            return state.authenticateUser;
        }

        const storedUser = localStorage.getItem('authenticateUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser !== undefined) {
                state.authenticateUser = parsedUser;
                return state.authenticateUser;
            }
        }

        return null;
    },


    GET_ACCESS_TOKEN: state => {
        if (state.access_token) {
            return state.access_token;
        }

        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
            const parsedToken = JSON.parse(storedToken);
            if (parsedToken !== undefined) {
                state.access_token = parsedToken;
                return state.access_token;
            }
        }

        return null;
    },

    IS_AUTHENTICATED: (getters) => {
        return getters.GET_ACCESS_TOKEN ? true : null;
    },


}