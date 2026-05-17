<template>
<div></div>
</template>

<script>
import axios from 'secure-axios';
import { mapActions, mapGetters } from 'vuex';
import urls from '../data/urls';

export default {
    name     : 'CheckPermission',
    computed : {
        ...mapGetters(['currentUser'])
    },

    mounted () {
        this.checkPermission();
    },
    methods : {
        checkPermission () {
            console.log('permission check');
            const that = this;
            axios.interceptors.response.use(function (response) {
                const permission = response.data.permission;
                const logoutUser = response.data.logout_user;
                if (permission === false && logoutUser === true) {
                    that.logout();
                }
                return response;
            }, function (error) {
                return Promise.reject(error);
            });
        },
        ...mapActions(['signOut']),
        logout () {
            if (this.currentUser.loggedIn === true) {
                this.signOut();
                axios.get(urls.auth.logout);
                this.$router.push('/auth/login/').catch(() => {});
            }
        }
    }
};
</script>

<style scoped>

</style>
