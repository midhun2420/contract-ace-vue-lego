import PrintChat from '../views/Consumer/Tender/PrintChat';

const Layout = () => import(/* webpackChunkName: "login" */'../layouts/BlankLayout');
const Landing = () => import(/* webpackChunkName: "login" */'../views/Auth/Landing');
const Login = () => import(/* webpackChunkName: "login" */'../views/Auth/Login');
const Register = () => import(/* webpackChunkName: "login" */'../views/Auth/ViewPage');
const ForgotPassword = () => import(/* webpackChunkName: "login" */'../views/Auth/ForgotPassword');

export default {
    path      : '/',
    name      : 'DashboardLayout',
    redirect  : '/auth/landing/',
    component : Layout,
    children  : [
        {
            path      : '/auth/landing/',
            name      : 'Landing',
            component : Landing
        },
        {
            path      : '/auth/login/',
            name      : 'Login',
            component : Login
        },
        {
            path      : '/auth/register/',
            name      : 'Register',
            component : Register
        },
        {
            path      : '/auth/forgot-password/',
            name      : 'ForgotPassword',
            component : ForgotPassword
        },
        {
            path      : '/app/bidder/:id/chat-print/',
            name      : 'BidderDetails',
            component : PrintChat
        }
    ]
};
