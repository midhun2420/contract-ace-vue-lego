import '@fullcalendar/core/vdom';
import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import lego from './plugins/lego';
import axios from 'axios';
import 'lego-framework/src/scss/variables/lego-variables.scss';
import './assets/style.scss';
import 'font-icons/nunito/nunito.css';
import 'font-icons/simple-line-icons/css/simple-line-icons.css';
import 'font-icons/iconsmind-s/css/iconsminds.css';
import 'font-icons/nucleo/css/nucleo.css';
import Globals from '@/utils/Globals';
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';
import VTooltip from 'v-tooltip';
import secureAxios from 'secure-axios';
Vue.use(VTooltip);
Vue.use(PerfectScrollbar);
Vue.component('FullCalendar', FullCalendar);
Vue.use(dayGridPlugin);
Vue.use(listPlugin);
Vue.use(interactionPlugin);

Vue.config.productionTip = false;
Vue.prototype.$Globals = new Globals();
Vue.use(lego);
secureAxios.interceptors.response.use(
    function (response) {
        const data = response.data;
        if (data && data.permission === false && data.logout_user === true) {
            store.commit('setLogout');
            router.push('/auth/login/');
            return Promise.reject(new Error('Permission denied'));
        }
        return response;
    },
    function (error) {
        if (error.response && error.response.data) {
            const data = error.response.data;
            if (data.permission === false && data.logout_user === true) {
                store.commit('setLogout');
                router.push('/auth/login/');
            }
        }
        return Promise.reject(error);
    }
);

// ✅ SAME interceptor on global axios (vue-table-card uses this)
axios.interceptors.response.use(
    function (response) {
        const data = response.data;
        if (data && data.permission === false && data.logout_user === true) {
            store.commit('setLogout');
            router.push('/auth/login/');
            return Promise.reject(new Error('Permission denied'));
        }
        return response;
    },
    function (error) {
        if (error.response && error.response.data) {
            const data = error.response.data;
            if (data.permission === false && data.logout_user === true) {
                store.commit('setLogout');
                router.push('/auth/login/');
            }
        }
        return Promise.reject(error);
    }
);
new Vue({
    router,
    store,
    render : h => h(App)
}).$mount('#app');
