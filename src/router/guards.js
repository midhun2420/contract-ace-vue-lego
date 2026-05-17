import store from '@/store';
import axios from 'secure-axios';
import urls from '../data/urls';

const checkStatus = function (fn) {
    if (store.getters.checkedStatus === true || store.getters.needChecking === false) {
        return fn();
    }

    axios.get(urls.auth.status).then(function (response) {
        const json = response.data;
        if (json.loggedIn === true) {
            store.commit('setUser', json.user);
        } else {
            store.commit('setLogout');
        }

        const sPublicKey = json['public-key'];
        if (sPublicKey) {
            store.commit('setPublicKey', sPublicKey);
        }
        return fn();
    }).catch(function () {
        store.commit('setLogout');
        return fn();
    });
};

export default {
    statusGuard : function (to, from, next) {
        checkStatus(function () {
            next();
        });
    },

    loggedInGuard : function (to, from, next) {
        if (store.getters.needChecking === false) {
            next();
        } else {
            checkStatus(function () {
                const currentUser = store.getters.currentUser;
                if (!currentUser.username) {
                    next('/auth/landing/');
                } else {
                    next();
                }
            });
        }
    }
};
