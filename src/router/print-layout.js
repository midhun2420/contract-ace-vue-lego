import gurads from '@/router/guards';

// Admin Components

import Editor from '../views/Editor';

import PrintTenderDetails from '../views/Consumer/Tender/PrintTenderDetails';

const Layout = () => import(/* webpackChunkName: "layout" */'../layouts/BlankLayout');

export default {
    path        : '/',
    name        : 'DashboardLayout',
    redirect    : '/app/',
    component   : Layout,
    beforeEnter : gurads.loggedInGuard,
    children    : [
        {
            path      : '/app/editor/',
            name      : 'Editor',
            component : Editor
        },
        {
            path      : '/app/tender/:id/print/',
            name      : 'TenderDetails',
            component : PrintTenderDetails
        }
    ]
};
