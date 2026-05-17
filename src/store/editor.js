export default {
    state : {
        editMode : false
    },

    getters : {
        editMode : state => state.editMode
    },

    mutations : {
        setEditMode (state, payload) {
            state.editMode = payload;
        }
    },

    actions : {
        startEditing ({ commit }) {
            commit('setEditMode', true);
        },

        stopEditing ({ commit }) {
            commit('setEditMode', false);
        }
    }
};
