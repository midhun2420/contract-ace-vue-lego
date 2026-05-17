import Vue from 'vue';
import VueRouter from 'vue-router';
import appRoutes from './app-layout';
import authRoutes from './auth-layout';
import docsLayout from 'lego-framework/src/router/docs-layout';
import printRoutes from './print-layout';

Vue.use(VueRouter);

const routes = [
    docsLayout,
    appRoutes,
    printRoutes,
    authRoutes
];

const router = new VueRouter({
    mode : 'history',
    base : process.env.BASE_URL,
    routes
});

router.beforeResolve((to, from, next) => {
    if (to.name) {
    }
    next();
});

router.afterEach(() => {
});

export default router;
