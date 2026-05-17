export default {
    state : {
        currentUser   : {},
        checkedStatus : false,
        needChecking  : true
    },

    getters : {
        currentUser   : state => state.currentUser,
        checkedStatus : state => state.checkedStatus,
        needChecking  : state => state.needChecking
    },

    mutations : {
        setUser (state, payload) {
            // console.log('payload', payload);
            state.currentUser = payload;
            state.checkedStatus = true;
        },

        setLogout (state) {
            // console.log('setLogout', state);
            state.currentUser = {};
            state.checkedStatus = true;
        }
    },

    actions : {
        setUser ({ commit }, payload) {
            commit('setUser', payload);
        },

        signOut ({ commit }) {
            // Perform signOut
            commit('setLogout');
        }
    }
};
